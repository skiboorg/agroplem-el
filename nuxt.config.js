export default {
  env: {
        img_url: 'http://localhost:8000/'

    },
  //  server: {
  //   port: 3000, // default: 3000
  //   host: '185.235.128.23' // default: localhost
  // },
  // Global page headers (https://go.nuxtjs.dev/config-head)
  head: {
    title: 'agroplem-el',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS (https://go.nuxtjs.dev/config-css)
  css: [
     'element-ui/lib/theme-chalk/index.css',
    '@/assets/main.sass',
  ],

  // Plugins to run before rendering page (https://go.nuxtjs.dev/config-plugins)
  plugins: [
    '@/plugins/element-ui'
  ],

  // Auto import components (https://go.nuxtjs.dev/config-components)
  components: true,

  // Modules for dev and build (recommended) (https://go.nuxtjs.dev/config-modules)
  buildModules: [
  ],

  // Modules (https://go.nuxtjs.dev/config-modules)
  modules: [
    // https://go.nuxtjs.dev/axios
    '@nuxtjs/axios',
    '@nuxtjs/auth',
  ],

  // Axios module configuration (https://go.nuxtjs.dev/config-axios)
  axios: {
    baseURL:'http://localhost:8000'
  },

  // Build Configuration (https://go.nuxtjs.dev/config-build)
  build: {
    transpile: [/^element-ui/],
  },
   auth: {
  strategies: {
    local: {
      endpoints: {
        login: { url: '/auth/token/login/', method: 'post', propertyName: 'auth_token' },
        logout: { url: '/auth/token/logout/', method: 'post' },
        user: { url: '/api/v1/user/me/', method: 'get', propertyName: false }
      },
      // tokenRequired: true,
      tokenType: 'Token',
      // globalToken: true,
      //autoFetchUser: false
    }
  }
}
}
