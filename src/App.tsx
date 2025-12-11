import { useState } from 'react';
import { Scene3D } from './components/Scene3D';
import { Controls } from './components/Controls';
import { UploadPage } from './components/UploadPage';
import { SimulationState } from './types/simulation';

function App() {
  const [isSimulationStarted, setIsSimulationStarted] = useState(false);
  const [glbFile, setGlbFile] = useState<File | null>(null);
  const [volume, setVolume] = useState(1000);
  const [targetAngle, setTargetAngle] = useState(0);
  const [currentVolume, setCurrentVolume] = useState(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>({
    torpedoAngle: 0,
    targetAngle: 0,
    isPouring: false,
    isReturning: false,
    ladleVolume: 0,
    maxLadleVolume: volume,
    torpedoVolume: volume,
  });

  const handleUploadConfirm = (file: File | null, initialVolume: number) => {
    setGlbFile(file);
    setVolume(initialVolume);
    setCurrentVolume(0);
    setTargetAngle(0);
    setIsSimulating(false);
    setIsSimulationStarted(true);
  };

  const handleStart = () => {
    if (targetAngle > 0) {
      setIsSimulating(true);
      setCurrentVolume(0);
    }
  };

  const handleReset = () => {
    setTargetAngle(0);
    setCurrentVolume(0);
    setIsSimulating(false);
    setSimulationState({
      torpedoAngle: 0,
      targetAngle: 0,
      isPouring: false,
      isReturning: false,
      ladleVolume: 0,
      maxLadleVolume: volume,
      torpedoVolume: volume,
    });
  };

  const handleGoBack = () => {
    setIsSimulationStarted(false);
    setGlbFile(null);
    setTargetAngle(0);
    setCurrentVolume(0);
    setIsSimulating(false);
    setSimulationState({
      torpedoAngle: 0,
      targetAngle: 0,
      isPouring: false,
      isReturning: false,
      ladleVolume: 0,
      maxLadleVolume: 1000,
      torpedoVolume: 1000,
    });
  };

  if (!isSimulationStarted) {
    return <UploadPage onConfirm={handleUploadConfirm} />;
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-900">
      <Controls
        volume={volume}
        targetAngle={targetAngle}
        currentVolume={currentVolume}
        onVolumeChange={setVolume}
        onAngleChange={setTargetAngle}
        onFileUpload={() => {}}
        onStart={handleStart}
        onReset={handleReset}
        simulationState={simulationState}
        onBack={handleGoBack}
      />

      <div className="absolute inset-0 pt-64">
        <Scene3D
          glbFile={glbFile}
          targetAngle={isSimulating ? targetAngle : 0}
          volume={volume}
          onVolumeChange={setCurrentVolume}
          onStateChange={setSimulationState}
        />
      </div>

      {!glbFile && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pt-64">
          <div className="text-center text-gray-500">
            <p className="text-lg">Using default model</p>
            <p className="text-sm mt-2">Set angle and start pouring</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
