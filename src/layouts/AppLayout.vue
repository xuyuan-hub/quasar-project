<script setup>
import { ref } from 'vue'
import SearchBar from '/src/components/SearchBar.vue'
import ChatComponent from 'src/components/ChatComponent.vue';
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>


<template>
  <q-layout view="hHh lpR fFf">
    <q-header elevated class="bg-indigo-10 text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <q-avatar>
            <img src="/src/assets/favicon.png">
          </q-avatar>
          <strong>Novo Force</strong>
        </q-toolbar-title>
        <q-btn flat round dense icon="person" />
        <q-btn flat round dense icon="logout" />
      </q-toolbar>
    </q-header>

    <q-drawer show-if-above v-model="leftDrawerOpen" side="left" bordered>
      <!-- drawer content -->
      <ChatComponent></ChatComponent>
      <SearchBar class="fixed-bottom"></SearchBar>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
