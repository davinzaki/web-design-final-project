import './style.css';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Prevent FOUC by removing visibility hidden if we added it
document.documentElement.classList.remove('js-enabled');

gsap.registerPlugin(ScrollTrigger);

// --- Three.js Background ---
const canvas = document.querySelector('#bg-canvas');
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 30;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1500;
const posArray = new Float32Array(particlesCount * 3);

for(let i = 0; i < particlesCount * 3; i++) {
  // Spread particles widely
  posArray[i] = (Math.random() - 0.5) * 120;
}
particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Material - using Catppuccin Mocha Mauve color
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.15,
  color: 0xcba6f7, // Mauve
  transparent: true,
  opacity: 0.6,
  blending: THREE.AdditiveBlending
});

// Mesh
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Mouse interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX);
  mouseY = (event.clientY - windowHalfY);
});

// Animation Loop
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  targetX = mouseX * 0.001;
  targetY = mouseY * 0.001;

  // Gentle continuous rotation
  particlesMesh.rotation.y += 0.0005;
  particlesMesh.rotation.x += 0.0002;

  // Interactive rotation based on mouse
  particlesMesh.rotation.y += 0.05 * (targetX - particlesMesh.rotation.y);
  particlesMesh.rotation.x += 0.05 * (targetY - particlesMesh.rotation.x);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();

// Resize Handler
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});


// --- GSAP Animations ---

// Wait for DOM
document.addEventListener("DOMContentLoaded", (event) => {
  
  // Initial load animation for hero
  gsap.from('.hero > *', {
    opacity: 0,
    y: 30,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out',
    delay: 0.2
  });

  // Staggered timeline items
  gsap.utils.toArray('.timeline-item').forEach(item => {
    gsap.from(item, {
      opacity: 0,
      x: -50,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: item,
        start: 'top 85%',
        toggleActions: 'play none none none' // Play once and keep it visible
      }
    });
  });

  // Refresh ScrollTrigger after all resources (like fonts) load
  window.addEventListener('load', () => {
    ScrollTrigger.refresh();
  });
});
