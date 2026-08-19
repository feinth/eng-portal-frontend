<template>
  <div class="q-mt-lg">
    <div class="tasks-grid">
      <q-card
        v-for="task in tasks"
        :key="task.id"
        class="task-card cursor-pointer"
        @click="fetchTaskDetails(task.id)"
      >
        <q-card-section class="text-center q-pa-lg">
          <q-icon 
            name="sym_o_assignment" 
            size="2.5rem" 
            class="text-primary q-mb-md" 
          />
          <div class="text-subtitle1 text-weight-medium text-grey-9">
            Вариант {{ task.exam.number }}
          </div>
          <div class="text-caption text-grey-6 q-mt-xs">
            Нажми, чтобы начать
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
  name: 'TasksList',
  props: {
    tasks: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    fetchTaskDetails(id) {
      const examStore = useExamStore()
      examStore.getTasksById(id).then(() => {
        router.push('/exam')
      }).catch(() => {
        this.$q.notify({
          color: 'negative',
          message: 'Не удалось загрузить вариант',
          icon: 'sym_o_warning'
        })
      })
    }
  }
}
</script>

<style scoped>
.tasks-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.tasks-grid .task-card {
  flex: 0 0 calc(50% - 0.75rem);
  max-width: calc(50% - 0.75rem);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  transition: all 0.3s ease;
  overflow: hidden;
}

.tasks-grid .task-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-color: var(--q-primary);
}

/* Адаптив: на мобильных — одна карточка в ряд */
@media (max-width: 600px) {
  .tasks-grid .task-card {
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>