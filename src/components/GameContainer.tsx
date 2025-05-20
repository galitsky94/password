import { useState, useEffect, useRef } from 'react';

const GameContainer = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Game control states
  const [power, setPower] = useState(50);
  const [gravity, setGravity] = useState(50);
  const [scale, setScale] = useState(50);

  // Trajectory calculation and animation states
  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [trajectoryPoints, setTrajectoryPoints] = useState<Array<{ x: number, y: number }>>([]);
  const [animatedTrajectory, setAnimatedTrajectory] = useState<Array<{ x: number, y: number }>>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Calculate the letter based on x position
  const calculateLetter = (x: number): string => {
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const index = Math.floor((x / 1000) * letters.length);
    return letters[Math.max(0, Math.min(index, letters.length - 1))];
  };

  // Calculate trajectory points, allowing for off-screen travel
  const calculateTrajectory = () => {
    const points: Array<{ x: number, y: number }> = [];
    const numPoints = 200; // Increased points for longer potential trajectories

    const range = (power / 100) * 1500; // Allow range to go beyond 1000px
    const maxHeight = 10 + (scale / 100) * 600; // Allow maxHeight to be higher
    const gravityFactor = 1 + (gravity / 25);

    for (let i = 0; i <= numPoints; i++) {
      const t = i / numPoints;
      const x = t * range;

      // No longer breaking if x > 1000, allow it to go off-screen

      let y = 4 * maxHeight * t * (1 - t);
      y = y / gravityFactor;

      // Clamping y to keep it within reasonable visual bounds for the SVG, even if it lands off-screen
      const clampedY = Math.max(-200, Math.min(550, y)); // Allow y to go below 0 or above canvas briefly

      points.push({ x, y: 350 - clampedY });
    }

    return points;
  };

  // Modified to handle off-screen landings
  const animateShot = (points: Array<{ x: number, y: number }>, duration: number) => {
    let startTime: number | null = null;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentPointIndex = Math.floor(progress * (points.length - 1));
      setAnimatedTrajectory(points.slice(0, currentPointIndex + 1));

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Animation finished
        const finalPoint = points[points.length - 1];
        // Check if the landing point is within the a-z range (0-1000px for x)
        if (
          finalPoint.x >= 0 &&
          finalPoint.x <= 1000 &&
          finalPoint.y >= 340 &&
          finalPoint.y <= 360
        ) {
          const letter = calculateLetter(finalPoint.x);
          setSelectedLetter(letter);
          setPassword((prev) => prev + letter);
        } else {
          setSelectedLetter(null); // Landed off-screen or too high/low
        }
        setIsAnimating(false);
      }
    };
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  // Handle the shot launch
  const handleLaunch = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setAnimatedTrajectory([]); // Clear previous animation path
    setSelectedLetter(null); // Clear previous selected letter
    const fullTrajectory = calculateTrajectory();
    setTrajectoryPoints(fullTrajectory); // Set full path for potential static display
    animateShot(fullTrajectory, 1000); // Animate over 1 second
  };

  useEffect(() => {
    // Cleanup animation frame on component unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // Clear password
  const handleClearPassword = () => {
    setPassword('');
    setSelectedLetter(null);
    setTrajectoryPoints([]);
    setAnimatedTrajectory([]);
  };

  // Handle login attempt
  const handleLogin = () => {
    alert(`Login attempt with username: ${username} and password: ${password}`);
  };

  // Convert points to SVG path (used for the animated path)
  const getPathFromPoints = (points: Array<{ x: number, y: number }>) => {
    if (points.length === 0) return '';
    return points.reduce((path, point, index) => {
      return path + `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y} `;
    }, '');
  };

  // Available letters
  const letters = 'abcdefghijklmnopqrstuvwxyz';

  // Get letter positions along x-axis
  const getLetterPositions = () => {
    const positions = [];
    const letterWidth = 1000 / letters.length;
    for (let i = 0; i < letters.length; i++) {
      positions.push({
        letter: letters[i],
        x: i * letterWidth + letterWidth / 2,
        isSelected: selectedLetter === letters[i] && !isAnimating // Only highlight if animation is done
      });
    }
    return positions;
  };

  const letterPositions = getLetterPositions();
  const pathData = getPathFromPoints(animatedTrajectory); // Use animatedTrajectory for the path
  const currentProjectilePosition =
    animatedTrajectory.length > 0 ? animatedTrajectory[animatedTrajectory.length - 1] : null;

  return (
    <div className="max-w-5xl w-full bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Password Trajectory Game
      </h1>

      <div className="space-y-4">
        {/* Username and Password */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="username" className="text-gray-700 w-24 font-medium">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-64 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your username"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="password" className="text-gray-700 w-24 font-medium">
              Password:
            </label>
            <input
              type="text"
              id="password"
              value={password}
              readOnly
              className="w-64 px-2 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Fire to add letters"
            />
          </div>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-3 gap-6">
          <div>
            <div className="flex justify-between">
              <label htmlFor="power" className="text-gray-700 font-medium">
                Power:
              </label>
              <span className="text-gray-700">{power}</span>
            </div>
            <input
              type="range"
              id="power"
              min="0"
              max="100"
              value={power}
              onChange={(e) => setPower(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={isAnimating}
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="gravity" className="text-gray-700 font-medium">
                Gravity:
              </label>
              <span className="text-gray-700">{gravity}</span>
            </div>
            <input
              type="range"
              id="gravity"
              min="0"
              max="100"
              value={gravity}
              onChange={(e) => setGravity(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={isAnimating}
            />
          </div>

          <div>
            <div className="flex justify-between">
              <label htmlFor="scale" className="text-gray-700 font-medium">
                Scale:
              </label>
              <span className="text-gray-700">{scale}</span>
            </div>
            <input
              type="range"
              id="scale"
              min="1"
              max="100"
              value={scale}
              onChange={(e) => setScale(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              disabled={isAnimating}
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={handleLaunch}
            disabled={isAnimating}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50"
          >
            Launch!
          </button>
          <button
            type="button"
            onClick={handleClearPassword}
            disabled={isAnimating}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleLogin}
            className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            Login
          </button>
        </div>

        {/* Trajectory Graph */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg">
          <svg
            viewBox="0 0 1000 400"
            className="w-full h-96"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="1000" height="350" fill="url(#smallGrid)" />

            {/* X and Y axes */}
            <line x1="0" y1="350" x2="1000" y2="350" stroke="black" strokeWidth="2" />
            <line x1="10" y1="0" x2="10" y2="350" stroke="black" strokeWidth="2" />

            {/* Target zone - ground line highlighting */}
            <rect x="0" y="345" width="1000" height="10" fill="rgba(0,0,0,0.05)" />

            {/* Letters along x-axis */}
            {letterPositions.map((pos) => (
              <g key={pos.letter}>
                <text
                  x={pos.x}
                  y="380"
                  textAnchor="middle"
                  className={`text-xs font-medium ${pos.isSelected ? 'fill-red-600 font-bold' : 'fill-gray-700'}`}
                >
                  {pos.letter}
                </text>
                <line
                  x1={pos.x}
                  y1="345"
                  x2={pos.x}
                  y2="355"
                  stroke={pos.isSelected ? 'red' : 'black'}
                  strokeWidth={pos.isSelected ? 2 : 1}
                />
                {pos.isSelected && (
                  <>
                    {/* Target highlight */}
                    <circle
                      cx={pos.x}
                      cy="345"
                      r="8"
                      fill="rgba(255,0,0,0.2)"
                    />
                    <circle
                      cx={pos.x}
                      cy="345"
                      r="5"
                      fill="red"
                    />
                  </>
                )}
              </g>
            ))}

            {/* Trajectory path (animated) */}
            {pathData && (
              <path
                d={pathData}
                fill="none"
                stroke="rgba(59, 130, 246, 0.8)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Projectile marker (animated) */}
            {isAnimating && currentProjectilePosition && (
              <circle
                cx={currentProjectilePosition.x}
                cy={currentProjectilePosition.y}
                r="8"
                fill="rgba(255, 0, 0, 0.7)"
              />
            )}

            {/* End point marker (static, shows after animation) */}
            {!isAnimating && trajectoryPoints.length > 0 && trajectoryPoints[trajectoryPoints.length - 1] && (
              <>
                <circle
                  cx={trajectoryPoints[trajectoryPoints.length - 1].x}
                  cy={trajectoryPoints[trajectoryPoints.length - 1].y}
                  r="10"
                  fill="rgba(255,0,0,0.2)"
                />
                <circle
                  cx={trajectoryPoints[trajectoryPoints.length - 1].x}
                  cy={trajectoryPoints[trajectoryPoints.length - 1].y}
                  r="6"
                  fill="red"
                />
              </>
            )}
          </svg>
        </div>

        {selectedLetter && (
          <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-100">
            <p className="text-lg">
              Selected letter: <span className="font-bold text-red-600">{selectedLetter}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameContainer;
