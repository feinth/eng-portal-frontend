import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog } from 'quasar'
import quasarLang from 'quasar/lang/ru'
//import { date } from 'quasar'
import storeWatcherPlugin from './plugins/store.watcher'
import { router } from './router/router'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'
// Import Quasar css
import 'quasar/src/css/index.sass'

import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: {},
  lang: quasarLang,
  plugins: [Notify, Dialog],
  config: {
    notify: {}
  }
})
app.use(storeWatcherPlugin)
app.mount('#app')
