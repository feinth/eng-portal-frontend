import { createRouter, createWebHistory } from 'vue-router'
import PortalLayout from '../layouts/portal-layout.vue'
import TrainerLayout from '../layouts/trainer-layout.vue'
import { useUserStore } from '../stores/user.store'
import { trackPageView } from '../plugins/metrika'


const PAGE_META = {
  '/': {
    title: 'Тренажёр устной части ОГЭ и ЕГЭ по английскому языку — EnglishPortal',
    description: 'Онлайн-тренажёр устной части ОГЭ и ЕГЭ по английскому: таймер, запись ответов, формат настоящего экзамена.'
  },
  '/select': {
    title: 'Выбор экзамена — ОГЭ и ЕГЭ по английскому | EnglishPortal',
    description: 'Выбери экзамен: ОГЭ или ЕГЭ, вариант из банка или случайная генерация, тренировка по отдельным заданиям.'
  },
  '/login': {
    title: 'Вход — EnglishPortal',
    description: 'Войди в аккаунт, чтобы сохранять результаты тренировок.'
  }
}

function setMetaTag(attr, name, content) {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

export const router = createRouter({
  history: createWebHistory('/'),
  routes: [
    {
      path: '/',
      name: 'index',
      component: () => import('../views/main.vue'),
      meta: {
        layout: PortalLayout
      }
    },
    {
      path: '/select',
      name: 'select',
      component: () => import('../views/select-exam.vue'),
      meta: {
        layout: TrainerLayout
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/user-profile.vue'),
      meta: {
        layout: PortalLayout
      }
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/login.vue'),
      meta: {
        layout: PortalLayout
      }
    },
    {
      path: '/exam',
      name: 'exam',
      component: () => import('../views/exam.vue'),
      meta: {
        layout: TrainerLayout
      }
    },
    {
      path: '/payment',
      name: 'payment',
      component: () => import('../views/payment-page.vue'),
      meta: {
        layout: PortalLayout
      }
    },
  ]
})

router.beforeEach(async (to) => {
  const publicPages = ['/', '/training', '/login']
  const authPages = ['/profile']
  const authRequired = authPages.includes(to.path)
  const store = useUserStore()
  if (authRequired && !store.token) {
    return '/login'
  }
})

let isFirstNavigation = true

router.afterEach((to) => {
  // Бонус: обновляем заголовок вкладки из meta
  if (to.meta.title) {
    document.title = to.meta.title
  }

  if (isFirstNavigation) {
    isFirstNavigation = false
    return
  }

  trackPageView(to)

    const meta = PAGE_META[to.path]
  if (!meta) return

  document.title = meta.title
  setMetaTag('name', 'description', meta.description)
  setMetaTag('property', 'og:title', meta.title)
  setMetaTag('property', 'og:description', meta.description)
  setMetaTag('property', 'og:url', `https://englishportal.ru${to.path}`)
})