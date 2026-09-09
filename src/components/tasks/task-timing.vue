<template>
  <div v-if="timing" class="timing-badge">
    <q-icon name="sym_o_schedule" class="timing-icon" />
    <span class="timing-part">Подготовка: {{ timing.prep }}</span>
    <span class="timing-divider">|</span>
    <span class="timing-part">Ответ: {{ timing.answer }}</span>
  </div>
</template>

<script>
// Тайминги по (тип экзамена, тип задания)
// Типы заданий: 1 — чтение, 2 — объявление, 3 — интервью, 4 — монолог
const TIMINGS = {
  ege: {
    1: { prep: '1.5 мин', answer: '1.5 мин' },
    2: { prep: '1.5 мин', answer: '20 сек на вопрос' },
    3: { prep: '0 мин', answer: '40 сек на вопрос' },
    4: { prep: '2.5 мин', answer: '3 мин' }
  },
  oge: {
    1: { prep: '1.5 мин', answer: '2 мин' },
    3: { prep: '0 мин', answer: '40 сек на вопрос' },  // задание 2 ОГЭ (интервью)
    4: { prep: '1.5 мин', answer: '2 мин' }            // задание 3 ОГЭ (монолог)
  }
}

export default {
  name: 'TaskTiming',
  props: {
    examType: {
      type: String,
      default: null
    },
    taskType: {
      type: Number,
      default: null
    }
  },
  computed: {
    timing() {
      return TIMINGS[this.examType]?.[this.taskType] || null
    }
  }
}
</script>

<style scoped>
.timing-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  flex-shrink: 0;
  background: #E4F5F8;
  color: #1798B1;
  border-radius: 10px;
  padding: 0.45rem 0.9rem;
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.3;
  white-space: nowrap;
}

.timing-icon {
  font-size: 18px !important;
}

.timing-divider {
  opacity: 0.45;
}

@media (max-width: 600px) {
  .timing-badge {
    white-space: normal;
    width: 100%;
    justify-content: center;
  }
}
</style>