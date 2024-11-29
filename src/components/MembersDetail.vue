<template>
    <div style="overflow: hidden;">
        <div class="container" id="horizontal-div">
            <section ref='firstSpanRef' class="panel gradient-2r-indigo-8-6 flex justify-end">
                <div class="box-container">
                    <div ref='greenBoxRef' class="box bg-green-6"></div>
                </div>
                <h2>致力于开发
                    <span class="text-purple-4 most-text">最</span>
                    先进的生物制药技术
                </h2>
            </section>
            <section class="panel gradient-2r-indigo-6-4 flex flex-center">
                <h2>高效研发</h2>
                <p>通过高效的团队合作和先进的实验设备，我们能够快速推进项目并取得突破性成果。</p>
            </section>
            <section class="panel gradient-2r-indigo-4-2 flex flex-center">
                <h2>精准医疗</h2>
                <p>我们的研究专注于精准医疗，旨在为患者提供个性化的治疗方案，提高治疗效果。</p>
            </section>
            <section class="panel gradient-2r-indigo-2-0 flex flex-center">
                <h2>全球合作</h2>
                <p>我们与全球领先的科研机构和企业紧密合作，共同推动生物制药领域的进步。</p>
            </section>
        </div>
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

onMounted(() => {
    let sections = gsap.utils.toArray(".panel"); // 获取所有 panel 元素

    // 创建 ScrollTrigger 和 GSAP 动画
    gsap.to(sections, {
        xPercent: -100 * (sections.length - 1), // 让最后一个面板滑出视口
        ease: "none", // 不进行加速
        scrollTrigger: {
            trigger: "#horizontal-div", // 触发滚动的元素是容器
            pin: true, // 固定容器
            scrub: 0.1, // 滚动同步（0.1 控制平滑度）
            start: "top top", // 起始位置：容器顶部对齐视口顶部
            end: `+=${500 * (sections.length - 1)}`, // 根据面板数量调整滚动距离
            // markers: true // 启用滚动调试标记
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
    width: 400%;
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
    font-size: 5rem;
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