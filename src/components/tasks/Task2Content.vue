<template>
  <div class="bg-gray-100 p-4 rounded-lg shadow-md">
    <div class="row q-col-gutter-lg responsive-layout">
      <div class="col-12 col-md-6">
        <p class="text-h4 font-bold text-gray-800 mt-4">
          {{ `Task ${task.number}.` }}
        </p>
        <p class="text-h5 text-gray-800 mt-4">
          {{ task.header }}
        </p>
        <q-separator spaced class="my-2" />
        <MarkdownView class="text-h5 font-bold text-gray-800 mt-4" :content="task.description" />
        <ul>
          <li v-for="(question, index) in task.questions" :key="index" class="text-h5 font-bold text-gray-800 mt-4">
            {{ `${index + 1}) ` + question.description }}
          </li>
        </ul>
        <br />
        <MarkdownView class="text-h5 font-bold text-gray-800 mt-4"
          :content="'**You have 20 seconds to ask each question.**'" />
      </div>

      <div class="col-12 col-md-6 text-gray-800 my-card image-container">
        <q-item>
          <q-item-section>
            <MarkdownView class="text-h5" :content="task.images[0].header" />
            <q-img :src="task.images[0].image" class="image-max-size" />
          </q-item-section>
        </q-item>
      </div>
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
