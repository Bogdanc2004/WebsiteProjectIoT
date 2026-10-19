/**
 * AWS Lambda Handler for Planta User Management & Authentication.
 * Supports:
 * - AWS Lambda Function URL (direct HTTPS invocation)
 * - AWS API Gateway (/users)
 *
 * Actions:
 * - OPTIONS: Returns CORS preflight headers
 * - GET: Retrieves users list from S3 or DynamoDB
 * - POST: Updates or saves user profiles (name, password hash, salt)
 */

const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

const S3_BUCKET = process.env.USERS_BUCKET || 'planta-users-bucket';
const S3_KEY = process.env.USERS_KEY || 'users.json';
const USERS_TABLE = process.env.USERS_TABLE || 'planta-users';

const s3 = new S3Client({});
const ddbClient = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(ddbClient);

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  console.log('[Lambda manageUsers] Received event:', JSON.stringify(event));

  // Handle Lambda Function URL or API Gateway HTTP method
  const method = event.requestContext?.http?.method || event.httpMethod || 'GET';

  // Handle CORS Preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: '',
    };
  }

  try {
    // --- GET /users: Retrieve existing users ---
    if (method === 'GET') {
      try {
        const s3Response = await s3.send(new GetObjectCommand({
          Bucket: S3_BUCKET,
          Key: S3_KEY,
        }));

        const bodyContents = await s3Response.Body.transformToString();
        const users = JSON.parse(bodyContents);

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify(users),
        };
      } catch (s3Err) {
        console.warn('[manageUsers] S3 read failed, trying DynamoDB fallback:', s3Err.message);

        // Fallback to DynamoDB if S3 bucket is not configured
        const scanRes = await ddb.send(new ScanCommand({
          TableName: USERS_TABLE,
        }));

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify(scanRes.Items || []),
        };
      }
    }

    // --- POST /users: Save updated users list or single user update ---
    if (method === 'POST' || method === 'PUT') {
      let payload = event.body;
      if (typeof payload === 'string') {
        payload = JSON.parse(payload);
      }

      if (!payload) {
        return {
          statusCode: 400,
          headers: CORS_HEADERS,
          body: JSON.stringify({ error: 'Payload body is required' }),
        };
      }

      // If array of users is provided (matches Planta auth.js saveUsersDb)
      if (Array.isArray(payload)) {
        await s3.send(new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: S3_KEY,
          Body: JSON.stringify(payload, null, 2),
          ContentType: 'application/json',
        }));

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            success: true,
            message: 'Users updated successfully in AWS S3',
            count: payload.length,
          }),
        };
      }

      // If a single user update object is provided: { userId, name, passwordHash, salt }
      if (payload.id || payload.email) {
        // Fetch existing users, update target user, and save
        let currentUsers = [];
        try {
          const s3Response = await s3.send(new GetObjectCommand({
            Bucket: S3_BUCKET,
            Key: S3_KEY,
          }));
          currentUsers = JSON.parse(await s3Response.Body.transformToString());
        } catch {
          currentUsers = [];
        }

        const targetIndex = currentUsers.findIndex(
          (u) => (payload.id && u.id === payload.id) || (payload.email && u.email?.toLowerCase() === payload.email?.toLowerCase())
        );

        if (targetIndex !== -1) {
          // Merge updates (name, passwordHash, salt, iterations, updatedAt)
          currentUsers[targetIndex] = {
            ...currentUsers[targetIndex],
            ...payload,
            updatedAt: Date.now(),
          };
        } else {
          // Add new user
          currentUsers.push({
            ...payload,
            createdAt: payload.createdAt || Date.now(),
          });
        }

        await s3.send(new PutObjectCommand({
          Bucket: S3_BUCKET,
          Key: S3_KEY,
          Body: JSON.stringify(currentUsers, null, 2),
          ContentType: 'application/json',
        }));

        return {
          statusCode: 200,
          headers: CORS_HEADERS,
          body: JSON.stringify({
            success: true,
            message: 'User profile updated successfully in AWS',
            user: {
              id: currentUsers[targetIndex]?.id || payload.id,
              name: currentUsers[targetIndex]?.name || payload.name,
              email: currentUsers[targetIndex]?.email || payload.email,
            },
          }),
        };
      }

      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid payload structure' }),
      };
    }

    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: `Method ${method} Not Allowed` }),
    };
  } catch (error) {
    console.error('[Lambda manageUsers] Error:', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'Internal Server Error',
        message: error.message,
      }),
    };
  }
};
