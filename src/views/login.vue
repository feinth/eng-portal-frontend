<template>
  <q-dialog :model-value="localVisible" @update:modelValue="updateVisibility">
    <q-card>
      <div
        class="max-w-lg mx-auto bg-white rounded-lg shadow-md px-8 py-10 flex flex-col items-center"
      >
        <h1 class="text-xl font-bold text-center text-gray-700 mb-8">
          Форма входа
        </h1>
        <q-form @submit.stop="onSubmit">
          <q-input
            v-model="email"
            type="text"
            label="Почта"
            lazy-rules
            :rules="emailRules"
            class="no-autofill"
          />
          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Пароль"
            lazy-rules
            :rules="passwordRules"
            class="no-autofill"
          >
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              ></q-icon>
            </template>
          </q-input>
          <q-btn
            unelevated
            color="primary"
            class="full-width"
            label="Войти"
            type="submit"
          />
          <div class="mt-4 text-center">
            У вас нет учетной записи?
            <a
              @click="registerAction()"
              class="text-blue-500 hover:text-blue-600"
              >Зарегистрируйтесь!</a
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
import RegisterForm from '../views/register.vue'
export default {
  name: 'Login',
  components: {
    RegisterForm
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      email: '',
      password: '',
      isPwd: true,
      localVisible: this.isVisible,
      store: useUserStore(),
      emailRules: [
        (val) =>
          (val && val.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ||
          'Почта обязательна'
      ],
      passwordRules: [(val) => (val && val.length > 0) || 'Пароль обязателен'],
      $q: useQuasar
    }
  },
  watch: {
    isVisible(newValue) {
      this.localVisible = newValue
    }
  },
  methods: {
    updateVisibility(newValue) {
      this.localVisible = newValue
      this.$emit('update:isVisible', newValue)
    },
    onSubmit() {
      this.store
        .login(this.email, this.password)
        .then(() => {
          this.updateVisibility(false)
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'positive',
            message: 'Успешно',
            timeout: 1000,
            icon: 'sym_o_check'
          })
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
    registerAction() {
      this.$q.dialog({
        component: RegisterForm,
        parent: this,
        on: {
          'registration-success': this.closeBothDialogs
        }
      })
    },
    closeBothDialogs() {
      this.updateVisibility(false)
    }
  }
}
</script>
<style></style>
