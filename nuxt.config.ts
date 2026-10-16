import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { ui } from './config/ui.js'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    'nuxt-auth-utils',
    '@pinia/nuxt',
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        config.plugins ||= []
        config.plugins.push(vuetify({ autoImport: true }))
      })
    },
  ],

  // pathPrefix: false -> tên thẻ component KHÔNG bị đổi theo tên thư mục
  // con (mặc định Nuxt sẽ ghép tiền tố theo path, vd components/Foo/Bar.vue
  // -> <FooBar>). Tắt đi để được tự do gom component theo cụm tính năng
  // (vd components/StudentProfile/) mà không phải đổi tên thẻ đang dùng
  // khắp nơi trong template.
  components: [
    { path: '~/components', pathPrefix: false },
  ],

  build: {
    transpile: ['vuetify'],
  },

  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  css: [
    'vuetify/styles',
    '~/assets/main.css',
  ],

  app: {
    head: {
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: `https://fonts.googleapis.com/css2?family=${ui.font.googleFont}&display=swap`,
        },
      ],
      style: [
        {
          innerHTML: `
            :root {
              --font-family: ${ui.font.family};
              --font-size: ${ui.font.size};
              --field-border: ${ui.field.borderColor};
              --field-border-focus: ${ui.field.focusBorderColor};
              --field-radius: ${ui.field.borderRadius};
              --checkbox-color: ${ui.checkbox.color};
            }
          `,
        },
      ],
    },
  },

  runtimeConfig: {
    geminiApiKey: process.env.GEMINI_API_KEY,
    supabaseServiceRoleKey: process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY || '',
    public: {
      supabaseUrl: process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey: process.env.NUXT_PUBLIC_SUPABASE_KEY || '',
    },
  },
})
