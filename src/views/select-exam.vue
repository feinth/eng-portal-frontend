<template>
  <q-page class="q-pa-md md:q-pa-lg">
    <!-- Основной контент -->
    <div class="main-content">

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="3rem" />
        <p class="text-body1 text-grey-7 q-mt-md">Загрузка...</p>
      </div>

      <!-- Блок выбора типа экзамена и задания -->
      <div v-else-if="!tasks && !exams && !isLoading" class="text-center">

        <!-- Заголовок текущего шага -->
        <div class="q-mb-xl">
          <h1 class="text-h5 text-weight-bold text-grey-9 q-mb-sm">
            {{ currentStepTitle }}
          </h1>
          <p class="text-body2 text-grey-6">
            Выберите один из вариантов ниже
          </p>
        </div>

        <!-- ШАГ 1: Выбор типа экзамена (ОГЭ / ЕГЭ) -->
        <div v-if="!selectedMainType" class="options-grid">
          <q-card v-for="option in mainTypes" :key="option.id" class="option-card cursor-pointer"
            @click="selectMainType(option)">
            <q-card-section class="text-center q-pa-lg">
              <q-icon :name="getOptionIcon(option)" size="3rem" class="text-primary q-mb-md" />
              <div class="text-h6 text-weight-medium text-grey-9">
                {{ option.label }}
              </div>
            </q-card-section>
          </q-card>
        </div>

        <!-- ШАГ 2 и далее -->
        <div v-else class="options-grid">
          <q-card v-for="option in currentStepOptions" :key="option.id" class="option-card cursor-pointer"
            @click="handleStepSelection(option)">
            <q-card-section class="text-center q-pa-lg">
              <q-icon :name="getOptionIcon(option)" size="3rem" class="text-primary q-mb-md" />
              <div class="text-h6 text-weight-medium text-grey-9">
                {{ option.label }}
              </div>
            </q-card-section>
          </q-card>
        </div>

      </div>

      <!-- Сообщение об отсутствии данных (только если загрузка завершена и данных нет) -->
      <q-banner
        v-else-if="!isLoading && ((selectedTaskType?.id === 2 && tasks && tasks.length === 0) || (selectedTaskType?.id === 1 && exams && exams.length === 0))"
        class="no-data-banner q-mb-lg" rounded>
        <template v-slot:avatar>
          <q-icon name="sym_o_info" color="warning" size="2rem" />
        </template>
        <span class="text-body1">
          <span v-if="selectedTaskType?.id === 2">Нет доступных заданий для выбранного типа</span>
          <span v-else-if="selectedTaskType?.id === 1">Нет доступных экзаменов для выбранного типа</span>
        </span>
      </q-banner>

      <!-- Список заданий -->
      <div v-else-if="!isLoading && selectedTaskType?.id === 2 && tasks && tasks.length > 0">
        <tasks-list :tasks="tasks" />
      </div>

      <!-- Список экзаменов -->
      <div v-else-if="!isLoading && selectedTaskType?.id === 1 && exams && exams.length > 0">
        <exams-list :exams="exams" />
      </div>

    </div>
  </q-page>
</template>

<script>
import TasksList from '../components/task-list.vue'
import ExamsList from '../components/exam-list.vue'
import { useExamStore } from '../stores/exam.store'

