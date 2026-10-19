import { useEffect, useState } from 'react';
import { generateAiOverview } from '../../services/aiOverview';

function SparkleIcon() {
  return (
    <svg className="w-5 h-5 text-green-400 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
    </svg>
  );
}

export default function AiOverview({ plant, stats, latest, loading }) {
  const [typedSegments, setTypedSegments] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [severity, setSeverity] = useState('good');

  useEffect(() => {
    if (loading || !plant || !stats || !latest) return;

    setIsTyping(true);
    setTypedSegments([]);
    const result = generateAiOverview(plant, stats, latest);
    setSeverity(result.severity);

    const segments = result.segments;

    let currentSegmentIndex = 0;
    let currentCharIndex = 0;
    let newTypedSegments = [];

    const interval = setInterval(() => {
      if (currentSegmentIndex < segments.length) {
        const seg = segments[currentSegmentIndex];

        if (!newTypedSegments[currentSegmentIndex]) {
          newTypedSegments[currentSegmentIndex] = { text: '', type: seg.type };
        }

        newTypedSegments[currentSegmentIndex].text += seg.text.charAt(currentCharIndex);
        setTypedSegments([...newTypedSegments]);

        currentCharIndex++;
        if (currentCharIndex >= seg.text.length) {
          currentSegmentIndex++;
          currentCharIndex = 0;
        }
      } else {
        clearInterval(interval);
        setIsTyping(false);
      }
    }, 15);

    return () => clearInterval(interval);
  }, [plant, stats, latest, loading]);

  if (loading || !plant) {
    return (
      <div className="flex items-center gap-3 p-5 rounded-2xl bg-planta-surface/75 border border-white/10 text-gray-400 text-sm backdrop-blur-xl animate-pulse">
        <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
        <span>Synthesizing plant health insights...</span>
      </div>
    );
  }

  const severityStyles = {
    good: 'border-green-500/25 bg-gradient-to-r from-green-500/10 via-planta-surface/80 to-planta-surface/90 shadow-glow-green',
    warn: 'border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-planta-surface/80 to-planta-surface/90 shadow-[0_0_20px_rgba(245,158,11,0.15)]',
    danger: 'border-red-500/30 bg-gradient-to-r from-red-500/10 via-planta-surface/80 to-planta-surface/90 shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  }[severity] || 'border-green-500/25 bg-planta-surface/80';

  return (
    <div className={`relative overflow-hidden rounded-2xl border p-5 sm:p-6 mb-6 backdrop-blur-xl transition-all duration-300 ${severityStyles}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-green-500/15 border border-green-500/25">
            <SparkleIcon />
          </div>
          <div>
            <h3 className="text-base font-bold font-heading text-white flex items-center gap-2">
              AI Botanical Overview
              <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30">
                Live Analysis
              </span>
            </h3>
          </div>
        </div>

        {isTyping && (
          <span className="text-xs text-green-400 font-mono animate-pulse">
            generating...
          </span>
        )}
      </div>

      <div className="text-sm leading-relaxed text-gray-200 pl-1">
        <p>
          {typedSegments.map((seg, i) => {
            const colorClass = {
              highlight: 'text-green-300 font-semibold',
              warn: 'text-amber-300 font-semibold',
              danger: 'text-red-400 font-semibold',
              water: 'text-sky-300 font-semibold',
            }[seg.type] || 'text-gray-200';

            return (
              <span key={i} className={colorClass}>
                {seg.text}
              </span>
            );
          })}
          {isTyping && (
            <span className="inline-block w-2 h-4 ml-1 bg-green-400 animate-pulse align-middle" />
          )}
        </p>
      </div>
    </div>
  );
}
