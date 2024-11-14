<script setup>
// import { ref } from 'vue';
const props = defineProps(['msg', 'role', 'stamp'])
// const msg = ref(props.msg || [])
</script>

<template>
    <div>
        <template v-if="props.role == 'user'">
            <q-chat-message :name="props.role" :text="[props.msg]" :stamp="props.stamp" sent />
        </template>
        <template v-else>
            <q-chat-message :name="props.role" :text="[props.msg]" :stamp="props.stamp" />
        </template>
        <!-- <p style="white-space: pre-line; max-width: 90vw;" class="text-wrap text-break">{{ msg }}</p> -->
    </div>
</template>