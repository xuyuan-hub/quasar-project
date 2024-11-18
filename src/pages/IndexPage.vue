<script setup>
import MembersDetail from 'src/components/MembersDetail.vue';
import IndexTitle from '../components/IndexTitle.vue'
import AboutUs from 'src/components/AboutUs.vue';
import Cas12Model from 'src/components/Cas12Model.vue';
</script>

<template>

  <q-page class="flex flex-center gradient-2b-indigo-10-9">
    <index-title></index-title>
  </q-page>
  <q-page class="flex flex-center gradient-2b-indigo-9-8">
    <about-us></about-us>
  </q-page>
  <q-page>
    <members-detail></members-detail>
  </q-page>
  <q-page class="flex flex-center">
    <!-- <cas12-model></cas12-model> -->
  </q-page>
</template>
