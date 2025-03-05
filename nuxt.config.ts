import VueI18nPlugin from "@intlify/unplugin-vue-i18n/vite";
import { fileURLToPath } from "node:url";
import vuetify from "vite-plugin-vuetify";
import svgLoader from "vite-svg-loader";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 4000
  },
  app: {
    head: {
      title: "Siakad Sekolah",
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/favicon.ico",
        },
      ],
    },
  },

  devtools: {
    enabled: false,
  },

  css: [
    "@core/scss/template/index.scss",
    "@styles/styles.scss",
    "@/plugins/iconify/icons.css",
  ],

  /*
    ❗ Please read the docs before updating runtimeConfig
    https://nuxt.com/docs/guide/going-further/runtime-config
  */
  runtimeConfig: {
    // Private keys are only available on the server
    AUTH_ORIGIN: process.env.AUTH_ORIGIN,
    AUTH_SECRET: process.env.AUTH_SECRET,

    // Public keys that are exposed to the client.
    public: {
      apiBaseURL: process.env.NUXT_PUBLIC_API_BASE_URL || "/api",
      apiContentBaseURL: process.env.NUXT_PUBLIC_CONTENT_API_BASE_URL,
      websiteURL: process.env.NUXT_PUBLIC_WEBSITE_BASE_URL,
      fileUploadUrl: process.env.FILE_UPLOAD_SERVICE_URL
    },
  },
  components: {
    dirs: [
      {
        path: "@/@core/components",
        pathPrefix: false,
      },
      {
        path: "~/components/global",
        global: true,
      },
      {
        path: "~/components",
        pathPrefix: false,
      },
    ],
  },

  plugins: [
    "@/plugins/casl/index.ts",
    "@/plugins/vuetify/index.ts",
    "@/plugins/i18n/index.ts",
    "@/plugins/iconify/index.ts",
  ],

  imports: {
    dirs: ["./@core/utils", "./@core/composable/", "./plugins/*/composables/*"],
    presets: ["vue-i18n"],
  },

  hooks: {},

  experimental: {
    typedPages: true,
  },

  typescript: {
    tsConfig: {
      compilerOptions: {
        paths: {
          "@/*": ["../*"],
          "@themeConfig": ["../themeConfig.ts"],
          "@layouts/*": ["../@layouts/*"],
          "@layouts": ["../@layouts"],
          "@core/*": ["../@core/*"],
          "@core": ["../@core"],
          "@images/*": ["../assets/images/*"],
          "@styles/*": ["../assets/styles/*"],
          "@validators": ["../@core/utils/validators"],
          "@db/*": ["../server/fake-db/*"],
          "@api-utils/*": ["../server/utils/*"],
        },
      },
    },
  },

  // ℹ️ Disable source maps until this is resolved: https://github.com/vuetifyjs/vuetify-loader/issues/290
  sourcemap: {
    server: false,
    client: false,
  },

  vue: {
    compilerOptions: {
      isCustomElement: (tag) =>
        tag === "swiper-container" || tag === "swiper-slide",
    },
  },

  vite: {
    define: { "process.env": {} },

    resolve: {
      alias: {
        "@": fileURLToPath(new URL(".", import.meta.url)),
        "@themeConfig": fileURLToPath(
          new URL("./themeConfig.ts", import.meta.url)
        ),
        "@core": fileURLToPath(new URL("./@core", import.meta.url)),
        "@layouts": fileURLToPath(new URL("./@layouts", import.meta.url)),
        "@images": fileURLToPath(new URL("./assets/images/", import.meta.url)),
        "@styles": fileURLToPath(new URL("./assets/styles/", import.meta.url)),
        "@configured-variables": fileURLToPath(
          new URL("./assets/styles/variables/_template.scss", import.meta.url)
        ),
        "@db": fileURLToPath(new URL("./server/fake-db/", import.meta.url)),
        "@api-utils": fileURLToPath(
          new URL("./server/utils/", import.meta.url)
        ),
      },
    },

    build: {
      chunkSizeWarningLimit: 5000,
    },

    optimizeDeps: {
      exclude: ["vuetify"],
      entries: ["./**/*.vue"],
    },

    plugins: [
      svgLoader(),
      vuetify({
        styles: {
          configFile: "assets/styles/variables/_vuetify.scss",
        },
      }),
      VueI18nPlugin({
        runtimeOnly: true,
        compositionOnly: true,
        ssr: true,
        include: [
          fileURLToPath(new URL("./plugins/i18n/locales/**", import.meta.url)),
        ],
      }),
    ],
  },

  build: {
    transpile: ["vuetify"],
  },

  modules: ["@vueuse/nuxt", "@nuxtjs/device", "@pinia/nuxt"],
});
