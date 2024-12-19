<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar class="bg-teal-9">
          <div class="flex items-center justify-center text-center w-full">
            <q-tabs>
              <q-route-tab label="Главная" to="/" no-caps />
              <q-route-tab label="Симулятор экзамена" to="/select" no-caps />
              <q-route-tab
                v-if="isLoggedIn"
                label="Личный кабинет"
                to="/profile"
                no-caps
              />
              <q-space />
              <q-route-tab
                v-if="!isLoggedIn"
                label="Авторизация"
                to="/login"
                no-caps
              />
            </q-tabs>
          </div>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <slot />
      </q-page-container>
      <q-footer v-if="shouldShowFooter" reveal>
        <div
          class="flex items-center justify-center text-center bg-teal-10 text-white-400"
        >
          <p class="m-2">Автор: Захарова Татьяна</p>
          <a class="mdi--vk" href="https://vk.ru" target="_blank" />
          <a
            class="ic--baseline-telegram"
            href="https://t.me/TA_eng_teacher"
            target="_blank"
          />
          <a class="mdi--youtube" href="https://youtube.com" target="_blank" />
        </div>
        <div
          class="flex items-center justify-center text-center bg-teal-10 text-white-400"
        >
          <a
            @click="showAgreementDialog"
            class="text-blue-500 hover:text-blue-600"
            >Пользовательское соглашение</a
          >
          <p class="m-2">
            {{ new Date().getFullYear() }} © Все права защищены
          </p>
        </div>
      </q-footer>
    </q-layout>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user.store'
import LoginForm from '../views/login.vue'
import Agreement from '../components/utils/agreement-terms.vue'

export default {
  name: 'PortalLayout',

  components: {
    LoginForm,
    Agreement
  },
  data() {
    return {
      store: useUserStore(),
      footerPath: ['/', '/profile'],
      showLogin: false
    }
  },
  methods: {
    showAgreementDialog() {
      this.$q.dialog({
        component: Agreement
      })
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.store.token
    },
    shouldShowFooter() {
      return true
    }
  }
}
</script>

<style scoped>
/* Дополнительные стили для улучшения внешнего вида */
.mdi--vk {
  display: inline-block;
  width: 2em;
  height: 2em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2m3.08 14.27h-1.46c-.55 0-.72-.45-1.69-1.44c-.88-.83-1.26-.95-1.47-.95c-.29 0-.38.08-.38.5v1.31c0 .35-.11.57-1.04.57c-1.54 0-3.25-.94-4.45-2.67c-1.81-2.54-2.3-4.46-2.3-4.84c0-.21.07-.41.49-.41h1.47c.37 0 .51.16.65.56c.72 2.1 1.92 3.9 2.41 3.9c.19 0 .27-.09.27-.55V10.1c-.05-.98-.58-1.07-.58-1.42c0-.18.14-.34.37-.34h2.29c.31 0 .42.16.42.54v2.89c0 .31.13.42.23.42c.18 0 .34-.11.67-.45c1.05-1.17 1.8-2.98 1.8-2.98c.1-.21.26-.41.65-.41h1.43c.44 0 .54.23.44.54c-.18.85-1.96 3.36-1.94 3.36c-.16.25-.22.36 0 .65c.15.21.66.65 1 1.04c.62.71 1.1 1.3 1.23 1.71c.11.41-.09.62-.51.62z' fill='%23000'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
.ic--baseline-telegram {
  display: inline-block;
  width: 2em;
  height: 2em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
.mdi--youtube {
  display: inline-block;
  width: 2em;
  height: 2em;
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73'/%3E%3C/svg%3E");
  background-color: currentColor;
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}
</style>
