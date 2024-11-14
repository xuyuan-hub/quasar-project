<script setup>
import { computed } from 'vue';
import { agentActionControl } from 'src/assets/js/AgentControl';

const messages = computed(() => {
    return agentActionControl.getMsgs()
})
</script>

<template>
    <div class="message" ref="messageContainer">
        <div v-for="msg in messages" :key="msg.key" class="message-alert" role="alert">
            <div class="v-stack gap-2" style="width: 100%;">
                <component :is="msg.content"></component>
            </div>
        </div>
    </div>
    <div style="height: 60px;"></div>
</template>