<template>
  <div class="bg-gray-100 p-4 rounded-lg shadow-md">
    <p class="text-h4 text-gray-800 mt-4">
      {{ `Task ${task.type}.` }}
    </p>
    <p class="text-h5 text-gray-800 mt-4">
      {{ task.header }}
    </p>
    <q-separator spaced class="my-2" />
    <MarkdownView class="text-h5 text-gray-800 mt-4" :content="task.description" />
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
