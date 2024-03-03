<template>
  <div>
    <div
      class="relative flex flex-col w-full h-full bg-primary px-16 py-8 md:py-0"
    >
      <div class="flex flex-col md:flex-row flex-grow max-h-[80%]">
        <div class="md:pt-8 flex md:flex-grow justify-center items-center">
          <img
            class="object-contain rounded-3xl max-h-[512px]"
            :src="track.image"
          />
        </div>

        <div
          class="text-tertiary md:max-w-[50%] flex flex-col md:gap-8 justify-center items-center pt-8 flex-grow"
        >
          <div
            class="flex flex-col justify-center items-center gap-1 text-center"
          >
            <div class="text-3xl">{{ track.name }}</div>
            <div class="text-2xl font-thin">{{ track.artist }}</div>
          </div>

          <div class="text-3xl md:text-5xl text-center font-semibold">
            #{{ track.position }} in {{ country }}
          </div>
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
