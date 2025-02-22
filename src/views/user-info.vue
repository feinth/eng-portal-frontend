<template>
  <div>
    <q-expansion-item class="text-h5" expand-separator :label="`Данные о пользователе: ${user.email}`">
      <q-card>
        <q-card-section class="bg-gray-100 p-4 rounded-lg shadow-md">
          <q-form class="q-gutter-md">
            <q-input filled v-model="user.first_name" label="Имя" />
            <q-input filled v-model="user.second_name" label="Фамилия" />
            <q-input filled v-model="user.birthdate" type="date" label="Дата рождения" class="no-autofill" />
            <q-input filled v-model="user.phone" label="Телефон" />
            <q-btn-group spread class="q-mt-md">
              <q-btn label="Обновить информацию" color="primary" @click="updateUserData" class="full-width" />
              <q-btn label="Выйти из аккаунта" color="red" @click="logout" class="full-width" />
            </q-btn-group>
          </q-form>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
import { useUserStore } from "../stores/user.store";

export default {
  data() {
    return {
      store: useUserStore(),
      answers: null,
    };
  },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  methods: {
    updateUserData() {
      this.store
        .updateUserData(this.user)
        .then((result) => {
          this.$q.notify({
            progress: true,
            position: "top-right",
            color: "positive",
            message: "Обновлено",
            timeout: 1000,
            icon: "sym_o_check",
          });
        })
        .catch((err) => { });
    },
    logout() {
      this.store.logout().then((result) => {
        this.$router.push("/");
      });
    },
  },
};
</script>

<style scoped>
/* Общие стили */
.q-card-section {
  padding: 16px;
}

.q-item {
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.q-item:nth-child(even) {
  background-color: #f5f5f5;
  /* Серый фон для четных элементов */
}

.q-item__section--side {
  flex: 0 0 auto;
  /* Фиксированная ширина для кнопок */
}

audio {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

/* Адаптивность для маленьких экранов */
@media (max-width: 600px) {
  .q-item-label {
    font-size: 14px;
  }

  audio {
    max-width: 100%;
    /* Полная ширина на мобильных устройствах */
  }

  .q-btn {
    font-size: 12px;
    padding: 4px 8px;
  }
}

/* Адаптивность для средних экранов */
@media (min-width: 601px) and (max-width: 1024px) {
  .q-item-label {
    font-size: 16px;
  }

  audio {
    max-width: 250px;
  }

  .q-btn {
    font-size: 14px;
    padding: 6px 12px;
  }
}

/* Адаптивность для больших экранов */
@media (min-width: 1025px) {
  .q-item-label {
    font-size: 18px;
  }

  audio {
    max-width: 300px;
  }

  .q-btn {
    font-size: 16px;
    padding: 8px 16px;
  }
}
</style>