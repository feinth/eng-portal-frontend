<template>
  <div class="task-container">
    <!-- Заголовок и тайминг -->
    <div class="task-intro">
      <span class="task-title">{{ `Task ${task.number}.` }}</span>
      <task-timing :exam-type="examType" :task-type="task.type" class="task-timing-right" />
    </div>

    <!-- Текст задания во всю ширину -->
    <MarkdownView class="task-header" :content="task.header" />

    <!-- Текст задания в рамке -->
    <div class="header-card">
      <MarkdownView class="task-description" :content="task.description" />
    </div>
    <fipi-source v-if="examType === 'oge'" />
  </div>
</template>

<script>
import MarkdownView from '../utils/markdown-view.vue'
import FipiSource from '../fipi-source.vue'
import TaskTiming from './task-timing.vue'

export default {
  components: {
    MarkdownView,
    FipiSource,
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

/* Заголовок и тайминг */
.task-intro {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap; /* Позволяет переносить элементы */
  margin-bottom: 1.5rem;
}

.task-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--q-primary);
  line-height: 1.3;
}

/* Текст задания во всю ширину */
.task-header {
  margin-bottom: 1.5rem;
}

.task-header :deep(p) {
  font-size: 1rem;
  line-height: 1.6;
  color: #2B2D42;
  margin-bottom: 0;
}

/* Плашка с таймингом */
.task-timing-right {
  flex-shrink: 0;
}

/* Рамка с текстом задания */
.header-card {
  border: 2px solid var(--q-primary);
  border-radius: 16px;
  padding: 1.25rem 2rem;
  background-color: #FFFFFF;
}

/* Текст внутри рамки */
.task-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #3D3D3D;
}

.task-description :deep(p) {
  margin-bottom: 1rem;
}

.task-description :deep(p:last-child) {
  margin-bottom: 0;
}

/* Адаптивность */
@media (max-width: 768px) {
  .task-container {
    padding: 1.75rem 1.5rem;
    border-radius: 16px;
  }

  .task-title {
    font-size: 1.6rem;
  }

  .task-header :deep(p),
  .task-description {
    font-size: 1rem;
  }

  .header-card {
    padding: 1rem 1.25rem;
  }
}

/* На мобильных: тайминг переносится ПОД заголовок */
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