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
  const wireframeRef = useRef<THREE.LineSegments | null>(null);
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
  const originalZPositionsRef = useRef<number[]>([]);
  const fontRef = useRef<Font | null>(null);
  const materialRef = useRef<THREE.MeshPhongMaterial | null>(null);

  // Function to calculate responsive text size
  const getResponsiveTextSize = () => {
    const baseSize = 1000;
    const minSize = 400;
    const maxSize = 1200;
    
    // Calculate size based on screen width
    const screenWidth = window.innerWidth;
    const scaleFactor = Math.min(Math.max(screenWidth / 1920, 0.5), 1.5);
    
    return Math.min(Math.max(baseSize * scaleFactor, minSize), maxSize);
  };

  // Function to create text geometry with responsive sizing
  const createTextGeometry = (font: Font) => {
    const text = '< Build : Future / >';
    const size = getResponsiveTextSize();
    const depth = size * 0.25; // Scale depth proportionally
    const curveSegments = 6;
    const bevelThickness = size * 0.05; // Scale bevel proportionally
    const bevelSize = size * 0.0125; // Scale bevel size proportionally
    const bevelEnabled = true;

    return new TextGeometry(text, {
      font: font,
      size: size,
      depth: depth,
      curveSegments: curveSegments,
      bevelThickness: bevelThickness,
      bevelSize: bevelSize,
      bevelEnabled: bevelEnabled
    });
  };

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
    originalZPositionsRef.current = originalZPositions; // Store in ref for animation access
    positions.needsUpdate = true;

    // Lighting
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight1.position.set(0, 0, 1).normalize();
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 2);
    dirLight2.position.set(0, 30, 10).normalize();
    scene.add(dirLight2);

    // Material - make text more visible
    const material = new THREE.MeshPhongMaterial({ 
      color: '#CAFA77', // Blue color (you can change this to any hex color)
      emissive: '#CAFA77', // Subtle blue glow
      specular: '#CAFA77', // Specular highlights
      shininess: 0, // How shiny the surface is
      flatShading: true 
    });
    materialRef.current = material;

    // Group for text - position it at a fixed location
    const group = new THREE.Group();
    group.position.set(0, 8000, 0); // Fixed position in world space
    scene.add(group);
    groupRef.current = group;

    // Font loading
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/orbitron_bold.json', (font: Font) => {
      fontRef.current = font;
      updateTextGeometry();
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

    // mount.addEventListener('pointerdown', onPointerDown);
    // document.addEventListener('pointermove', onPointerMove);
    // document.addEventListener('pointerup', onPointerUp);

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

    // mount.addEventListener('mousemove', onMouseMove);
    // mount.addEventListener('touchmove', onTouchMove);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      // Camera rotation (like in Svelte version)
      // if (cameraRef.current) {
      //   const x = cameraRef.current.position.x;
      //   const z = cameraRef.current.position.z;
      //   cameraRef.current.position.x = x * Math.cos(0.001) + z * Math.sin(0.001) - 10;
      //   cameraRef.current.position.z = z * Math.cos(0.001) - x * Math.sin(0.001) - 10;
      //   cameraRef.current.lookAt(new THREE.Vector3(0, 11000, 0));
      // }

      // Update wave animation (matching Svelte logic)
      if (wavePlaneRef.current) {
        // console.log('wavePlaneRef.current', wavePlaneRef.current);
        const geometry = wavePlaneRef.current.geometry;
        const positions = geometry.attributes.position;
        const count = positions.count;

        for (let i = 0; i < count; i++) {
          const originalZ = originalZPositionsRef.current[i];
          const waveZ = Math.sin((i * 0.01 + countRef.current * 0.02)) * (originalZ * 0.5);
          positions.setZ(i, waveZ);
        }
        positions.needsUpdate = true;
        countRef.current += 1;
      }

      if (groupRef.current) {
        // Apply mouse-based rotations only
        groupRef.current.rotation.y += (targetRotationRef.current - groupRef.current.rotation.y) * 0.05;
        groupRef.current.rotation.x += (mouseYRef.current * 0.0005 - groupRef.current.rotation.x) * 0.05;
        groupRef.current.rotation.z += (mouseXRef.current * 0.0005 - groupRef.current.rotation.z) * 0.05;

        // Add subtle floating movement relative to the fixed base position
        groupRef.current.position.y = 8000 + Math.sin(Date.now() * 0.001) * 50;
        groupRef.current.position.x = mouseXRef.current * 1;
        groupRef.current.position.z = mouseYRef.current * 1;
      }

      if (cameraRef.current && sceneRef.current && rendererRef.current) {
        cameraRef.current.lookAt(cameraTarget);
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animate();

    // Handle window resize - UPDATED VERSION with text responsiveness
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

        // Update text geometry for new screen size
        updateTextGeometry();
      }
    };

    window.addEventListener('resize', handleResize);

    // Function to update text geometry (moved inside useEffect)
    const updateTextGeometry = () => {
      if (!fontRef.current || !groupRef.current || !materialRef.current) return;

      // Remove existing text mesh and wireframe
      if (textMeshRef.current) {
        groupRef.current.remove(textMeshRef.current);
        textMeshRef.current.geometry.dispose();
        textMeshRef.current = null;
      }
      if (wireframeRef.current) {
        groupRef.current.remove(wireframeRef.current);
        wireframeRef.current.geometry.dispose();
        wireframeRef.current = null;
      }

      // Create new geometry with responsive size
      const textGeometry = createTextGeometry(fontRef.current);
      textGeometry.computeBoundingBox();
      const textWidth = textGeometry.boundingBox!.max.x - textGeometry.boundingBox!.min.x;
      textGeometry.translate(-textWidth / 2, 0, 0);

      // Create new text mesh
      const textMesh = new THREE.Mesh(textGeometry, materialRef.current);
      groupRef.current.add(textMesh);
      textMeshRef.current = textMesh;

      // Add black borders to the edges of the text geometry
      const edges = new THREE.EdgesGeometry(textGeometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      groupRef.current.add(wireframe);
      wireframeRef.current = wireframe;
    };

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