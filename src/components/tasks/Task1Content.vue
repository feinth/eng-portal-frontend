<template>
  <div class="task-container bg-gray-100 p-4 rounded-lg shadow-md">
    <p class="text-h4 text-gray-800 task-title">
      {{ `Task ${task.type}.` }}
    </p>
    <p class="text-h6 text-gray-800 task-header mt-4">
      {{ task.header }}
    </p>
    <q-separator spaced class="my-2" />
    <MarkdownView class="text-h6 markdown-content text-gray-800 mt-4" :content="task.description" />
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
</style>