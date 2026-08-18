import { createRouter, createWebHistory } from 'vue-router'
import PortalLayout from '../layouts/portal-layout.vue'
import TrainerLayout from '../layouts/trainer-layout.vue'
import { useUserStore } from '../stores/user.store'
import { trackPageView } from '../plugins/metrika'

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
})