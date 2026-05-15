import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { motion, useScroll, useTransform } from 'motion/react';

export const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const mouse = useRef({ x: 0, y: 0 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);

  useEffect(() => {
    const handleVisibilityChange = () => {
      // Re-trigger play if user returns to tab and video is paused
      if (document.visibilityState === 'visible' && videoRef.current && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.log("Autoplay issue:", err);
      });
    }
  }, []);

  // Extra check to ensure video is actually playing
  useEffect(() => {
    let checkCount = 0;
    const interval = setInterval(() => {
      checkCount++;
      if (videoRef.current && videoRef.current.readyState >= 3 && !videoRef.current.paused) {
        setVideoLoaded(true);
        clearInterval(interval);
      }
      
      // If we've checked 10 times (10s) and still not playing, log it once
      if (checkCount === 10 && !videoLoaded) {
        console.warn("Video still not playing after 10s. Checking sources...");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [videoLoaded]);

  useEffect(() => {
    if (videoRef.current && videoLoaded) {
      videoRef.current.play().catch(() => {});
    }
  }, [videoLoaded]);

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
    <section id="hero" className="relative h-screen w-full overflow-hidden bg-zinc-950 flex items-center justify-center">
      {/* Dynamic Background Video & Fallback */}
      <div 
        className="absolute inset-0 z-0 bg-zinc-950 pointer-events-none flex items-center justify-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <video 
          ref={videoRef}
          autoPlay 
          muted 
          loop 
          playsInline
          crossOrigin="anonymous"
          preload="auto"
          poster="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=2070"
          className={`w-full h-full object-contain md:object-cover transition-opacity duration-1000 ${videoLoaded ? 'opacity-80' : 'opacity-0'}`}
          onLoadedData={() => setVideoLoaded(true)}
          onCanPlay={() => setVideoLoaded(true)}
          onPlay={() => setVideoLoaded(true)}
          onWaiting={() => {
            videoRef.current?.play().catch(() => {});
          }}
          onStalled={() => {
            console.warn("Video stalled, attempting resume...");
            videoRef.current?.load();
            videoRef.current?.play().catch(() => {});
          }}
          onError={(e) => {
            const video = e.currentTarget;
            console.warn(`Video source error on: ${video.currentSrc}. Network state: ${video.networkState}`);
            
            // If all sources have been tried (networkState 3 means no source)
            if (video.networkState === 3 || (video.error && !video.canPlayType('video/mp4'))) {
              setVideoError(true);
              setVideoLoaded(false);
            }
          }}
        >
          {/* User-uploaded custom video */}
          <source src="/video.mp4" type="video/mp4" />
          
          {/* Main high-performance Direct Links */}
          <source src="https://player.vimeo.com/external/494252666.sd.mp4?s=72ad1385cf6a08466e130c25a0a382e2df5c093a&profile_id=164&oauth2_token_id=57447761" type="video/mp4" />
          <source src="https://player.vimeo.com/external/370335048.sd.mp4?s=1240c57d77180f164627d057790a6e03328e185e&profile_id=164" type="video/mp4" />
          
          {/* GitHub / CDN Fallbacks (if the user uploads their own video under these names) */}
          <source src="https://cdn.jsdelivr.net/gh/janaryalfaro3-lab/north-fitness-camp@main/video.mp4" type="video/mp4" />
          <source src="https://raw.githubusercontent.com/janaryalfaro3-lab/north-fitness-camp/main/video.mp4" type="video/mp4" />
          <source src="https://github.com/janaryalfaro3-lab/north-fitness-camp/blob/main/video.mp4?raw=true" type="video/mp4" />
          
          Your browser does not support the video tag.
        </video>

        {/* Subtle fallback indicator for debugging/info if video fails after timeout */}
        {(videoError || !videoLoaded) && (
          <div className="absolute bottom-10 right-10 text-white/20 text-[10px] font-mono uppercase tracking-widest z-10 transition-opacity duration-1000">
            {videoError ? "Streaming offline • Static overlay active" : "Establishing connection..."}
          </div>
        )}

        {/* Cinematic Overlays - Optimized to show "whole" video clearly */}
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-orange-500/5 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-zinc-950/40" />
        <div className="absolute inset-0 bg-primary/2 animate-pulse-slow mix-blend-color-dodge" />
      </div>

      {/* Three.js Particle Layer */}
      <div ref={containerRef} className="absolute inset-0 z-10 opacity-20 pointer-events-none" />
      
      {/* Cyberpunk Grid - Placed behind overlays for depth */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none z-[1]" />
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
