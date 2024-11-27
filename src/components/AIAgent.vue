<template>
    <div>
        <q-fab v-if="!isChatOpen" color="deep-purple-7" icon="chat" direction="up" class="fixed-bottom-right"
            @click="toggleChat">
            <!-- 这里可以添加其他浮动按钮 -->
        </q-fab>

        <div v-if="isChatOpen" class="chat-container">
            <div style="height: 50px;" class="row bg-deep-purple-7 items-center q-pl-md">
                <span class="text-h5 justify-start text-white">{{ webName }}</span>
                <q-btn flat round icon="close" class="close-button" @click="toggleChat"></q-btn>
            </div>
            <div class="row" style="height: 300px;">
                <q-scroll-area class="fit">
                    <div class="q-pa-sm">
                        <chat-component></chat-component>
                    </div>
                </q-scroll-area>
                <search-bar class="fixed-bottom"></search-bar>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import SearchBar from '/src/components/SearchBar.vue';
import ChatComponent from 'src/components/ChatComponent.vue';

const props = defineProps(['webName'])
const webName = props.webName || "Novo Force"
const isChatOpen = ref(false);

const toggleChat = () => {
    isChatOpen.value = !isChatOpen.value;
};
</script>

<style scoped>
.chat-container {
    position: fixed;
    bottom: 32px;
    right: 32px;
    width: 300px;
    /* 根据需要调整宽度 */
    height: 350px;
    /* 根据需要调整高度 */
    background-color: white;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
    z-index: 999;
    border-radius: 5px;
    /* 确保在浮动按钮之下 */
}

.fixed-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    border-radius: 5px;
}

.fixed-bottom-right {
    position: fixed;
    bottom: 32px;
    right: 32px;
    z-index: 1000;
}

.close-button {
    position: absolute;
    top: 4px;
    right: 4px;
    z-index: 1001;
    color: white;
}
</style>