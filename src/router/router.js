import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '../stores/user.store'
import PortalLayout from '../layouts/portal-layout.vue'

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
      component: () => import('../components/test-micro.vue'),
      meta: {
        layout: PortalLayout
      }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../components/user-profile.vue'),
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
