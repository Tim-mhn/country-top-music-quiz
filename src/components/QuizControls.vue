<script lang="ts" setup>
const emit = defineEmits(["startClicked"]);
</script>

<template>
  <div class="flex flex-col justify-center items-center gap-4 md:gap-16">
    <div class="text-xl md:text-4xl text-tertiary font-thin">Music Quiz</div>
    <button
      class="text-5xl md:text-7xl text-tertiary hover:text-tertiary-hover font-semibold hover:text-slate-500"
      @click.prevent="emit('startClicked')"
    >
      Start quiz
    </button>

    <div
      class="text-md md:text-2xl text-ellipsis text-slate-100 font-thin text-center"
    >
      Each track is in the top 50 of a country. <br />Guess the countries
    </div>
  </div>
</template>
