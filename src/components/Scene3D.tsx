import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { PhysicsWorld } from '../utils/physics';
import { FluidSimulation } from '../utils/fluidSimulation';
import { TorpedoController } from '../utils/torpedoController';
import { SimulationState } from '../types/simulation';

interface Scene3DProps {
  glbFile: File | null;
  targetAngle: number;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onStateChange: (state: SimulationState) => void;
}

export function Scene3D({ glbFile, targetAngle, volume, onVolumeChange, onStateChange }: Scene3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const torpedoRef = useRef<THREE.Group | null>(null);
  const ladleRef = useRef<THREE.Group | null>(null);
  const controllerRef = useRef<TorpedoController | null>(null);
  const fluidSimRef = useRef<FluidSimulation | null>(null);
  const physicsRef = useRef<PhysicsWorld | null>(null);
  const animationFrameRef = useRef<number>();
  const clockRef = useRef<THREE.Clock>(new THREE.Clock());

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(5, 3, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    scene.add(mainLight);

    const fillLight = new THREE.DirectionalLight(0x4466ff, 0.3);
    fillLight.position.set(-5, 5, -5);
    scene.add(fillLight);

    const pointLight = new THREE.PointLight(0xff6600, 1, 10);
    pointLight.position.set(0, 2, 0);
    scene.add(pointLight);

    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    const physics = new PhysicsWorld();
    physicsRef.current = physics;

    const initialState: SimulationState = {
      torpedoAngle: 0,
      targetAngle: 0,
      isPouring: false,
      isReturning: false,
      ladleVolume: 0,
      maxLadleVolume: volume,
      torpedoVolume: volume,
    };

    const pivotPoint = new THREE.Vector3(0, 1.5, 0);
    const controller = new TorpedoController(pivotPoint, initialState);
    controllerRef.current = controller;

    if (glbFile) {
      const loader = new GLTFLoader();
      const url = URL.createObjectURL(glbFile);

      loader.load(url, (gltf) => {
        const model = gltf.scene;

        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }

          const name = child.name.toLowerCase();

          if (name.includes('o_lad') && !name.includes('21')) {
            if (!torpedoRef.current) {
              torpedoRef.current = new THREE.Group();
              scene.add(torpedoRef.current);
            }
            torpedoRef.current.add(child.clone());
          }

          if (name.includes('lad21') || name.includes('ladle')) {
            if (!ladleRef.current) {
              ladleRef.current = new THREE.Group();
              scene.add(ladleRef.current);
            }
            ladleRef.current.add(child.clone());
          }
        });

        if (torpedoRef.current) {
          torpedoRef.current.position.copy(pivotPoint);
          controller.setTorpedo(torpedoRef.current);
        }

        if (ladleRef.current) {
          ladleRef.current.position.set(0, 0, 0);
        }

        const ladlePosition = new THREE.Vector3(0, 0.5, 0);
        const fluidSim = new FluidSimulation(scene, physics.world, ladlePosition, 0.5);
        fluidSimRef.current = fluidSim;

        URL.revokeObjectURL(url);
      });
    } else {
      const torpedoGeometry = new THREE.CylinderGeometry(0.3, 0.3, 3, 32);
      const torpedoMaterial = new THREE.MeshStandardMaterial({
        color: 0x888888,
        metalness: 0.7,
        roughness: 0.3,
      });
      const torpedo = new THREE.Mesh(torpedoGeometry, torpedoMaterial);
      torpedo.rotation.z = Math.PI / 2;
      torpedo.castShadow = true;
      torpedo.receiveShadow = true;

      const supportGeometry = new THREE.BoxGeometry(0.5, 0.8, 0.5);
      const supportMaterial = new THREE.MeshStandardMaterial({ color: 0x666666 });

      const support1 = new THREE.Mesh(supportGeometry, supportMaterial);
      support1.position.set(-1.5, 0, 0);
      support1.castShadow = true;

      const support2 = new THREE.Mesh(supportGeometry, supportMaterial);
      support2.position.set(1.5, 0, 0);
      support2.castShadow = true;

      const torpedoGroup = new THREE.Group();
      torpedoGroup.add(torpedo);
      torpedoGroup.add(support1);
      torpedoGroup.add(support2);
      torpedoGroup.position.copy(pivotPoint);
      scene.add(torpedoGroup);

      torpedoRef.current = torpedoGroup;
      controller.setTorpedo(torpedoGroup);

      const ladleGeometry = new THREE.CylinderGeometry(0.5, 0.4, 0.8, 32);
      const ladleMaterial = new THREE.MeshStandardMaterial({
        color: 0x555555,
        metalness: 0.6,
        roughness: 0.4,
      });
      const ladle = new THREE.Mesh(ladleGeometry, ladleMaterial);
      ladle.position.set(0, 0.4, 0);
      ladle.castShadow = true;
      ladle.receiveShadow = true;
      scene.add(ladle);

      ladleRef.current = new THREE.Group();
      ladleRef.current.add(ladle);
      scene.add(ladleRef.current);

      const ladlePosition = new THREE.Vector3(0, 0.5, 0);
      const fluidSim = new FluidSimulation(scene, physics.world, ladlePosition, 0.5);
      fluidSimRef.current = fluidSim;
    }

    let lastTime = 0;
    let hasStartedPouring = false;

    const animate = (time: number) => {
      animationFrameRef.current = requestAnimationFrame(animate);

      const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      controls.update();

      if (controllerRef.current && fluidSimRef.current && physicsRef.current) {
        const { angle, pourPosition, isPouring } = controllerRef.current.update(deltaTime);

        if (targetAngle > 0 && !hasStartedPouring && angle < 1) {
          controllerRef.current.startPouring(targetAngle);
          hasStartedPouring = true;
        }

        if (isPouring) {
          const velocity = new THREE.Vector3(
            Math.cos((angle * Math.PI) / 180) * 0.5,
            -Math.sin((angle * Math.PI) / 180) * 2,
            0
          );

          fluidSimRef.current.setEmitPosition(pourPosition);
          fluidSimRef.current.setEmitVelocity(velocity);
          fluidSimRef.current.setEmitRate(50);
        } else {
          fluidSimRef.current.setEmitRate(0);
        }

        physicsRef.current.update(deltaTime);
        fluidSimRef.current.update(deltaTime);

        const particlesInLadle = fluidSimRef.current.getParticlesInLadle();
        const currentVolume = (particlesInLadle / 100) * volume;
        onVolumeChange(Math.min(currentVolume, volume));

        if (currentVolume >= volume * 0.95 && hasStartedPouring) {
          controllerRef.current.returnToStart();
          hasStartedPouring = false;
        }

        const state = controllerRef.current.getState();
        onStateChange({
          ...state,
          ladleVolume: currentVolume,
        });
      }

      renderer.render(scene, camera);
    };

    animate(0);

    const handleResize = () => {
      if (!containerRef.current) return;

      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [glbFile]);

  useEffect(() => {
    if (controllerRef.current) {
      const state = controllerRef.current.getState();
      state.maxLadleVolume = volume;
      state.torpedoVolume = volume;
    }
  }, [volume]);

  return <div ref={containerRef} className="w-full h-full" />;
}
