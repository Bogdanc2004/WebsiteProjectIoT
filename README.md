# Planta (Planterra)

> Smart IoT Plant Monitoring and Care Platform. Track environmental metrics, monitor soil moisture in real-time, get AI-powered health overviews, and keep your plants thriving.

---

## Getting Started (Local Installation)

Follow these steps to run the application locally on your machine.

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version **18.x** or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js) or `pnpm` / `yarn`
- [Git](https://git-scm.com/)

---

### Step 1: Clone the Repository

```bash
git clone https://github.com/Bogdanc2004/WebsiteProjectIoT.git
cd WebsiteProjectIoT
```

---

### Step 2: Install Dependencies

Install all necessary frontend packages:

```bash
npm install
```

---

### Step 3: Configure Environment Variables

The project uses environment variables to communicate with AWS cloud services (API Gateway for telemetry and AWS Lambda for user authentication).

1. Copy the example environment file:

```bash
cp .env.example .env
```

2. Open `.env` and fill in your AWS endpoint URLs:

```env
VITE_AWS_API_GATEWAY_URL=https://your-api-id.execute-api.eu-central-1.amazonaws.com
VITE_AWS_LAMBDA_USERS_URL=https://your-lambda-url-id.lambda-url.eu-central-1.on.aws/
```

> **Note**: If deploying AWS infrastructure from scratch, check out the [AWS Deployment Guide](aws/README.md) for instructions on provisioning API Gateway, Lambda, DynamoDB, and IoT Core via AWS SAM.

---

### Step 4: Run the Development Server

Start the local Vite development server:

```bash
npm run dev
```

The application will start and automatically open in your default browser at:
```
http://localhost:3000
```

---

## Available Scripts

In the project root, you can run:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite development server on port `3000` with Hot Module Replacement (HMR). |
| `npm run build` | Compiles and bundles production-ready assets into the `dist/` directory. |
| `npm run preview` | Locally serves the production build from `dist/` to test before deployment. |

---

## Tech Stack

- **Frontend Framework**: [React 18](https://react.dev/)
- **Build Tool**: [Vite 5](https://vitejs.dev/)
- **Routing**: [React Router DOM v6](https://reactrouter.com/)
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/)
- **UI Primitives**: [Radix UI](https://www.radix-ui.com/)
- **Cloud Backend**: AWS (API Gateway, AWS Lambda Function URLs, DynamoDB, AWS IoT Core)
- **Security**: PBKDF2 Password Hashing (Web Crypto API) + Secure Session Cookies

---

## Project Structure

```text
├── aws/                   # AWS SAM infrastructure templates & Lambda handlers
│   ├── lambda/            # Lambda functions (user management, etc.)
│   └── template.yaml      # CloudFormation / SAM template
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── auth/          # Login, Register, Auth Modals
│   │   ├── dashboard/     # Metric cards, sensor charts, stats
│   │   ├── layout/        # Navbar, footer, shell
│   │   ├── plants/        # Plant cards, Add Plant modal, filters
│   │   └── shop/          # Hardware shop catalog & buy modal
│   ├── context/           # React Context (AuthContext, etc.)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Page views (Dashboard, Plants, PlantDetail, Shop)
│   ├── services/          # API layer, Auth service, AI Overview
│   ├── App.jsx            # Main app router
│   └── main.jsx           # Application entrypoint
├── .env.example           # Example environment variables template
└── vite.config.js         # Vite configuration
```
