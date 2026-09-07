<template>
  <div class="login-container">
    <q-card class="login-card">
      <q-card-section class="q-pa-xl">
        
        <div class="text-center q-mb-xl">
          <h1 class="text-h5 text-weight-bold text-grey-9 q-mb-sm">
            Форма входа
          </h1>
          <p class="text-caption text-grey-6">
            Войдите в свой аккаунт для продолжения
          </p>
        </div>

        <!-- Форма -->
        <q-form @submit.stop="onSubmit" class="q-gutter-md">
          
          <q-input
            v-model="email"
            type="email"
            label="Почта"
            outlined
            lazy-rules
            hide-bottom-space
            :rules="emailRules"
            class="full-width no-autofill"
          >
            <template v-slot:prepend>
              <q-icon name="sym_o_mail" />
            </template>
          </q-input>

          <q-input
            v-model="password"
            :type="isPwd ? 'password' : 'text'"
            label="Пароль"
            outlined
            lazy-rules
            hide-bottom-space
            :rules="passwordRules"
            class="full-width no-autofill"
          >
            <template v-slot:prepend>
              <q-icon name="sym_o_lock" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd"
              />
            </template>
          </q-input>

          <!-- Кнопка входа -->
          <q-btn
            unelevated
            color="primary"
            class="full-width q-mt-md login-btn"
            label="Войти"
            type="submit"
          />

          <!-- Ссылка на регистрацию -->
          <div class="text-center q-mt-lg">
            <span class="text-grey-7">У вас нет учетной записи? </span>
            <a 
              @click="registerAction()" 
              class="register-link cursor-pointer"
            >
              Зарегистрируйтесь!
            </a>
          </div>

        </q-form>
      </q-card-section>
    </q-card>
  </div>
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
      router: router,
      emailRules: [
        (val) =>
          (val && val.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ||
          'Почта обязательна'
      ],
      passwordRules: [(val) => (val && val.length > 0) || 'Пароль обязателен']
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
            message: 'Вход выполнен успешно',
            timeout: 1000,
            icon: 'sym_o_check'
          })
          this.router.push('/')
        })
        .catch((err) => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'negative',
            message: 'Неправильный логин или пароль',
            timeout: 1000,
            icon: 'sym_o_warning'
          })
        })
    },
    registerAction() {
      this.$q.dialog({
        component: RegisterForm,
        parent: this
      })
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  padding: 1rem;
}

:deep(.login-card) {
  width: 100%;
  max-width: 450px;
  border-radius: 20px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.3s ease !important;
}

:deep(.login-card:hover) {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12) !important;
}

:deep(.q-field),
.login-btn {
  width: 100% !important;
  max-width: 100% !important;
  box-sizing: border-box !important; /* Учитываем границы и отступы в общей ширине */
}

/* Инпуты */
:deep(.q-field__control) {
  border-radius: 12px !important;
  min-height: 56px !important;
}

:deep(.q-field__marginal) {
  height: 56px !important;
}

:deep(.q-field__bottom) {
  min-height: 0 !important;
  padding: 0 !important;
}

/* Кнопка входа */
.login-btn {
  border-radius: 12px !important;
  height: 56px !important;
  min-height: 56px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px !important;
  transition: all 0.2s ease !important;
  box-shadow: 0 4px 12px rgba(124, 147, 195, 0.3) !important;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
}

.login-btn:active {
  transform: translateY(0);
}

.register-link {
  color: var(--q-primary) !important;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.register-link:hover {
  text-decoration: underline;
  opacity: 0.8;
}

:deep(.q-icon) {
  color: #9E9E9E;
  font-size: 1.3rem;
}

@media (max-width: 600px) {
  .login-container {
    min-height: calc(100vh - 100px);
    padding: 0.5rem;
  }

  :deep(.login-card) {
    max-width: 100%;
    border-radius: 16px !important;
  }

  :deep(.q-pa-xl) {
    padding: 1.5rem !important;
  }

  .text-h5 {
    font-size: 1.3rem !important;
  }
}

@media (max-width: 400px) {
  :deep(.q-pa-xl) {
    padding: 1rem !important;
  }
}
</style>