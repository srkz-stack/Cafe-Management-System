import { Play, RotateCcw, ArrowLeft } from 'lucide-react';
import { SimulationState } from '../types/simulation';

interface ControlsProps {
  volume: number;
  targetAngle: number;
  currentVolume: number;
  onVolumeChange: (volume: number) => void;
  onAngleChange: (angle: number) => void;
  onFileUpload: (file: File) => void;
  onStart: () => void;
  onReset: () => void;
  simulationState: SimulationState;
  onBack: () => void;
}

export function Controls({
  volume,
  targetAngle,
  currentVolume,
  onVolumeChange,
  onAngleChange,
  onFileUpload,
  onStart,
  onReset,
  simulationState,
  onBack,
}: ControlsProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.glb')) {
      onFileUpload(file);
    }
  };

  const fillPercentage = (currentVolume / volume) * 100;

  return (
    <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-gray-900/95 to-gray-900/80 backdrop-blur-sm text-white p-6 shadow-2xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-orange-400">
            Molten Steel Pouring Simulation
          </h1>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          >
            <ArrowLeft size={18} />
            Back
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                GLB Model File
              </label>
              <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-600">
                <Upload size={20} />
                <span className="text-sm">Upload GLB Model</span>
                <input
                  type="file"
                  accept=".glb"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Torpedo Volume (Liters)
              </label>
              <input
                type="number"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                min="1"
                max="10000"
                step="10"
                className="w-full px-4 py-3 bg-gray-800 rounded-lg border border-gray-600 focus:border-orange-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Tilt Angle (Degrees): {targetAngle}°
              </label>
              <input
                type="range"
                value={targetAngle}
                onChange={(e) => onAngleChange(Number(e.target.value))}
                min="0"
                max="90"
                step="5"
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0°</span>
                <span>45°</span>
                <span>90°</span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-sm font-medium mb-3 text-gray-300">Simulation Status</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Angle:</span>
                  <span className="font-mono text-orange-400">
                    {simulationState.torpedoAngle.toFixed(1)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="font-mono text-green-400">
                    {simulationState.isPouring
                      ? 'Pouring'
                      : simulationState.isReturning
                        ? 'Returning'
                        : 'Ready'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Ladle Fill:</span>
                  <span className="font-mono text-blue-400">{fillPercentage.toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-300">
                Ladle Volume: {currentVolume.toFixed(1)} / {volume} L
              </label>
              <div className="w-full h-8 bg-gray-800 rounded-lg overflow-hidden border border-gray-600">
                <div
                  className="h-full bg-gradient-to-r from-orange-600 to-orange-400 transition-all duration-300 flex items-center justify-center text-xs font-bold"
                  style={{ width: `${Math.min(fillPercentage, 100)}%` }}
                >
                  {fillPercentage > 10 && `${fillPercentage.toFixed(0)}%`}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={onStart}
              disabled={simulationState.isPouring || simulationState.isReturning}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed rounded-lg font-semibold transition-all shadow-lg"
            >
              <Play size={20} />
              Start Pouring
            </button>

            <button
              onClick={onReset}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 rounded-lg font-semibold transition-all shadow-lg"
            >
              <RotateCcw size={20} />
              Reset
            </button>

            <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <h3 className="text-xs font-medium mb-2 text-gray-400">Instructions</h3>
              <ul className="text-xs text-gray-400 space-y-1">
                <li>1. Upload your GLB model</li>
                <li>2. Set volume and tilt angle</li>
                <li>3. Click Start Pouring</li>
                <li>4. Watch the physics simulation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
