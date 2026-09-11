<template>
  <!-- q-layout должен быть КОРНЕВЫМ элементом, без обертки в div -->
  <q-layout view="lHh Lpr lFf">

    <!-- Хедер: используем наш пастельный primary цвет -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <div class="flex items-center justify-center text-center w-full">
          <q-tabs align="center" dense>
            <q-route-tab label="Главная" to="/" no-caps />
            <q-route-tab label="Симулятор экзамена" to="/select" no-caps />
            <q-route-tab v-if="isLoggedIn" label="Личный кабинет" to="/profile" no-caps />
            <q-space />
            <q-route-tab v-if="!isLoggedIn" label="Авторизация" to="/login" no-caps />
          </q-tabs>
        </div>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot />
    </q-page-container>

    <!-- ИЗМЕНЕНИЕ: убрали 'reveal', добавили 'v-model="footerVisible"' -->
    <q-footer v-if="shouldShowFooter" v-model="footerVisible" elevated class="bg-white text-grey-8">
      <!-- Строка 1: автор + соцсети -->
      <div class="flex items-center justify-center q-py-md q-px-md">
        <p class="q-mr-md text-caption">Автор: Захарова Татьяна</p>

        <div class="flex items-center social-icons">
          <span class="social-link">
            <a class="ic--baseline-telegram" href="https://t.me/TA_eng_teacher" target="_blank"
              aria-label="Написать мне в Telegram" />
            <q-tooltip class="social-tooltip" anchor="top middle" self="bottom middle" :delay="150">
              Написать мне в Telegram
            </q-tooltip>
          </span>

          <span class="social-link">
            <a class="mdi--vk" href="https://vk.ru/id11068353" target="_blank" aria-label="Написать мне в ВКонтакте" />
            <q-tooltip class="social-tooltip" anchor="top middle" self="bottom middle" :delay="150">
              Написать мне в ВКонтакте
            </q-tooltip>
          </span>



          <span class="social-link">
            <a class="ic--max-messenger" href="https://max.ru/" target="_blank" aria-label="Написать мне в MAX" />
            <q-tooltip class="social-tooltip" anchor="top middle" self="bottom middle" :delay="150">
              Написать мне в MAX
            </q-tooltip>
          </span>
        </div>
      </div>

      <!-- Строка 2: НОВОЕ — дисклеймер -->
      <div class="flex justify-center q-px-lg q-pb-sm">
        <p class="disclaimer-line text-center">
          Некоммерческий образовательный проект. Создан учителем-энтузиастом
          для помощи школьникам и не аффилирован с ФГБНУ «ФИПИ»
        </p>
      </div>

      <!-- Строка 3: соглашение + копирайт -->
      <div class="flex items-center justify-center q-pb-md text-caption text-grey-6">
        <a @click="showAgreementDialog" class="text-primary cursor-pointer hover:underline q-mr-md">
          Пользовательское соглашение
        </a>
        <p>{{ new Date().getFullYear() }} © Все права защищены</p>
      </div>
    </q-footer>

  </q-layout>
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
      showLogin: false,
      footerVisible: false,
      lastScrollY: 0,
      isPinnedToBottom: false // находимся ли мы сейчас в самом низу страницы
    }
  },
  methods: {
    showAgreementDialog() {
      this.$q.dialog({
        component: Agreement
      })
    },
    handleScroll() {
      const currentScrollY = window.scrollY

      // Полная высота страницы и проверка "в самом ли мы низу"
      const scrollHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight
      )
      const isAtBottom = window.innerHeight + currentScrollY >= scrollHeight - 1

      if (isAtBottom) {
        // У самого низа подвал всегда виден
        this.isPinnedToBottom = true
        this.footerVisible = true
      } else {
        this.isPinnedToBottom = false

        // Скроллим вверх — показываем
        if (currentScrollY < this.lastScrollY) {
          this.footerVisible = true
        }
        // Скроллим вниз — прячем
        else if (currentScrollY > this.lastScrollY) {
          this.footerVisible = false
        }
      }

      this.lastScrollY = currentScrollY
    }
  },
  watch: {
    // Когда подвал появляется, находясь у самого низа,
    // докручиваем страницу до нового упора — так он не заезжает на контент
    footerVisible(visible) {
      if (visible && this.isPinnedToBottom) {
        this.$nextTick(() => {
          requestAnimationFrame(() => {
            const maxScroll = Math.max(
              document.body.scrollHeight,
              document.documentElement.scrollHeight
            )
            window.scrollTo({ top: maxScroll })
          })
        })
      }
    }
  },
  computed: {
    isLoggedIn() {
      return !!this.store.token
    },
    shouldShowFooter() {
      const hiddenRoutes = ['/login', '/register', '/profile']
      return !hiddenRoutes.includes(this.$route.path)
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll, { passive: true })
    // Начальная проверка: если страница короткая, подвал виден сразу
    this.handleScroll()
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleScroll)
  }
}
</script>

