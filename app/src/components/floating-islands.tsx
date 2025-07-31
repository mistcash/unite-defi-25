'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FloatingIslands = () => {
	const containerRef = useRef(null);
	const sceneRef = useRef(null);
	const rendererRef = useRef(null);
	const cameraRef = useRef(null);
	const islandsRef = useRef([]);
	const animationIdRef = useRef(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// Scene setup
		const scene = new THREE.Scene();
		const camera = new THREE.PerspectiveCamera(
			75,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
		renderer.setSize(window.innerWidth, window.innerHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		containerRef.current.appendChild(renderer.domElement);

		// Store refs
		sceneRef.current = scene;
		rendererRef.current = renderer;
		cameraRef.current = camera;

		// Lighting
		const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
		scene.add(ambientLight);
		const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
		directionalLight.position.set(5, 10, 7);
		scene.add(directionalLight);

		// Camera position
		camera.position.set(0, 10, 20);
		camera.lookAt(0, 5, 0);

		// Island creation function
		function createIsland(x, y, z, detail, size) {
			const geometry = new THREE.ConeGeometry(size, size * -2, detail);
			const wireframeGeometry = new THREE.WireframeGeometry(geometry);

			// Create a group to hold multiple line segments for thickness effect
			const islandGroup = new THREE.Group();

			// Create material
			const material = new THREE.LineBasicMaterial({
				depthTest: false,
				opacity: 0.15, // Reduced opacity since we're layering multiple lines
				transparent: true,
				color: 0x6b7280,
			});

			// Create multiple slightly offset line segments to simulate thickness
			const offsets = [
				{ x: 0, y: 0, z: 0 },
				{ x: 0.015, y: 0, z: 0 },
				{ x: -0.015, y: 0, z: 0 },
				{ x: 0, y: 0.015, z: 0 },
				{ x: 0, y: -0.015, z: 0 },
				{ x: 0, y: 0, z: 0.015 },
				{ x: 0, y: 0, z: -0.015 },
			];

			offsets.forEach(offset => {
				const lineSegments = new THREE.LineSegments(wireframeGeometry, material.clone());
				lineSegments.position.set(offset.x, offset.y, offset.z);
				islandGroup.add(lineSegments);
			});

			// Random rotation for variety
			islandGroup.rotation.y = Math.random() * Math.PI;
			islandGroup.position.set(x, y, z);

			// Animation properties
			islandGroup.userData = {
				baseY: y,
				floatSpeed: 0.2 + Math.random() * 0.3,
				floatRange: 0.2 + Math.random() * 0.3,
			};

			scene.add(islandGroup);
			return islandGroup;
		}

		const islands = [];

		// Your brand colors + popular blockchain network colors
		const networkColors = [
			0x00296b, // Navy Deep (your brand)
			0xfdc500, // Gold (your brand)
			0x627eea, // Ethereum blue
			0xf7931a, // Bitcoin orange
			0x00d4aa, // Polygon purple-teal
			0x000000, // Bitcoin black
			0x1652f0, // Solana purple
			0x00509d, // Navy Bright (your brand)
			0xe84142, // Avalanche red
		];

		// Create multiple islands representing different blockchain networks
		const islandData = [
			{ x: -5, y: 0, z: -5, size: 2.5, detail: 9, colorIndex: 0, network: "Brand Navy" }, // Navy Deep
			{ x: 6, y: -4, z: -5, size: 2.8, detail: 8, colorIndex: 2, network: "Ethereum" }, // Ethereum blue

			{ x: -12, y: -2, z: -15, size: 2.1, detail: 7, colorIndex: 3, network: "Bitcoin" }, // Bitcoin orange
			{ x: 12, y: 0, z: -15, size: 2, detail: 6, colorIndex: 1, network: "Brand Gold" }, // Gold
			{ x: -8, y: 6, z: 0, size: 1.6, detail: 5, colorIndex: 4, network: "Polygon" }, // Polygon teal
			{ x: 8, y: 6, z: 0, size: 1.8, detail: 5, colorIndex: 6, network: "Solana" }, // Solana purple

			{ x: -4, y: 7, z: -10, size: 1.4, detail: 7, colorIndex: 7, network: "Brand Navy Bright" }, // Navy Bright
			{ x: 5, y: 2, z: -10, size: 1.5, detail: 6, colorIndex: 8, network: "Avalanche" }, // Avalanche red
			{ x: 15, y: -5, z: -8, size: 1.1, detail: 5, colorIndex: 5, network: "Bitcoin Alt" }, // Bitcoin black
		];

		// Create islands
		islandData.forEach((data) => {
			const island = createIsland(data.x, data.y, data.z, data.detail, data.size);
			// Set color for all line segments in the group
			island.children.forEach(lineSegment => {
				lineSegment.material.color.set(networkColors[data.colorIndex]);
			});
			islands.push(island);
		});

		islandsRef.current = islands;

		// Animation loop
		function animate() {
			animationIdRef.current = requestAnimationFrame(animate);

			// Animate islands (subtle floating effect)
			islands.forEach((island) => {
				island.position.y =
					island.userData.baseY +
					Math.sin(Date.now() * 0.001 * island.userData.floatSpeed) *
					island.userData.floatRange;
				island.rotation.y += 0.005;
			});

			renderer.render(scene, camera);
		}
		animate();

		// Handle window resize
		const handleResize = () => {
			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();
			renderer.setSize(window.innerWidth, window.innerHeight);
		};

		window.addEventListener('resize', handleResize);

		// Cleanup function
		return () => {
			window.removeEventListener('resize', handleResize);
			if (animationIdRef.current) {
				cancelAnimationFrame(animationIdRef.current);
			}
			if (containerRef.current && renderer.domElement) {
				containerRef.current.removeChild(renderer.domElement);
			}

			// Dispose of geometries and materials
			islands.forEach(island => {
				island.children.forEach(lineSegment => {
					if (lineSegment.geometry) lineSegment.geometry.dispose();
					if (lineSegment.material) lineSegment.material.dispose();
				});
			});

			renderer.dispose();
		};
	}, []);

	return (
		<div className="relative w-full h-screen overflow-hidden">
			{/* Scene container */}
			<div
				ref={containerRef}
				className="fixed top-0 left-0 w-full h-full -z-10"
				style={{
					background: 'linear-gradient(to bottom, #f0f5ff, #fff9e5)' // Navy pale to Gold pale
				}}
			/>

			{/* Hero content overlay */}
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center font-sans z-10">
				<h1 className="text-6xl font-bold mb-4">Fintech Solutions</h1>
				<p className="text-xl">Empowering your financial future with innovative technology.</p>
			</div>
		</div>
	);
};

export default FloatingIslands;