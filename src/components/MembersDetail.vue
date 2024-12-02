<template>
    <div class="gt-md">
        <div style="overflow: hidden;">
            <div class="container lexend-text" id="horizontal-div">
                <section ref='firstSpanRef' class="panel gradient-2r-indigo-8-6 flex justify-end">
                    <div class="box-container">
                        <div ref='greenBoxRef' class="box bg-green-6"></div>
                    </div>
                    <h2 class="text-no-wrap">developing
                        <span class="text-purple-4 most-text">the most</span>
                        advanced technologies
                    </h2>
                </section>
                <section ref='secondSpanRef' class="panel bg-indigo-6 flex " style="width: 400%;">
                    <h2>&nbsp;{{ restP }}</h2>
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
import { webCacheControl } from 'src/store/webStore';


// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

const firstSpanRef = ref(null)
const greenBoxRef = ref(null)
const secondSpanRef = ref(null)
const props = defineProps('first-p', 'rest-p')

const restP = "Through efficient teamwork and state-of-the-art laboratory equipment, we are able to rapidly advance projects and achieve groundbreaking results."

onMounted(() => {
    let sections = gsap.utils.toArray(".panel"); // 获取所有 panel 元素

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
            markers: true // 启用滚动调试标记
        }
    });
    const getInitialPosition = () => {
        console.log(`x: ${webCacheControl.get('x')}, y:${webCacheControl.get('y')}`)
        return {
            x: webCacheControl.get('x'),
            y: webCacheControl.get('y')
        }
    }
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: greenBoxRef.value,
            start: "top 40%",
            end: "top 40%",
            markers: false,
            onEnter: () => {
                const { x, y } = getInitialPosition();
                const boxHeight = greenBoxRef.value.offsetHeight;
                const bottomY = y + boxHeight - 20;
                const RobotArm = document.getElementById('robot-arm');
                RobotArm.style.display = 'none';

                // 添加绿色盒子的动画
                tl.fromTo(greenBoxRef.value,
                    { x: x - 100, y: -200, opacity: 1 },
                    { x: x - 100, y: bottomY, opacity: 1, duration: 2, immediateRender: true }
                );

                // 添加文本的动画
                tl.from('.most-text',
                    { fontWeight: 600, fontSize: '9rem', opacity: 0, duration: 1 },
                    '<'
                );
            },
            onLeaveBack: () => {
                const RobotArm = document.getElementById('robot-arm');
                // 显示 robot-arm
                RobotArm.style.display = 'block';
            }
        }
    });

});
</script>

<style scoped>
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