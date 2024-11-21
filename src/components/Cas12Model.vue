<template>
    <div ref="parentEle"></div>
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const parentEle = ref(null)

const loadModel = () => {
    const scene = new THREE.Scene();
    // 2. 创建镜头
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight * 0.8, 1, 1000);
    camera.position.z = 10;
    camera.lookAt(0, 0, 10);
    // 3. 创建Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * 0.8, window.innerHeight);
    renderer.setClearColor(0x000000, 0);  // 设置背景色为白色
    parentEle.value.appendChild(renderer.domElement);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    const loader = new GLTFLoader();
    loader.load('3d/sixaxisrobot.gltf', (gltf) => {
        const model = gltf.scene;
        scene.add(model);
        model.rotation.x = 0.628;
        // 如果有动画
        const mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });

        // 渲染循环
        const clock = new THREE.Clock();
        function animate() {
            requestAnimationFrame(animate);

            // 更新动画
            const delta = clock.getDelta();
            if (mixer) mixer.update(delta);

            renderer.render(scene, camera);
        }

        animate();
    }, undefined, (error) => {
        console.error('An error occurred while loading the model:', error);
    });
}

onMounted(() => {
    loadModel()
})

</script>