<script setup>
import { ref } from 'vue'
const uinput = ref("")
const ufile = ref()

const submitClicked = async () => {
  console.log(uinput.value)
  uinput.value = ""
}

</script>

<template>
  <div>
    <q-file inlined v-model="ufile">
      <template v-slot:prepend>
        <q-icon name="attach_file" />
      </template>
    </q-file>
    <q-input v-model="uinput" label="Prompt...">
      <template v-slot:append>
        <q-icon v-if="uinput !== ''" name="close" @click="uinput = ''" class="cursor-pointer" />
        <q-icon name="search" @click="submitClicked" />
      </template>
    </q-input>
  </div>

</template>
