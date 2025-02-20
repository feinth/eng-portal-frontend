<template>
  <div class="exams-list">
    <q-btn v-for="exam in exams" :key="exam.id" :label="`Вариант ${exam.number}`" color="teal-8"
      class="custom-exam-button" @click="fetchExamDetails(exam.id)" />
  </div>
</template>

<script>
import { useExamStore } from '../stores/exam.store'
import { router } from '../router/router'

export default {
  name: 'ExamsList',
  props: {
    exams: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    fetchExamDetails(id) {
      const examStore = useExamStore()
      examStore.getExamTasks(id).then(
        router.push('/microphone-test')
      )
    }
  }
}
</script>

<style scoped>
.exams-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  /* 5 столбцов на больших экранах */
  gap: 1rem;
  /* Расстояние между кнопками */
}

.custom-exam-button {
  margin: 0.5rem;
  /* Отступы между кнопками */
  font-size: 1.25rem;
  /* Размер шрифта */
  color: #ffffff;
  /* Цвет текста */
  width: 100%;
  /* Кнопки занимают всю ширину ячейки */
}

/* Адаптивные стили для планшетов */
@media (max-width: 1024px) {
  .exams-list {
    grid-template-columns: repeat(3, 1fr);
    /* 3 столбца на планшетах */
  }
}

/* Адаптивные стили для мобильных устройств */
@media (max-width: 600px) {
  .exams-list {
    grid-template-columns: repeat(2, 1fr);
    /* 2 столбца на мобильных устройствах */
  }

  .custom-exam-button {
    font-size: 1rem;
    /* Уменьшаем размер шрифта на мобильных устройствах */
    margin: 0.25rem;
    /* Уменьшаем отступы */
  }
}

/* Адаптивные стили для очень маленьких экранов */
@media (max-width: 400px) {
  .exams-list {
    grid-template-columns: repeat(1, 1fr);
    /* 1 столбец на очень маленьких экранах */
  }
}
</style>