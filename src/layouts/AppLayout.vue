<script setup>
import { ref } from 'vue'
import SearchBar from '/src/components/SearchBar.vue'
import ChatComponent from 'src/components/ChatComponent.vue';
import AIAgent from 'src/components/AIAgent.vue';
const leftDrawerOpen = ref(false)

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>

<template>
  <q-layout view="hHh lpR fFf">

    <q-header elevated class="bg-indigo-10 text-white" height-hint="98">
      <q-toolbar>
        <q-toolbar-title>
          <RouterLink to="/" style="text-decoration: none;">
            <q-avatar>
              <img src="/src/assets/favicon.png">
            </q-avatar>
            <strong style="color: white;">Novo Force</strong>
          </RouterLink>
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">
        <q-route-tab to="/about-us" label="About us" />
        <q-route-tab to="/page2" label="Page Two" />
        <q-route-tab to="/page3" label="Page Three" />
      </q-tabs>
    </q-header>

    <q-page-container>
      <AIAgent></AIAgent>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
