<template>
  <div v-if="countdown > 0" class="countdown-container">
    <p>Be ready for the test</p>

    <p>{{ countdown }}</p>

    <p>seconds</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      countdown: 5,
    };
  },
  mounted() {
    setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      }
    }, 1000);
  },
};
</script>

<style>
.countdown-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 2rem;
}
</style>
