import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeHeroSceneProps {
  className?: string;
  variant?: 'hero' | 'login' | 'subtle';
}

export const ThreeHeroScene: React.FC<ThreeHeroSceneProps> = ({
  className = '',
  variant = 'hero'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Detect headless test environment or reduced motion preference
    const isHeadless =
      typeof navigator !== 'undefined' &&
      (Boolean(navigator.webdriver) || /HeadlessChrome/i.test(navigator.userAgent));
    const prefersReducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Create scene, camera, renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x07090d, 0.04);

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = variant === 'login' ? 9 : 8;
    camera.position.y = 0.5;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: !isHeadless,
        alpha: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(isHeadless ? 1 : Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      container.appendChild(renderer.domElement);
    } catch (e) {
      console.warn('WebGL initialization failed, falling back to CSS background', e);
      return;
    }

    // Lights: Premium Gold and Electric Blue
    const ambientLight = new THREE.AmbientLight(0x0d121d, 2.0);
    scene.add(ambientLight);

    const goldPointLight = new THREE.PointLight(0xd4af37, 4.5, 30);
    goldPointLight.position.set(4, 5, 4);
    scene.add(goldPointLight);

    const bluePointLight = new THREE.PointLight(0x168bff, 5.0, 30);
    bluePointLight.position.set(-4, -3, 3);
    scene.add(bluePointLight);

    const rimLight = new THREE.DirectionalLight(0xfff5db, 1.5);
    rimLight.position.set(0, 10, -5);
    scene.add(rimLight);

    // Group for objects
    const mainGroup = new THREE.Group();
    scene.add(mainGroup);

    // 1. Central Floating Glass Sculpture / Geometric Orb
    const coreGeometry = new THREE.IcosahedronGeometry(variant === 'login' ? 1.8 : 1.6, 2);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0e1726,
      emissive: 0x051329,
      metalness: 0.2,
      roughness: 0.15,
      transmission: 0.75, // Glasslike transparency
      thickness: 1.2,
      ior: 1.5,
      reflectivity: 0.9,
      wireframe: false
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    mainGroup.add(coreMesh);

    // 2. Outer Gold Wireframe Facet Cage
    const cageGeometry = new THREE.IcosahedronGeometry(variant === 'login' ? 1.95 : 1.75, 1);
    const cageMaterial = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xaa820a,
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
      metalness: 0.9,
      roughness: 0.2
    });
    const cageMesh = new THREE.Mesh(cageGeometry, cageMaterial);
    mainGroup.add(cageMesh);

    // 3. Interconnected Luminous Rings (Gold & Electric Blue)
    const ring1Geo = new THREE.TorusGeometry(2.4, 0.025, 16, 100);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xd4af37,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    mainGroup.add(ring1);

    const ring2Geo = new THREE.TorusGeometry(2.8, 0.02, 16, 100);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0x168bff,
      emissive: 0x168bff,
      emissiveIntensity: 0.9,
      metalness: 0.8,
      roughness: 0.1
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 3;
    mainGroup.add(ring2);

    // 4. Floating Particles (Gold & Electric Blue shimmering points)
    const particleCount = isHeadless ? 150 : 600;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorGold = new THREE.Color(0xd4af37);
    const colorBlue = new THREE.Color(0x168bff);
    const colorWhite = new THREE.Color(0xf7f8fc);

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3;
      // Spread across spherical cloud
      const radius = 3.5 + Math.random() * 8.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      positions[idx] = radius * Math.sin(phi) * Math.cos(theta);
      positions[idx + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[idx + 2] = radius * Math.cos(phi);

      const mixed = Math.random();
      const col = mixed < 0.45 ? colorGold : mixed < 0.85 ? colorBlue : colorWhite;
      colors[idx] = col.r;
      colors[idx + 1] = col.g;
      colors[idx + 2] = col.b;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const particlePoints = new THREE.Points(particleGeo, particleMat);
    scene.add(particlePoints);

    // Subtle pointer parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handlePointerMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (e.clientX / innerWidth - 0.5) * 1.5;
      mouseY = (e.clientY / innerHeight - 0.5) * 1.5;
    };

    if (!prefersReducedMotion && !isHeadless) {
      window.addEventListener('mousemove', handlePointerMove, { passive: true });
    }

    // Window resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const newW = container.clientWidth || window.innerWidth;
      const newH = container.clientHeight || window.innerHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = clock.getDelta();

      if (!prefersReducedMotion) {
        // Slowly rotate objects
        coreMesh.rotation.y = elapsedTime * 0.18;
        coreMesh.rotation.x = elapsedTime * 0.12;

        cageMesh.rotation.y = -elapsedTime * 0.15;
        cageMesh.rotation.z = elapsedTime * 0.1;

        ring1.rotation.z = elapsedTime * 0.22;
        ring2.rotation.z = -elapsedTime * 0.26;

        particlePoints.rotation.y = elapsedTime * 0.04;
        particlePoints.rotation.x = Math.sin(elapsedTime * 0.03) * 0.05;

        // Subtle gentle floating
        mainGroup.position.y = Math.sin(elapsedTime * 0.8) * 0.15;

        // Pointer parallax damping
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;

        camera.position.x = targetX * 1.2;
        camera.position.y = 0.5 - targetY * 1.0;
        camera.lookAt(0, 0, 0);
      }

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animate();

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('resize', handleResize);

      if (renderer && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      coreGeometry.dispose();
      coreMaterial.dispose();
      cageGeometry.dispose();
      cageMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (renderer) {
        renderer.dispose();
      }
    };
  }, [variant]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};
