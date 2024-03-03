<script lang="ts" setup>
defineProps<{
  options: string[];
}>();
const emit = defineEmits<{
  (e: "answerClicked", country: string): void;
}>();
</script>

<template>
  <div
    class="z-10 flex flex-col justify-center md:grid md:grid-cols-2 md:grid-rows-2 gap-4 md:gap-16"
  >
    <div
      v-for="option of options"
      :key="option"
      @click="emit('answerClicked', option)"
      class="h-24 md:h-36 w-full flex justify-center items-center rounded-lg p-4 font-semibold text-md bg-tertiary hover:bg-tertiary-hover cursor-pointer text-secondary hover:text-slate-100"
    >
      {{ option }}
    </div>
  </div>
</template>
