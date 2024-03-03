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
  tailwindcss: {
    config: {
      theme: {
        extend: {
          colors: {
            primary: "#191919",
            secondary: "#750E21",
            tertiary: "#BED754",
            "tertiary-hover": "#E3651D",
          },
        },
      },
    },
  },
  css: ["primevue/resources/themes/lara-dark-teal/theme.css"],
});
