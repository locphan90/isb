
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'
import { ui } from './config/ui.js'

const appMode = process.env.NUXT_APP_MODE || 'staff'

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

  // Lọc route theo website cần build
  hooks: {
    'pages:extend'(pages) {
      const normalize = (file = '') =>
        `/${file.replace(/\\/g, '/')}`

      const isStudentPage = (file = '') =>
        normalize(file).includes('/pages/student/')

      const isStaffLogin = (file = '') =>
        normalize(file).endsWith('/pages/login.vue')

      for (let i = pages.length - 1; i >= 0; i--) {
        const file = pages[i].file || ''

        if (appMode === 'student') {
          // Website sinh viên:
          // Giữ tất cả route thuộc pages/student/
          // Loại route của website nhân viên.
          if (!isStudentPage(file) || isStaffLogin(file)) {
            pages.splice(i, 1)
          }
        } else {
          // Website nhân viên:
          // Loại toàn bộ route thuộc pages/student/
          if (isStudentPage(file)) {
            pages.splice(i, 1)
          }
        }
      }
    },
  },

  // Giữ nguyên cấu hình components
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
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
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
    supabaseServiceRoleKey:
      process.env.NUXT_SUPABASE_SERVICE_ROLE_KEY || '',

    public: {
      supabaseUrl:
        process.env.NUXT_PUBLIC_SUPABASE_URL || '',
      supabaseKey:
        process.env.NUXT_PUBLIC_SUPABASE_KEY || '',
    },
  },
})
