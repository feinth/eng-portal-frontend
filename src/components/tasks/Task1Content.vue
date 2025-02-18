<template>
  <div class="task-container bg-gray-100 p-4 rounded-lg shadow-md">
    <p class="text-h4 text-gray-800 task-title">
      {{ `Task ${task.type}.` }}
    </p>
    <p class="text-h5 text-gray-800 task-header mt-4">
      {{ task.header }}
    </p>
    <q-separator spaced class="my-2" />
    <MarkdownView class="markdown-content text-gray-800 mt-4" :content="task.description" />
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
.task-container {
  margin: 0 auto; /* Центрирование контейнера */
  padding: 16px; /* Отступы внутри контейнера */
}

.image-container {
  display: flex;
  justify-content: center;
  /* Центрируем изображения */
  align-items: center;
  flex-wrap: wrap;
  /* Позволяет переносить изображения на новую строку */
  gap: 10px;
  /* Добавляем небольшой отступ между изображениями */
  width: 100%;
}

.image-max-size {
  width: 45%;
  /* Каждое изображение занимает примерно половину ширины */
  object-fit: contain;
}

@media (max-width: 768px) {
  .image-max-size {
    width: 100%;
    /* На маленьких экранах изображения занимают всю ширину */
  }
}

/* Стили для текста поверх изображения */
.image-text {
  position: absolute;
  top: 50%;
  /* Расположить по середине изображения */
  left: 50%;
  /* Центрировать по горизонтали */
  transform: translate(-50%,
      -50%);
  /* Сдвинуть текст для точного центрирования */
  color: white;
  /* Цвет текста (или другой, если нужно) */
  font-weight: bold;
  /* Жирный шрифт для текста */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  /* Тень для улучшения читабельности */
  text-align: center;
}
</style>