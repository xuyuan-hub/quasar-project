<template>
    <div class="q-mb-xl gt-sm">
        <h3 class="title text-h2 text-teal-3 text-weight-bold shadow-text no-wrap" id="about-us-title">About Us</h3>
        <div class="scrolling-banner">
            <p class="banner-text">
                Welcome to [Lab Name], a leading research laboratory at the forefront of combining Artificial
                Intelligence with biological sciences.
            </p>
            <p class="banner-text">
                Our mission is to harness the power of AI to unlock new insights
                in biology, from understanding complex biological systems to accelerating medical discoveries.
            </p>
            <p class="banner-text">
                At [Lab Name], we integrate cutting-edge machine learning techniques with biological data to address
                some of the most pressing challenges in healthcare, genomics, and biotechnology.
            </p>
            <p class="banner-text">
                Through collaboration and
                innovation, we aim to transform the way we study life, offering novel solutions for disease
                diagnosis, personalized medicine, and beyond.
            </p>
        </div>
    </div>
    <div class="q-mb-xl lt-md">
        <h3 class="title text-h4 text-teal-3 text-weight-bold shadow-text no-wrap text-center" id="about-us-title">About
            Us</h3>
        <div class="scrolling-banner text-white">
            <p>
                Welcome to [Lab Name], a leading research laboratory at the forefront of combining Artificial
                Intelligence with biological sciences.
            </p>
            <p>
                Our mission is to harness the power of AI to unlock new insights
                in biology, from understanding complex biological systems to accelerating medical discoveries.
            </p>
            <p>
                At [Lab Name], we integrate cutting-edge machine learning techniques with biological data to address
                some of the most pressing challenges in healthcare, genomics, and biotechnology.
            </p>
            <p>
                Through collaboration and
                innovation, we aim to transform the way we study life, offering novel solutions for disease
                diagnosis, personalized medicine, and beyond.
            </p>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 注册 ScrollTrigger 插件
gsap.registerPlugin(ScrollTrigger);

const slideText = () => {
    // 使用 ScrollTrigger 和 batch 来控制每个段落逐个滚动
    const textElements = document.querySelectorAll('.banner-text');
    gsap.utils.toArray(textElements).forEach((text, index) => {
        gsap.fromTo(
            text,
            {
                x: '100%',
                opacity: 0,
            },
            {
                x: '0', // 滚动结束位置：左侧外部
                opacity: 1,
                scrollTrigger: {
                    trigger: text, // 触发滚动的元素是每个段落
                    start: 'top 80%', // 当段落顶部到达视口底部时开始滚动
                    end: 'bottom center', // 当段落顶部到达视口顶部时结束滚动
                    scrub: true, // 启用平滑滚动效果
                    markers: false, // 关闭调试标记
                }
            }
        );
    });
}

const animateText = () => {
    gsap.fromTo("#about-us-title",
        {
            x: 0,
            y: -200,
            rotation: 0,
            opacity: 0,
        },
        {
            x: 0,
            y: 0,
            rotation: 0,
            opacity: 1,
            ease: "bounce.out",
            scrollTrigger: {
                trigger: "#about-us-title",
                start: 'top center',
                end: "bottom 30%",
                markers: false,
            }
        })
}
onMounted(() => {
    slideText()
    animateText()
});
</script>

<style scoped>
.container {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
}

.title {
    font-weight: bold;
    text-align: center;
    margin-bottom: 20px;
}

.scrolling-banner {
    width: 80%;
    overflow: hidden;
}

.banner-text {
    font-size: 1.2rem;
    font-weight: normal;
    padding: 10px 20px;
    max-width: 90%;
    color: white;
    margin-bottom: 0px;
}
</style>