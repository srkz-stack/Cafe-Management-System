import { Upload, ArrowRight } from 'lucide-react';
import { useRef, useState } from 'react';

interface UploadPageProps {
  onConfirm: (file: File | null, volume: number) => void;
}

export function UploadPage({ onConfirm }: UploadPageProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [volume, setVolume] = useState(1000);
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.glb')) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-orange-500', 'bg-orange-500/5');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-orange-500', 'bg-orange-500/5');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-orange-500', 'bg-orange-500/5');

    const file = e.dataTransfer.files?.[0];
    if (file && file.name.endsWith('.glb')) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleContinue = () => {
    onConfirm(selectedFile, volume);
  };

  const handleUseDefault = () => {
    onConfirm(null, volume);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-3">
            Molten Steel Simulation
          </h1>
          <p className="text-gray-400 text-lg">
            Upload your 3D model or use the default scene
          </p>
        </div>

        <div className="space-y-8">
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className="border-2 border-dashed border-gray-600 hover:border-gray-500 rounded-xl p-12 bg-gray-800/50 cursor-pointer transition-all hover:bg-gray-800/70"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".glb"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-4">
              <div className="p-4 bg-orange-500/10 rounded-lg">
                <Upload size={40} className="text-orange-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">
                  {fileName || 'Drop your GLB file here'}
                </h2>
                <p className="text-gray-400">or click to browse</p>
              </div>
              {selectedFile && (
                <div className="text-sm text-green-400 mt-2 flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  File selected: {fileName}
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Torpedo Volume (Liters)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                min="10"
                max="10000"
                step="10"
                className="flex-1 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
              />
              <div className="text-xl font-bold text-orange-400 min-w-24 text-right">
                {volume.toLocaleString()} L
              </div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>10 L</span>
              <span>5,000 L</span>
              <span>10,000 L</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleUseDefault}
              className="px-6 py-4 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Use Default Model
            </button>
            <button
              onClick={handleContinue}
              disabled={!selectedFile}
              className="px-6 py-4 bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400 disabled:from-gray-700 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              Continue to Simulation
              <ArrowRight size={20} />
            </button>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
            <h3 className="text-sm font-semibold text-gray-300 mb-3">
              Expected GLB Structure
            </h3>
            <ul className="text-sm text-gray-400 space-y-2">
              <li className="flex gap-2">
                <span className="text-orange-400">•</span>
                <span>
                  <strong>o_lad</strong> - The torpedo container (will rotate)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">•</span>
                <span>
                  <strong>o_LAD21</strong> - The ladle container (will receive liquid)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-orange-400">•</span>
                <span>Support blocks for the torpedo rotation axis</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
