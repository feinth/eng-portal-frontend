<template>
  <div class="answers-stack">

    <!-- Заголовок + счётчик -->
    <div class="answers-header">
      <h2 class="section-title">
        <q-icon name='sym_o_task_alt' class="title-icon" />
        {{ 'Выполненные задания' }}
      </h2>
      <p class="section-subtitle" v-if="totalCount > 0">
        Всего: <strong>{{ totalCount }}</strong>
      </p>
    </div>

    <!-- Индикатор первичной загрузки -->
    <q-inner-loading v-if="isLoading && answers.length === 0" :showing="true" label="Загружаем историю..."
      label-class="text-grey-7" />

    <!-- Список карточек -->
    <div v-else-if="answers.length > 0" class="answers-grid">
      <q-card v-for="answer in answers" :key="answer.id" class="answer-card">
        <q-card-section class="answer-top">
          <div class="answer-meta">
            <div class="answer-date">
              <q-icon name="sym_o_calendar_month" size="18px" />
              <span>{{ formatDate(answer.created_at) }}</span>
            </div>
            <q-badge v-if="answer.exam_type" :color="answer.exam_type === 'ege' ? 'primary' : 'secondary'"
              class="answer-badge">
              {{ answer.exam_type === 'ege' ? 'ЕГЭ' : 'ОГЭ' }}
            </q-badge>
            <q-badge v-if="answer.variant_type" :color="answer.variant_type === 'random' ? 'accent' : 'grey-7'"
              class="answer-badge">
              {{ answer.variant_type === 'random' ? 'Случайный' : 'Из банка' }}
            </q-badge>
          </div>

          <h3 class="answer-title">
            {{
              answer.variant_type === 'random'
                ? 'Случайный вариант'
                : 'Вариант из банка'
            }}
          </h3>
        </q-card-section>

        <q-card-section v-if="answer.full_audio" class="answer-audio">
          <audio controls preload="none" class="custom-audio">
            <source :src="answer.full_audio" type="audio/mpeg" />
          </audio>
        </q-card-section>

        <q-card-actions v-if="answer.answer_archive" class="answer-actions" align="right">
          <q-btn flat no-caps color="primary" icon="sym_o_download" label="Скачать архив" :href="answer.answer_archive"
            target="_blank" class="download-btn" />
        </q-card-actions>
      </q-card>
    </div>

    <!-- Пустое состояние -->
    <q-card v-else-if="!isLoading" class="empty-card">
      <q-card-section class="empty-state">
        <div class="empty-icon">
          <q-icon :name="status === 3 ? 'sym_o_assignment' : 'sym_o_hourglass_empty'" size="64px" />
        </div>
        <h3 class="empty-title">
          {{ 'Пока нет выполненных заданий' }}
        </h3>
        <p class="empty-text">
          {{ 'Начните с одного задания — это займёт немного времени' }}
        </p>
        <q-btn unelevated no-caps color="primary" icon="sym_o_play_arrow" label="Начать тренировку" class="empty-btn"
          @click="$router.push('/select')" />
      </q-card-section>
    </q-card>

    <!-- Кнопка «Загрузить ещё» -->
    <div v-if="hasMore" class="load-more-wrapper">
      <q-btn unelevated no-caps color="primary" :loading="isLoadingMore" icon="sym_o_expand_more" label="Загрузить ещё"
        class="load-more-btn" @click="loadMore" />
      <p class="load-more-hint">
        Показано {{ answers.length }} из {{ totalCount }}
      </p>
    </div>

  </div>
</template>

<script>
import { useExamStore } from '../stores/exam.store'
import { date } from 'quasar'

