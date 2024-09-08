<template>
  <div class="flex justify-center min-h-screen">
    <div v-if="!selectedMainType" class="space-y-4 text-center">
      <h1 class="text-2xl font-bold mb-4">Выберите тип экзамена</h1>
      <q-btn
        v-for="type in mainTypes"
        :key="type.id"
        @click="selectMainType(type)"
        class="custom-button"
        color="primary"
        :label="type.label"
        unelevated
      />
    </div>
    <div v-else-if="!selectedTaskType" class="space-y-4 text-center">
      <h1 class="text-2xl font-bold mb-4">Выберите тип задания</h1>
      <q-btn
        v-for="type in taskTypes"
        :key="type.id"
        @click="selectTaskType(type)"
        class="custom-button"
        color="primary"
        :label="type.label"
        unelevated
      />
    </div>
    <div
      v-else-if="
        !selectedExamType &&
        selectedTaskType.label === 'Экзамен' &&
        selectedMainType.label === 'ОГЭ'
      "
      class="space-y-4 text-center"
    >
      <h1 class="text-2xl font-bold mb-4">Выберите варианты</h1>
      <q-btn
        v-for="type in examTypes"
        :key="type.id"
        @click="selectExamType(type)"
        class="custom-button"
        color="primary"
        :label="type.label"
        unelevated
      />
    </div>
    <div v-else class="text-center">
      <h1 class="text-2xl font-bold mb-4">Ваш выбор</h1>
      <q-btn
        @click="resetSelection"
        class="custom-secondary-button"
        color="red"
        label="Сбросить выбор"
        unelevated
      />
      <p class="mb-2">Экзамен: {{ selectedMainType.label }}</p>
      <p class="mb-2">Тип задания: {{ selectedTaskType.label }}</p>
      <p v-if="selectedExamType !== null" class="mb-2">
        Набор заданий: {{ selectedExamType.label }}
      </p>

      <!-- Слот для отображения списка заданий -->
      <div v-if="tasks" class="tasks-list-container">
        <tasks-list :tasks="tasks" @taskLoaded="onTaskLoaded" />
      </div>
    </div>
  </div>
</template>

<script>
import TasksList from '../components/task-list.vue'
import { useExamStore } from '../stores/exam.store'
import { router } from '../router/router'
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
      selectedMainType: null,
      selectedTaskType: null,
      selectedExamType: null,
      tasks: null,
      router: router
    }
  },
  methods: {
    selectMainType(type) {
      this.selectedMainType = type
    },
    selectTaskType(type) {
      this.selectedTaskType = type
      if (this.selectedMainType?.id === 2 && this.selectedTaskType?.id === 1) {
        this.fetchTasks(this.selectedMainType.id, this.selectedTaskType.id)
      }
    },
    selectExamType(type) {
      this.selectedExamType = type
      this.fetchTasks(type.id)
    },
    resetSelection() {
      this.selectedMainType = null
      this.selectedTaskType = null
      this.selectedExamType = null
      this.tasks = null
    },
    fetchTasks(idTaskType) {
      this.store
        .getExams(this.selectedMainType.type, idTaskType)
        .then((result) => {
          this.tasks = result
        })
    },
    onTaskLoaded() {
      this.router.push('/microphone-test')
    }
  }
}
</script>

<style scoped>
/* Дополнительные стили */
.space-y-4 > * + * {
  margin-top: 1rem;
}
.custom-button {
  width: 200px; /* Ширина кнопок */
  margin: 0 0.5rem; /* Отступы между кнопками */
  font-size: 1.25rem; /* Размер шрифта */
  color: #ffffff; /* Цвет текста */
}

.custom-secondary-button {
  color: #ffffff; /* Цвет текста */
  flex-wrap: wrap; /* Добавлено для переноса кнопок на следующую строку */
}
</style>
