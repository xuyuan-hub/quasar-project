<template>
    <div v-html="renderedHtml" class="code-renderer"></div>
</template>

<script setup>
import { ref, watch } from 'vue';

defineProps({
    code: {
        type: String,
        required: true
    }
});

const renderedHtml = ref('');

watch(() => props.code, () => {
    updateRenderedHtml();
}, { immediate: true });

function updateRenderedHtml() {
    try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(props.code, 'text/html');
        renderedHtml.value = doc.documentElement.innerHTML;
    } catch (error) {
        console.error('Failed to parse the code:', error);
        renderedHtml.value = `<pre>${props.code}</pre>`;
    }
}
</script>

<style scoped>
.code-renderer {
    background-color: #f8f8f8;
    border-radius: 5px;
    padding: 10px;
    overflow-x: auto;
    /* 支持水平滚动 */
}
</style>