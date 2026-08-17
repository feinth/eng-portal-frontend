<template>
  <q-page class="q-pa-md md:q-pa-lg">
    <div class="main-content">

      <!-- Карточка с текущим выбором (всегда видна, если есть выбор) -->
      <q-card v-if="hasAnySelection" class="selection-card q-mb-lg">
        <q-card-section class="q-pa-lg">

          <!-- Заголовок над чипами -->
          <div class="text-overline text-grey-6 q-mb-sm text-center">Ваш выбор</div>

          <!-- Чипы с текущим выбором -->
          <div class="selection-chips q-mb-md">
            <q-chip v-if="selectedMainType" color="primary" text-color="white" class="selection-chip" square>
              <div class="chip-content">
                <q-icon name="sym_o_school" size="20px" />
                <span class="chip-text">{{ selectedMainType.label }}</span>
              </div>
            </q-chip>

            <q-chip v-if="selectedTaskType" color="secondary" text-color="white" class="selection-chip" square>
              <div class="chip-content">
                <q-icon name="sym_o_assignment" size="20px" />
                <span class="chip-text">{{ selectedTaskType.label }}</span>
              </div>
            </q-chip>

            <q-chip v-if="selectedExamType" color="accent" text-color="white" class="selection-chip" square>
              <div class="chip-content">
                <q-icon name="sym_o_description" size="20px" />
                <span class="chip-text">{{ selectedExamType.label }}</span>
              </div>
            </q-chip>
          </div>

          <!-- Кнопки управления -->
          <div class="selection-actions">
            <q-btn flat dense no-caps icon="sym_o_arrow_back" label="Назад" color="grey-7" @click="goBack"
              class="back-btn q-mr-sm" />
            <q-btn flat dense no-caps icon="sym_o_refresh" label="Сбросить" color="grey-7" @click="resetSelection"
              class="reset-btn" />
          </div>

        </q-card-section>
      </q-card>

      <!-- Индикатор загрузки -->
      <div v-if="isLoading" class="text-center q-pa-xl">
        <q-spinner-dots color="primary" size="3rem" />
        <p class="text-body1 text-grey-7 q-mt-md">Загрузка...</p>
      </div>

      <!-- Блок выбора типа экзамена и задания -->
      <div v-else-if="!tasks && !exams && !isLoading" class="text-center">

        <div class="q-mb-xl">
          <h1 class="text-h5 text-weight-bold text-grey-9 q-mb-sm">
            {{ currentStepTitle }}
          </h1>
          <p class="text-body2 text-grey-6">
            Выберите один из вариантов ниже
          </p>
        </div>

        <!-- Индикатор генерации случайного варианта -->
        <div v-if="isGeneratingRandom" class="text-center q-pa-xl">
          <q-spinner-dots color="primary" size="3rem" />
          <p class="text-body1 text-grey-7 q-mt-md">Создаём случайный вариант...</p>
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

      <!-- Сообщение об отсутствии данных -->
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
        { id: 1, label: 'Авторские варианты', type: 'author' },
        { id: 2, label: 'На основе открытого банка ФИПИ', type: 'fipi' },
        { id: 3, label: 'Случайный вариант', type: 'random' }
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
      isLoading: false,
      isGeneratingRandom: false
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
    },
    hasAnySelection() {
      return !!(this.selectedMainType || this.selectedTaskType || this.selectedExamType)
    }
  },
  methods: {
    goBack() {
      if (this.selectedExamType) {
        this.selectedExamType = null
        this.exams = null
        this.tasks = null
        return
      }
      if (this.selectedTaskType) {
        this.selectedTaskType = null
        this.exams = null
        this.tasks = null
        return
      }
      if (this.selectedMainType) {
        this.selectedMainType = null
        this.exams = null
        this.tasks = null
        return
      }
    },
    getOptionIcon(option) {
      if (option.type === 'oge') return 'sym_o_menu_book'
      if (option.type === 'ege') return 'sym_o_school'
      if (option.label === 'Экзамен') return 'sym_o_quiz'
      if (option.label === 'По заданиям') return 'sym_o_task'
      if (option.label.includes('Авторские')) return 'sym_o_edit_note'
      if (option.label.includes('ФИПИ')) return 'sym_o_database'
      if (option.type === 'random') return 'sym_o_shuffle'
      if (option.label.includes('Задание')) return 'sym_o_assignment'
      return 'sym_o_circle'
    },
    selectMainType(type) {
      this.selectedMainType = type
    },
    async handleStepSelection(type) {
      if (type.type === 'random') {
        await this.generateRandomExam()
        return
      }

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
    async generateRandomExam() {
      this.isGeneratingRandom = true
      try {
        const result = await this.store.generateRandomExam(this.selectedMainType.id)

        if (result.warnings && result.warnings.length > 0) {
          this.$q.notify({
            color: 'warning',
            message: 'Некоторые задания не были найдены',
            icon: 'sym_o_warning'
          })
        }
        this.router.push('/exam')
      } catch (error) {
        const errMsg = error.response?.data?.error || 'Ошибка генерации варианта'
        const details = error.response?.data?.details || []

        this.$q.notify({
          color: 'negative',
          message: errMsg + (details.length ? ': ' + details.join(', ') : ''),
          icon: 'sym_o_warning'
        })
      } finally {
        this.isGeneratingRandom = false
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
      this.isLoading = true
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
          this.isLoading = false
        });
    },
    fetchTasksByType(examType, taskSubTypeId) {
      this.isLoading = true
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
          this.isLoading = false
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
  max-width: 900px !important;
  margin: 0 auto 1.5rem auto !important;
  /* Центрирование карточки */
}

/* Контейнер внутри карточки */
:deep(.selection-card .row) {
  display: flex;
  align-items: center;
  justify-content: center;
  /* Центрирование содержимого */
  gap: 1rem;
  flex-wrap: wrap;
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

/* Чипы выбора */
.selection-chips {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

:deep(.selection-chip) {
  border-radius: 24px !important;
  padding: 0 !important;
  margin: 0 !important;
  height: auto !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1) !important;
  transition: all 0.2s ease !important;
}

:deep(.selection-chip:hover) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* Контейнер внутри чипа */
.chip-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px 8px 12px;
}

/* Иконка внутри чипа */
.chip-content .q-icon {
  flex-shrink: 0;
}

/* Текст внутри чипа */
.chip-text {
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

/* Адаптивность для мобильных */
@media (max-width: 600px) {
  .selection-chips {
    gap: 0.5rem;
  }

  :deep(.selection-chip) {
    border-radius: 20px !important;
  }

  .chip-content {
    padding: 6px 12px 6px 10px;
    gap: 0.4rem;
  }

  .chip-content .q-icon {
    font-size: 18px !important;
  }

  .chip-text {
    font-size: 0.85rem;
  }
}

@media (max-width: 400px) {
  .chip-content {
    padding: 5px 10px 5px 8px;
  }

  .chip-text {
    font-size: 0.8rem;
  }
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

/* Сетка выбора: 2 колонки, последний элемент по центру */
.options-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

/* Каждая карточка занимает 50% ширины */
.options-grid .option-card {
  flex: 0 0 calc(50% - 0.75rem);
  max-width: calc(50% - 0.75rem);
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

/* Кнопка Назад */
:deep(.back-btn) {
  border-radius: 10px !important;
  transition: all 0.2s ease !important;
  padding: 6px 16px !important;
}

:deep(.back-btn:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  transform: translateX(-2px);
}

:deep(.back-btn .q-icon) {
  font-size: 1.3rem !important;
  margin-right: 4px !important;
}

/* Адаптивность */
@media (max-width: 768px) {
  :deep(.selection-card .q-card__section) {
    padding: 1rem !important;
  }

  .selection-chips {
    gap: 0.3rem;
  }

  :deep(.selection-chip) {
    padding: 6px 12px !important;
    font-size: 0.85rem !important;
  }
}

@media (max-width: 600px) {
  .options-grid .option-card {
    flex: 0 0 100%;
    max-width: 100%;
  }

  .text-h6 {
    font-size: 1.1rem !important;
  }

  .text-h5 {
    font-size: 1.3rem !important;
  }

  :deep(.option-card .q-card__section) {
    padding: 1.25rem !important;
  }
}

/* Кнопки управления (Назад, Сбросить) */
.selection-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

/* Кнопка Назад */
:deep(.back-btn) {
  border-radius: 10px !important;
  transition: all 0.2s ease !important;
  padding: 6px 16px !important;
}

:deep(.back-btn:hover) {
  background-color: rgba(0, 0, 0, 0.05) !important;
  transform: translateX(-2px);
}

:deep(.back-btn .q-icon) {
  font-size: 1.3rem !important;
  margin-right: 4px !important;
}

@media (max-width: 600px) {
  :deep(.selection-card) {
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  :deep(.selection-card .q-card__section) {
    padding: 1rem !important;
  }

  .selection-chips {
    gap: 0.3rem;
  }

  :deep(.selection-chip) {
    padding: 6px 12px !important;
    font-size: 0.85rem !important;
  }
}
</style>