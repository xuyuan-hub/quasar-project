<script setup>
import { ref } from 'vue'
const text = ref("")

</script>

<template>
  <q-input v-model="text" label="Prompt...">
    <template v-slot:prepend>
      <q-icon name="event"></q-icon>
    </template>
    <template v-slot:append>
      <q-icon v-if="text !== ''" name="close" @click="text = ''" class="cursor-pointer" />
      <q-icon name="search" />
    </template>
  </q-input>
</template>
