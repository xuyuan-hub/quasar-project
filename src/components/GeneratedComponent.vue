<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
import { gsap } from 'gsap'
const cubeContainer = ref(null)
onMounted(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 200 / 200, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(200, 200)
    cubeContainer.value.appendChild(renderer.domElement)
    const geometry = new THREE.BoxGeometry()
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    const cube = new THREE.Mesh(geometry, material)
    scene.add(cube)
    camera.position.z = 5
    function animate() {
        requestAnimationFrame(animate)
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        renderer.render(scene, camera)
    }
    animate()
})
const animateButton = () => {
    gsap.from('.about-us h1', { duration: 1, y: -20, opacity: 0, ease: 'bounce' })
}
</script>

<template> <q-page class="flex flex-center">
        <div class="about-us">
            <h1>About Us</h1>
            <p>We are a team of passionate developers and designers who love to create beautiful web applications.</p>
            <q-btn color="primary" label="Learn More" @click="animateButton" /> <!-- 使用Three.js创建一个简单的3D立方体 -->
            <div ref="cubeContainer" style="width: 200px; height: 200px;"></div>
        </div>
    </q-page>
</template>

<style scoped>
.about-us {
    text-align: center;
    padding: 50px;
}

.about-us h1 {
    font-size: 2em;
    margin-bottom: 20px;
}

.about-us p {
    font-size: 1.2em;
    color: #666;
}
</style>
