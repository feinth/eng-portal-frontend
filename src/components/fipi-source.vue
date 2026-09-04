<template>
  <p class="fipi-source">
    Источник: ФГБНУ «ФИПИ».
    <a href="https://oge.fipi.ru/bank/index.php" target="_blank" rel="noopener noreferrer" class="fipi-link">Открытый
      банк заданий ОГЭ</a>
  </p>
</template>
<script>
export default {
  name: 'FipiSource'
}
</script>
<style scoped>
.fipi-source {
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #8A94A6;
  line-height: 1.5;
}

.fipi-link {
  color: var(--q-primary);
  text-decoration: none;
  border-bottom: 1px dashed currentColor;
  transition: border-color 0.2s ease;
}

.fipi-link:hover {
  border-bottom-style: solid;
}
</style>