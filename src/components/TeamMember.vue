<template>
    <q-card class="my-card" style="width: 200px; margin: 16px;">
        <q-card-section>
            <div class="text-h6">{{ name }}</div>
            <div class="text-subtitle2">{{ position }}</div>
        </q-card-section>

        <q-card-section>
            <img :src="avatar" alt="Avatar" class="avatar" />
        </q-card-section>

        <q-card-section>
            <p>{{ bio }}</p>
        </q-card-section>
    </q-card>
</template>

<script setup>
const props = defineProps({
    name: String,
    position: String,
    bio: String,
    avatar: String
})
</script>

<style scoped>
.avatar {
    width: 100%;
    height: auto;
    border-radius: 50%;
}
</style>