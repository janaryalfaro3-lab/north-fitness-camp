import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'motion/react';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Silent catch for autoplay blocking
      });
    }
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    // ... rest of init
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = window.innerWidth < 768 ? 2000 : 4000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 15;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.006,
      color: '#FF0000',
      transparent: true,
      opacity: 0.5,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Add more complex 3D shapes
    const shapes: THREE.Mesh[] = [];
    const geometry = new THREE.TorusKnotGeometry(0.3, 0.1, 100, 16);
    const material = new THREE.MeshPhongMaterial({ 
      color: '#FF0000', 
      shininess: 150,
      transparent: true,
      opacity: 0.7,
      wireframe: true
    });

    for (let i = 0; i < 8; i++) {
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 8,
        (Math.random() - 0.5) * 4
      );
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
      scene.add(mesh);
      shapes.push(mesh);
    }

    const light = new THREE.PointLight(0xffffff, 2, 100);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));

    camera.position.z = 4;

    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.current.x = x;
      mouse.current.y = y;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);

    let scrollPos = 0;
    const handleScroll = () => {
      scrollPos = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll);

    const animate = () => {
      requestAnimationFrame(animate);
      
      const time = Date.now() * 0.001;
      
      // Auto-rotation combined with mouse reaction
      particlesMesh.rotation.y += 0.0005;
      particlesMesh.rotation.x += 0.0002;

      // Dynamic rotation based on mouse position
      particlesMesh.rotation.y += (mouse.current.x * 0.15 - particlesMesh.rotation.y) * 0.05;
      particlesMesh.rotation.x += (mouse.current.y * 0.15 - particlesMesh.rotation.x) * 0.05;

      // Scroll reaction for 3D elements - increase scale and push deeper
      const scrollFactor = scrollPos * 0.001;
      particlesMesh.position.z = scrollFactor * 2;
      particlesMesh.scale.setScalar(1 + scrollFactor * 0.5);
      
      shapes.forEach((shape, i) => {
        // Base rotation speed varies per shape
        const speed = 0.01 + (i * 0.002);
        shape.rotation.x += speed;
        shape.rotation.y += speed;
        
        // Mouse interaction for shapes - they "swing" towards the cursor
        shape.rotation.x += (mouse.current.y * 0.5 - shape.rotation.x) * 0.08;
        shape.rotation.y += (mouse.current.x * 0.5 - shape.rotation.y) * 0.08;
        
        // Floating motion
        shape.position.y += Math.sin(time + i) * 0.005;
        shape.position.x += Math.cos(time * 0.5 + i) * 0.004;
        
        // Scroll rotation - more dramatic spin on scroll
        shape.rotation.z = scrollPos * 0.008;
        shape.position.z = (Math.sin(time + i) * 0.5) + (scrollPos * 0.002);
      });

      // Camera dynamic follow with slight damping
      const targetCamX = mouse.current.x * 2;
      const targetCamY = mouse.current.y * 2;
      camera.position.x += (targetCamX - camera.position.x) * 0.03;
      camera.position.y += (targetCamY - camera.position.y) * 0.03;
      camera.position.z = 4 + (scrollPos * 0.002); // Zoom in on scroll
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-background flex items-center justify-center">
      {/* Dynamic Background Video */}
      <div className="absolute inset-0 z-0 bg-neutral-900">
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          crossOrigin="anonymous"
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            if (video.currentTime >= 30) {
              video.currentTime = 0;
            }
          }}
          className="w-full h-full object-cover"
        >
          <source 
            src="https://raw.githubusercontent.com/janaryalfaro3-lab/north-fitness-camp/main/video.mp4.mp4" 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>
        {/* Cinematic Overlays - Enhanced for a warmer, more inviting environment */}
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-orange-500/5 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/60" />
        <div className="absolute inset-0 bg-primary/5 animate-pulse-slow mix-blend-color-dodge pointer-events-none" />
      </div>

      {/* Three.js Particle Layer */}
      <div ref={containerRef} className="absolute inset-0 z-10 opacity-40 pointer-events-none" />
      
      {/* Cyberpunk Grid */}
      <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none z-0" />
      <div className="absolute inset-0 scanline opacity-5 pointer-events-none z-20" />

      <div className="relative z-30 container mx-auto px-6 text-center">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-primary font-display font-bold text-sm md:text-base tracking-[0.4em] uppercase mb-6"
        >
          Tarlac’s Premier 2-floor, 600sqm Powerhouse
        </motion.p>

        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-white text-5xl md:text-8xl lg:text-9xl font-display font-black leading-[0.9] mb-8 drop-shadow-[0_0_50px_rgba(255,0,0,0.5)] uppercase italic tracking-tighter"
        >
          FORGE YOUR <br />
          <span className="text-primary text-shadow-3d relative inline-block">
            STRONGEST
            <motion.span 
              className="absolute -inset-12 bg-primary/40 blur-[120px] rounded-full -z-10"
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.3, 1] }}
              transition={{ duration: 5, repeat: Infinity }}
            />
          </span> SELF
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="text-gray-300 text-xl md:text-2xl font-medium max-w-3xl mx-auto mb-12 leading-relaxed"
        >
          Unrivaled Facilities • Elite Performance Gear • Rebranded & Reloaded for Excellence
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col md:flex-row items-center justify-center gap-8"
        >
          <a 
            href="#enroll" 
            className="w-full md:w-auto px-16 py-6 bg-primary text-white font-display font-bold uppercase tracking-widest hover:bg-white hover:text-primary transition-all duration-500 shadow-[0_0_40px_rgba(255,0,0,0.4)] hover:shadow-[0_0_60px_rgba(255,0,0,0.6)] transform hover:-translate-y-2 relative group overflow-hidden"
          >
            <span className="relative z-10">Start Your Journey</span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </a>
          <a 
            href="#programs" 
            className="w-full md:w-auto px-16 py-6 border-2 border-white/30 text-white font-display font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all duration-500 transform hover:-translate-y-2 backdrop-blur-md"
          >
            View Programs
          </a>
        </motion.div>
      </div>
    </section>
  );
};
