export interface FluidParticle {
  position: [number, number, number];
  velocity: [number, number, number];
  active: boolean;
}

export interface SimulationState {
  torpedoAngle: number;
  targetAngle: number;
  isPouring: boolean;
  isReturning: boolean;
  ladleVolume: number;
  maxLadleVolume: number;
  torpedoVolume: number;
}

export interface TorpedoConfig {
  length: number;
  radius: number;
  pivotOffset: number;
}
