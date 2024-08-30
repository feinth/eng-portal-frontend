<template>
  <h2>{{ task.header }}</h2>
  <!-- <MarkdownView :content="task.description" /> -->
  <div v-if="task.images">
    <h3>Images:</h3>
    <ul>
      <li v-for="(image, index) in task.images" :key="index">
        <img :src="image.url" :alt="image.header" />
        <p>{{ image.header }}</p>
      </li>
    </ul>
  </div>

  <div v-if="task.audio_guidance">
    <h3>Audio Guidance:</h3>
    <audio :src="task.audio_guidance" controls></audio>
  </div>
</template>

<script>
// import MarkdownView from 'src/components/markdown-view.vue'
export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
}
</style>
