<template>
    <div ref="parentEle" id="robot-arm"></div>
</template>
<script setup>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { computed, onMounted, ref } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { webCacheControl } from 'src/store/webStore';

const parentEle = ref(null);
let mixer, renderer, scene, camera, cube;
let clock = new THREE.Clock();
const firstDuration = ref(0);

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

const animateModel = () => {
    const totalDuration = firstDuration.value - 0.01; // 获取第一个动画的总持续时间(-0.01)为了避免跳帧
    const startOffset = 0.5; // scrollTrigger 起始位置 (start 的百分比)
    const endOffset = 2; // scrollTrigger 结束位置 (end 的倍数相对 start)
    let lastScrollProgress = 0;

    gsap.to(mixer, {
        time: totalDuration,
        scrollTrigger: {
            trigger: parentEle.value,
            scrub: true,
            start: `${startOffset * 100}% 50%`,
            end: `bottom+=${endOffset * 100}% 50%`,
            markers: false,
            onUpdate: (self) => {
                const currentProgress = self.progress;
                const progressDelta = currentProgress - lastScrollProgress;
                const deltaTime = progressDelta * totalDuration;
                lastScrollProgress = currentProgress;
                mixer.update(deltaTime);
                renderer.render(scene, camera);
                renderer.render(scene, camera);
            },
        }
    });
}

const animateCamera = () => {
    const triggerElement = parentEle.value;
    var islookAtCube = false
    gsap.to(camera.position, {
        x: cube.position.x,
        y: cube.position.y,
        z: cube.position.z,
        imageRendering: false,
        scrollTrigger: {
            trigger: triggerElement,
            start: "bottom+=200% 50%",
            end: "bottom+=280% 50%",
            scrub: true,
            markers: false,
            onEnter: () => {
                islookAtCube = true
            },
            onLeaveBack: () => {
                islookAtCube = false
                camera.lookAt(2, 1, 0);
                camera.updateProjectionMatrix()
            },
            onUpdate: () => {
                camera.lookAt(cube.position.x, cube.position.y, cube.position.z - 0.01);
                camera.updateProjectionMatrix()
                renderer.render(scene, camera);
            }
        }
    });
    gsap.to(camera, {
        fov: 3,
        scrollTrigger: {
            trigger: triggerElement,
            start: "bottom+=200% 50%",
            end: "bottom+=280% 50%",
            scrub: true,
            markers: false,
            onUpdate: () => {
                camera.updateProjectionMatrix()
                renderer.render(scene, camera)
            }
        }
    });
};


const loadModel = () => {
    scene = new THREE.Scene();
    // 创建镜头
    camera = new THREE.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(2, 2, -20); // 确保从倾斜角度观看模型
    camera.lookAt(2, 1, 0);

    // 创建 Renderer
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, }); // 设置透明背景
    renderer.setSize(window.innerWidth, window.innerHeight);
    parentEle.value.appendChild(renderer.domElement);

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 10, 10);
    scene.add(directionalLight);
    const axesHelper = new THREE.AxesHelper(5); // 参数 5 为坐标轴长度
    scene.add(axesHelper);

    // 加载模型
    const loader = new GLTFLoader();
    loader.load('3d/grap2.glb', (gltf) => {
        let model = gltf.scene
        scene.add(model)
        cube = model.getObjectByName('cube');
        // console.log(cube.position);
        // 调整模型方向和位置
        // model.rotation.x = -0.628 * 1.25;
        // 如果模型有动画，创建 AnimationMixer
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            const action = mixer.clipAction(clip);
            if (clip.name == 'Armature动作.001') {
                firstDuration.value = clip.duration;
            }
            console.debug(`Animation Clip Name: ${clip.name}`);
            console.debug(`Total Duration: ${clip.duration} seconds`);
            action.play();
        });
        mixer.update(0);
        renderer.render(scene, camera);
        animateModel();
        animateCamera()
    }, undefined, (error) => {
        console.error('An error occurred while loading the model:', error);
    });

};

onMounted(() => {
    loadModel();
});
</script>