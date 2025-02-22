<template>
  <q-page class="q-pa-md payment-page">
    <div class="text-h4 text-center q-mb-md">Оплата подписки</div>
    <q-separator class="q-my-md" />
    <div v-if="plan" class="text-center">
      <p class="text-subtitle1">Вы выбрали тариф: <strong>{{ plan.title }}</strong></p>
      <p class="text-subtitle1 q-mb-md">Сумма к оплате: <strong>{{ plan.price }}</strong></p>
      <q-btn
        color="primary"
        label="Оплатить через СБП"
        @click="processPayment"
        class="full-width q-mb-md"
      />
      <q-btn
        color="grey"
        label="Вернуться к выбору тарифа"
        @click="$router.push('/profile')"
        class="full-width"
      />
    </div>
    <div v-else class="text-center">
      <p class="text-subtitle1 q-mb-md">Ошибка: данные о тарифе отсутствуют.</p>
      <q-btn
        color="primary"
        label="Вернуться к выбору тарифа"
        @click="$router.push('/profile')"
        class="full-width"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      plan: null
    }
  },
  created() {
    this.plan = this.$route.query.plan
  },
  methods: {
    processPayment() {
      this.$q.notify({
        type: 'positive',
        message: 'Оплата успешно завершена!'
      })
      this.$router.push('/profile')
    }
  }
}
</script>

<style scoped>
.payment-page {
  max-width: 600px;
  margin: 0 auto;
}

@media (max-width: 600px) {
  .text-h4 {
    font-size: 1.5rem;
  }
}
</style>