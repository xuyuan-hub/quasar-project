<script setup>
import { ref } from 'vue';
const props = defineProps(['msg', 'role'])
const msg = ref(props.msg || [])
</script>

<template>
    <div>
        <p style="white-space: pre-line; max-width: 90vw;" class="text-wrap text-break">{{ msg }}</p>
    </div>
</template>