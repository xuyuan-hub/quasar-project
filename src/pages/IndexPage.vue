<script setup>
import MembersDetail from 'src/components/MembersDetail.vue';
import IndexTitle from '../components/IndexTitle.vue'
import Cas12Model from 'src/components/RobotArm.vue';
import TeamMemebers from 'src/pages/TeamMemebers.vue';
</script>

<template>
  <div>

    <div class="flex gradient-2b-indigo-10-9 gt-sm" id="index-page">
      <index-title class="frontground"></index-title>
      <cas12-model class="background gt-sm"></cas12-model>
    </div>
    <div class="flex gradient-2b-indigo-10-9 lt-md">
      <index-title class="frontground"></index-title>
    </div>
    <q-page>
      <members-detail></members-detail>
    </q-page>
    <q-page>
      <team-memebers></team-memebers>
    </q-page>
  </div>
</template>

<style scoped>
#index-page {
  position: relative;
  /* overflow: hidden; */
  height: 400vh;
}

.frontground {
  z-index: 1;
}

.background {
  position: fixed;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.index-title {
  position: sticky;
}

.q-page-scroller {
  pointer-events: none;
}
</style>