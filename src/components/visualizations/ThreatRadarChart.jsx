import React, { useState, useEffect } from 'react';
import { Radar, Shield, AlertTriangle, Mail, CreditCard, Smartphone } from 'lucide-react';

/**
 * Threat Radar Chart - Professional visual representation of threat distribution
 * Optimized for clarity, readability, and compact display
 */
export const ThreatRadarChart = ({ threats }) => {
  const [animated, setAnimated] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);

  // Categories with consistent ordering (5 variables - optimal range)
  const categories = [
    { 
      name: 'Breaches', 
      key: 'data-breach', 
      angle: 0, 
      icon: Shield,
      description: 'Data breach incidents',
      color: 'red'
    },
    { 
      name: 'Phishing', 
      key: 'phishing', 
      angle: 72, 
      icon: Mail,
      description: 'Phishing campaigns',
      color: 'orange'
    },
    { 
      name: 'Security', 
      key: 'general-security', 
      angle: 144, 
      icon: AlertTriangle,
      description: 'Security threats',
      color: 'yellow'
    },
    { 
      name: 'Scams', 
      key: 'scams', 
      angle: 216, 
      icon: CreditCard,
      description: 'Scam alerts',
      color: 'green'
    },
    { 
      name: 'Device', 
      key: 'device-security', 
      angle: 288, 
      icon: Smartphone,
      description: 'Device vulnerabilities',
      color: 'blue'
    }
  ];

  // Consistent scaling - all axes share same scale from center (0) outward
  const maxThreats = Math.max(...categories.map(cat => 
    threats.filter(t => t.feedCategory === cat.key).length
  ), 1);

  // Color function with severity-based gradients
  const getColor = (count) => {
    if (count === 0) return { 
      fill: 'rgb(203, 213, 225)', 
      stroke: 'rgb(148, 163, 184)',
      bg: 'bg-slate-200',
      text: 'text-slate-600'
    };
    const severity = count / maxThreats;
    if (severity > 0.7) return { 
      fill: 'rgb(239, 68, 68)', 
      stroke: 'rgb(220, 38, 38)', 
      gradient: 'url(#gradient-critical)',
      bg: 'bg-red-500',
      text: 'text-red-700'
    };
    if (severity > 0.4) return { 
      fill: 'rgb(249, 115, 22)', 
      stroke: 'rgb(234, 88, 12)', 
      gradient: 'url(#gradient-high)',
      bg: 'bg-orange-500',
      text: 'text-orange-700'
    };
    if (severity > 0.2) return { 
      fill: 'rgb(234, 179, 8)', 
      stroke: 'rgb(202, 138, 4)', 
      gradient: 'url(#gradient-medium)',
      bg: 'bg-yellow-500',
      text: 'text-yellow-700'
    };
    return { 
      fill: 'rgb(59, 130, 246)', 
      stroke: 'rgb(37, 99, 235)', 
      gradient: 'url(#gradient-low)',
      bg: 'bg-blue-500',
      text: 'text-blue-700'
    };
  };

  // Trigger animation on mount
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Generate SVG path for radar chart
  const generateRadarPath = () => {
    const centerX = 100;
    const centerY = 100;
    const maxRadius = 75; // Reduced from 100

    const points = categories.map(cat => {
      const count = threats.filter(t => t.feedCategory === cat.key).length;
      const radius = maxThreats > 0 ? (count / maxThreats) * maxRadius : 0;
      const angleRad = (cat.angle * Math.PI) / 180;
      const x = centerX + radius * Math.cos(angleRad - Math.PI / 2);
      const y = centerY + radius * Math.sin(angleRad - Math.PI / 2);
      return `${x},${y}`;
    });

    return `M ${points.join(' L ')} Z`;
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-gray-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all duration-300">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 rounded-lg blur-sm"></div>
            <div className="relative p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-lg shadow-md">
              <Radar className="w-4 h-4 text-white" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Threat Distribution
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Real-time analysis
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 dark:bg-slate-700/50 rounded-md">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-gray-600 dark:text-gray-300">Live</span>
        </div>
      </div>
      
      {/* Compact Chart Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        {/* Radar Chart - Reduced Size */}
        <div className="flex justify-center items-center">
          <div className="relative">
            <svg 
              viewBox="0 0 200 200" 
              className="w-full max-w-[200px] mx-auto"
              style={{ overflow: 'visible' }}
              preserveAspectRatio="xMidYMid meet"
            >
              {/* Enhanced Gradient definitions */}
              <defs>
                <linearGradient id="gradient-critical" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="rgb(220, 38, 38)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="rgb(185, 28, 28)" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="gradient-high" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(249, 115, 22)" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="rgb(234, 88, 12)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="rgb(194, 65, 12)" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="gradient-medium" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(234, 179, 8)" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="rgb(202, 138, 4)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="rgb(161, 98, 7)" stopOpacity="0.4" />
                </linearGradient>
                <linearGradient id="gradient-low" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="rgb(37, 99, 235)" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="rgb(29, 78, 216)" stopOpacity="0.4" />
                </linearGradient>
                <radialGradient id="centerGlow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="rgb(239, 68, 68)" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="rgb(239, 68, 68)" stopOpacity="0.05" />
                  <stop offset="100%" stopColor="rgb(239, 68, 68)" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Center glow effect */}
              <circle
                cx="100"
                cy="100"
                r="85"
                fill="url(#centerGlow)"
                opacity={animated ? 1 : 0}
                style={{ transition: 'opacity 0.8s ease-in-out' }}
              />

              {/* Background circles - consistent scale indicators */}
              {[75, 56, 37, 18].map((r, i) => (
                <circle
                  key={i}
                  cx="100"
                  cy="100"
                  r={r}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={i === 0 ? "1.5" : "1"}
                  className="text-gray-200 dark:text-slate-700"
                  opacity={animated ? (i === 0 ? 0.5 : 0.3) : 0}
                  style={{ 
                    transition: `opacity ${0.2 + i * 0.08}s ease-in-out`,
                    transitionDelay: `${i * 0.08}s`
                  }}
                />
              ))}

              {/* Axis lines - clear visual guides */}
              {categories.map((cat, i) => {
                const angleRad = (cat.angle * Math.PI) / 180;
                const x = 100 + 75 * Math.cos(angleRad - Math.PI / 2);
                const y = 100 + 75 * Math.sin(angleRad - Math.PI / 2);
                const isHovered = hoveredCategory === cat.key;
                return (
                  <line
                    key={i}
                    x1="100"
                    y1="100"
                    x2={x}
                    y2={y}
                    stroke="currentColor"
                    strokeWidth={isHovered ? "2" : "1"}
                    className={isHovered ? "text-red-400 dark:text-red-500" : "text-gray-300 dark:text-slate-600"}
                    opacity={animated ? (isHovered ? 0.8 : 0.5) : 0}
                    style={{ 
                      transition: 'all 0.3s ease-in-out',
                      transitionDelay: `${0.4 + i * 0.08}s`
                    }}
                  />
                );
              })}

              {/* Threat data polygon */}
              <path
                d={generateRadarPath()}
                fill="url(#gradient-critical)"
                fillOpacity={animated ? 0.4 : 0}
                stroke="rgb(220, 38, 38)"
                strokeWidth="2.5"
                strokeLinejoin="round"
                strokeLinecap="round"
                filter="url(#glow)"
                style={{ 
                  transition: 'fill-opacity 0.8s ease-in-out',
                  transitionDelay: '0.6s'
                }}
              />

              {/* Animated border path */}
              <path
                d={generateRadarPath()}
                fill="none"
                stroke="rgb(239, 68, 68)"
                strokeWidth="1.5"
                strokeDasharray="6,6"
                opacity={animated ? 0.4 : 0}
                style={{ 
                  transition: 'opacity 1.5s ease-in-out',
                  transitionDelay: '1s',
                  animation: 'dash 25s linear infinite'
                }}
              />

              {/* Category labels and data points - clear, concise labels */}
              {categories.map((cat, i) => {
                const count = threats.filter(t => t.feedCategory === cat.key).length;
                const angleRad = (cat.angle * Math.PI) / 180;
                const labelRadius = 95;
                const x = 100 + labelRadius * Math.cos(angleRad - Math.PI / 2);
                const y = 100 + labelRadius * Math.sin(angleRad - Math.PI / 2);
                const dataX = 100 + (maxThreats > 0 ? (count / maxThreats) * 75 : 0) * Math.cos(angleRad - Math.PI / 2);
                const dataY = 100 + (maxThreats > 0 ? (count / maxThreats) * 75 : 0) * Math.sin(angleRad - Math.PI / 2);
                const colors = getColor(count);
                const isHovered = hoveredCategory === cat.key;

                return (
                  <g 
                    key={i} 
                    style={{ overflow: 'visible' }}
                    onMouseEnter={() => setHoveredCategory(cat.key)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="cursor-pointer"
                  >
                    {/* Data point */}
                    <circle
                      cx={dataX}
                      cy={dataY}
                      r={isHovered ? "6" : "5"}
                      fill={colors.fill}
                      stroke="white"
                      strokeWidth="2"
                      opacity={animated ? 1 : 0}
                      filter="url(#glow)"
                      style={{ 
                        transition: 'all 0.3s ease-in-out',
                        transitionDelay: `${0.8 + i * 0.08}s`
                      }}
                    />
                    {/* Pulsing ring on hover */}
                    {isHovered && (
                      <circle
                        cx={dataX}
                        cy={dataY}
                        r="10"
                        fill="none"
                        stroke={colors.fill}
                        strokeWidth="2"
                        opacity="0.5"
                        style={{ 
                          animation: 'pulse 2s ease-in-out infinite'
                        }}
                      />
                    )}
                    {/* Category label - concise text */}
                    <rect
                      x={x - 35}
                      y={y - 18}
                      width="70"
                      height="28"
                      rx="6"
                      fill="white"
                      fillOpacity={isHovered ? 0.98 : 0.92}
                      stroke={colors.stroke}
                      strokeWidth={isHovered ? "2" : "1.5"}
                      className="dark:fill-slate-800 dark:stroke-slate-600"
                      style={{ 
                        transition: 'all 0.3s ease-in-out',
                        filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                      }}
                    />
                    {/* Category name */}
                    <text
                      x={x}
                      y={y - 4}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-semibold fill-gray-800 dark:fill-gray-200"
                      style={{ 
                        fontSize: '10px',
                        pointerEvents: 'none',
                        userSelect: 'none'
                      }}
                    >
                      {cat.name}
                    </text>
                    {/* Count */}
                    <text
                      x={x}
                      y={y + 10}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      className="font-bold"
                      fill={colors.fill}
                      style={{ 
                        fontSize: '11px',
                        pointerEvents: 'none',
                        userSelect: 'none',
                        textShadow: '0 1px 2px rgba(255,255,255,0.9)'
                      }}
                    >
                      {count}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>

        {/* Compact Legend */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
            Categories
          </h4>
          {categories.map(cat => {
            const count = threats.filter(t => t.feedCategory === cat.key).length;
            const colors = getColor(count);
            const isHovered = hoveredCategory === cat.key;
            const IconComponent = cat.icon;
            const percentage = maxThreats > 0 ? Math.round((count / maxThreats) * 100) : 0;

            return (
              <div 
                key={cat.key} 
                className={`group relative p-2.5 rounded-lg border transition-all duration-300 cursor-pointer ${
                  isHovered 
                    ? 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-slate-700 dark:to-slate-600 border-red-300 dark:border-red-600 shadow-md scale-[1.02]' 
                    : 'bg-gray-50/50 dark:bg-slate-700/30 border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
                onMouseEnter={() => setHoveredCategory(cat.key)}
                onMouseLeave={() => setHoveredCategory(null)}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    {/* Icon */}
                    <div 
                      className="p-1.5 rounded-md bg-opacity-10 dark:bg-opacity-20 transition-all duration-300 flex-shrink-0"
                      style={{ 
                        backgroundColor: `${colors.fill}20`,
                        transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                      }}
                    >
                      <IconComponent 
                        className="w-3.5 h-3.5"
                        style={{ color: colors.fill }}
                      />
                    </div>
                    {/* Category Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <h5 className="font-semibold text-gray-900 dark:text-white text-xs truncate">
                          {cat.name}
                        </h5>
                        <span 
                          className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-opacity-20 flex-shrink-0"
                          style={{ 
                            backgroundColor: `${colors.fill}20`,
                            color: colors.fill
                          }}
                        >
                          {percentage}%
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  {/* Count Badge */}
                  <div 
                    className="flex items-center justify-center w-8 h-8 rounded-lg bg-opacity-10 dark:bg-opacity-20 border transition-all duration-300 flex-shrink-0"
                    style={{ 
                      backgroundColor: `${colors.fill}20`,
                      borderColor: isHovered ? colors.fill : 'transparent',
                      transform: isHovered ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    <span 
                      className="text-sm font-bold"
                      style={{ color: colors.fill }}
                    >
                      {count}
                    </span>
                  </div>
                </div>
                {/* Compact Progress bar */}
                <div className="mt-2 h-1 bg-gray-200 dark:bg-slate-600 rounded-full overflow-hidden">
                  <div 
                    className="h-full transition-all duration-500 ease-out rounded-full"
                    style={{ 
                      width: `${percentage}%`,
                      backgroundColor: colors.fill,
                      opacity: 0.7
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
};