export default {
  name: 'UserAnswers',
  props: {
    status: { type: Number, default: 3 } // 3 = готовые, 1 = в процессе
  },
  data() {
    return {
      store: useExamStore(),
      answers: [],
      totalCount: 0,
      hasMore: false,
      nextOffset: 0,
      isLoading: false,
      isLoadingMore: false
    }
  },
  methods: {
    async loadAnswers() {
      this.isLoading = true
      this.answers = []
      this.nextOffset = 0
      this.hasMore = false

      try {
        const response = await this.store.getAnswers({
          status: this.status,
          offset: 0,
          limit: 4
        })

        this.answers = response.results
        this.totalCount = response.count
        this.hasMore = response.hasMore
        this.nextOffset = response.nextOffset
      } catch {
        this.$q.notify({
          progress: true,
          position: 'top-right',
          color: 'negative',
          message: 'Ошибка при загрузке истории',
          timeout: 2000,
          icon: 'sym_o_error'
        })
      } finally {
        this.isLoading = false
      }
    },

    async loadMore() {
      if (!this.hasMore || this.isLoadingMore) return

      this.isLoadingMore = true
      try {
        const response = await this.store.getAnswers({
          status: this.status,
          offset: this.nextOffset,
          limit: 10
        })

        this.answers = [...this.answers, ...response.results]
        this.totalCount = response.count
        this.hasMore = response.hasMore
        this.nextOffset = response.nextOffset
      } catch {
        this.$q.notify({
          color: 'red',
          message: 'Не удалось загрузить ещё',
          timeout: 2000,
          icon: 'sym_o_error'
        })
      } finally {
        this.isLoadingMore = false
      }
    },

    formatDate(dateStr) {
      return date.formatDate(dateStr, 'DD MMM YYYY, HH:mm')
    }
  },
  mounted() {
    this.loadAnswers()
  },
}
</script>

<style scoped>
.answers-stack {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.answers-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: clamp(1.2rem, 3vw, 1.5rem);
  font-weight: 800;
  color: #2B2D42;
  margin: 0;
}

.title-icon {
  color: var(--q-primary);
  font-size: 26px !important;
}

.section-subtitle {
  color: #5A6178;
  font-size: 0.95rem;
  margin: 0;
}

.section-subtitle strong {
  color: var(--q-primary);
  font-weight: 700;
}

/* Сетка карточек */
.answers-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
}

.answer-card {
  border-radius: 20px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  transition: all 0.3s ease;
  overflow: hidden;
}

.answer-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 28px rgba(0, 0, 0, 0.1) !important;
}

.answer-top {
  padding: 1.25rem 1.5rem 0.75rem !important;
}

.answer-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.answer-date {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  color: #8A94A6;
  font-weight: 500;
  margin-right: auto;
}

.answer-badge {
  border-radius: 8px !important;
  padding: 3px 10px !important;
  font-weight: 600 !important;
  letter-spacing: 0.5px;
  font-size: 0.72rem !important;
}

.answer-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #2B2D42;
  margin: 0;
  line-height: 1.4;
}

.answer-audio {
  padding: 0.5rem 1.5rem 0.75rem !important;
}

.custom-audio {
  width: 100%;
  height: 40px;
  border-radius: 20px;
  outline: none;
}

.answer-actions {
  padding: 0 0.5rem 0.75rem !important;
}

.download-btn {
  border-radius: 10px !important;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Кнопка «Загрузить ещё» */
.load-more-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.load-more-btn {
  border-radius: 14px !important;
  padding: 0.6rem 1.75rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(124, 147, 195, 0.25) !important;
}

.load-more-hint {
  color: #8A94A6;
  font-size: 0.85rem;
  margin: 0;
}

/* Пустое состояние */
.empty-card {
  border-radius: 20px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 2px dashed #C8D4E8 !important;
  background: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 2rem !important;
}

.empty-icon {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: linear-gradient(135deg, #EEF3FB, #E1EAF8);
  color: var(--q-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.empty-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #2B2D42;
  margin: 0 0 0.5rem;
}

.empty-text {
  color: #5A6178;
  font-size: 0.95rem;
  max-width: 400px;
  margin: 0 0 1.5rem;
  line-height: 1.6;
}

.empty-btn {
  border-radius: 14px !important;
  padding: 0.7rem 1.75rem;
  font-weight: 700;
  font-size: 0.95rem;
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
  transition: all 0.25s ease;
}

.empty-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(124, 147, 195, 0.5) !important;
}

@media (max-width: 900px) {
  .answers-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 500px) {
  .answer-top {
    padding: 1rem 1.25rem 0.5rem !important;
  }

  .answer-audio {
    padding: 0.5rem 1.25rem 0.75rem !important;
  }

  .answer-title {
    font-size: 0.95rem;
  }

  .empty-state {
    padding: 2rem 1.25rem !important;
  }

  .empty-icon {
    width: 90px;
    height: 90px;
  }

  .empty-title {
    font-size: 1.1rem;
  }

  .empty-btn {
    width: 100%;
  }
}
</style>