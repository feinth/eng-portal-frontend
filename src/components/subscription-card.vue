<template>
  <q-card
    class="shadow-md hover:shadow-lg transition-shadow h-full flex flex-col"
  >
    <q-card-section class="text-center p-4 flex-grow">
      <div class="text-2xl font-bold text-teal-600 mb-4">{{ title }}</div>
      <ul class="text-left text-gray-800 mb-4 list-disc list-inside">
        <li v-for="benefit in benefits" :key="benefit" class="text-justify">
          {{ benefit }}
        </li>
      </ul>
    </q-card-section>
    <q-card-actions align="center">
      <div class="text-2xl font-extrabold text-teal-900 mb-4">{{ price }}</div>

      <q-btn flat label="Подписаться" color="teal" class="q-mb-md"></q-btn>
    </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'SubscriptionCard',
  props: {
    title: {
      type: String,
      required: true
    },
    benefits: {
      type: Array,
      required: true
    },
    price: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped>
.text-teal-700 {
  color: #285e61;
}

.text-teal-900 {
  color: #1c3d45;
}

.text-gray-800 {
  color: #2d3748;
}

.list-disc {
  list-style-type: disc;
}

.list-inside {
  list-style-position: inside;
}

.h-full {
  height: 100%;
}

.flex-grow {
  flex-grow: 1;
}

.text-justify {
  text-align: justify;
}
</style>
