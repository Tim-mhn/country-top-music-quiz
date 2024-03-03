<script lang="ts" setup>
defineProps<{
  options: string[];
}>();
const emit = defineEmits<{
  (e: "answerClicked", country: string): void;
}>();
</script>

<template>
  <div class="z-10 grid grid-cols-2 grid-rows-2 gap-32">
    <div
      v-for="option of options"
      :key="option"
      @click="emit('answerClicked', option)"
      class="flex justify-center items-center rounded-sm p-4 font-semibold text-md bg-[#B10374] hover:bg-[#7F0253] cursor-pointer text-white"
    >
      {{ option }}
    </div>
  </div>
</template>
