<script lang="ts" setup>
defineProps<{ seconds: number }>();
</script>

<template>
  <div class="text-9xl text-slate-200 font-thin">
    {{ seconds }}
  </div>
</template>
