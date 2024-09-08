<template>
  <q-page class="p-6 bg-white">
    <div class="max-w-4xl mx-auto">
      <p class="text-lg mb-6 leading-relaxed text-gray-700 text-justify">
        Здравствуйте, дорогие выпускники и уважаемые коллеги! На этом сайте вы
        найдёте симулятор устного экзамена для Основного государственного
        экзамена (ОГЭ) и Единого государственного экзамена (ЕГЭ). Вы сможете
        воссоздать атмосферу настоящего экзамена у себя дома или на уроке в
        школе. Для этого мы подготовили авторские варианты различной тематики,
        согласно темам кодификатора ОГЭ/ЕГЭ.
      </p>
      <p class="text-lg mb-6 leading-relaxed text-gray-700 text-justify">
        Вы можете работать в нескольких режимах: экзамен, по заданиям, по темам,
        на основе открытого банка заданий ФИПИ (для ОГЭ). Для тех ребят, кто
        готовится самостоятельно и хочет, чтобы их устные ответы проверили, мы
        предлагаем подписку на месяц, в рамках которой ваши устные ответы будут
        проверять Эксперты региональной комиссии по проверке развернутых ответов
        письменной и устной частей ОГЭ/ЕГЭ с многолетним опытом работы.
      </p>
      <p class="text-lg mb-6 leading-relaxed text-gray-700 text-justify">
        Наши эксперты внимательно проверят ваши работы согласно критериям
        ОГЭ/ЕГЭ, напишут комментарии и дадут рекомендации. В будущем наш сайт
        сможет принимать на проверку и письменные работы: письма и эссе.
      </p>
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
      <div class="my-8 bg-gray-100 rounded-lg shadow-md p-6 flex items-center">
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline text-gray-600">О преподавателе</div>
            <div class="text-h5">Захарова Татьяна</div>
            <div class="text-caption">
              Я готовлю детей к ЕГЭ и ОГЭ по английскому уже много лет. Среди
              моих учеников очень большое количество сдали ЕГЭ на 100 баллов.
            </div>
          </q-card-section>
          <q-card-section class="col-5 flex flex-center">
            <q-img
              src="@/assets/teacher-photo.jpg"
              alt="Teacher Photo"
              class="rounded-borders"
            />
          </q-card-section>
        </q-card-section>
      </div>
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
.bg-gray-100 {
  background-color: #f7fafc;
}

.text-teal-800 {
  color: #234e52;
}

.text-teal-700 {
  color: #285e61;
}

.text-teal-900 {
  color: #1c3d45;
}

.text-gray-700 {
  color: #4a5568;
}

.leading-relaxed {
  line-height: 1.625;
}

.rounded-borders {
  border-radius: 0.375rem;
}

.transition-shadow {
  transition: box-shadow 0.3s ease;
}

.shadow-md {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.shadow-lg {
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
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
</style>
