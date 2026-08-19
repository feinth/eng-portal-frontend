<template>
  <div class="task-container">
    <!-- Заголовок и текст задания в одну строку -->
    <div class="task-intro">
      <span class="task-title">{{ `Task ${task.number}.` }}</span>
      <MarkdownView class="task-header-text" :content="task.header" />
    </div>
    <div class="header-card">
      <MarkdownView class="task-description" :content="task.description" />
    </div>
    <MarkdownView class="task-description"
      content="You will speak for not more than 3 minutes (12–15 sentences). You have to talk continuously." />

    <div v-if="images.length > 0" class="images-grid">
      <q-img v-for="(image, index) in images" :key="index" :src="image.image" class="task-img" fit="cover" />
    </div>

  </div>
</template>

<script>
import MarkdownView from '../utils/markdown-view.vue'

export default {
  components: {
    MarkdownView
  },
  props: {
    task: {
      type: Object,
      required: true
    }
  },
  computed: {
    images() {
      return this.task?.images || []
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
.task-header-text {
  display: inline;
}

.task-header-text :deep(p) {
  display: inline;
  font-size: 1.3rem;
  line-height: 1.9;
  color: #2B2D42;
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

@media (max-width: 480px) {
  .task-container {
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }

  .task-title {
    font-size: 1.5rem;
    display: block;
    margin-bottom: 0.5rem;
  }
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
</style>