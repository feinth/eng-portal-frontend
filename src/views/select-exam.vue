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
            <q-chip v-if="selectedMainType" color="primary" text-color="white"
              class="selection-chip selection-chip--clickable" square clickable @click="editMainType">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
                Нажмите, чтобы изменить тип экзамена
              </q-tooltip>
              <div class="chip-content">
                <q-icon name="sym_o_school" size="20px" />
                <span class="chip-text">{{ selectedMainType.label }}</span>
                <q-icon name="sym_o_edit" size="16px" class="chip-edit-icon" />
              </div>
            </q-chip>

            <q-chip v-if="selectedTaskType" color="secondary" text-color="white"
              class="selection-chip selection-chip--clickable" square clickable @click="editTaskType">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
                Нажмите, чтобы изменить тип задания
              </q-tooltip>
              <div class="chip-content">
                <q-icon name="sym_o_assignment" size="20px" />
                <span class="chip-text">{{ selectedTaskType.label }}</span>
                <q-icon name="sym_o_edit" size="16px" class="chip-edit-icon" />
              </div>
            </q-chip>

            <q-chip v-if="selectedExamType" color="accent" text-color="white"
              class="selection-chip selection-chip--clickable" square clickable @click="editExamType">
              <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 8]">
                Нажмите, чтобы изменить тип варианта
              </q-tooltip>
              <div class="chip-content">
                <q-icon name="sym_o_description" size="20px" />
                <span class="chip-text">{{ selectedExamType.label }}</span>
                <q-icon name="sym_o_edit" size="16px" class="chip-edit-icon" />
              </div>
            </q-chip>
          </div>

          <!-- Кнопки управления -->
          <!-- <div class="selection-actions">
            <q-btn flat dense no-caps icon="sym_o_arrow_back" label="Назад" color="grey-7" @click="goBack"
              class="back-btn q-mr-sm" />
          </div> -->

        </q-card-section>
      </q-card>

      <!-- Индикатор загрузки (для списков) -->
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

      <!-- Сообщение об отсутствии данных (ИСПРАВЛЕНО: выровнено по центру) -->
      <q-banner
        v-else-if="!isLoading && ((selectedTaskType?.id === 2 && tasks && tasks.length === 0) || (selectedTaskType?.id === 1 && exams && exams.length === 0))"
        class="no-data-banner q-mb-lg text-center" rounded>
        <div class="flex flex-center q-pa-md">
          <q-icon name="sym_o_info" color="warning" size="2rem" class="q-mr-sm" />
          <span class="text-body1 text-weight-medium">
            <span v-if="selectedTaskType?.id === 2">Нет доступных заданий для выбранного типа</span>
            <span v-else-if="selectedTaskType?.id === 1">Нет доступных экзаменов для выбранного типа</span>
          </span>
        </div>
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
    <!-- PDF-сборники для скачивания -->
    <div v-if="!selectedMainType && !isLoading && !tasks && !exams" class="pdf-section q-mt-xl">
      <div class="row items-center q-mb-md">
        <q-separator class="col" />
        <div class="text-overline text-grey-6 q-px-md">Материалы для скачивания</div>
        <q-separator class="col" />
      </div>

      <div class="pdf-cards">
        <q-card v-for="res in pdfResources" :key="res.path" class="pdf-card">
          <q-card-section horizontal class="items-center q-pa-md text-left">

            <div class="pdf-icon-wrap bg-primary-1 flex flex-center q-mr-md">
              <q-icon name="sym_o_picture_as_pdf" size="28px" color="primary" />
            </div>

            <div class="pdf-info col">
              <div class="text-subtitle1 text-weight-medium text-grey-9">
                {{ res.title }}
              </div>
              <div class="text-caption text-grey-6">{{ res.description }}</div>
              <div class="pdf-meta text-caption text-grey-5 q-mt-xs">
                <q-icon name="sym_o_description" size="14px" class="q-mr-xs" />
                PDF · {{ res.size }}
              </div>
            </div>

            <q-btn unelevated no-caps color="primary" icon="sym_o_download" label="Скачать"
              class="pdf-download-btn q-ml-md" @click="downloadPdf(res)" />

          </q-card-section>
        </q-card>
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
      pdfResources: [],
      store: useExamStore(),
      mainTypes: [
        { id: 1, label: 'ОГЭ', type: 'oge' },
        { id: 2, label: 'ЕГЭ', type: 'ege' }
      ],
      taskTypes: [
        { id: 1, label: 'Экзамен' },
        { id: 2, label: 'По заданиям' }
      ],
      allExamTypes: [
        { id: 1, label: 'Авторские варианты', type: 'author' },
        { id: 2, label: 'На основе открытого банка ФИПИ', type: 'fipi' },
        { id: 3, label: 'Случайный вариант', type: 'random' }
      ],
      ogeTaskSubTypes: [
        { id: 1, label: 'Задание 1', taskType: 1 },
        { id: 2, label: 'Задание 2', taskType: 3 },
        { id: 3, label: 'Задание 3', taskType: 4 }
      ],
      egeTaskSubTypes: [
        { id: 1, label: 'Задание 1', taskType: 1 },
        { id: 2, label: 'Задание 2', taskType: 2 },
        { id: 3, label: 'Задание 3', taskType: 3 },
        { id: 4, label: 'Задание 4', taskType: 4 }
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
    examTypes() {
      if (this.selectedMainType?.type === 'ege') {
        return this.allExamTypes.filter(t => t.type !== 'fipi')
      }
      return this.allExamTypes
    },

    currentStepTitle() {
      if (!this.selectedMainType) return 'Выберите тип экзамена'
      if (!this.selectedTaskType) return 'Выберите тип задания'

      if (this.selectedTaskType.id === 2) {
        if (this.selectedMainType.id === 1) return 'Выберите тип задания (ОГЭ)'
        if (this.selectedMainType.id === 2) return 'Выберите тип задания (ЕГЭ)'
      }

      if (this.selectedTaskType.id === 1) {
        if (!this.selectedExamType) {
          const examName = this.selectedMainType.label
          return `Выберите тип варианта (${examName})`
        }
        return `Выберите конкретный вариант (${this.selectedMainType.label})`
      }

      return ''
    },

    currentStepOptions() {
      if (!this.selectedMainType) return this.mainTypes
      if (!this.selectedTaskType) return this.taskTypes

      if (this.selectedMainType.id === 1 && this.selectedTaskType.id === 2) {
        return this.ogeTaskSubTypes
      }
      if (this.selectedMainType.id === 2 && this.selectedTaskType.id === 2) {
        return this.egeTaskSubTypes
      }

      if (this.selectedTaskType.id === 1 && !this.selectedExamType) {
        return this.examTypes
      }

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
        this.store.setVariantType(null) // Сброс при возврате назад
        return
      }
      if (this.selectedTaskType) {
        this.selectedTaskType = null
        this.exams = null
        this.tasks = null
        this.store.setVariantType(null)
        return
      }
      if (this.selectedMainType) {
        this.selectedMainType = null
        this.exams = null
        this.tasks = null
        this.store.setVariantType(null)
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
      // Если выбран случайный вариант
      if (type.type === 'random') {
        this.store.setVariantType('random') // Сохраняем в store
        await this.generateRandomExam()
        return
      }

      if (!this.selectedTaskType) {
        this.selectedTaskType = type
        return
      }

      if (this.selectedTaskType.id === 2) {
        this.fetchTasksByType(this.selectedMainType.type, type.taskType)
        return
      }

      if (this.selectedTaskType.id === 1 && !this.selectedExamType) {
        this.selectedExamType = type

        if (type.type === 'author' || type.type === 'fipi') {
          this.store.setVariantType(type.type) // Сохраняем 'author' или 'fipi' в store
          this.fetchExams()
        }
      }
    },

    async generateRandomExam() {
      this.isGeneratingRandom = true
      try {
        const result = await this.store.generateRandomExam(this.selectedMainType.type)
        
        if (result.warnings && result.warnings.length > 0) {
          this.$q.notify({
            color: 'warning',
            message: 'Некоторые задания не были найдены',
            caption: result.warnings.join(', '),
            icon: 'sym_o_warning',
            timeout: 3000
          })
        }

        this.$router.push('/exam')
      } catch (error) {
        const errMsg = error.response?.data?.error || 'Ошибка генерации варианта'
        const details = error.response?.data?.details || []

        this.$q.notify({
          color: 'negative',
          message: errMsg + (details.length ? ': ' + details.join(', ') : ''),
          icon: 'sym_o_error',
          timeout: 4000
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
      this.store.setVariantType(null) // Полный сброс типа варианта
    },

    fetchExams() {
      this.isLoading = true
      let fipi = null

      if (this.selectedMainType?.type === 'oge' && this.selectedExamType) {
        fipi = this.selectedExamType.type === 'fipi' ? 1 : 0
      }

      if (this.selectedMainType?.type === 'ege' && this.selectedExamType) {
        fipi = 0
      }

      this.store
        .getExams(this.selectedMainType.type, fipi)
        .then((result) => {
          this.exams = result
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
        })
    },

    fetchTasksByType(examType, taskSubTypeId) {
      this.isLoading = true
      this.store
        .getTasksByType(examType, taskSubTypeId)
        .then((result) => {
          this.tasks = result
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
        })
    },
    
    editMainType() {
      this.selectedMainType = null
      this.selectedTaskType = null
      this.selectedExamType = null
      this.tasks = null
      this.exams = null
      this.store.setVariantType(null) // Сброс при изменении основного типа
    },

    editTaskType() {
      this.selectedTaskType = null
      this.selectedExamType = null
      this.tasks = null
      this.exams = null
      this.store.setVariantType(null) // Сброс при изменении типа задания
    },

    editExamType() {
      this.selectedExamType = null
      this.exams = null
      this.store.setVariantType(null) // Сброс только типа варианта
    },
    
    buildPdfList() {
      const files = import.meta.glob(
        '../assets/downloads/*.pdf',
        { eager: true, query: '?url', import: 'default' }
      )

      this.pdfResources = Object.entries(files)
        .map(([filePath, url]) => {
          const fileName = decodeURIComponent(filePath.split('/').pop())
          return {
            title: this.fileNameToTitle(fileName),
            fileName,
            url,
            size: null
          }
        })
        .sort((a, b) => a.title.localeCompare(b.title, 'ru'))

      this.loadPdfSizes()
    },

    fileNameToTitle(fileName) {
      return fileName
        .replace(/\.pdf$/i, '')
        .replace(/[-_]+/g, ' ')
        .trim()
    },

    async loadPdfSizes() {
      await Promise.all(
        this.pdfResources.map(async (res) => {
          try {
            const resp = await fetch(res.url, { method: 'HEAD' })
            const len = resp.headers.get('Content-Length')
            if (len) res.size = this.formatBytes(Number(len))
          } catch (e) { /* размер — не критично */ }
        })
      )
    },

    formatBytes(bytes) {
      if (bytes < 1024) return `${bytes} Б`
      if (bytes < 1024 ** 2) return `${Math.round(bytes / 1024)} КБ`
      return `${(bytes / 1024 ** 2).toFixed(1)} МБ`
    },

    downloadPdf(resource) {
      const link = document.createElement('a')
      link.href = resource.url
      link.setAttribute('download', resource.fileName)
      document.body.appendChild(link)
      link.click()
      link.remove()

      this.$q.notify({
        color: 'positive',
        icon: 'sym_o_download_done',
        message: `Загрузка началась: ${resource.title}`,
        position: 'bottom',
        timeout: 2000
      })
    }
  },
  created() {
    this.buildPdfList()
  },
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
}

:deep(.selection-card .row) {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
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

.chip-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 8px 16px 8px 12px;
}

.chip-content .q-icon {
  flex-shrink: 0;
}

.chip-text {
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.options-grid .option-card {
  flex: 0 0 calc(50% - 0.75rem);
  max-width: calc(50% - 0.75rem);
}

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

/* Стили для баннера отсутствия данных */
:deep(.no-data-banner) {
  background-color: #FFF9E6 !important;
  border: 1px solid #FFE082 !important;
  text-align: center !important;
}

:deep(.no-data-banner .q-banner__content) {
  color: #856404 !important;
  padding: 0 !important;
  /* Убираем лишние отступы, так как используем свой q-pa-md */
}

.selection-actions {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
}

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

  /* Кликабельные чипы */
  :deep(.selection-chip--clickable) {
    cursor: pointer !important;
    position: relative;
  }

  :deep(.selection-chip--clickable:hover) {
    filter: brightness(1.1);
  }

  :deep(.selection-chip--clickable:active) {
    transform: scale(0.97) translateY(0) !important;
  }

  .chip-edit-icon {
    opacity: 0.6;
    transition: opacity 0.2s ease, transform 0.2s ease;
    margin-left: 2px;
  }

  :deep(.selection-chip--clickable:hover) .chip-edit-icon {
    opacity: 1;
    transform: rotate(-12deg);
  }

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

  :deep(.selection-card) {
    max-width: 100% !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  :deep(.selection-card .q-card__section) {
    padding: 1rem !important;
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

/* === PDF-секция === */
.pdf-section {
  max-width: 900px;
  margin: 0 auto;
}

.pdf-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

:deep(.pdf-card) {
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease !important;
  overflow: hidden;
}

:deep(.pdf-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
  border-color: var(--q-primary) !important;
}

.pdf-icon-wrap {
  width: 56px;
  height: 56px;
  min-width: 56px;
  border-radius: 16px;
}

:deep(.pdf-download-btn) {
  border-radius: 12px !important;
  padding: 4px 18px !important;
  font-weight: 600 !important;
  white-space: nowrap !important;
}

.pdf-meta {
  display: flex;
  align-items: center;
}

/* Адаптивность */
@media (max-width: 600px) {
  :deep(.pdf-card .q-card__section--horiz) {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
  }

  .pdf-icon-wrap {
    margin: 0 auto 0.75rem auto !important;
  }

  .pdf-meta {
    justify-content: center;
  }

  :deep(.pdf-download-btn) {
    margin-left: 0 !important;
    width: 100%;
  }
}
</style>