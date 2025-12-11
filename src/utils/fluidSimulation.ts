import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { FluidParticle } from '../types/simulation';

export class FluidSimulation {
  private particles: FluidParticle[] = [];
  private particleBodies: CANNON.Body[] = [];
  private instancedMesh: THREE.InstancedMesh;
  private particleCount: number = 0;
  private maxParticles: number = 2000;
  private emitRate: number = 0;
  private emitPosition: THREE.Vector3 = new THREE.Vector3();
  private emitVelocity: THREE.Vector3 = new THREE.Vector3();
  private world: CANNON.World;
  private scene: THREE.Scene;
  private dummy = new THREE.Object3D();
  private ladlePosition: THREE.Vector3;
  private ladleRadius: number;

  constructor(scene: THREE.Scene, world: CANNON.World, ladlePos: THREE.Vector3, ladleRadius: number) {
    this.scene = scene;
    this.world = world;
    this.ladlePosition = ladlePos;
    this.ladleRadius = ladleRadius;

    const geometry = new THREE.SphereGeometry(0.03, 8, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      emissive: 0xff3300,
      emissiveIntensity: 0.5,
      metalness: 0.8,
      roughness: 0.2,
    });

    this.instancedMesh = new THREE.InstancedMesh(geometry, material, this.maxParticles);
    this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.scene.add(this.instancedMesh);

    for (let i = 0; i < this.maxParticles; i++) {
      this.particles.push({
        position: [0, -100, 0],
        velocity: [0, 0, 0],
        active: false,
      });
    }
  }

  setEmitRate(rate: number) {
    this.emitRate = rate;
  }

  setEmitPosition(position: THREE.Vector3) {
    this.emitPosition.copy(position);
  }

  setEmitVelocity(velocity: THREE.Vector3) {
    this.emitVelocity.copy(velocity);
  }

  private createParticle() {
    if (this.particleCount >= this.maxParticles) return;

    const index = this.particleCount;
    const particle = this.particles[index];

    const spread = 0.05;
    particle.position = [
      this.emitPosition.x + (Math.random() - 0.5) * spread,
      this.emitPosition.y,
      this.emitPosition.z + (Math.random() - 0.5) * spread,
    ];

    particle.velocity = [
      this.emitVelocity.x + (Math.random() - 0.5) * 0.2,
      this.emitVelocity.y + (Math.random() - 0.5) * 0.2,
      this.emitVelocity.z + (Math.random() - 0.5) * 0.2,
    ];

    particle.active = true;

    const body = new CANNON.Body({
      mass: 0.1,
      shape: new CANNON.Sphere(0.03),
      position: new CANNON.Vec3(...particle.position),
      velocity: new CANNON.Vec3(...particle.velocity),
      linearDamping: 0.1,
    });

    this.world.addBody(body);
    this.particleBodies[index] = body;
    this.particleCount++;
  }

  update(deltaTime: number) {
    if (this.emitRate > 0) {
      const particlesToEmit = Math.floor(this.emitRate * deltaTime);
      for (let i = 0; i < particlesToEmit; i++) {
        this.createParticle();
      }
    }

    for (let i = 0; i < this.particleCount; i++) {
      const particle = this.particles[i];
      const body = this.particleBodies[i];

      if (particle.active && body) {
        particle.position = [body.position.x, body.position.y, body.position.z];
        particle.velocity = [body.velocity.x, body.velocity.y, body.velocity.z];

        this.dummy.position.set(...particle.position);
        this.dummy.updateMatrix();
        this.instancedMesh.setMatrixAt(i, this.dummy.matrix);

        if (body.position.y < -5) {
          particle.active = false;
          this.world.removeBody(body);
        }
      }
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    this.instancedMesh.count = this.particleCount;
  }

  getParticlesInLadle(): number {
    let count = 0;
    for (let i = 0; i < this.particleCount; i++) {
      const particle = this.particles[i];
      if (particle.active) {
        const dx = particle.position[0] - this.ladlePosition.x;
        const dz = particle.position[2] - this.ladlePosition.z;
        const distSq = dx * dx + dz * dz;

        if (
          distSq < this.ladleRadius * this.ladleRadius &&
          particle.position[1] < this.ladlePosition.y + 1 &&
          particle.position[1] > this.ladlePosition.y - 0.5
        ) {
          count++;
        }
      }
    }
    return count;
  }

  reset() {
    for (let i = 0; i < this.particleCount; i++) {
      const body = this.particleBodies[i];
      if (body) {
        this.world.removeBody(body);
      }
      this.particles[i].active = false;
    }
    this.particleCount = 0;
    this.emitRate = 0;
  }
}
