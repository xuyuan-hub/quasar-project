<script setup>
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ref, onMounted } from 'vue';

import AboutUs from './AboutUs.vue';

const nBox = ref(null);
const fBox = ref(null);
const titleRef = ref(null);
const desRef = ref(null);

const props = defineProps(['title']);
gsap.registerPlugin(ScrollTrigger)

const animate = () => {
  const tl = gsap.timeline();
  const nBoxText = nBox.value.innerText.split('').map(char => `<span>${char}</span>`).join('');
  const fBoxText = fBox.value.innerText.split('').map(char => `<span>${char}</span>`).join('');
  nBox.value.innerHTML = nBoxText;
  fBox.value.innerHTML = fBoxText;

  tl.from(titleRef.value.querySelectorAll('span'), {
    opacity: 0,
    duration: 2,
    stagger: 0.2
  });
}

const upText = () => {
  gsap.fromTo(
    desRef.value,
    {
      y: '100',
      opacity: 0.2,
    },
    {
      y: '0',
      opacity: 1,
      scrollTrigger: {
        trigger: desRef.value,
        start: 'top center',
        end: 'bottom+=200% 20%',
        scrub: true,
        markers: false
      }
    }
  );
}

onMounted(() => {
  animate();
  upText()
});

</script>

<template>
  <div class="gt-sm">
    <div class="des">
      <h1 ref="titleRef" class="text-title row text-h1 text-blue-grey-2 text-weight-bold shadow-text no-wrap">
        <div ref="nBox" class="text-light-blue-4 q-mr-md">Novo </div>
        <div ref="fBox" class="text-deep-purple-5"> Force</div>
      </h1>
      <p ref="desRef" class="row web-des">
        Welcome to novo force, a leading research laboratory at the forefront of combining
        Artificial
        Intelligence with biological sciences.
      </p>
    </div>
    <div class="about-container">
      <AboutUs class="about"></AboutUs>
    </div>
  </div>

  <div class="lt-md">
    <div class="des-md">
      <h1 ref="titleRef"
        class="text-title row text-h4 text-blue-grey-2 text-weight-bold shadow-text no-wrap justify-center">
        <div ref="nBox" class="text-light-blue-4 q-mr-md">Novo </div>
        <div ref="fBox" class="text-deep-purple-5"> Force</div>
      </h1>
      <p class="row text-white">
        Welcome to novo force, a leading research laboratory at the forefront of combining
        Artificial
        Intelligence with biological sciences.
      </p>
    </div>
    <div class="about-container" style="width: 80vw;">
      <AboutUs class="about"></AboutUs>
    </div>
  </div>
</template>
<style>
.text-title {
  height: 20vh;
  position: sticky;
  top: 20vh;
}

.web-des {
  font-size: 1.5rem;
  font-weight: normal;
  padding: 10px 0px;
  max-width: 90%;
  color: white;
  margin-bottom: 0px;
  position: sticky;
  top: 40vh
}

.about-container {
  height: auto;
  position: relative;
  margin-left: 10vw;
  width: 60vw;
  z-index: 100;
}

.about {
  height: auto;
  position: sticky;
  top: 20vh;
}

.des {
  width: 60vw;
  margin-left: 10vw;
  height: 200vh;
}

.des-md {
  width: 80vw;
  margin-left: 10vw;
  height: auto;
}
</style>