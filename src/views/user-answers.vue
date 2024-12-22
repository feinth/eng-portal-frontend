<template>
  <div>
    <div class="text-h6"></div>
    <q-inner-loading v-if="!answers" showing />
    <q-expansion-item v-else-if="answers && answers.length > 0" class="text-h5" expand-separator
      label="Ваши выполненные задания">
      <q-intersection v-for="answer in answers" :key="answer.id">
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label class="text-xl">Ответы на экзамен от {{ formatDate(answer.created_at) }}</q-item-label>
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
.q-card-section {
  padding: 16px;
}
</style>