export default {
  name: 'TrainingPage',
  components: {
    ExamsList,
    TasksList
  },
  data() {
    return {
      store: useExamStore(),
      mainTypes: [
        { id: 1, label: 'ОГЭ', type: 'oge' },
        { id: 2, label: 'ЕГЭ', type: 'ege' }
      ],
      taskTypes: [
        { id: 1, label: 'Экзамен' },
        { id: 2, label: 'По заданиям' }
      ],
      examTypes: [
        { id: 1, label: 'Авторские варианты' },
        { id: 2, label: 'На основе открытого банка ФИПИ' }
      ],
      ogeTaskSubTypes: [
        { id: 1, label: 'Задание 1' },
        { id: 2, label: 'Задание 2' },
        { id: 3, label: 'Задание 3' }
      ],
      egeTaskSubTypes: [
        { id: 1, label: 'Задание 1' },
        { id: 2, label: 'Задание 2' },
        { id: 3, label: 'Задание 3' },
        { id: 4, label: 'Задание 4' }
      ],
      selectedMainType: null,
      selectedTaskType: null,
      selectedExamType: null,
      tasks: null,
      exams: null,
      isLoading: false
    }
  },
  computed: {
    currentStepTitle() {
      if (!this.selectedMainType) return 'Выберите тип экзамена'
      if (!this.selectedTaskType) return 'Выберите тип задания'
      if (this.selectedMainType.id === 1 && this.selectedTaskType.id === 2) return 'Выберите тип задания (ОГЭ)'
      if (this.selectedMainType.id === 2 && this.selectedTaskType.id === 2) return 'Выберите тип задания (ЕГЭ)'
      if (!this.selectedExamType && this.selectedTaskType.label === 'Экзамен' && this.selectedMainType.label === 'ОГЭ') return 'Выберите варианты'
      return ''
    },
    currentStepOptions() {
      if (!this.selectedMainType) return this.mainTypes
      if (!this.selectedTaskType) return this.taskTypes
      if (this.selectedMainType.id === 1 && this.selectedTaskType.id === 2) return this.ogeTaskSubTypes
      if (this.selectedMainType.id === 2 && this.selectedTaskType.id === 2) return this.egeTaskSubTypes
      if (!this.selectedExamType && this.selectedTaskType.label === 'Экзамен' && this.selectedMainType.label === 'ОГЭ') return this.examTypes
      return []
    }
  },
  methods: {
    getOptionIcon(option) {
      if (option.type === 'oge' || option.type === 'ege') return 'sym_o_school'
      if (option.label === 'Экзамен') return 'sym_o_quiz'
      if (option.label === 'По заданиям') return 'sym_o_task'
      if (option.label.includes('Авторские')) return 'sym_o_edit_note'
      if (option.label.includes('ФИПИ')) return 'sym_o_database'
      if (option.label.includes('Задание')) return 'sym_o_assignment'
      return 'sym_o_circle'
    },
    selectMainType(type) {
      this.selectedMainType = type
    },
    handleStepSelection(type) {
      if (!this.selectedTaskType) {
        this.selectedTaskType = type
        if (this.selectedMainType?.id === 2 && this.selectedTaskType?.id === 1) {
          this.fetchExams(this.selectedMainType.id, this.selectedTaskType.id)
        }
      } else if (this.selectedMainType.id === 1 && this.selectedTaskType.id === 2) {
        this.fetchTasksByType(this.selectedMainType.type, type.id)
      } else if (this.selectedMainType.id === 2 && this.selectedTaskType.id === 2) {
        this.fetchTasksByType(this.selectedMainType.type, type.id)
      } else if (!this.selectedExamType && this.selectedTaskType.label === 'Экзамен' && this.selectedMainType.label === 'ОГЭ') {
        this.selectedExamType = type
        this.fetchExams(type.id)
      }
    },
    resetSelection() {
      this.selectedMainType = null
      this.selectedTaskType = null
      this.selectedExamType = null
      this.tasks = null
      this.exams = null
    },
    fetchExams() {
      this.isLoading = true  // Включаем индикатор загрузки
      let fipi = null;
      if (this.selectedMainType?.label === 'ОГЭ' && this.selectedExamType) {
        fipi = this.selectedExamType.id === 1 ? 0 : 1;
      }

      this.store
        .getExams(this.selectedMainType.type, fipi)
        .then((result) => {
          this.exams = result;
        })
        .catch((error) => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'negative',
            message: 'Ошибка при получении экзаменов, попробуйте перезагрузить страницу',
            timeout: 2000,
            icon: 'sym_o_warning'
          })
        })
        .finally(() => {
          this.isLoading = false  // Выключаем индикатор загрузки в любом случае
        });
    },
    fetchTasksByType(examType, taskSubTypeId) {
      this.isLoading = true  // Включаем индикатор загрузки
      this.store
        .getTasksByType(examType, taskSubTypeId)
        .then((result) => {
          this.tasks = result;
        })
        .catch((error) => {
          this.$q.notify({
            progress: true,
            position: 'top-right',
            color: 'negative',
            message: 'Ошибка при получении заданий, попробуйте перезагрузить страницу',
            timeout: 2000,
            icon: 'sym_o_warning'
          })
        })
        .finally(() => {
          this.isLoading = false  // Выключаем индикатор загрузки в любом случае
        });
    }
  }
}
</script>

<style scoped>
/* Карточка с текущим выбором */
:deep(.selection-card) {
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
}

/* Чипы выбора */
.selection-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

:deep(.selection-chip) {
  border-radius: 20px !important;
  font-weight: 500 !important;
  padding: 8px 16px !important;
  margin: 0 !important;
}

/* Кнопка сброса */
:deep(.reset-btn) {
  border-radius: 12px !important;
  font-weight: 500 !important;
  transition: all 0.2s ease !important;
}

:deep(.reset-btn:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
}

/* Сетка кнопок выбора */
.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

/* Карточки вариантов */
:deep(.option-card) {
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease !important;
  overflow: hidden;
}

:deep(.option-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border-color: var(--q-primary) !important;
}

:deep(.option-card:active) {
  transform: translateY(-2px);
}

/* Баннер об отсутствии данных */
:deep(.no-data-banner) {
  background-color: #FFF9E6 !important;
  border: 1px solid #FFE082 !important;
}

:deep(.no-data-banner .q-banner__content) {
  color: #856404 !important;
}

/* Адаптивность */
@media (max-width: 1024px) {
  .options-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 600px) {
  .options-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  :deep(.selection-card .q-card__section) {
    padding: 1rem !important;
  }

  .text-h6 {
    font-size: 1.1rem !important;
  }

  .text-h5 {
    font-size: 1.3rem !important;
  }

  .selection-chips {
    gap: 0.3rem;
  }

  :deep(.selection-chip) {
    padding: 6px 12px !important;
    font-size: 0.85rem !important;
  }
}

@media (max-width: 400px) {
  .options-grid {
    gap: 0.75rem;
  }

  :deep(.option-card .q-card__section) {
    padding: 1.25rem !important;
  }
}
</style>