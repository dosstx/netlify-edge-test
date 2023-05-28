// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    nitro: {
        preset: 'netlify'
    },
    runtimeConfig: {
        OPENAI_API_KEY: ""
    }
})
