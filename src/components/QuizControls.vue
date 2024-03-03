<script lang="ts" setup>
const emit = defineEmits(["startClicked"]);
</script>

<template>
  <button
    class="text-5xl text-slate-400 font-semibold hover:text-slate-500"
    @click.prevent="emit('startClicked')"
  >
    Start quiz
  </button>
</template>
