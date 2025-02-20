<template>
  <div>
    <q-inner-loading v-if="!answers" showing />
    <q-expansion-item v-else-if="answers && answers.length > 0" class="text-h5" expand-separator
      label="Ваши выполненные задания">
      <q-intersection v-for="answer in answers" :key="answer.id">
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label class="text-xl">{{ `Ответы на экзамен от ${formatDate(answer.created_at)}` }}</q-item-label>
          </q-item-section>

          <q-item-section>
            <div>
              <audio controls>
                <source :src="answer.full_audio" type="audio/mpeg" />
              </audio>
            </div>
          </q-item-section>
          <q-item-section>
            <q-btn :href="answer.answer_archive" target="_blank" color="primary" icon="download"
              label="Скачать архив" />
          </q-item-section>
        </q-item>
      </q-intersection>
    </q-expansion-item>
    <q-banner v-else>
      Нет выполненных заданий
    </q-banner>
  </div>
</template>

<script>
import { useExamStore } from "../stores/exam.store";
import { date } from "quasar";

export default {
  data() {
    return {
      store: useExamStore(),
      answers: null, 
    };
  },
  methods: {
    async getAnswers() {
      try {
        const result = await this.store.getAnswers();
        if (Array.isArray(result)) {
          this.answers = result.filter(answer => answer.status === 3)
        } else {
          this.answers = [];
          this.$q.notify({
            progress: true,
            position: "top-right",
            color: "negative",
            message: "Неверный формат данных от сервера",
            timeout: 2000,
          });
        }
      } catch (err) {
        this.$q.notify({
          progress: true,
          position: "top-right",
          color: "negative",
          message: "Ошибка при загрузке выполненных ответов",
          timeout: 2000,
        });
      }
    },
    formatDate(dateStr) {
      return date.formatDate(dateStr, "DD MMM YYYY HH:mm"); 
    },
    formatStatus(status) {
      const statuses = {
        1: "Ожидает",
        2: "В обработке",
        3: "Готов",
      };
      return statuses[status] || "Неизвестно";
    },
  },
  mounted() {
    this.getAnswers();
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
  background-color: #e5fdfb; /* Серый фон для четных элементов */
}

.q-item__section--side {
  flex: 0 0 auto; /* Фиксированная ширина для кнопок */
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
    max-width: 100%; /* Полная ширина на мобильных устройствах */
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