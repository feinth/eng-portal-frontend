<template>
  <div class="q-mt-lg">
    <div class="text-h6 text-weight-medium text-grey-8 q-mb-md">
      Доступные экзамены
    </div>
    
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
/* Адаптивная сетка карточек */
.exams-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 1.25rem;
}

/* Стиль карточки экзамена */
:deep(.exam-card) {
  border-radius: 16px !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.05) !important;
  transition: all 0.25s ease !important;
  overflow: hidden;
}

:deep(.exam-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08) !important;
  border-color: var(--q-primary) !important;
}

:deep(.exam-card:active) {
  transform: translateY(-2px);
}

/* Адаптивность */
@media (max-width: 600px) {
  .exams-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  :deep(.exam-card .q-card__section) {
    padding: 1rem !important;
  }

  :deep(.exam-card .q-icon) {
    font-size: 2rem !important;
  }

  .text-subtitle1 {
    font-size: 0.95rem !important;
  }
}

@media (max-width: 400px) {
  .exams-grid {
    grid-template-columns: 1fr;
  }
}
</style>