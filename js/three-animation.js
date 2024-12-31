// Three.js Background Animation
const canvas = document.querySelector('#bg-canvas');

// Only initialize if canvas exists
if (canvas) {
    try {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ 
            canvas, 
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        // Renderer settings
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance

        // Create particles with optimized geometry
        const particlesGeometry = new THREE.BufferGeometry();
        const particlesCount = Math.min(5000, window.innerWidth * 2); // Adjust particle count based on screen size
        const posArray = new Float32Array(particlesCount * 3);

        for(let i = 0; i < particlesCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 5;
        }

        particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        // Optimize material
        const particlesMaterial = new THREE.PointsMaterial({
            size: 0.005,
            color: '#2ecc71',
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
        scene.add(particlesMesh);

        camera.position.z = 2;

        // Mouse movement effect with debouncing
        let mouseX = 0;
        let mouseY = 0;
        let targetX = 0;
        let targetY = 0;
        const windowHalfX = window.innerWidth / 2;
        let frameId = null;

        const mouseMoveHandler = (event) => {
            mouseX = (event.clientX - windowHalfX) / windowHalfX;
            mouseY = event.clientY / window.innerHeight;
        };

        window.addEventListener('mousemove', mouseMoveHandler);

        // Animation loop with RAF
        function animate() {
            targetX += (mouseX - targetX) * 0.1;
            targetY += (mouseY - targetY) * 0.1;

            particlesMesh.rotation.y += 0.001;
            if(mouseX !== 0) {
                particlesMesh.rotation.x = -targetY * 0.2;
                particlesMesh.rotation.y = -targetX * 0.2;
            }

            renderer.render(scene, camera);
            frameId = requestAnimationFrame(animate);
        }

        // Start animation
        animate();

        // Handle window resize with debouncing
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Update camera
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                
                // Update renderer
                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }, 250);
        });

        // Cleanup function
        window.addEventListener('unload', () => {
            window.removeEventListener('mousemove', mouseMoveHandler);
            if (frameId) {
                cancelAnimationFrame(frameId);
            }
            
            // Dispose of Three.js resources
            particlesGeometry.dispose();
            particlesMaterial.dispose();
            renderer.dispose();
        });

    } catch (error) {
        console.error('Error initializing Three.js animation:', error);
        // Hide canvas on error to not show broken animation
        canvas.style.display = 'none';
    }
}
