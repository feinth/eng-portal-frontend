<template>
  <div>
    <q-page>
      <!-- Выполненные задания -->
      <div class="q-pa-md q-gutter-md">
        <UserAnswers  />
      </div>
      <div class="q-pa-md row items-start q-gutter-md">

        <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">

          <q-inner-loading v-if="!dataLoaded" :showing="!dataLoaded" label="Пожалуйста, подождите..." />
          <q-card v-else-if="dataLoaded" class="items-center center">

            <q-card-section>
              <div class="text-h6"> {{ `Данные о пользователе: ${user.email}`}} </div>
              <q-separator />
              <q-form class="q-gutter-md">
                <q-input filled v-model="user.first_name" label="Имя" />
                <q-input filled v-model="user.second_name" label="Фамилия" />
                <q-input filled v-model="user.birthdate" type="date" label="Дата рождения" class="no-autofill" />
                <q-input filled v-model="user.phone" label="Телефон" />

                <q-btn-group spread>
                  <q-btn label="Обновить информацию" color="primary" @click="updateUserData" />
                  <q-btn label="Выйти из аккаунта" color="red" @click="logout" />
                </q-btn-group>
              </q-form>
            </q-card-section>
          </q-card>
        </div>
      </div>
    </q-page>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user.store'
import { router } from '../router/router'
import UserAnswers from './user-answers.vue'
export default {
  components: {
    UserAnswers
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

<style scoped></style>
