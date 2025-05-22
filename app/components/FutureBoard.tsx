'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';

const FutureBoard = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const textMeshRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xFBFFE9);
    scene.fog = new THREE.Fog(0xFBFFE9, 250, 1400);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 1500);
    camera.position.set(0, 400, 700);
    const cameraTarget = new THREE.Vector3(0, 150, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

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
    const depth = 10;
    const size = 50;
    const curveSegments = 4;
    const bevelThickness = 1;
    const bevelSize = 0.5;

    // Font loading
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      const textGeometry = new TextGeometry(text, {
        font: font,
        size: size,
        height: depth,
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
    let targetRotation = 0;
    let targetRotationOnPointerDown = 0;
    let pointerX = 0;
    let pointerXOnPointerDown = 0;
    const windowHalfX = window.innerWidth / 2;

    const onPointerDown = (event: PointerEvent) => {
      pointerXOnPointerDown = event.clientX - windowHalfX;
      targetRotationOnPointerDown = targetRotation;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.isPrimary === false) return;
      pointerX = event.clientX - windowHalfX;
      targetRotation = targetRotationOnPointerDown + (pointerX - pointerXOnPointerDown) * 0.02;
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    mountRef.current.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    const animate = () => {
      requestAnimationFrame(animate);

      if (groupRef.current) {
        groupRef.current.rotation.y += (targetRotation - groupRef.current.rotation.y) * 0.05;
      }

      camera.lookAt(cameraTarget);
      renderer.render(scene, camera);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current) {
        mountRef.current.removeEventListener('pointerdown', onPointerDown);
      }
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full absolute inset-0" />
  );
};

export default FutureBoard; 