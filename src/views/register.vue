<template>
  <q-dialog>
    <q-card>
      <div
        class="max-w-lg mx-auto bg-white rounded-lg shadow-md px-8 py-10 flex flex-col items-center"
      >
        <h1 class="text-xl font-bold text-center text-gray-700 mb-8">
          Форма регистрации
        </h1>
        <q-form @submit.stop="onSubmit">
          <q-input
            v-model="email"
            type="text"
            label="Email"
            lazy-rules
            :rules="emailRules"
            class="no-autofill"
          />
          <q-input
            v-model="firstName"
            type="text"
            label="Имя"
            lazy-rules
            :rules="defaultRules"
            class="no-autofill"
          />
          <q-input
            v-model="lastName"
            type="text"
            label="Фамилия"
            lazy-rules
            :rules="defaultRules"
            class="no-autofill"
          />

          <q-input
            v-model="birthday"
            type="date"
            label="Дата рождения"
            lazy-rules
            :rules="birthdayRules"
            class="no-autofill"
          />
          <!-- <q-input
        v-model="username"
        type="text"
        label="Логин"
        lazy-rules
        :rules="defaultRules"
        class="no-autofill"
      /> -->
          <q-input
            v-model="password"
            type="password"
            label="Пароль"
            lazy-rules
            :rules="defaultRules"
            class="no-autofill"
          />
          <q-btn
            unelevated
            color="primary"
            class="full-width"
            label="Регистрация"
            type="submit"
          />
          <div class="mt-4 text-center">
            Нажимая «Регистрация», вы принимаете
            <a
              @click="showAgreementDialog"
              class="text-blue-500 hover:text-blue-600"
              >пользовательское соглашение</a
            >
          </div>
        </q-form>
      </div>
    </q-card>
  </q-dialog>
</template>

<script>
import { useUserStore } from '../stores/user.store'
import { router } from '../router/router'
import { useQuasar } from 'quasar'
import Agreement from '../components/agreement-terms.vue'
export default {
  name: 'Register',
  data() {
    return {
      firstName: '',
      lastName: '',
      birthday: '',
      email: '',
      username: '',
      password: '',
      isPwd: true,
      store: useUserStore(),
      defaultRules: [(val) => (val && val.length > 0) || 'Обязательное поле'],
      birthdayRules: [
        (val) =>
          (val && val.length > 0 && this.isValidDate(val)) ||
          'Проверьте корректность введенного значения'
      ],
      emailRules: [
        (val) =>
          (val && val.length > 0 && this.isValidEmail(val)) ||
          'Проверьте корректность введенного значения'
      ],
      $q: useQuasar
    }
  },
  methods: {
    onSubmit() {
      this.store
        .registerUser()
        .then(() => {
          router.push('/')
        })
        .catch((err) => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'negative',
            message: err.response.data,
            timeout: 1000,
            icon: 'sym_o_warning'
          })
        })
    },
    isValidEmail(email) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    },
    isValidDate(date) {
      return true
    },
    showAgreementDialog() {
      this.$q.dialog({
        component: Agreement
      })
    }
  }
}
</script>
<style></style>
