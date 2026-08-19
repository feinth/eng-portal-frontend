<template>
  <q-page class="q-pa-md md:q-pa-lg">
    <div class="main-container">

      <!-- Приветственный текст -->
      <div class="welcome-section">
        <p class="welcome-greeting">
          Здравствуйте, дорогие выпускники и уважаемые коллеги!
        </p>
        <p class="welcome-text">
          На этом сайте вы найдёте симулятор устного экзамена для Основного
          государственного экзамена (ОГЭ) и Единого государственного экзамена
          (ЕГЭ). Вы сможете воссоздать атмосферу настоящего экзамена у себя дома
          или на уроке в школе. Для этого мы подготовили авторские варианты по
          различной тематике, согласно темам кодификатора ОГЭ/ЕГЭ.
        </p>
        <p class="welcome-text">
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

      <!-- Карточка преподавателя -->
      <q-card class="teacher-card">
        <q-card-section horizontal class="teacher-card-section">

          <!-- Текстовая часть -->
          <q-card-section class="teacher-text-section">
            <div class="section-label">О преподавателе</div>
            <div class="teacher-name">Захарова Татьяна</div>
            <div class="teacher-description">
              Я готовлю детей к ЕГЭ и ОГЭ по английскому уже много лет. Среди
              моих учеников очень большое количество сдали ЕГЭ на 100 баллов.
            </div>
            
            <!-- Декоративные бейджи достижений -->
            <div class="teacher-badges">
              <div class="badge-item">
                <q-icon name="sym_o_school" size="1.5rem" class="text-primary" />
                <span class="badge-text">ЕГЭ и ОГЭ</span>
              </div>
              <div class="badge-item">
                <q-icon name="sym_o_workspace_premium" size="1.5rem" class="text-primary" />
                <span class="badge-text">100-балльники</span>
              </div>
            </div>
          </q-card-section>

          <!-- Фотография -->
          <q-card-section class="teacher-photo-section">
            <q-img 
              src="@/assets/teacher-photo.jpg" 
              alt="Teacher Photo" 
              class="teacher-photo" 
              fit="cover" 
            />
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
/* Основной контейнер страницы */
.main-container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 0;
}

/* Секция приветственного текста */
.welcome-section {
  background-color: #FFFFFF;
  border-radius: 20px;
  padding: 2.5rem 3rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
  margin-bottom: 2rem;
}

/* Приветствие — крупнее и выразительнее */
.welcome-greeting {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--q-primary);
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

/* Обычный текст приветствия */
.welcome-text {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #3D3D3D;
  text-align: justify;
  margin-bottom: 1rem;
}

.welcome-text:last-child {
  margin-bottom: 0;
}

/* Карточка преподавателя */
:deep(.teacher-card) {
  border-radius: 20px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease !important;
  overflow: hidden;
  background-color: #FFFFFF !important;
}

:deep(.teacher-card:hover) {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08) !important;
}

/* Секция карточки */
:deep(.teacher-card-section) {
  flex-direction: column;
  padding: 0 !important;
}

@media (min-width: 1024px) {
  :deep(.teacher-card-section) {
    flex-direction: row;
  }
}

/* Текстовая часть карточки */
.teacher-text-section {
  flex: 1;
  padding: 2.5rem 3rem !important;
}

/* Лейбл "О преподавателе" */
.section-label {
  display: inline-block;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--q-primary);
  margin-bottom: 0.75rem;
}

/* Имя преподавателя */
.teacher-name {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2B2D42;
  margin-bottom: 1.25rem;
  line-height: 1.2;
}

/* Описание преподавателя */
.teacher-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #3D3D3D;
  margin-bottom: 1.75rem;
}

/* Бейджи достижений */
.teacher-badges {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.badge-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #F8F9FA;
  border-radius: 20px;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.badge-text {
  font-size: 0.95rem;
  font-weight: 600;
  color: #2B2D42;
}

/* Секция с фотографией */
.teacher-photo-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2.5rem !important;
}

/* Фотография преподавателя */
:deep(.teacher-photo) {
  border-radius: 20px !important;
  width: 320px !important;
  height: 320px !important;
  max-width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

/* Адаптивность */
@media (max-width: 1023px) {
  .welcome-section {
    padding: 2rem 1.75rem;
  }

  .welcome-greeting {
    font-size: 1.3rem;
  }

  .welcome-text {
    font-size: 1rem;
  }

  .teacher-text-section {
    padding: 2rem 1.75rem !important;
  }

  .teacher-name {
    font-size: 1.8rem;
  }

  .teacher-description {
    font-size: 1rem;
  }

  :deep(.teacher-photo) {
    width: 260px !important;
    height: 260px !important;
  }
}

@media (max-width: 768px) {
  .welcome-section {
    padding: 1.75rem 1.5rem;
    border-radius: 16px;
  }

  .welcome-greeting {
    font-size: 1.2rem;
    margin-bottom: 1.25rem;
  }

  .teacher-text-section {
    padding: 1.75rem 1.5rem !important;
  }

  .teacher-name {
    font-size: 1.6rem;
    margin-bottom: 1rem;
  }

  .teacher-description {
    margin-bottom: 1.5rem;
  }

  .teacher-badges {
    gap: 0.5rem;
  }

  .badge-item {
    padding: 0.4rem 0.85rem;
  }

  .badge-text {
    font-size: 0.9rem;
  }

  :deep(.teacher-photo) {
    width: 220px !important;
    height: 220px !important;
  }

  .teacher-photo-section {
    padding: 1.5rem !important;
    padding-top: 0 !important;
  }
}

@media (max-width: 480px) {
  .welcome-section {
    padding: 1.25rem 1rem;
    border-radius: 12px;
  }

  .welcome-greeting {
    font-size: 1.1rem;
  }

  .welcome-text {
    font-size: 0.95rem;
    text-align: left;
  }

  .teacher-text-section {
    padding: 1.25rem 1rem !important;
  }

  .teacher-name {
    font-size: 1.4rem;
  }

  .teacher-description {
    font-size: 0.95rem;
  }

  :deep(.teacher-photo) {
    width: 180px !important;
    height: 180px !important;
  }
}
</style>