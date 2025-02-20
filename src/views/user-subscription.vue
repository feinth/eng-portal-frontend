<template>
  <div>
    <q-expansion-item class="text-h5" expand-separator :label="`Платная подписка`">
      <q-card>
        <q-card-section>
          <q-separator />
          <div v-if="user.subscription" class="q-mt-md">
            <p class="text-subtitle1">Ваша подписка активна до: <strong>{{ user.subscription.end_date }}</strong></p>
            <p class="text-subtitle1">Тип подписки: <strong>{{ user.subscription.type }}</strong></p>
          </div>
          <div v-else class="q-mt-md">
            <p class="text-subtitle1 text-center q-mb-md"><strong>У вас нет активной подписки</strong></p>
            <div class="row q-col-gutter-md justify-center">
              <div v-for="(plan, index) in benefits" :key="index" class="col-12 col-sm-6 col-md-4">
                <q-card class="plan-card">
                  <q-card-section>
                    <div class="text-h6 text-center"><strong>{{ plan.title }}</strong></div>
                    <q-separator class="q-my-md" />
                    <ul class="q-pl-md">
                      <li v-for="(benefit, i) in plan.benefits" :key="i" class="q-my-xs">
                        {{ benefit }}
                      </li>
                    </ul>
                  </q-card-section>
                  <q-card-actions class="justify-center">
                    <q-btn color="primary" :label="plan.price" @click="selectPlan(plan)" class="full-width" />
                  </q-card-actions>
                </q-card>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-expansion-item>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      benefits: [
        {
          id: 1,
          title: 'Beginner',
          benefits: [
            'Все ответы сохраняются в личном кабинете',
            'Проверка 1 ответа устной части ЕГЭ/ОГЭ',
          ],
          price: '500₽ в месяц'
        },
        {
          id: 2,
          title: 'Intermediate',
          benefits: [
            'Все ответы сохраняются в личном кабинете',
            'Проверка 2 ответов устной части ЕГЭ/ОГЭ',
            'Консультации с преподавателем в чате'
          ],
          price: '1000₽ в месяц'
        },
        {
          id: 3,
          title: 'Advanced',
          benefits: [
            'Все ответы сохраняются в личном кабинете',
            'Проверка 4 ответов устной части ЕГЭ/ОГЭ',
            'Возможность индивидуального занятия с преподавателем'
          ],
          price: '2000₽ в месяц'
        }
      ]
    }
  },
  methods: {
    selectPlan(plan) {
      this.$q.dialog({
        title: 'Подтверждение выбора',
        message: `Вы выбрали тариф "${plan.title}". Перейти к оплате?`,
        cancel: true,
        persistent: true
      }).onOk(() => {
        this.redirectToPayment(plan)
      })
    },
    redirectToPayment(plan) {
      this.$router.push({
        path: '/payment',
        query: {
          plan: plan.id
        }
      })
    }
  }
}
</script>

<style scoped>
.plan-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.2s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

ul {
  list-style-type: disc;
  padding-left: 20px;
}

@media (max-width: 600px) {
  .text-h6 {
    font-size: 1.25rem;
  }

  .plan-card {
    margin-bottom: 20px;
  }
}
</style>