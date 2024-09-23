<template>
  <Timer
    v-if="showTimerPrepare"
    :duration="5"
    :audioSrc="task.audio_guidance"
    :type="'test'"
    @countdown-finished="startPrepare"
  />
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
import Timer from '../utils/timer.vue'
import MarkdownView from '../utils/markdown-view.vue'
import MicrophoneFooterPrepare from '../microphone/microphone-footer-prepare.vue'
import MicrophoneFooterRecord from '../microphone/microphone-footer-record.vue'
export default {
  components: {
    Timer,
    MarkdownView,
    MicrophoneFooterPrepare,
    MicrophoneFooterRecord
  },
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
