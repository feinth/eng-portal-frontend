<template>
  <q-page class="q-pa-md md:q-pa-lg bg-white">
    <div class="max-w-5xl mx-auto">

      <!-- Приветственный текст -->
      <div class="mb-8 space-y-6">
        <p class="text-lg leading-relaxed text-gray-700 text-justify">
          Здравствуйте, дорогие выпускники и уважаемые коллеги!
        </p>
        <p class="text-lg leading-relaxed text-gray-700 text-justify">
          На этом сайте вы найдёте симулятор устного экзамена для Основного
          государственного экзамена (ОГЭ) и Единого государственного экзамена
          (ЕГЭ). Вы сможете воссоздать атмосферу настоящего экзамена у себя дома
          или на уроке в школе. Для этого мы подготовили авторские варианты по
          различной тематике, согласно темам кодификатора ОГЭ/ЕГЭ.
        </p>
        <p class="text-lg leading-relaxed text-gray-700 text-justify">
          Вы можете работать в нескольких режимах: экзамен, по заданиям, по темам,
          на основе открытого банка заданий ФИПИ (для ОГЭ).
        </p>
      </div>

      <!-- Закомментированный блок с платными услугами (сохранен как есть) -->
      <!-- <h1 class="text-3xl font-extrabold mb-6 text-teal-800 text-left">
        Платные услуги
      </h1>
      <div class="my-8 bg-gray-100 rounded-lg shadow-md p-6 flex items-center">
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="my-8">
              <div class="flex flex-wrap -mx-2">
                <div
                  v-for="benefit in benefits"
                  :key="benefit.title"
                  class="w-full md:w-1/3 p-2"
                >
                  <SubscriptionCard
                    :title="benefit.title"
                    :benefits="benefit.benefits"
                    :price="benefit.price"
                  />
                </div>
              </div>
            </div>
          </q-card-section>
        </q-card-section>
      </div> -->

      <!-- Карточка преподавателя (адаптивная) -->
      <q-card class="teacher-card q-mb-lg">
        <q-card-section horizontal class="teacher-card-section">

          <!-- Текстовая часть -->
          <q-card-section class="col-12 col-md-7 q-pa-lg">
            <div class="text-overline text-primary q-mb-xs">О преподавателе</div>
            <div class="text-h5 q-mb-md">Захарова Татьяна</div>
            <div class="text-body1 text-grey-7">
              Я готовлю детей к ЕГЭ и ОГЭ по английскому уже много лет. Среди
              моих учеников очень большое количество сдали ЕГЭ на 100 баллов.
            </div>
          </q-card-section>

          <!-- Фотография -->
          <q-card-section class="col-12 col-md-5 flex flex-center q-pa-lg">
            <q-img src="@/assets/teacher-photo.jpg" alt="Teacher Photo" class="teacher-photo" fit="cover" />
          </q-card-section>

        </q-card-section>
      </q-card>

    </div>
  </q-page>
</template>

<script>
import SubscriptionCard from '../components/utils/subscription-card.vue'

export default {
  name: 'MainPage',
  components: {
    SubscriptionCard
  },
  data() {
    return {
      benefits: [
        {
          title: 'Beginner',
          benefits: [
            'Все ответы сохраняются в личном кабинете',
            'Проверка 1 ответа устной части ЕГЭ/ОГЭ',
            'Дополнительная поддержка'
          ],
          price: '500₽ в месяц'
        },
        {
          title: 'Intermediate',
          benefits: [
            'Все ответы сохраняются в личном кабинете',
            'Проверка 2 ответов устной части ЕГЭ/ОГЭ',
            'Консультации с преподавателем в чате'
          ],
          price: '1000₽ в месяц'
        },
        {
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
  }
}
</script>

<style scoped>
/* Стили для текста */
.text-justify {
  text-align: justify;
}

.space-y-6>*+* {
  margin-top: 1.5rem;
}

/* Карточка преподавателя */
:deep(.teacher-card) {
  border-radius: 16px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease !important;
  overflow: hidden;
}

:deep(.teacher-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
}

/* Адаптивность для секции карточки */
:deep(.teacher-card-section) {
  flex-direction: column;
}

@media (min-width: 1024px) {
  :deep(.teacher-card-section) {
    flex-direction: row;
  }
}

/* Фотография преподавателя */
:deep(.teacher-photo) {
  border-radius: 12px !important;
  max-width: 300px;
  max-height: 300px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1023px) {
  :deep(.teacher-photo) {
    max-width: 250px;
    max-height: 250px;
    margin-top: 1rem;
  }
}

/* Цвета текста */
.text-primary {
  color: var(--q-primary) !important;
}

.text-grey-7 {
  color: #616161 !important;
}

/* Отступы для адаптивности */
@media (max-width: 768px) {
  .max-w-5xl {
    max-width: 100%;
  }

  :deep(.q-card-section.q-pa-lg) {
    padding: 1.5rem !important;
  }
}
</style>