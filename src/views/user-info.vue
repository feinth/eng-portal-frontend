<template>
  <div class="info-stack">
    <!-- Карточка с формой -->
    <q-card class="info-card">
      <q-card-section>
        <h3 class="card-title">
          <q-icon name="sym_o_person" class="title-icon" />
          Личные данные
        </h3>

        <q-form class="profile-form" @submit.prevent="updateUserData">
          <div class="form-row">
            <q-input
              filled
              v-model="user.first_name"
              label="Имя"
              class="form-field"
            >
              <template v-slot:prepend>
                <q-icon name="sym_o_person" color="grey-6" />
              </template>
            </q-input>

            <q-input
              filled
              v-model="user.second_name"
              label="Фамилия"
              class="form-field"
            >
              <template v-slot:prepend>
                <q-icon name="sym_o_person_outline" color="grey-6" />
              </template>
            </q-input>
          </div>

          <q-input
            filled
            v-model="user.birthdate"
            type="date"
            label="Дата рождения"
            class="form-field no-autofill"
          >
            <template v-slot:prepend>
              <q-icon name="sym_o_cake" color="grey-6" />
            </template>
          </q-input>

          <q-input
            filled
            v-model="user.phone"
            label="Телефон"
            class="form-field"
          >
            <template v-slot:prepend>
              <q-icon name="sym_o_phone" color="grey-6" />
            </template>
          </q-input>

          <q-btn
            unelevated
            no-caps
            color="primary"
            icon="sym_o_save"
            label="Сохранить изменения"
            type="submit"
            class="save-btn full-width"
          />
        </q-form>
      </q-card-section>
    </q-card>

    <!-- Карточка выхода -->
    <q-card class="info-card logout-card">
      <q-card-section class="logout-section">
        <div class="logout-text">
          <q-icon name="sym_o_info" color="grey-6" size="20px" />
          <span>Завершить текущий сеанс</span>
        </div>
        <q-btn
          flat
          no-caps
          color="red"
          icon="sym_o_logout"
          label="Выйти из аккаунта"
          @click="logout"
          class="logout-btn"
        />
      </q-card-section>
    </q-card>

  </div>
</template>

<script>
import { useUserStore } from '../stores/user.store'

export default {
  name: 'UserInfo',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      store: useUserStore()
    }
  },
  computed: {
    fullName() {
      const parts = [this.user.first_name, this.user.second_name].filter(Boolean)
      return parts.join(' ').trim()
    },
    initials() {
      const first = this.user.first_name?.[0] || ''
      const second = this.user.second_name?.[0] || ''
      const result = (first + second).toUpperCase()
      return result || (this.user.email?.[0]?.toUpperCase() || '?')
    }
  },
  methods: {
    updateUserData() {
      this.store
        .updateUserData(this.user)
        .then(() => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'positive',
            message: 'Данные успешно обновлены',
            timeout: 2000,
            icon: 'sym_o_check_circle'
          })
        })
        .catch(() => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'red',
            message: 'Не удалось обновить данные',
            timeout: 2000,
            icon: 'sym_o_error'
          })
        })
    },
    logout() {
      this.$q.dialog({
        title: 'Выход из аккаунта',
        message: 'Вы уверены, что хотите выйти?',
        cancel: { label: 'Отмена', flat: true },
        ok: { label: 'Выйти', color: 'red' }
      }).onOk(() => {
        this.store.logout().then(() => {
          this.$router.push('/')
        })
      })
    }
  }
}
</script>

<style scoped>
.info-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ═══════════ КАРТОЧКА С АВАТАРОМ ═══════════ */
.profile-card {
  border-radius: 20px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  background: linear-gradient(135deg, #EEF3FB 0%, #E1EAF8 100%);
  overflow: hidden;
}

.profile-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem !important;
  text-align: center;
}

.avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--q-primary), #5B79B8);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 1rem;
  box-shadow: 0 8px 24px rgba(124, 147, 195, 0.4);
  letter-spacing: 1px;
}

.profile-identity {
  width: 100%;
}

.profile-name {
  font-size: 1.3rem;
  font-weight: 800;
  color: #2B2D42;
  margin: 0 0 0.25rem;
  word-break: break-word;
}

.profile-email {
  font-size: 0.95rem;
  color: #5A6178;
  margin: 0;
  word-break: break-all;
}

/* ═══════════ КАРТОЧКИ С ФОРМОЙ И ВЫХОДОМ ═══════════ */
.info-card {
  border-radius: 20px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
}

.info-card :deep(.q-card__section) {
  padding: 1.75rem !important;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.15rem;
  font-weight: 700;
  color: #2B2D42;
  margin: 0 0 1.5rem;
}

.title-icon {
  color: var(--q-primary);
  font-size: 22px !important;
}

/* ═══════════ ФОРМА ═══════════ */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.form-field {
  width: 100%;
}

.save-btn {
  margin-top: 0.5rem;
  height: 48px;
  border-radius: 12px !important;
  font-weight: 600;
  letter-spacing: 0.3px;
  box-shadow: 0 4px 12px rgba(124, 147, 195, 0.3) !important;
  transition: all 0.25s ease;
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
}

/* ═══════════ ВЫХОД ═══════════ */
.logout-card {
  background: #FFF9E6;
  border: 1px solid #FFE082 !important;
}

.logout-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.5rem !important;
}

.logout-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #5A6178;
  font-size: 0.95rem;
}

.logout-btn {
  border-radius: 10px !important;
  font-weight: 600;
}

/* ═══════════ АДАПТИВ ═══════════ */
@media (max-width: 500px) {
  .form-row {
    grid-template-columns: 1fr;
  }

  .logout-section {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .logout-btn {
    width: 100%;
  }
}
</style>