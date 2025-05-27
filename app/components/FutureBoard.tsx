'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import type { Font } from 'three/examples/jsm/loaders/FontLoader.js';

const FutureBoard = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const textMeshRef = useRef<THREE.Mesh | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const targetRotationRef = useRef<number>(0);
  const targetRotationOnPointerDownRef = useRef<number>(0);
  const pointerXRef = useRef<number>(0);
  const pointerXOnPointerDownRef = useRef<number>(0);
  const mouseXRef = useRef<number>(0);
  const mouseYRef = useRef<number>(0);
  const windowHalfXRef = useRef<number>(0);
  const windowHalfYRef = useRef<number>(0);
  const wavePlaneRef = useRef<THREE.Mesh | null>(null);
  const countRef = useRef<number>(0);
  const isPointerDownRef = useRef<boolean>(false);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize window-related values
    windowHalfXRef.current = window.innerWidth / 2;
    windowHalfYRef.current = window.innerHeight / 2;

    const mount = mountRef.current;
    // Scene setup - adjust fog for better visibility
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFBFFE9); // Your original light background
    scene.fog = new THREE.Fog(0xFBFFE9, 50000, 200000); // Much further fog distances
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 1, 400000);
    camera.position.set(0, 10000, 10000);
    const cameraTarget = new THREE.Vector3(0, 8000, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Create wave plane - make it more visible against light background
    const vertexHeight = 15000;
    const planeDefinition = 100;
    const planeSize = 1245000;
    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize, planeDefinition, planeDefinition);
    const plane = new THREE.Mesh(
      planeGeo,
      new THREE.MeshBasicMaterial({
        color: 0x000000, // Pure black for better contrast
        wireframe: true,
        transparent: true,
        opacity: 0.8 // Increased opacity for better visibility
      })
    );
    plane.rotation.x -= Math.PI * 0.5;
    scene.add(plane);
    wavePlaneRef.current = plane;

    // Initialize wave vertices - store original Z positions
    const positions = planeGeo.attributes.position;
    const originalZPositions: number[] = [];
    
    for (let i = 0; i < positions.count; i++) {
      const randomOffset = Math.random() * vertexHeight - vertexHeight;
      const originalZ = positions.getZ(i) + randomOffset;
      positions.setZ(i, originalZ);
      originalZPositions[i] = originalZ; // Store original position
    }
    positions.needsUpdate = true;

    // Lighting
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight1.position.set(0, 0, 1).normalize();
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight2.position.set(0, 30, 10).normalize();
    dirLight2.color.setHSL(Math.random(), 1, 0.5, THREE.SRGBColorSpace);
    scene.add(dirLight2);

    // Material - make text more visible
    const material = new THREE.MeshPhongMaterial({ 
      color: 0x000000, // Pure black for better contrast against light background
      flatShading: false 
    });

    // Group for text - position it much higher and further to be visible with new camera
    const group = new THREE.Group();
    group.position.y = 8000;
    scene.add(group);
    groupRef.current = group;

    
    const text = 'FUTUREBOARD';
    const depth = 200; 
    const size = 1000; 
    const curveSegments = 6;
    const bevelThickness = 40;
    const bevelSize = 10;
    const bevelEnabled = true;

    // Font loading
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font: Font) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        depth: depth,
        curveSegments: curveSegments,
        bevelThickness: bevelThickness,
        bevelSize: bevelSize,
        bevelEnabled: bevelEnabled
      });

      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
      textGeometry.translate(-textWidth / 2, 0, 0);

      const textMesh = new THREE.Mesh(textGeometry, material);
      group.add(textMesh);
      textMeshRef.current = textMesh;
    });

    // Animation
    const windowHalfX = window.innerWidth / 2;

    const onPointerDown = (event: PointerEvent) => {
      isPointerDownRef.current = true;
      pointerXOnPointerDownRef.current = event.clientX - windowHalfX;
      targetRotationOnPointerDownRef.current = targetRotationRef.current;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (!isPointerDownRef.current) return;
      pointerXRef.current = event.clientX - windowHalfX;
      targetRotationRef.current = targetRotationOnPointerDownRef.current + (pointerXRef.current - pointerXOnPointerDownRef.current) * 0.02;
    };

    const onPointerUp = () => {
      isPointerDownRef.current = false;
    };

    mount.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    // Mouse move handler
    const onMouseMove = (event: MouseEvent) => {
      mouseXRef.current = (event.clientX - windowHalfXRef.current) * 0.5;
      mouseYRef.current = (event.clientY - windowHalfYRef.current) * 0.5;
    };

    // Touch move handler
    const onTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 1) {
        mouseXRef.current = (event.touches[0].clientX - windowHalfXRef.current) * 0.5;
        mouseYRef.current = (event.touches[0].clientY - windowHalfYRef.current) * 0.5;
      }
    };

    mount.addEventListener('mousemove', onMouseMove);
    mount.addEventListener('touchmove', onTouchMove);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Camera rotation (like in Svelte version)
      if (cameraRef.current) {
        const x = cameraRef.current.position.x;
        const z = cameraRef.current.position.z;
        cameraRef.current.position.x = x * Math.cos(0.001) + z * Math.sin(0.001) - 10;
        cameraRef.current.position.z = z * Math.cos(0.001) - x * Math.sin(0.001) - 10;
        cameraRef.current.lookAt(new THREE.Vector3(0, 11000, 0));
      }

      // Update wave animation (matching Svelte logic)
      if (wavePlaneRef.current) {
        const geometry = wavePlaneRef.current.geometry;
        const positions = geometry.attributes.position;
        const count = positions.count;

        for (let i = 0; i < count; i++) {
          const originalZ = originalZPositions[i];
          const waveZ = Math.sin((i + countRef.current * 0.00002)) * (originalZ - (originalZ * 0.7));
          positions.setZ(i, waveZ);
        }
        positions.needsUpdate = true;
        countRef.current += 0.1;
      }

      if (groupRef.current) {
        // Smooth rotation based on mouse X position
        groupRef.current.rotation.y += (targetRotationRef.current - groupRef.current.rotation.y) * 0.05;
        
        // Add tilt effect based on mouse position
        groupRef.current.rotation.x += (mouseYRef.current * 0.0005 - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.z += (mouseXRef.current * 0.0005 - groupRef.current.rotation.z) * 0.05;

        // Add subtle floating movement - scaled for new position
        groupRef.current.position.y = 8000 + Math.sin(Date.now() * 0.001) * 50; // Increased from 5 to 50
        groupRef.current.position.x = mouseXRef.current * 1; // Increased from 0.1 to 1
        groupRef.current.position.z = mouseYRef.current * 1; // Increased from 0.1 to 1
      }

      if (cameraRef.current && sceneRef.current && rendererRef.current) {
        cameraRef.current.lookAt(cameraTarget);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize - FIXED VERSION
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        windowHalfXRef.current = window.innerWidth / 2;
        windowHalfYRef.current = window.innerHeight / 2;

        // Simply scale the existing plane instead of recreating geometry
        if (wavePlaneRef.current) {
          const scaleX = Math.max(window.innerWidth / 1920, 1);
          const scaleZ = Math.max(window.innerHeight / 1080, 1);
          wavePlaneRef.current.scale.set(scaleX, 1, scaleZ);
        }
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', onMouseMove);
      mount.removeEventListener('touchmove', onTouchMove);
      mount.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (rendererRef.current) {
        rendererRef.current.dispose();
        mount.removeChild(rendererRef.current.domElement);
      }
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full absolute inset-0 overflow-hidden" />
  );
};

export default FutureBoard; 