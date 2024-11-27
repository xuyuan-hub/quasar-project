<template>
    <div style="overflow: hidden;">
        <div class="container" id="horizontal-div">
            <section ref='firstSpanRef' class="panel gradient-2r-indigo-8-6 flex flex-center">
                <h2>1</h2>
            </section>
            <section class="panel gradient-2r-indigo-6-4 flex flex-center">
                <h2>2</h2>
            </section>
            <section class="panel gradient-2r-indigo-4-2 flex flex-center">
                <h2>3</h2>
            </section>
            <section class="panel gradient-2r-indigo-2-0 flex flex-center">
                <h2 class="text-orange-10">4</h2>
            </section>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

const firstSpanRef = ref(null)

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
    /* 每个面板占据容器的100% */
    height: 100vh;
    /* 每个面板的高度为视口高度 */
    display: flex;
    justify-content: center;
    align-items: center;
}

h2 {
    color: white;
    font-size: 4rem;
}
</style>