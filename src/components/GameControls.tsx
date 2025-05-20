interface GameControlsProps {
  power: number;
  gravity: number;
  curve: number;
  onPowerChange: (value: number) => void;
  onGravityChange: (value: number) => void;
  onCurveChange: (value: number) => void;
  onLaunch: () => void;
  onClear: () => void;
  onTogglePassword: () => void;
  isAnimating: boolean;
  showPassword: boolean;
}

const GameControls = ({
  power,
  gravity,
  curve,
  onPowerChange,
  onGravityChange,
  onCurveChange,
  onLaunch,
  onClear,
  onTogglePassword,
  isAnimating,
  showPassword
}: GameControlsProps) => {
  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold mb-1">Trajectory Controls</h2>

      {/* Power Slider - Controls horizontal distance */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <label htmlFor="power" className="font-medium text-gray-700">
            Power: {power} <span className="text-xs text-gray-500">(distance)</span>
          </label>
          <span className="text-gray-500">{power}%</span>
        </div>
        <input
          type="range"
          id="power"
          min="0"
          max="100"
          value={power}
          onChange={(e) => onPowerChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={isAnimating}
        />
      </div>

      {/* Gravity Slider - Controls arc height */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <label htmlFor="gravity" className="font-medium text-gray-700">
            Gravity: {gravity} <span className="text-xs text-gray-500">(height)</span>
          </label>
          <span className="text-gray-500">{gravity}%</span>
        </div>
        <input
          type="range"
          id="gravity"
          min="0"
          max="100"
          value={gravity}
          onChange={(e) => onGravityChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={isAnimating}
        />
      </div>

      {/* Curve Slider - Controls arc curvature */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <label htmlFor="curve" className="font-medium text-gray-700">
            Curve: {curve} <span className="text-xs text-gray-500">(curveness)</span>
          </label>
          <span className="text-gray-500">{curve}%</span>
        </div>
        <input
          type="range"
          id="curve"
          min="1"
          max="100"
          value={curve}
          onChange={(e) => onCurveChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          disabled={isAnimating}
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-3 gap-1 pt-1">
        <button
          type="button"
          onClick={onLaunch}
          disabled={isAnimating}
          className="flex justify-center py-1 px-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 disabled:opacity-50"
        >
          Launch!
        </button>

        <button
          type="button"
          onClick={onClear}
          disabled={isAnimating}
          className="flex justify-center py-1 px-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-1 focus:ring-red-500 disabled:opacity-50"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={onTogglePassword}
          disabled={isAnimating}
          className="flex justify-center py-1 px-2 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
        >
          {showPassword ? 'Hide' : 'Show'}
        </button>
      </div>

      {/* Tip */}
      <div className="mt-1 p-2 bg-yellow-50 rounded-md border border-yellow-200 text-xs">
        <span className="font-medium">Tip:</span> Lower power for letters near 'a', higher for 'z'.
      </div>
    </div>
  );
};

export default GameControls;
