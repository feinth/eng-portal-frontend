<template>
  <q-dialog
    :model-value="localVisible"
    @update:modelValue="updateVisibility"
    class="register-dialog"
  >
    <q-card class="register-card">
      <!-- Шапка с кнопкой закрытия -->
      <q-card-section class="register-header">
        <q-btn
          flat
          round
          dense
          icon="sym_o_close"
          class="close-btn"
          @click="closeDialog"
        />
        <div class="header-content">
          <h1 class="register-title">Форма регистрации</h1>
        </div>
      </q-card-section>

      <q-card-section class="register-body">
        <q-form @submit.stop.prevent="onSubmit" class="register-form" greedy>
          <q-input
            v-model="user.email"
            type="email"
            label="Email"
            outlined
            dense
            lazy-rules
            :rules="[emailRule]"
            class="form-field"
          >
            <template v-slot:prepend>
              <q-icon name="sym_o_email" color="grey-6" />
            </template>
          </q-input>

          <div class="name-row">
            <q-input
              v-model="user.firstName"
              type="text"
              label="Имя"
              outlined
              dense
              lazy-rules
              :rules="[requiredRule]"
              class="form-field"
            >
              <template v-slot:prepend>
                <q-icon name="sym_o_person" color="grey-6" />
              </template>
            </q-input>

            <q-input
              v-model="user.lastName"
              type="text"
              label="Фамилия"
              outlined
              dense
              lazy-rules
              :rules="[requiredRule]"
              class="form-field"
            >
              <template v-slot:prepend>
                <q-icon name="sym_o_person_outline" color="grey-6" />
              </template>
            </q-input>
          </div>

          <q-input
            v-model="user.birthday"
            type="date"
            label="Дата рождения"
            outlined
            dense
            lazy-rules
            :rules="[birthdayRule]"
            class="form-field"
          >
            <template v-slot:prepend>
              <q-icon name="sym_o_cake" color="grey-6" />
            </template>
          </q-input>

          <q-input
            v-model="user.password"
            :type="showPassword ? 'text' : 'password'"
            label="Пароль"
            outlined
            dense
            lazy-rules
            :rules="[passwordRule]"
            class="form-field"
          >
            <template v-slot:prepend>
              <q-icon name="sym_o_lock" color="grey-6" />
            </template>
            <template v-slot:append>
              <q-icon
                :name="showPassword ? 'sym_o_visibility_off' : 'sym_o_visibility'"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
                color="grey-6"
              />
            </template>
          </q-input>

          <q-btn
            unelevated
            no-caps
            color="primary"
            class="submit-btn full-width"
            label="Зарегистрироваться"
            type="submit"
            :loading="isLoading"
          />

          <div class="agreement-text">
            Нажимая «Зарегистрироваться», вы принимаете
            <a @click="showAgreementDialog" class="agreement-link">
              пользовательское соглашение
            </a>
          </div>

          <!-- Ссылка на форму входа -->
          <div class="login-link-section">
            Уже есть аккаунт?
            <a @click="switchToLogin" class="login-link">Войти</a>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { useUserStore } from '../stores/user.store'
import { useQuasar } from 'quasar'
import Agreement from '../components/utils/agreement-terms.vue'
import { router } from '../router/router'

export default {
  name: 'Register',
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        birthday: '',
        email: '',
        password: ''
      },
      localVisible: this.isVisible,
      isLoading: false,
      showPassword: false,
      store: useUserStore(),
      $q: useQuasar(),
      router: router
    }
  },
  props: {
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  emits: ['switch-to-login'],
  methods: {
    closeDialog() {
      this.updateVisibility(false)
    },

    switchToLogin() {
      this.closeDialog()
      this.$emit('switch-to-login')
    },

    extractErrorMessage(err) {
      const data = err?.response?.data
      if (!data) {
        return 'Не удалось связаться с сервером. Проверьте подключение.'
      }

      if (typeof data === 'string') {
        return data
      }

      if (Array.isArray(data)) {
        return data.join('; ')
      }

      if (typeof data === 'object') {
        const messages = []

        if (data.detail) {
          messages.push(Array.isArray(data.detail) ? data.detail.join('; ') : data.detail)
        }

        if (data.non_field_errors) {
          const nfe = Array.isArray(data.non_field_errors)
            ? data.non_field_errors
            : [data.non_field_errors]
          messages.push(...nfe)
        }

        for (const [field, errors] of Object.entries(data)) {
          if (['detail', 'non_field_errors'].includes(field)) continue

          const fieldErrors = Array.isArray(errors) ? errors : [errors]
          const readable = fieldErrors
            .map((e) => (typeof e === 'string' ? e : JSON.stringify(e)))
            .join('; ')
          if (readable) {
            messages.push(`${this.humanizeField(field)}: ${readable}`)
          }
        }

        if (messages.length > 0) {
          return messages.join('. ')
        }
      }

      return 'Произошла ошибка. Попробуйте ещё раз.'
    },

    humanizeField(field) {
      const map = {
        email: 'Email',
        first_name: 'Имя',
        firstName: 'Имя',
        last_name: 'Фамилия',
        lastName: 'Фамилия',
        birthday: 'Дата рождения',
        password: 'Пароль',
        password2: 'Подтверждение пароля'
      }
      return map[field] || field
    },

    onSubmit() {
      this.isLoading = true
      this.store
        .register(this.user)
        .then(() => {
          this.updateVisibility(false)
          this.localVisible = false
          this.$q.notify({
            progress: true,
            position: 'bottom',
            color: 'positive',
            message: 'Регистрация прошла успешно!',
            timeout: 2000,
            icon: 'sym_o_check_circle'
          })
          this.router.push('/profile')
        })
        .catch((err) => {
          this.$q.notify({
            progress: true,
            position: 'top',
            color: 'negative',
            message: this.extractErrorMessage(err),
            timeout: 5000,
            icon: 'sym_o_error',
            multiLine: true,
            classes: 'error-notify'
          })
        })
        .finally(() => {
          this.isLoading = false
        })
    },

    emailRule(val) {
      return (
        (val && val.length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) ||
        'Введите корректный email'
      )
    },

    birthdayRule(val) {
      if (!val) return 'Укажите дату рождения'
      if (!this.isValidDate(val)) return 'Некорректная дата'
      const today = new Date()
      const birth = new Date(val)
      if (birth > today) return 'Дата не может быть в будущем'
      const age = today.getFullYear() - birth.getFullYear()
      if (age > 120) return 'Проверьте дату рождения'
      return true
    },

    passwordRule(val) {
      if (!val || val.length === 0) return 'Введите пароль'
      if (val.length < 6) return 'Пароль должен быть не менее 6 символов'
      return true
    },

    requiredRule(val) {
      return (val && val.length > 0) || 'Обязательное поле'
    },

    isValidDate(date) {
      const parsed = new Date(date)
      return !isNaN(parsed.getTime())
    },

    showAgreementDialog() {
      this.$q.dialog({
        component: Agreement
      })
    },

    updateVisibility(newValue) {
      this.localVisible = newValue
    }
  },
  watch: {
    isVisible(newValue) {
      this.localVisible = newValue
    }
  }
}
</script>

