<template>
  <q-page class="profile-page">
    <div class="profile-container">

      <!-- Сетка: профиль слева, табы справа -->
      <div class="profile-grid">

        <!-- Левая колонка: профиль -->
        <div class="profile-sidebar">
          <user-info v-if="user" :user="user" />
        </div>

        <!-- Правая колонка: табы -->
        <div class="profile-main">
          <q-card class="tabs-card">
            <q-tab-panels v-model="activeTab" animated class="tabs-panels">
              <q-tab-panel name="finished" class="q-pa-lg">
                <user-answers :status="3" />
              </q-tab-panel>
            </q-tab-panels>
          </q-card>
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>
import { useUserStore } from '../stores/user.store'
import { router } from '../router/router'
import UserAnswers from './user-answers.vue'
import UserInfo from './user-info.vue'

export default {
  name: 'UserProfile',
  components: {
    UserAnswers,
    UserInfo
  },
  data() {
    return {
      store: useUserStore(),
      user: null,
      activeTab: 'finished',
      router: router
    }
  },
  methods: {
    fetchData() {
      this.store.getUserData()
        .then((result) => {
          this.user = result
        })
        .catch(() => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'negative',
            message: 'Ошибка при получении данных, попробуйте позже',
            timeout: 2000,
            icon: 'sym_o_warning'
          })
        })
    }
  },
  mounted() {
    this.fetchData()
  }
}
</script>

<style scoped>
.profile-page {
  background-color: #F7F8FB;
  padding: 2.5rem 1.5rem 4rem;
  min-height: 100vh;
}

.profile-container {
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 1.5rem;
  align-items: start;
}

/* Карточка с табами */
.tabs-card {
  border-radius: 20px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  overflow: hidden;
}

.tabs-panels {
  background: white;
}

/* ═══════════ МОБИЛЬНАЯ АДАПТАЦИЯ ═══════════ */
@media (max-width: 900px) {
  .profile-page {
    padding: 1.5rem 1rem 3rem;
  }

  .profile-grid {
    grid-template-columns: 1fr;
    gap: 1.25rem;
  }

  /* На мобильных: история тренировок сверху, профиль снизу */
  .profile-main {
    order: 1;
  }

  .profile-sidebar {
    order: 2;
  }
}
</style>