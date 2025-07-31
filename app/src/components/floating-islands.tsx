'use client'

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FloatingIslands = ({ children }: { children: React.ReactNode }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const sceneRef = useRef<THREE.Scene | null>(null);
	const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
	const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
	// const islandsRef = useRef([]);
	const animationIdRef = useRef<number>(null);

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
		camera.lookAt(0, 3, 0);
		camera.fov = 45;
		camera.updateProjectionMatrix();

		// Island creation function
		function createIsland(island: IslandData) {
			const { x, y, z, size, detail, network } = island;
			const geometry = new THREE.ConeGeometry(size, size * -2, detail);
			const wireframeGeometry = new THREE.WireframeGeometry(geometry);

			// Create a group to hold multiple line segments for thickness effect
			const islandGroup = new THREE.Group();

			// Create material
			const material = new THREE.LineBasicMaterial({
				depthTest: false,
				opacity: 0.5, // Reduced opacity since we're layering multiple lines
				transparent: true,
				color: networkColors[network] || 0x6b7280,
			});

			const thickness = island.thickness || 0.03; // Default thickness if not specified
			// Create multiple slightly offset line segments to simulate thickness
			const offsets = [
				{ x: 0, y: 0, z: 0 },
				{ x: thickness, y: 0, z: 0 },
				// { x: -thickness, y: 0, z: 0 },
				{ x: 0, y: thickness, z: 0 },
				// { x: 0, y: -thickness, z: 0 },
				{ x: 0, y: 0, z: thickness },
				// { x: 0, y: 0, z: -thickness },
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

		const islands: any[] = [];

		// Your brand colors + popular blockchain network colors
		const networkColors: { [key: string]: string } = {
			MIST: '#fdc500', // Gold (your brand)
			Bitcoin: '#F7931A',
			Ethereum: '#627EEA',
			USDT: '#26A17B',
			Base: '#00f',
			USDC: '#2775CA',
			Avalanche: "#E84142",
			Tron: "#EB0029",
			Starknet: "#0c0c4f",
			Starknet_: "#e57691",
		};

		const mistNetwork = { x: 0, y: -8, z: -5, size: 4, detail: 12, network: "MIST" };

		interface IslandData { x: number; y: number; z: number; size: number; detail: number; network: string; thickness?: number }

		// Create multiple islands representing different blockchain networks
		const islandData: IslandData[] = [
			// mistNetwork,
			{ x: -2, y: -1, z: -5, size: 2.3, detail: 9, network: "Base" },
			{ x: 5, y: -5, z: -5, size: 3.4, detail: 8, network: "Ethereum" },

			{ x: -9, y: -3, z: -5, size: 4.1, detail: 7, network: "Bitcoin" },
			// { x: 12, y: 0, z: -15, size: 2, detail: 6, network: "Starknet" },
			{ x: 2, y: 3, z: -10, size: 2.5, detail: 14, network: "Starknet_" },
			{ x: -8, y: 6, z: 0, size: 1.6, detail: 5, network: "USDC" },
			{ x: 5, y: 7, z: 0, size: 1.8, detail: 5, network: "USDT" },

			{ x: -4, y: 7, z: -10, size: 1.4, detail: 7, network: "Avalanche" },
			{ x: 12, y: -1, z: -15, size: 2.1, detail: 3, network: "Tron" },
		];

		// Create connection lines between MIST and other networks
		function createConnectionLine(fromPos: THREE.Vector3, toPos: THREE.Vector3) {
			const geometry = new THREE.BufferGeometry().setFromPoints([
				new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z),
				new THREE.Vector3(toPos.x, toPos.y, toPos.z)
			]);

			const material = new THREE.LineBasicMaterial({
				color: 0xfdc500, // Gold connections
				opacity: 1,
				transparent: true,
				depthTest: false
			});

			return new THREE.Line(geometry, material);
		}

		// Create islands
		const connectionLines: THREE.Line[] = [];
		// Create other network islands and connect them to MIST
		islandData.forEach((data) => {
			const island = createIsland(data);
			islands.push(island);
		});

		// islandsRef.current = islands;

		// Animation loop
		function animate() {
			animationIdRef.current = requestAnimationFrame(animate);

			// Animate islands (subtle floating effect)
			islands.forEach((island, index) => {
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
				island.children.forEach((lineSegment: { geometry: { dispose: () => void; }; material: { dispose: () => void; }; }) => {
					if (lineSegment.geometry) lineSegment.geometry.dispose();
					if (lineSegment.material) lineSegment.material.dispose();
				});
			});

			// Dispose of connection lines
			connectionLines.forEach(line => {
				if (line.geometry) line.geometry.dispose();
				if (line.material) line.material.dispose();
			});

			renderer.dispose();
		};
	}, []);

	return (
		<div className="relative w-full min-h-screen overflow-hidden flex items-center justify-center">
			{/* Scene container */}
			<div
				ref={containerRef}
				className="absolute top-0 left-0 w-full h-full -z-10"
				style={{
					background: 'linear-gradient(to bottom, #022152, #020202)' // Navy deep to black
				}}
			/>

			{/* Hero content overlay */}
			<div className="m-auto text-white">
				{children}
			</div>
		</div>
	);
};

export default FloatingIslands;
