<template>
  <div class="task-container">
    <!-- Заголовок и тайминг -->
    <div class="task-intro">
      <span class="task-title">{{ `Task ${task.number}.` }}</span>
      <task-timing :exam-type="examType" :task-type="task.type" class="task-timing-right" />
    </div>

    <!-- Текст задания во всю ширину -->
    <MarkdownView class="task-header-text" :content="task.header" />

    <MarkdownView v-if="examType === 'oge'" class="task-description" content="Remember to say" />

    <div class="header-card">
      <MarkdownView class="task-description" :content="task.description" />
    </div>
    <MarkdownView class="task-description" :content="speakingTimeText" />

    <div v-if="images.length > 0" class="images-grid">
      <q-img v-for="(image, index) in images" :key="index" :src="image.image" class="task-img" fit="cover" />
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
  },
  computed: {
    images() {
      return this.task?.images || []
    },
    speakingTimeText() {
      if (this.examType === 'oge') {
        return "You will speak for not more than 2 minutes (10–12 sentences). You have to talk continuously."
      }
      return "You will speak for not more than 3 minutes (12–15 sentences). You have to talk continuously."
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
.task-header-text {
  display: block;
  margin-bottom: 1.5rem;
}

.task-header-text :deep(p) {
  font-size: 1rem;
  line-height: 1.9;
  color: #2B2D42;
  margin-bottom: 0;
}

/* Плашка с таймингом */
.task-timing-right {
  flex-shrink: 0;
}

/* Описание задания */
.task-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #3D3D3D;
}

.task-description :deep(p) {
  margin-bottom: 1.25rem;
}

.task-description :deep(p:last-child) {
  margin-bottom: 0;
}

/* Скруглённая рамка для списка пунктов (blockquote или список) */
.task-description :deep(blockquote),
.task-description :deep(> ul) {
  border: 2px solid var(--q-primary);
  border-radius: 16px;
  padding: 1.25rem 2rem;
  margin: 1.5rem 0;
  background-color: #FFFFFF;
}

/* Если список внутри blockquote — убираем двойную рамку */
.task-description :deep(blockquote) ul {
  border: none;
  padding: 0;
  margin: 0;
}

/* Квадратные маркеры списка, как в примере */
.task-description :deep(ul) {
  list-style: square;
  padding-left: 1.5rem;
}

.task-description :deep(li) {
  margin-bottom: 0.6rem;
}

.task-description :deep(li:last-child) {
  margin-bottom: 0;
}

/* Ссылки в цвет primary, как в примере */
.task-header-text :deep(a),
.task-description :deep(a) {
  color: var(--q-primary);
  font-weight: 600;
  text-decoration: none;
}

/* Две картинки рядом по центру */
.images-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  margin: 2rem auto 0;
  max-width: 800px;
}

.task-img {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
}

/* Рамка с пунктами */
.header-card {
  border: 2px solid var(--q-primary);
  border-radius: 16px;
  padding: 1.25rem 2rem;
  margin-bottom: 1.5rem;
  background-color: #FFFFFF;
}

/* Каждый абзац внутри рамки — с квадратным маркером */
.header-card :deep(p) {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}

.header-card :deep(p:last-child) {
  margin-bottom: 0;
}

/* Квадратная точка перед каждым пунктом (как в примере) */
.header-card :deep(p)::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0.6em;
  width: 0.45em;
  height: 0.45em;
  background-color: #2B2D42;
}

/* Если в markdown уже есть список — квадратные маркеры */
.header-card :deep(ul) {
  list-style: square;
  padding-left: 1.5rem;
}

.header-card :deep(li) {
  position: relative;
  margin-bottom: 0.6rem;
}

.header-card :deep(li:last-child) {
  margin-bottom: 0;
}

/* Адаптивность */
@media (max-width: 900px) {
  .images-grid {
    grid-template-columns: 1fr;
    gap: 2rem;
    max-width: 500px;
  }
}

@media (max-width: 768px) {
  .task-container {
    padding: 1.75rem 1.5rem;
    border-radius: 16px;
  }

  .task-title {
    font-size: 1.7rem;
  }

  .task-header-text :deep(p),
  .task-description {
    font-size: 1rem;
  }

  .task-description :deep(blockquote),
  .task-description :deep(> ul) {
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
    font-size: 1.5rem;
  }
}
</style>