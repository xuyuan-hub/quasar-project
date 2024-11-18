<script setup>
import gsap from 'gsap';

import { ref, onMounted } from 'vue';

const nBox = ref(null);
const fBox = ref(null);
const titleRef = ref(null);

defineOptions({
  name: 'IndexPage'
});

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

onMounted(() => {
  animate();
});

</script>

<template>
  <h1 ref="titleRef" class="row text-h1 text-blue-grey-2 text-weight-bold shadow-text no-wrap">
    <div ref="nBox" class="text-light-blue-4 q-mr-md">Novo </div>
    <div ref="fBox" class="text-deep-purple-5"> Force</div>
  </h1>
</template>
