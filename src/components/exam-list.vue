<template>
  <div class="q-mt-lg">
    <div class="exams-grid">
      <q-card
        v-for="exam in exams"
        :key="exam.id"
        class="exam-card cursor-pointer"
        @click="fetchExamDetails(exam.id)"
      >
        <q-card-section class="text-center q-pa-lg">
          <q-icon 
            name="sym_o_quiz" 
            size="2.5rem" 
            class="text-primary q-mb-md" 
          />
          <div class="text-subtitle1 text-weight-medium text-grey-9">
            Вариант {{ exam.number }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Нажми, чтобы начать экзамен
          </div>
        </q-card-section>
      </q-card>
    </div>
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
      examStore.getExamTasks(id).then(() => {
        router.push('/exam')
      }).catch(() => {
        this.$q.notify({
          color: 'negative',
          message: 'Не удалось загрузить экзамен',
          icon: 'sym_o_warning'
        })
      })
    }
  }
}
</script>

<style scoped>
.exams-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.exams-grid .exam-card {
  flex: 0 0 calc(50% - 0.75rem);
  max-width: calc(50% - 0.75rem);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  overflow: hidden;
}

.exams-grid .exam-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-color: var(--q-primary);
}

/* Адаптив: на мобильных — одна карточка в ряд */
@media (max-width: 600px) {
  .exams-grid .exam-card {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>