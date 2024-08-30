import { createRouter, createWebHistory } from 'vue-router'
import PortalLayout from '../layouts/portal-layout.vue'
import TrainerLayout from '../layouts/trainer-layout.vue'

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
      path: '/training',
      name: 'training',
      component: () => import('../components/trainer-main.vue'),
      meta: {
        layout: TrainerLayout
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../components/user-profile.vue'),
      meta: {
        layout: PortalLayout
      }
    },
    {
      path: '/test',
      name: 'test',
      component: () => import('../components/microphone-test.vue'),
      meta: {
        layout: PortalLayout
      }
    }
  ]
})

// router.beforeEach(async (to) => {
//   const publicPages = ['/login']
//   const authRequired = !publicPages.includes(to.path)
//   const store = useUserStore()
//   if (authRequired && !store.user) {
//     return '/login'
//   }
// })
