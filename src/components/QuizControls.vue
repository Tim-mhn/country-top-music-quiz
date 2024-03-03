<script lang="ts" setup>
const emit = defineEmits(["startClicked"]);
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-16">
    <div class="text-4xl text-slate-700 font-bold">Music Quiz</div>
    <button
      class="text-7xl text-slate-400 font-semibold hover:text-slate-500"
      @click.prevent="emit('startClicked')"
    >
      Start quiz
    </button>

    <div class="text-2xl text-ellipsis text-slate-400 text-center">
      Each track is in the top 50 of a country. <br />Guess the countries
    </div>
  </div>
</template>