<style scoped>
.register-dialog :deep(.q-dialog__inner) {
  padding: 0;
}

.register-card {
  width: 100%;
  max-width: 480px;
  margin: 1rem auto;
  border-radius: 24px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
  overflow: hidden;
  position: relative;
}

/* Шапка */
.register-header {
  background: linear-gradient(135deg, #EEF3FB 0%, #E1EAF8 100%);
  padding: 1.75rem 2rem !important;
  text-align: center;
  position: relative;
}

.header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.close-btn {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  z-index: 10;
  color: #5A6178 !important;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.5) !important;
}

.register-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #2B2D42;
  margin: 0;
}

/* Тело формы */
.register-body {
  padding: 1.75rem 2rem 2rem !important;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-field :deep(.q-field__control) {
  border-radius: 12px !important;
}

.form-field :deep(.q-field__native) {
  font-size: 0.95rem;
}

.submit-btn {
  margin-top: 0.5rem;
  height: 48px;
  border-radius: 12px !important;
  font-weight: 700 !important;
  font-size: 1rem !important;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(124, 147, 195, 0.3) !important;
  transition: all 0.25s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
}

.agreement-text {
  margin-top: 1rem;
  text-align: center;
  font-size: 0.85rem;
  color: #5A6178;
  line-height: 1.5;
}

.agreement-link {
  color: var(--q-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
  transition: border-color 0.2s ease;
}

.agreement-link:hover {
  border-bottom-style: solid;
}

/* Ссылка на форму входа */
.login-link-section {
  margin-top: 1.25rem;
  text-align: center;
  font-size: 0.9rem;
  color: #5A6178;
}

.login-link {
  color: var(--q-primary);
  font-weight: 700;
  cursor: pointer;
  text-decoration: none;
  margin-left: 0.25rem;
  transition: color 0.2s ease;
}

.login-link:hover {
  color: #5B79B8;
  text-decoration: underline;
}

/* ═══════════ АДАПТИВНОСТЬ ═══════════ */

@media (max-width: 768px) {
  .register-card {
    max-width: 100%;
    margin: 0.5rem;
    border-radius: 20px !important;
  }

  .register-header {
    padding: 1.5rem 1.5rem !important;
  }

  .register-body {
    padding: 1.5rem !important;
  }

  .register-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 500px) {
  .register-card {
    margin: 0;
    border-radius: 0 !important;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  .register-header {
    padding: 1.25rem 1.25rem !important;
  }

  .register-body {
    padding: 1.25rem 1.25rem 2rem !important;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .register-form {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .register-title {
    font-size: 1.2rem;
  }

  .name-row {
    grid-template-columns: 1fr;
  }

  .submit-btn {
    margin-top: auto;
    padding-top: 1rem;
  }

  .agreement-text {
    padding: 1rem 0;
  }
}

@media (max-width: 360px) {
  .register-header {
    padding: 1rem 1rem !important;
  }

  .register-body {
    padding: 1rem 1rem 1.5rem !important;
  }

  .register-title {
    font-size: 1.1rem;
  }
}
</style>

<style>
.error-notify {
  max-width: 90vw !important;
  white-space: normal !important;
}

.error-notify .q-notification__message {
  white-space: normal !important;
  line-height: 1.5 !important;
}
</style>