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

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize window-related values
    windowHalfXRef.current = window.innerWidth / 2;
    windowHalfYRef.current = window.innerHeight / 2;

    const mount = mountRef.current;
    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFBFFE9);
    scene.fog = new THREE.Fog(0xFBFFE9, 250, 1400);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 400, 700);
    const cameraTarget = new THREE.Vector3(0, 150, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight1.position.set(0, 0, 1).normalize();
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight2.position.set(0, 30, 10).normalize();
    dirLight2.color.setHSL(Math.random(), 1, 0.5, THREE.SRGBColorSpace);
    scene.add(dirLight2);

    // Material
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xffffff, 
      flatShading: false 
    });

    // Group for text
    const group = new THREE.Group();
    group.position.y = 100;
    scene.add(group);
    groupRef.current = group;

    // Text parameters
    const text = 'FUTUREBOARD';
    const depth = 5;
    const size = 50;
    const curveSegments = 4;
    const bevelThickness = 2;
    const bevelSize = 0.5;

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
        bevelEnabled: true
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
      pointerXOnPointerDownRef.current = event.clientX - windowHalfX;
      targetRotationOnPointerDownRef.current = targetRotationRef.current;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      pointerXRef.current = event.clientX - windowHalfX;
      targetRotationRef.current = targetRotationOnPointerDownRef.current + (pointerXRef.current - pointerXOnPointerDownRef.current) * 0.02;
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
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

      if (groupRef.current) {
        // Smooth rotation based on mouse X position
        groupRef.current.rotation.y += (targetRotationRef.current - groupRef.current.rotation.y) * 0.05;
        
        // Add tilt effect based on mouse position
        groupRef.current.rotation.x += (mouseYRef.current * 0.0005 - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.z += (mouseXRef.current * 0.0005 - groupRef.current.rotation.z) * 0.05;

        // Add subtle floating movement
        groupRef.current.position.y = 100 + Math.sin(Date.now() * 0.001) * 5;
        groupRef.current.position.x = mouseXRef.current * 0.1;
        groupRef.current.position.z = mouseYRef.current * 0.1;
      }

      if (cameraRef.current && sceneRef.current && rendererRef.current) {
        cameraRef.current.lookAt(cameraTarget);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = window.innerWidth / window.innerHeight;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        windowHalfXRef.current = window.innerWidth / 2;
        windowHalfYRef.current = window.innerHeight / 2;
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