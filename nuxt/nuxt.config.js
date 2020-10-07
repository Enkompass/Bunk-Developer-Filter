export default {
  /*
  ** Nuxt rendering mode
  ** See https://nuxtjs.org/api/configuration-mode
  */
  env: {
    SOCKET_BASE_URL: process.env.SOCKET_BASE || 'http://127.0.0.1:5001'
  },
  mode: 'universal',
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 3000
  },
  /*
  ** Nuxt target
  ** See https://nuxtjs.org/api/configuration-target
  */
  target: 'server',
  /*
  ** Headers of the page
  ** See https://nuxtjs.org/api/configuration-head
  */
  head: {
    htmlAttrs: {
      lang: 'ja'
    },
    titleTemplate: '%s | DELIVOW',
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' },
      { name: 'msapplication-TileColor', content: '#da532c' }
    ],
    link: [
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
      { rel: 'preload', href: '/fonts/stylesheet.css', as: 'style' },
      { rel: 'stylesheet', href: '/fonts/stylesheet.css' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  // loading: '~/components/loading.vue',
  loading: {
    color: '#3B8070', throttle: 0, height: '3px'
  },
  /*
  ** Global CSS
  */
  css: [
    '@mdi/font/css/materialdesignicons.css',
    '~/assets/scss/app.scss'
  ],
  /*
  ** Plugins to load before mounting the App
  ** https://nuxtjs.org/guide/plugins
  */
  plugins: [
    '~/plugins/i18n.js',
    '~/plugins/axios',
    '~/plugins/bus',
    '~/plugins/filters',
    '~/plugins/echarts',
    { src: '~/plugins/socket.io', mode: 'client' },
    { src: '~/plugins/components', ssr: false }
  ],
  /*
  ** Auto import components
  ** See https://nuxtjs.org/api/configuration-components
  */
  components: true,
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxtjs/vuetify',
    '@nuxtjs/moment'
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/auth',
    '@nuxtjs/pwa',
    'nuxt-izitoast',
    ['nuxt-fontawesome', {
      imports: [
        {
          set: '@fortawesome/free-solid-svg-icons',
          icons: ['fas']
        },
        {
          set: '@fortawesome/free-brands-svg-icons',
          icons: ['fab']
        }
      ]
    }],
    ['nuxt-gmaps', {
      key: process.env.GMAP_API_KEY
    }]
  ],
  izitoast: {
    position: 'bottomRight',
    transitionIn: 'bounceInLeft',
    transitionOut: 'fadeOutRight'
  },
  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {
    proxy: true,
    prefix: '/api/v1'
  },

  proxy: {
    '/api/v1/store': {
      target: 'http://127.0.0.1:5000'
    },
    '/api/v1/admin': {
      target: 'http://127.0.0.1:5000'
    },
    '/api/v1': {
      target: 'http://127.0.0.1:5000'
    }
  },
  /*
  ** vuetify module configuration
  ** https://github.com/nuxt-community/vuetify-module
  */
  vuetify: {
    defaultAssets: false,
    treeShake: true,
    customVariables: ['~/assets/scss/_variables.scss'],
    theme: {
      light: true,
      themes: {
        light: {
          primary: '#0E1D3B', // a color that is not in the material colors palette
          accent: '#848484',
          secondary: '#0D7684',
          info: '#1976D2',
          error: '#CE082E',
          success: '#4CAF50',
          warning: '#9D931F'
        }
      }
    }
  },
  auth: {
    strategies: {
      local: {
        endpoints: {
          login: { url: '/store/auth/login/', method: 'post', propertyName: 'accessToken' },
          logout: { url: '/store/auth/logout/', method: 'post' },
          user: { url: '/store/auth/user', method: 'get', propertyName: false }
        },
        tokenType: 'Bearer'
      }
    },
    localStorage: {
      prefix: 'auth.'
    },
    redirect: {
      login: '/auth/login',
      home: '/',
      logout: '/auth/login'
    }
  },
  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
    transpile: ['vuetify', 'vue-echarts', 'resize-detector']
  }
}