<style scoped>
.social-icons a {
  color: #9E9E9E;
  margin: 0 8px;
  transition: all 0.2s ease;
}

.social-icons a:hover {
  color: var(--q-primary);
  transform: translateY(-2px);
}

.mdi--vk,
.ic--baseline-telegram,
.ic--max-messenger {
  display: inline-block;
  width: 1.5em;
  height: 1.5em;
  background-color: currentColor;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  mask-size: 100% 100%;
}

.mdi--vk {
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath d='M15.07 2H8.93C3.33 2 2 3.33 2 8.93v6.14C2 20.67 3.33 22 8.93 22h6.14c5.6 0 6.93-1.33 6.93-6.93V8.93C22 3.33 20.67 2 15.07 2m3.08 14.27h-1.46c-.55 0-.72-.45-1.69-1.44c-.88-.83-1.26-.95-1.47-.95c-.29 0-.38.08-.38.5v1.31c0 .35-.11.57-1.04.57c-1.54 0-3.25-.94-4.45-2.67c-1.81-2.54-2.3-4.46-2.3-4.84c0-.21.07-.41.49-.41h1.47c.37 0 .51.16.65.56c.72 2.1 1.92 3.9 2.41 3.9c.19 0 .27-.09.27-.55V10.1c-.05-.98-.58-1.07-.58-1.42c0-.18.14-.34.37-.34h2.29c.31 0 .42.16.42.54v2.89c0 .31.13.42.23.42c.18 0 .34-.11.67-.45c1.05-1.17 1.8-2.98 1.8-2.98c.1-.21.26-.41.65-.41h1.43c.44 0 .54.23.44.54c-.18.85-1.96 3.36-1.94 3.36c-.16.25-.22.36 0 .65c.15.21.66.65 1 1.04c.62.71 1.1 1.3 1.23 1.71c.11.41-.09.62-.51.62z' fill='%23000'/%3E%3C/svg%3E");
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
}

.ic--baseline-telegram {
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19c-.14.75-.42 1-.68 1.03c-.58.05-1.02-.38-1.58-.75c-.88-.58-1.38-.94-2.23-1.5c-.99-.65-.35-1.01.22-1.59c.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02c-.09.02-1.49.95-4.22 2.79c-.4.27-.76.41-1.08.4c-.36-.01-1.04-.2-1.55-.37c-.63-.2-1.12-.31-1.08-.66c.02-.18.27-.36.74-.55c2.92-1.27 4.86-2.11 5.83-2.51c2.78-1.16 3.35-1.36 3.73-1.36c.08 0 .27.02.39.12c.1.08.13.19.14.27c-.01.06.01.24 0 .38'/%3E%3C/svg%3E");
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
}

.ic--max-messenger {
  --svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23000' d='M5.1 20.8Q6.2 19.4 8.4 18.8A8.3 8.3 0 1 0 4.4 13.2Q5.2 17 5.1 20.8Z M12.5 6.95a4.55 4.55 0 1 1 0 9.1a4.55 4.55 0 1 1 0-9.1Z'/%3E%3C/svg%3E");
  -webkit-mask-image: var(--svg);
  mask-image: var(--svg);
}

.disclaimer-line {
  max-width: 900px;
  font-size: 0.65rem;
  line-height: 1;
  color: #9E9E9E;
  margin: 0;
}

.disclaimer-line a {
  color: var(--q-primary);
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
  transition: border-color 0.2s ease;
}

.disclaimer-line a:hover {
  border-bottom-style: solid;
}

/* Обёртка иконки: к ней цепляется тултип, отступы переезжают сюда */
.social-link {
  display: inline-flex;
  margin: 0 8px;
}

/* У самих ссылок отступы больше не нужны */
.social-icons a {
  color: #9E9E9E;
  margin: 0;
  transition: all 0.2s ease;
}

.social-icons a:hover {
  color: var(--q-primary);
  transform: translateY(-2px);
}

/* Оформление подсказки */
.social-tooltip {
  background: #2B2D42;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 8px;
  box-shadow: 0 4px 14px rgba(43, 45, 66, 0.3);
}
</style>