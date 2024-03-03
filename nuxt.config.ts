// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ["@nuxtjs/tailwindcss", "nuxt-primevue"],
  runtimeConfig: {
    spotifyClientId: "",
    spotifyClientSecret: "",
  },
  primevue: {
    cssLayerOrder: "reset,primevue",
    components: {
      include: ["Button", "DataTable"],
    },
  },
  css: ["primevue/resources/themes/lara-dark-teal/theme.css"],
});
