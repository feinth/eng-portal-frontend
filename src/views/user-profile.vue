<template>
  <div>
    <q-page>
      <div v-if="user" class="q-pa-md q-gutter-md">
        <UserInfo :user="user" />
      </div>
      <div class="q-pa-md q-gutter-md">
        <UserAnswers />
      </div>
      <!-- <div v-if="user" class="q-pa-md q-gutter-md">
        <SubscriptionComponent :user="user" />
      </div> -->
    </q-page>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user.store'
import { router } from '../router/router'
import UserAnswers from './user-answers.vue'
import UserInfo from './user-info.vue'
import SubscriptionComponent from './user-subscription.vue'

export default {
  components: {
    UserAnswers,
    SubscriptionComponent,
    UserInfo
  },
  data() {
    return {
      store: useUserStore(),
      user: null,
      dataLoaded: false,
      router: router
    }
  },
  methods: {
    fetchData() {
      this.store
        .getUserData()
        .then((result) => {
          this.user = result
          this.dataLoaded = true
        })
        .catch((err) => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'negative',
            message: 'Ошибка при получении данных, попробуйте позже',
            timeout: 2000,
            icon: 'sym_o_warning'
          })
        })
    },
    updateUserData() {
      this.store
        .updateUserData(this.user)
        .then((result) => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'positive',
            message: 'Обновлено',
            timeout: 1000,
            icon: 'sym_o_check'
          })
        })
        .catch((err) => { })
    },
    logout() {
      this.store.logout().then((result) => {
        this.router.push('/')
      })
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
@media (min-width: 768px) {
  .q-card {
    height: 100%;
  }
}
</style>