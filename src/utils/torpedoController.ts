import * as THREE from 'three';
import { SimulationState } from '../types/simulation';

export class TorpedoController {
  private torpedo: THREE.Group | null = null;
  private pivotPoint: THREE.Vector3;
  private rotationSpeed: number = 0.5;
  private state: SimulationState;

  constructor(pivotPoint: THREE.Vector3, initialState: SimulationState) {
    this.pivotPoint = pivotPoint;
    this.state = initialState;
  }

  setTorpedo(torpedo: THREE.Group) {
    this.torpedo = torpedo;
  }

  startPouring(targetAngle: number) {
    this.state.targetAngle = targetAngle;
    this.state.isPouring = true;
    this.state.isReturning = false;
  }

  returnToStart() {
    this.state.targetAngle = 0;
    this.state.isReturning = true;
    this.state.isPouring = false;
  }

  update(deltaTime: number): { angle: number; pourPosition: THREE.Vector3; isPouring: boolean } {
    if (!this.torpedo) {
      return {
        angle: 0,
        pourPosition: new THREE.Vector3(),
        isPouring: false,
      };
    }

    const angleDiff = this.state.targetAngle - this.state.torpedoAngle;

    if (Math.abs(angleDiff) > 0.01) {
      const rotationAmount = Math.sign(angleDiff) * this.rotationSpeed * deltaTime;

      if (Math.abs(rotationAmount) < Math.abs(angleDiff)) {
        this.state.torpedoAngle += rotationAmount;
      } else {
        this.state.torpedoAngle = this.state.targetAngle;
      }

      const rotationAxis = new THREE.Vector3(0, 0, 1);

      this.torpedo.position.copy(this.pivotPoint);
      this.torpedo.rotation.z = (this.state.torpedoAngle * Math.PI) / 180;
    }

    const pourOffset = new THREE.Vector3(1.5, 0, 0);
    pourOffset.applyAxisAngle(new THREE.Vector3(0, 0, 1), (this.state.torpedoAngle * Math.PI) / 180);

    const pourPosition = new THREE.Vector3().addVectors(this.pivotPoint, pourOffset);

    const isPouringNow = this.state.torpedoAngle > 5 && !this.state.isReturning;

    return {
      angle: this.state.torpedoAngle,
      pourPosition,
      isPouring: isPouringNow,
    };
  }

  getState(): SimulationState {
    return this.state;
  }
}
