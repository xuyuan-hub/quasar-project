<script setup>
import { ref, onMounted } from 'vue'
import { computePosition, flip, shift } from '@floating-ui/dom';
import { agentActionControl } from 'src/assets/js/AgentControl';

const uinput = ref("")
const ufile = ref(null)
const fileIconRef = ref(null)
const fileDivRef = ref(null)

const submitClicked = async () => {
  agentActionControl.pushMsg(uinput.value, "user")
  uinput.value = ""
  ufile.value = null
}

const update = () => {
  if (fileIconRef.value && fileDivRef.value) {
    computePosition(fileIconRef.value, fileDivRef.value, {
      placement: 'top',
      middleware: [
        flip(),
        shift({ padding: 5 }),
      ],
    }).then(({ x, y, placement }) => {
      Object.assign(fileDivRef.value.style, {
        left: `${x}px`,
        top: `${y}px`,
      });
    });
  }
}

const showSelectFile = () => {
  fileDivRef.value.style.display = "block"
  update()
}

const hideSelectFile = () => {
  fileDivRef.value.style.display = ""
}

</script>

<template>
  <div style="background-color: white;">
    <div ref="fileDivRef" class="tooltip">
      <q-file filled bottom-slots v-model="ufile" label="Label" counter>
        <template v-slot:prepend>
          <q-icon name="cloud_upload" @click.stop.prevent />
        </template>
        <template v-slot:append>
          <q-icon name="close" @click.stop.prevent="ufile = null" class="cursor-pointer" />
        </template>
        <template v-slot:hint>
        </template>
      </q-file>
    </div>
    <q-input v-model="uinput" label="Prompt..." @keyup.enter="submitClicked" @focus="hideSelectFile">
      <template v-slot:prepend>
        <div class="cursor-pointer" ref="fileIconRef">
          <q-icon name="attach_file" @click="showSelectFile" />
        </div>
      </template>
      <template v-slot:append>
        <q-icon v-if="uinput !== ''" name="close" @click="uinput = ''" class="cursor-pointer" />
        <q-icon name="search" @click="submitClicked" />
      </template>
    </q-input>
  </div>

</template>
<style scoped>
.tooltip {
  display: none;
  width: max-content;
  position: absolute;
  top: 0;
  left: 0;
  font-weight: bold;
  padding: 5px;
  border-radius: 4px;
  font-size: 90%;
  z-index: 10;
}
</style>