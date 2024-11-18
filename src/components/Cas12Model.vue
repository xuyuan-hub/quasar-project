<template>
    <div></div>
</template>

<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { onMounted } from 'vue';
const loadModel = () => {
    // 1. 创建场景
    const scene = new THREE.Scene();

    // 2. 创建镜头
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 150;

    // 3. 创建Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth * 0.9, window.innerHeight * 0.9);
    renderer.setClearColor(0xffffff, 1);  // 设置背景色为白色
    document.body.appendChild(renderer.domElement);

    // 4. 设置环境光为白色
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);  // 白色环境光，强度为1
    scene.add(ambientLight);

    // 5. 加载模型
    const loader = new GLTFLoader();
    loader.load(
        'public/3d/cas1.glb', // 模型文件的路径
        (gltf) => {
            // 模型加载成功时的回调
            const model = gltf.scene;
            scene.add(model); // 将模型添加到场景中
            animate(); // 调用渲染函数
        },
        (xhr) => {
            // 进度回调
            console.log((xhr.loaded / xhr.total) * 100 + '% loaded');
        },
        (error) => {
            // 错误回调
            console.error('An error occurred:', error);
        }
    );

    // 渲染函数
    function animate() {
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
    }
}

onMounted(() => {
    loadModel()
})

</script>