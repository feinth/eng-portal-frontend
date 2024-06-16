<template>
  <div class="bg-gray-100 p-4 rounded-lg shadow-md">
    <p class="text-lg font-bold text-gray-800 mt-4">
      Task: {{ task.task_number }}
    </p>
    <h2 class="text-lg font-bold text-gray-800 mt-4">{{ task.taskHeader }}</h2>
    <q-separator spaced class="my-2" />
    <!-- Горизонтальный разделитель -->
    <p class="text-gray-700 mt-2 text-base">{{ task.taskText }}</p>
  </div>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true
    }
  }
}
</script>
