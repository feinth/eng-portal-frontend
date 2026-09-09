<template>
  <div class="task-container">
    <div class="task-layout">
      <div class="task-text">
        <!-- Заголовок и плашка тайминга -->
        <div class="task-intro">
          <span class="task-title">{{ `Task ${task.number}.` }}</span>
          <task-timing :exam-type="examType" :task-type="task.type" class="task-timing-right" />
        </div>

        <!-- Текст задания во всю ширину -->
        <MarkdownView class="task-header" :content="task.header" />

        <q-separator spaced class="my-2" />
        <MarkdownView class="task-description" :content="task.description" />
        <div class="questions-list">
          <div v-for="(question, index) in task.questions" :key="index" class="question-item">
            {{ `${index + 1}) ${question.description}` }}
          </div>
        </div>
        <q-separator spaced class="my-2" />
        <MarkdownView class="text-h6 font-bold text-gray-800 mt-4"
          :content="'**You have 20 seconds to ask each question.**'" />
      </div>
      <div class="task-image">
        <q-item>
          <q-item-section>
            <div class="image-header-card">
              <MarkdownView :content="task?.images?.[0].header" />
            </div>
            <q-img :src="task.images[0].image" class="image-max-size" />
          </q-item-section>
        </q-item>
      </div>
    </div>
  </div>
</template>

<script>
import MarkdownView from '../utils/markdown-view.vue'
import TaskTiming from './task-timing.vue'

export default {
  components: {
    MarkdownView,
    TaskTiming
  },
  props: {
    task: {
      type: Object,
      required: true
    },
    examType: {
      type: String,
      default: 'ege'
    }
  }
}
</script>

<style scoped>
/* Контейнер задания */
.task-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2.5rem 3rem;
  background-color: #FFFFFF;
  border-radius: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

/* Двухколоночный макет */
.task-layout {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  gap: 3rem;
  align-items: start;
}

/* Заголовок и плашка */
.task-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap; /* Перенос плашки под заголовок, если не хватает места */
  margin-bottom: 1.5rem;
}

.task-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--q-primary);
  line-height: 1.3;
}

/* Плашка с таймингом */
.task-timing-right {
  flex-shrink: 0;
}

/* Текст задания во всю ширину */
.task-header {
  display: block;
  margin-bottom: 1rem;
}

.task-header :deep(p) {
  font-size: 1rem;
  line-height: 1.9;
  color: #2B2D42;
  margin-bottom: 0;
}

/* Описание задания */
.task-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #3D3D3D;
  margin-bottom: 1.5rem;
}

/* Список вопросов */
.questions-list {
  margin-bottom: 1.5rem;
}

.question-item {
  font-size: 1.1rem;
  line-height: 1.6;
  color: #3D3D3D;
  margin-bottom: 0.5rem;
}

/* Правая колонка с картинкой — опущена ниже заголовка */
.task-image {
  margin-top: 3rem; /* Опускаем картинку ниже строки "Task 2." */
}

/* Рамка-заголовок над изображением */
.image-header-card {
  border: 2px solid var(--q-primary);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  text-align: center;
  color: var(--q-primary);
  font-weight: 600;
  font-size: 1.05rem;
  margin-bottom: 1rem;
  background-color: #FFFFFF;
}

/* Адаптивность: одна колонка на планшете и мобильном */
@media (max-width: 900px) {
  .task-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .task-image {
    margin-top: 0; /* На узких экранах убираем отступ — картинка идёт сразу после текста */
    max-width: 500px;
    margin-left: auto;
    margin-right: auto;
    width: 100%;
  }
}

/* На мобильных: плашка переносится ПОД заголовок */
@media (max-width: 600px) {
  .task-intro {
    flex-direction: column;
    align-items: flex-start;
  }

  .task-timing-right {
    width: 100%;
    margin-top: 0.5rem;
  }
}

@media (max-width: 768px) {
  .task-container {
    padding: 1.75rem 1.5rem;
    border-radius: 16px;
  }

  .task-title {
    font-size: 1.6rem;
  }

  .task-header :deep(p),
  .task-description,
  .question-item {
    font-size: 1rem;
  }
}

@media (max-width: 480px) {
  .task-container {
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }

  .task-title {
    font-size: 1.4rem;
  }
}
</style>