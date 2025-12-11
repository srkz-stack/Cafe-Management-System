import * as CANNON from 'cannon-es';

export class PhysicsWorld {
  world: CANNON.World;

  constructor() {
    this.world = new CANNON.World();
    this.world.gravity.set(0, -9.82, 0);
    this.world.broadphase = new CANNON.NaiveBroadphase();
    this.world.solver.iterations = 10;
  }

  update(deltaTime: number) {
    this.world.step(1 / 60, deltaTime, 3);
  }

  addBody(body: CANNON.Body) {
    this.world.addBody(body);
  }

  removeBody(body: CANNON.Body) {
    this.world.removeBody(body);
  }
}
