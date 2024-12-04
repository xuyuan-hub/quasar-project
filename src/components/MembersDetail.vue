<template>
    <div class="gt-sm">
        <div style="overflow: hidden;">
            <div class="container lexend-text" id="horizontal-div">
                <section ref='firstSpanRef' class="panel bg-box flex justify-end">
                    <h2 class="text-no-wrap">developing
                        <span class="text-purple-4 most-text">the most</span>
                        advanced technologies.
                    </h2>
                </section>
                <section ref='secondSpanRef' class="panel bg-indigo-6 flex " style="width: 400%;">
                    <h2 class="q-ml-sm rest-p">{{ restP }}</h2>
                </section>
            </div>
        </div>
    </div>
    <div class="lt-md">
        <p class="text-no-wrap">developing the most advanced technologies
        </p>
        <p>{{ restP }}</p>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

const firstSpanRef = ref(null)
const secondSpanRef = ref(null)
const props = defineProps('first-p', 'rest-p')

const restP = "Through efficient teamwork and state-of-the-art laboratory equipment, we are able to rapidly advance projects and achieve groundbreaking results."

onMounted(() => {
    // 创建 ScrollTrigger 和 GSAP 动画
    gsap.to(firstSpanRef.value, {
        xPercent: -100, // 让最后一个面板滑出视口
        ease: "none", // 不进行加速
        scrollTrigger: {
            trigger: "#horizontal-div",
            start: "top top",
            scrub: 0.1,
            end: `+=1000`, // 根据面板数量调整滚动距离
            // markers: true // 启用滚动调试标记
            // onLeave: () => {
            //     const RobotArm = document.getElementById('robot-arm');
            //     // 显示 robot-arm
            //     RobotArm.style.display = 'none';
            // },
            // onLeaveBack: () => {
            //     const RobotArm = document.getElementById('robot-arm');
            //     // 显示 robot-arm
            //     RobotArm.style.display = 'block';
            // }
        }
    });
    gsap.to(secondSpanRef.value, {
        xPercent: -100, // 让最后一个面板滑出视口
        ease: "none", // 不进行加速
        scrollTrigger: {
            trigger: "#horizontal-div",
            scrub: 0.1,
            pin: true,
            end: "+=4000",
            markers: false // 启用滚动调试标记
        }
    });
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: '.most-text',
            start: "top bottom",
            duration: 2,
            markers: false,
            onEnter: () => {
                // 添加文本的动画
                tl.from('.most-text',
                    { fontWeight: 600, fontSize: '9rem', opacity: 0, duration: 1 },
                );
            },

        }
    });
});
</script>

<style scoped>
.bg-box {
    background-color: #5ca67a;
}

.container {
    width: 500%;
    /* 容器宽度是面板宽度的5倍 */
    height: 100vh;
    display: flex;
    flex-wrap: nowrap;
    overflow-x: hidden;
    /* 隐藏溢出的内容 */
}

.panel {
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
}

.panel h2 {
    color: white;
    font-size: 4.5rem;
    font-weight: 400;
    z-index: 2;
}

@media (max-width: 1440px) {
    .panel h2 {
        font-size: 3rem;
    }
}

.panel p {
    color: white;
}

.box-container {
    position: absolute;
    top: 0;
    /* 调整顶部距离 */
    left: 0;
    /* 调整左侧距离 */
}

.box {
    width: 200px;
    height: 200px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    opacity: 0;
    z-index: 1;
}
</style>