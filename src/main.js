// 1. Иконки Quasar (один раз)
import '@quasar/extras/material-icons/material-icons.css'
import '@quasar/extras/material-symbols-outlined/material-symbols-outlined.css'

// 2. Quasar CSS (должен быть ДО Tailwind, чтобы Tailwind мог его переопределить)
import 'quasar/src/css/index.sass'

// 3. Ваши глобальные стили (Tailwind + кастомные CSS-переменные)
import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'
import { Quasar, Notify, Dialog } from 'quasar'
import quasarLang from 'quasar/lang/ru'
import storeWatcherPlugin from './plugins/store.watcher'
import { router } from './router/router'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(Quasar, {
  plugins: [Notify, Dialog],
  lang: quasarLang,
  config: {
    notify: {}
  }
})
app.use(storeWatcherPlugin)
app.mount('#app')