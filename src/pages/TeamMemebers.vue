<template>
    <q-page class="flex flex-center">
        <team-member v-for="(member, index) in members" :key="index" :name="member.name" :position="member.position"
            :bio="member.bio" :avatar="member.avatar" />
    </q-page>
</template>

<script setup>
import { ref } from 'vue';
import TeamMember from '/src/components/TeamMember.vue'
const members = [
    {
        name: '张三',
        position: '前端工程师',
        bio: '热爱编程，擅长Vue.js和React。',
        avatar: 'https://via.placeholder.com/150'
    },
    {
        name: '李四',
        position: '后端工程师',
        bio: '专注于Node.js和Django开发。',
        avatar: 'https://via.placeholder.com/150'
    },
    // 可以继续添加更多成员
]

</script>

<style scoped>
.q-page {
    padding: 24px;
}
</style>