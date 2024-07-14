<template>
  <div class="p-4">
    <div v-if="currentTaskIndex < tasks.length">
      <TaskPrepareComponent
        :task="tasks[currentTaskIndex]"
        @prepare-finished="handlePrepareFinished"
        :key="currentTaskIndex"
        v-if="!prepareComplete"
      />
      <TaskAnswerComponent
        :task="tasks[currentTaskIndex]"
        @task-finished="handleTaskFinished"
        :key="currentTaskIndex"
        v-if="prepareComplete"
      />
    </div>
  </div>
</template>

<script>
import TaskPrepareComponent from './task-prepare.vue'
import TaskAnswerComponent from './task-answer.vue'

export default {
  components: {
    TaskPrepareComponent,
    TaskAnswerComponent
  },
  data() {
    return {
      currentTaskIndex: 0,
      prepareComplete: false,
      tasks: [
        {
          prepareTimeout: 30,
          recordTimeout: 60,
          taskText:
            "The Sun is a star like many others in our Milky Way galaxy. It is located at the centre of our solar system. It is a yellow dwarf star that gives off energy as light. The Sun is about a hundred times as wide as the Earth. Since the Sun is all gas, surface features come and go. The Sun and everything that orbits it is in the Milky Way. The Sun orbits around the centre of the Milky Way. It takes along everything in the Solar System. The Sun moves at 820,000 km an hour. At that speed, it still takes 230 million years for a full orbit. Since the Sun is all gas, surface features come and go. If the Sun is viewed through a special solar telescope, dark areas called sunspots can be seen. These areas are caused by the Sun's magnetic field. The sunspots only look dark because the rest of the Sun is very bright. A solar eclipse appears when the moon is between the Earth and the Sun.",
          taskHeader:
            'You are going to read the text aloud. You have 1.5 minutes to read text silently, and then be ready to read it aloud. Remember that you will not have more than 2 minutes for reading aloud.',
          taskNumber: 1
        },
        {
          prepareTimeout: 45,
          recordTimeout: 90,
          taskText:
            "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).",
          taskHeader: 'Why do we use it?',
          taskNumber: 2
        }
      ],
      recordings: []
    }
  },
  methods: {
    async handleTaskFinished(record) {
      this.recordings.push(record)
      this.prepareComplete = false
      this.currentTaskIndex++
    },
    async handlePrepareFinished() {
      this.prepareComplete = true
    }
  }
}
</script>
