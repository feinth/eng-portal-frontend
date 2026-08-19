<template>
  <div class="task-container">
    <!-- Заголовок и текст задания в одну строку -->
    <div class="task-intro">
      <span class="task-title">{{ `Task ${task.number}.` }}</span>
      <MarkdownView class="task-header" :content="task.header" />
    </div>

    <!-- Текст задания в рамке -->
    <div class="header-card">
      <MarkdownView class="task-description" :content="task.description" />
    </div>
  </div>
</template>

<script>
import MarkdownView from '../utils/markdown-view.vue'

export default {
  components: { MarkdownView },
  props: {
    task: {
      type: Object,
      required: true
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

/* Заголовок + текст в одну строку */
.task-intro {
  margin-bottom: 1.5rem;
  line-height: 1.9;
}

.task-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--q-primary);
  margin-right: 0.5rem;
  line-height: 1.3;
}

/* Текст задания продолжается в строку после заголовка */
.task-header {
  display: inline;
}

.task-header :deep(p) {
  display: inline;
  font-size: 1.3rem;
  line-height: 1.6;
  color: #2B2D42;
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