// earth.js - Photorealistic 3D Earth Simulation using Three.js

(function () {
    // --- 1. SETUP SCENE, CAMERA, & RENDERER ---
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    document.body.appendChild(renderer.domElement);

    // Setup OrbitControls (Assumes OrbitControls.js is loaded)
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 6;
    controls.maxDistance = 50;

    // --- 2. LIGHTING (Sunlight) ---
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.0);
    sunLight.position.set(-15, 3, 10);
    scene.add(sunLight);

    const ambientLight = new THREE.AmbientLight(0x111116, 0.5);
    scene.add(ambientLight);

    // --- 3. TEXTURES ---
    const textureLoader = new THREE.TextureLoader();
    const textureUrls = {
        day: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/2_no_clouds_4k.jpg',
        bump: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/elev_bump_4k.jpg',
        specular: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/water_4k.png',
        clouds: 'https://raw.githubusercontent.com/turban/webgl-earth/master/images/fair_clouds_4k.png',
        moon: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/moon_1024.jpg',
        galaxy: 'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/lensflare/lensflare0_alpha.png'
    };

    const earthDayTex = textureLoader.load(textureUrls.day);
    const earthBumpTex = textureLoader.load(textureUrls.bump);
    const earthSpecTex = textureLoader.load(textureUrls.specular);
    const cloudTex = textureLoader.load(textureUrls.clouds);
    const moonTex = textureLoader.load(textureUrls.moon);
    const starTex = textureLoader.load(textureUrls.galaxy);

    // --- 4. EARTH (Day/Night) ---
    const earthRadius = 4;
    const earthGeometry = new THREE.SphereGeometry(earthRadius, 64, 64);
    
    const earthMaterial = new THREE.MeshStandardMaterial({
        map: earthDayTex,
        bumpMap: earthBumpTex,
        bumpScale: 0.15,
        roughnessMap: earthSpecTex,
        metalness: 0.1
    });
    
    // Inject custom shader logic for realistic dark-side city lights
    earthMaterial.onBeforeCompile = (shader) => {
        shader.uniforms.tNight = { value: textureLoader.load('https://raw.githubusercontent.com/turban/webgl-earth/master/images/lights_4k.png') };
        
        shader.vertexShader = 'varying vec3 vNormal;\n' + shader.vertexShader.replace(
            'void main() {',
            'void main() {\nvNormal = normalize(normalMatrix * normal);'
        );
        
        shader.fragmentShader = 'uniform sampler2D tNight;\nvarying vec3 vNormal;\n' + shader.fragmentShader;
        
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <map_fragment>',
            `
            #include <map_fragment>
            vec3 viewLightDir = normalize(vViewPosition);
            float intensity = dot(vNormal, vec3(0.0, 0.0, 1.0));
            vec4 nightColor = texture2D(tNight, vUv);
            
            float mixAmount = smoothstep(-0.2, 0.2, intensity);
            diffuseColor.rgb = mix(nightColor.rgb * 1.8, diffuseColor.rgb, mixAmount);
            `
        );
    };

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.rotation.y = Math.PI;
    scene.add(earth);

    // --- 5. CLOUDS ---
    const cloudGeometry = new THREE.SphereGeometry(earthRadius + 0.04, 64, 64);
    const cloudMaterial = new THREE.MeshStandardMaterial({
        map: cloudTex,
        transparent: true,
        blending: THREE.NormalBlending,
        opacity: 0.8
    });
    const clouds = new THREE.Mesh(cloudGeometry, cloudMaterial);
    scene.add(clouds);

    // --- 6. ATMOSPHERE GLOW ---
    const atmosphereGeometry = new THREE.SphereGeometry(earthRadius + 0.15, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
        vertexShader: `
            varying vec3 vNormal;
            void main() {
                vNormal = normalize(normalMatrix * normal);
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec3 vNormal;
            void main() {
                float intensity = pow(0.6 - dot(vNormal, vec3(0, 0, 1.0)), 2.5);
                gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
            }
        `,
        blending: THREE.AdditiveBlending,
        side: THREE.BackSide,
        transparent: true
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphere);

    // --- 7. MOON ---
    const moonRadius = earthRadius * 0.27;
    const moonGeometry = new THREE.SphereGeometry(moonRadius, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({
        map: moonTex,
        roughness: 0.9,
        metalness: 0.1
    });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    // --- 8. SATELLITE ---
    const satelliteGroup = new THREE.Group();
    const satelliteBodyGeo = new THREE.BoxGeometry(0.08, 0.08, 0.15);
    const satelliteMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const satelliteBody = new THREE.Mesh(satelliteBodyGeo, satelliteMat);
    
    const panelGeo = new THREE.PlaneGeometry(0.4, 0.07);
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x0055ff, side: THREE.DoubleSide, metalness: 0.5 });
    const panelLeft = new THREE.Mesh(panelGeo, panelMat);
    panelLeft.position.x = -0.24;
    const panelRight = panelLeft.clone();
    panelRight.position.x = 0.24;

    satelliteGroup.add(satelliteBody, panelLeft, panelRight);
    scene.add(satelliteGroup);

    // --- 9. 10,000 STARS ---
    const starsCount = 10000;
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starsCount * 3);
    const starColors = new Float32Array(starsCount * 3);

    for (let i = 0; i < starsCount * 3; i += 3) {
        const u = Math.random();
        const v = Math.random();
        const theta = u * 2.0 * Math.PI;
        const phi = Math.acos(2.0 * v - 1.0);
        const r = 150 + Math.random() * 100;

        starPositions[i] = r * Math.sin(phi) * Math.cos(theta);
        starPositions[i + 1] = r * Math.sin(phi) * Math.sin(theta);
        starPositions[i + 2] = r * Math.cos(phi);

        starColors[i] = 0.8 + Math.random() * 0.2;
        starColors[i + 1] = 0.8 + Math.random() * 0.2;
        starColors[i + 2] = 0.9 + Math.random() * 0.1;
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(starColors, 3));

    const starMaterial = new THREE.PointsMaterial({
        size: 1.2,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        map: starTex,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const starField = new THREE.Points(starGeometry, starMaterial);
    scene.add(starField);

    // --- 10. GALAXY BACKGROUND ---
    const galaxyGeo = new THREE.PlaneGeometry(350, 350);
    const galaxyMat = new THREE.MeshBasicMaterial({
        map: starTex,
        color: 0x110822,
        transparent: true,
        opacity: 0.4,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide
    });
    const galaxy = new THREE.Mesh(galaxyGeo, galaxyMat);
    galaxy.position.z = -120;
    galaxy.lookAt(camera.position);
    scene.add(galaxy);

    // --- 11. ANIMATION LOOP ---
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Rotations
        earth.rotation.y = elapsedTime * 0.02;
        clouds.rotation.y = elapsedTime * 0.027;
        clouds.rotation.x = elapsedTime * 0.003;

        // Moon Orbit
        const moonOrbitRadius = 15;
        const moonSpeed = 0.05;
        moon.position.x = Math.cos(elapsedTime * moonSpeed) * moonOrbitRadius;
        moon.position.z = Math.sin(elapsedTime * moonSpeed) * moonOrbitRadius;
        moon.rotation.y = -elapsedTime * moonSpeed;

        // Satellite Orbit
        const satOrbitRadius = 5.5;
        const satSpeed = 0.3;
        satelliteGroup.position.x = Math.cos(elapsedTime * satSpeed) * satOrbitRadius;
        satelliteGroup.position.z = Math.sin(elapsedTime * satSpeed) * satOrbitRadius;
        satelliteGroup.position.y = Math.sin(elapsedTime * satSpeed) * 1.5;
        satelliteGroup.lookAt(earth.position);

        // Twinkle effect
        starMaterial.size = 1.0 + Math.sin(elapsedTime * 2) * 0.3;

        controls.update();
        renderer.render(scene, camera);
    }

    animate();

    // --- 12. RESIZE HANDLER ---
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
})();