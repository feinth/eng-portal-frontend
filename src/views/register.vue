<template>
  <q-dialog :model-value="localVisible" @update:modelValue="updateVisibility">
    <q-card>
      <div
        class="max-w-lg mx-auto bg-white rounded-lg shadow-md px-8 py-10 flex flex-col items-center"
      >
        <h1 class="text-xl font-bold text-center text-gray-700 mb-8">
          Форма регистрации
        </h1>
        <q-form @submit.stop="onSubmit">
          <q-input
            v-model="user.email"
            type="text"
            label="Email"
            lazy-rules
            :rules="[emailRule]"
            class="no-autofill"
          />
          <q-input
            v-model="user.firstName"
            type="text"
            label="Имя"
            lazy-rules
            :rules="[requiredRule]"
            class="no-autofill"
          />
          <q-input
            v-model="user.lastName"
            type="text"
            label="Фамилия"
            lazy-rules
            :rules="[requiredRule]"
            class="no-autofill"
          />
          <q-input
            v-model="user.birthday"
            type="date"
            label="Дата рождения"
            lazy-rules
            :rules="[birthdayRule]"
            class="no-autofill"
          />
          <q-input
            v-model="user.password"
            type="password"
            label="Пароль"
            lazy-rules
            :rules="[requiredRule]"
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
import { useQuasar } from 'quasar'
import Agreement from '../components/agreement-terms.vue'

export default {
  name: 'Register',
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        birthday: '',
        email: '',
        password: '',
        localVisible: this.isVisible
      },
      store: useUserStore(),
      $q: useQuasar()
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onSubmit() {
      this.store
        .register(this.user)
        .then(() => {
          this.updateVisibility(false)
          this.$emit('registration-success')
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'positive',
            message: 'Регистрация прошла успешно!',
            timeout: 1000,
            icon: 'sym_o_check'
          })
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
    emailRule(val) {
      return (
        (val && val.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ||
        'Проверьте корректность введенного значения'
      )
    },
    birthdayRule(val) {
      return (
        (val && val.length > 0 && this.isValidDate(val)) ||
        'Проверьте корректность введенного значения'
      )
    },
    requiredRule(val) {
      return (val && val.length > 0) || 'Обязательное поле'
    },
    isValidDate(date) {
      return true // Здесь можно добавить проверку на корректность даты
    },
    showAgreementDialog() {
      this.$q.dialog({
        component: Agreement
      })
    },
    updateVisibility(newValue) {
      this.localVisible = newValue
      this.$emit('update:isVisible', newValue)
    }
  },
  watch: {
    isVisible(newValue) {
      this.localVisible = newValue
    }
  }
}
</script>

<style></style>
