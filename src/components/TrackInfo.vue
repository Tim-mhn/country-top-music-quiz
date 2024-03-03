<template>
  <div>
    <div class="relative flex flex-col w-full h-full bg-slate-800 px-16">
      <div class="flex flex-row flex-grow max-h-[80%]">
        <div class="pt-8 flex flex-grow justify-center items-center">
          <img
            class="object-contain rounded-3xl max-h-[512px]"
            :src="track.image"
          />
        </div>

        <div
          class="text-slate-100 flex flex-col gap-8 justify-center items-center pt-8 flex-grow"
        >
          <div class="flex flex-col justify-center items-center gap-1">
            <div class="text-3xl font-">{{ track.name }}</div>
            <div class="text-2xl font-thin">{{ track.artist }}</div>
          </div>

          <div class="text-5xl font-semibold">{{ country }}</div>
        </div>
      </div>

      <div class="flex justify-center items-center">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Track } from "../dtos/quiz";

defineProps<{ track: Track; country: string }>();
</script>
