import { useState, useEffect, useRef } from 'react';

interface TrajectoryGraphProps {
  trajectoryPoints: Array<{x: number, y: number}>;
  selectedLetter: string | null;
  isAnimating: boolean;
}

const TrajectoryGraph = ({
  trajectoryPoints,
  selectedLetter,
  isAnimating
}: TrajectoryGraphProps) => {
  const [animationProgress, setAnimationProgress] = useState(0);
  const animationRef = useRef<number | null>(null);

  // Available letters
  const letters = 'abcdefghijklmnopqrstuvwxyz';

  // Reset animation progress when trajectory changes
  useEffect(() => {
    if (isAnimating) {
      setAnimationProgress(0);
      startAnimation();
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isAnimating, trajectoryPoints]);

  // Animation loop
  const startAnimation = () => {
    let startTime: number | null = null;
    const animationDuration = 1000; // 1 second

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      setAnimationProgress(progress);

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  // Calculate animated trajectory points based on progress
  const getAnimatedPoints = () => {
    if (!isAnimating || trajectoryPoints.length === 0) {
      return trajectoryPoints;
    }

    const numPoints = Math.ceil(trajectoryPoints.length * animationProgress);
    return trajectoryPoints.slice(0, numPoints);
  };

  // Convert points to SVG path
  const getPathFromPoints = (points: Array<{x: number, y: number}>) => {
    if (points.length === 0) return '';

    return points.reduce((path, point, index) => {
      return path + `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y} `;
    }, '');
  };

  // Get letter positions along x-axis
  const getLetterPositions = () => {
    const positions = [];
    const letterWidth = 1000 / letters.length;

    for (let i = 0; i < letters.length; i++) {
      positions.push({
        letter: letters[i],
        x: i * letterWidth + letterWidth / 2,
        isSelected: selectedLetter === letters[i]
      });
    }

    return positions;
  };

  const letterPositions = getLetterPositions();
  const animatedPoints = getAnimatedPoints();
  const pathData = getPathFromPoints(animatedPoints);

  // Get the endpoint (used for showing where the trajectory ends)
  const endpoint = animatedPoints.length > 0 ? animatedPoints[animatedPoints.length - 1] : null;

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-1">Trajectory Graph</h2>

      <div className="w-full bg-gradient-to-b from-blue-50 to-gray-100 border border-gray-300 rounded-lg shadow-inner">
        <svg
          viewBox="0 0 1000 350"
          className="w-full h-[60vh]"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background grid */}
          <defs>
            <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="1000" height="300" fill="url(#smallGrid)" />

          {/* X and Y axes */}
          <line x1="0" y1="300" x2="1000" y2="300" stroke="black" strokeWidth="2" />
          <line x1="10" y1="0" x2="10" y2="300" stroke="black" strokeWidth="2" />

          {/* Target zone - ground line highlighting */}
          <rect x="0" y="295" width="1000" height="10" fill="rgba(0,0,0,0.05)" />

          {/* Letters along x-axis */}
          {letterPositions.map((pos) => (
            <g key={pos.letter}>
              <text
                x={pos.x}
                y="330"
                textAnchor="middle"
                className={`text-xs font-medium ${pos.isSelected ? 'fill-red-600 font-bold' : 'fill-gray-700'}`}
              >
                {pos.letter}
              </text>
              <line
                x1={pos.x}
                y1="295"
                x2={pos.x}
                y2="305"
                stroke={pos.isSelected ? 'red' : 'black'}
                strokeWidth={pos.isSelected ? 2 : 1}
              />
              {pos.isSelected && (
                <>
                  {/* Target highlight */}
                  <circle
                    cx={pos.x}
                    cy="295"
                    r="8"
                    fill="rgba(255,0,0,0.2)"
                  />
                  <circle
                    cx={pos.x}
                    cy="295"
                    r="5"
                    fill="red"
                  />
                </>
              )}
            </g>
          ))}

          {/* Trajectory path */}
          {pathData && (
            <>
              {/* Shadow path */}
              <path
                d={pathData}
                fill="none"
                stroke="rgba(0,0,0,0.1)"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0"
                transform="translate(3,3)"
              />
              {/* Main path */}
              <path
                d={pathData}
                fill="none"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="0"
              />
            </>
          )}

          {/* End point marker */}
          {endpoint && (
            <>
              {/* Glow effect */}
              <circle
                cx={endpoint.x}
                cy={endpoint.y}
                r="10"
                fill="rgba(255,0,0,0.2)"
              />
              {/* Main ball */}
              <circle
                cx={endpoint.x}
                cy={endpoint.y}
                r="6"
                fill="red"
              />
              {/* Shine effect */}
              <circle
                cx={endpoint.x - 2}
                cy={endpoint.y - 2}
                r="2"
                fill="white"
                opacity="0.7"
              />
            </>
          )}

          {/* Legend - more compact */}
          <g transform="translate(850, 20)">
            <rect x="0" y="0" width="140" height="45" rx="3" fill="white" opacity="0.8" />
            <text x="5" y="15" className="text-xs font-medium fill-gray-700">Letter Selection:</text>
            <line x1="5" y1="25" x2="25" y2="25" stroke="rgba(59, 130, 246, 0.8)" strokeWidth="3" strokeLinecap="round" />
            <text x="30" y="28" className="text-xs fill-gray-600">Path</text>
            <circle cx="15" cy="38" r="4" fill="red" />
            <text x="30" y="41" className="text-xs fill-gray-600">Landing</text>
          </g>
        </svg>
      </div>

      {selectedLetter && (
        <div className="text-center p-1 bg-blue-50 rounded-lg border border-blue-100 text-sm">
          Selected letter: <span className="font-bold text-red-600">{selectedLetter}</span>
        </div>
      )}
    </div>
  );
};

export default TrajectoryGraph;
