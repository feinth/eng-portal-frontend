<template>
  <div class="top text-center">
    <q-btn @click="resetSelection" class="custom-secondary-button" color="red" label="Сбросить выбор" unelevated />
    <p class="mb-2">Экзамен: {{ selectedMainType?.label }}</p>
    <p class="mb-2">Тип задания: {{ selectedTaskType?.label }}</p>
    <p v-if="selectedExamType !== null" class="mb-2">
      Набор заданий: {{ selectedExamType?.label }}
    </p>
  </div>
  <div class="flex justify-center min-h-screen">
    <div v-if="!selectedMainType" class="space-y-4 text-center">
      <h1 class="text-2xl font-bold mb-4">Выберите тип экзамена</h1>
      <div class="button-container">
        <q-btn v-for="type in mainTypes" :key="type.id" @click="selectMainType(type)" class="custom-button"
          color="primary" :label="type.label" unelevated />
      </div>
    </div>

    <div v-else class="space-y-4 text-center">
      <h1 class="text-2xl font-bold mb-4">{{ currentStepTitle }}</h1>
      <div class="button-container">
        <q-btn v-for="type in currentStepOptions" :key="type.id" @click="handleStepSelection(type)"
          class="custom-button" color="primary" :label="type.label" unelevated />
      </div>
    </div>

    <div>
      <div v-if="tasks" class="tasks-list-container">
        <tasks-list :tasks="tasks" />
      </div>
    </div>
  </div>
</template>

<script>
import TasksList from '../components/task-list.vue'
import { useExamStore } from '../stores/exam.store'

export default {
  name: 'TrainingPage',
  components: {
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
      tasks: null
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
    selectMainType(type) {
      this.selectedMainType = type
    },
    handleStepSelection(type) {
      if (!this.selectedTaskType) {
        this.selectedTaskType = type
        if (this.selectedMainType?.id === 2 && this.selectedTaskType?.id === 1) {
          this.fetchTasks(this.selectedMainType.id, this.selectedTaskType.id)
        }
      } else if (this.selectedMainType.id === 1 && this.selectedTaskType.id === 2) {
        this.selectedTaskType = type
      } else if (this.selectedMainType.id === 2 && this.selectedTaskType.id === 2) {
        this.selectedTaskType = type
      } else if (!this.selectedExamType && this.selectedTaskType.label === 'Экзамен' && this.selectedMainType.label === 'ОГЭ') {
        this.selectedExamType = type
        this.fetchTasks(type.id)
      }
    },
    resetSelection() {
      this.selectedMainType = null
      this.selectedTaskType = null
      this.selectedExamType = null
      this.tasks = null
    },
    fetchTasks() {
      let fipi = null;
      if (this.selectedMainType?.label === 'ОГЭ' && this.selectedExamType) {
        // Если выбран ОГЭ и тип варианта, определяем значение fipi
        fipi = this.selectedExamType.id === 1 ? 0 : 1; // 0 для авторских, 1 для ФИПИ
      }

      this.store
        .getExams(this.selectedMainType.type, fipi)
        .then((result) => {
          this.tasks = result;
        });
    }
  }
}
</script>

<style scoped>
/* Общие стили */
.space-y-4>*+* {
  margin-top: 1rem;
}

.button-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
}

.custom-button {
  flex: 1 1 45%;
  /* Кнопки занимают 45% ширины контейнера */
  max-width: 200px;
  /* Максимальная ширина кнопки */
  margin: 0.25rem;
  font-size: 1rem;
  color: #ffffff;
}

.custom-secondary-button {
  color: #ffffff;
}

/* Адаптивные стили для мобильных устройств */
@media (max-width: 600px) {
  .custom-button {
    flex: 1 1 100%;
    /* Кнопки занимают всю ширину на мобильных устройствах */
    max-width: 100%;
    font-size: 0.875rem;
  }

  h1 {
    font-size: 1.5rem;
  }

  p {
    font-size: 0.875rem;
  }
}
</style>