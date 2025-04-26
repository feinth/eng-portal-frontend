<template>
  <div class="bg-gray-100 p-4 rounded-lg shadow-md">
    <p class="text-h4 font-bold text-gray-800 mt-4">
      {{ `Task ${task.number}.` }}
    </p>
    <p class="text-h5 font-bold text-gray-800 mt-4">
      {{ task.header }}
    </p>
    <q-separator spaced class="my-2" />
    <p class="text-h5 font-bold text-gray-800 mt-4">
      {{ task.description }}
    </p>
    <div v-for="(question, index) in task.questions" :key="index">
    <p class="text-h5 font-bold text-gray-800 mt-4">
      {{ `${index+1}. ` + question.description }}
    </p>
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
  }
}
</script>
