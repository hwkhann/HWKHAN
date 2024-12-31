// Initialize Three.js scene for cube
let cleanup = null;

const initCube = () => {
    try {
        // Check if Three.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('Three.js is not loaded');
            return;
        }

        const cubeContainer = document.querySelector('.rotating-cube');
        if (!cubeContainer) {
            console.error('Cube container not found');
            return;
        }

        // Clear any existing content and cleanup
        if (cleanup) {
            cleanup();
            cleanup = null;
        }
        cubeContainer.innerHTML = '';

        // Create scene
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        
        // Create renderer with error handling
        let renderer;
        try {
            renderer = new THREE.WebGLRenderer({ 
                alpha: true,
                antialias: true,
                powerPreference: "high-performance"
            });
        } catch (error) {
            console.error('WebGL not supported:', error);
            return;
        }

        // Set renderer size and pixel ratio
        const size = Math.min(cubeContainer.offsetWidth, 200);
        renderer.setSize(size, size);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        cubeContainer.appendChild(renderer.domElement);

        // Create cube geometry and materials
        const geometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
        
        // Create shader materials with error handling
        const createShaderMaterial = (color1Hex, color2Hex) => {
            try {
                return new THREE.ShaderMaterial({
                    uniforms: {
                        color1: { value: new THREE.Color(color1Hex) },
                        color2: { value: new THREE.Color(color2Hex) }
                    },
                    vertexShader: `
                        varying vec2 vUv;
                        void main() {
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                        }
                    `,
                    fragmentShader: `
                        uniform vec3 color1;
                        uniform vec3 color2;
                        varying vec2 vUv;
                        void main() {
                            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
                        }
                    `
                });
            } catch (error) {
                console.error('Error creating shader material:', error);
                // Fallback to basic material
                return new THREE.MeshPhongMaterial({ color: color1Hex });
            }
        };

        const materials = [
            createShaderMaterial('#2ecc71', '#3498db'),
            createShaderMaterial('#3498db', '#2ecc71')
        ];

        // Create cube with error handling
        const cube = new THREE.Mesh(geometry, Array(6).fill(materials[0]));
        scene.add(cube);

        camera.position.z = 3;

        // Add lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(ambientLight);
        scene.add(directionalLight);

        // Animation variables
        let targetRotationX = 0;
        let targetRotationY = 0;
        let currentRotationX = 0;
        let currentRotationY = 0;
        const ease = 0.1;
        let isHovered = false;
        let animationFrameId = null;
        let isAnimating = true;

        // Mouse interaction handlers
        const handleMouseEnter = () => isHovered = true;
        const handleMouseLeave = () => {
            isHovered = false;
            targetRotationX = 0;
            targetRotationY = 0;
        };
        
        const handleMouseMove = (event) => {
            if (!isHovered || !isAnimating) return;
            
            const rect = cubeContainer.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width * 2 - 1;
            const y = (event.clientY - rect.top) / rect.height * 2 - 1;
            
            targetRotationX = y * 1;
            targetRotationY = x * 1;
        };

        // Add event listeners
        cubeContainer.addEventListener('mouseenter', handleMouseEnter);
        cubeContainer.addEventListener('mouseleave', handleMouseLeave);
        cubeContainer.addEventListener('mousemove', handleMouseMove);

        // Animation loop with error handling
        function animate() {
            if (!isAnimating) return;

            try {
                // Smooth rotation
                currentRotationX += (targetRotationX - currentRotationX) * ease;
                currentRotationY += (targetRotationY - currentRotationY) * ease;

                // Base rotation
                cube.rotation.x += 0.005;
                cube.rotation.y += 0.005;

                // Mouse-based rotation
                cube.rotation.x += currentRotationX * 0.05;
                cube.rotation.y += currentRotationY * 0.05;

                renderer.render(scene, camera);
                animationFrameId = requestAnimationFrame(animate);
            } catch (error) {
                console.error('Animation error:', error);
                isAnimating = false;
                if (animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            }
        }

        // Start animation
        animate();

        // Handle window resize with debouncing
        let resizeTimeout;
        const handleResize = () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                if (!cubeContainer) return;
                const size = Math.min(cubeContainer.offsetWidth, 200);
                renderer.setSize(size, size);
            }, 250);
        };

        window.addEventListener('resize', handleResize);

        // Handle visibility change
        const handleVisibilityChange = () => {
            isAnimating = !document.hidden;
            if (isAnimating) {
                animate();
            }
        };
        
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Create cleanup function
        cleanup = () => {
            isAnimating = false;
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }

            // Remove event listeners
            cubeContainer.removeEventListener('mouseenter', handleMouseEnter);
            cubeContainer.removeEventListener('mouseleave', handleMouseLeave);
            cubeContainer.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            document.removeEventListener('visibilitychange', handleVisibilityChange);

            // Dispose of Three.js resources
            geometry.dispose();
            materials.forEach(material => {
                if (material && material.dispose) {
                    material.dispose();
                }
            });
            renderer.dispose();

            // Remove canvas
            if (cubeContainer.contains(renderer.domElement)) {
                cubeContainer.removeChild(renderer.domElement);
            }
        };

    } catch (error) {
        console.error('Error initializing cube:', error);
        if (cleanup) {
            cleanup();
            cleanup = null;
        }
    }
};

// Initialize cube when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCube);
} else {
    initCube();
}
