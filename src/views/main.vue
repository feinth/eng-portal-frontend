<template>
  <q-page class="landing">

    <!-- ═══════════ HERO ═══════════ -->
    <section class="hero-section">
      <!-- Школьные каракули на фоне -->
      <div class="doodles" aria-hidden="true">
        <q-icon name="sym_o_school" class="doodle d1" />
        <q-icon name="sym_o_menu_book" class="doodle d2" />
        <q-icon name="sym_o_draw" class="doodle d3" />
        <q-icon name="sym_o_backpack" class="doodle d4" />
        <q-icon name="sym_o_psychology" class="doodle d5" />
        <span class="doodle-letter dl1">A</span>
        <span class="doodle-letter dl2">B</span>
        <span class="doodle-letter dl3">C</span>
      </div>
      <div class="hero-content">

        <h1 class="hero-title">
          Добро пожаловать в тренажёр устной части
          <span class="hero-accent">ОГЭ и ЕГЭ по английскому языку!</span>
        </h1>

        <p class="hero-text">
          Здесь можно тренировать говорение
          <span class="mark mark-blue">в формате настоящего экзамена</span>:
          привыкать к таймеру, учиться быстро собираться с мыслями, записывать
          свои ответы и постепенно чувствовать себя
          <span class="mark mark-green">увереннее</span> перед компьютером
          на ОГЭ или ЕГЭ.
        </p>

        <p class="hero-quote">
          Экзамен не должен впервые случиться с тобой
          <span class="mark mark-pink">в день экзамена</span>. Чем чаще ты
          работаешь в знакомом формате, тем меньше волнения остаётся и тем
          больше внимания можно уделить самому английскому.
        </p>

        <q-btn unelevated no-caps color="primary" icon="sym_o_arrow_forward" label="Выбрать экзамен" class="hero-btn"
          @click="goToSelect" />
      </div>
    </section>
    <div class="ruler-divider" aria-hidden="true"></div>

    <!-- ═══════════ ВОЗМОЖНОСТИ ═══════════ -->
    <section class="section">
      <h2 class="section-title">Что можно делать в тренажёре?</h2>

      <div class="features-grid">
        <q-card class="feature-card card-blue">
          <q-card-section>
            <div class="feature-icon blue"><q-icon name="sym_o_timer" size="26px" /></div>
            <h3>Тренироваться с таймером</h3>
            <p>
              На подготовку и ответ даётся
              <span class="text-blue">ограниченное время</span> — так же, как
              на экзамене. Постепенно ты научишься укладываться в него без
              спешки и паники.
            </p>
          </q-card-section>
        </q-card>

        <q-card class="feature-card card-red">
          <q-card-section>
            <div class="feature-icon red"><q-icon name="sym_o_mic" size="26px" /></div>
            <h3>Записывать свои ответы</h3>
            <p>
              Говори вслух, <span class="text-red">переслушивай себя</span> и
              замечай, что уже получается хорошо, а над чем ещё стоит
              поработать.
            </p>
          </q-card-section>
        </q-card>

        <q-card class="feature-card card-green">
          <q-card-section>
            <div class="feature-icon green"><q-icon name="sym_o_headphones" size="26px" /></div>
            <h3>Воспринимать задания на слух</h3>
            <p>
              <span class="text-green">Разные голоса и интонации</span> помогут
              чувствовать себя увереннее, когда вопросы задаёт не знакомый
              преподаватель.
            </p>
          </q-card-section>
        </q-card>

        <q-card class="feature-card card-orange">
          <q-card-section>
            <div class="feature-icon orange"><q-icon name="sym_o_menu_book" size="26px" /></div>
            <h3>Отрабатывать отдельные задания и темы</h3>
            <p>
              Необязательно каждый раз проходить весь вариант целиком. Можно
              выбрать <span class="text-orange">именно тот тип задания или
                тему</span>, которые сейчас требуют больше практики.
            </p>
          </q-card-section>
        </q-card>

        <q-card class="feature-card card-purple">
          <q-card-section>
            <div class="feature-icon purple"><q-icon name="sym_o_target" size="26px" /></div>
            <h3>Готовиться в экзаменационном формате</h3>
            <p>
              Здесь важно не просто знать английский, а научиться использовать
              свои знания <span class="text-purple">в условиях реального
                экзамена</span>: услышать задание, быстро сориентироваться,
              подготовить ответ и уложиться во время.
            </p>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <!-- ═══════════ КАК ЗАНИМАТЬСЯ ═══════════ -->
    <section class="section section-grey">
      <h2 class="section-title">Как заниматься?</h2>
      <p class="section-subtitle">Не стремись сразу выполнить всё идеально.</p>

      <div class="steps-grid">
        <div class="step-card">
          <div class="step-number">1</div>
          <div class="step-icon blue"><q-icon name="sym_o_task_alt" size="24px" /></div>
          <div class="step-label">Выбери задание</div>
        </div>
        <div class="step-card">
          <div class="step-number">2</div>
          <div class="step-icon orange"><q-icon name="sym_o_description" size="24px" /></div>
          <div class="step-label">Прочитай инструкцию</div>
        </div>
        <div class="step-card">
          <div class="step-number">3</div>
          <div class="step-icon yellow"><q-icon name="sym_o_lightbulb" size="24px" /></div>
          <div class="step-label">Подготовься</div>
        </div>
        <div class="step-card">
          <div class="step-number">4</div>
          <div class="step-icon red"><q-icon name="sym_o_mic" size="24px" /></div>
          <div class="step-label">Запиши ответ</div>
        </div>
        <div class="step-card">
          <div class="step-number">5</div>
          <div class="step-icon green"><q-icon name="sym_o_headphones" size="24px" /></div>
          <div class="step-label">Переслушай себя</div>
        </div>
        <div class="step-card">
          <div class="step-number">6</div>
          <div class="step-icon purple"><q-icon name="sym_o_refresh" size="24px" /></div>
          <div class="step-label">Попробуй ещё раз</div>
        </div>
      </div>

      <q-banner class="tip-banner" rounded>
        <template v-slot:avatar>
          <q-icon name="sym_o_lightbulb" color="primary" size="2rem" />
        </template>
        <span>
          <strong class="text-blue">Регулярные короткие тренировки</strong>
          эффективнее одной большой тренировки накануне экзамена.
        </span>
      </q-banner>

      <p class="section-note">
        Начни с <span class="mark mark-yellow">одного задания сегодня</span>.
        Через несколько недель то, что сейчас кажется сложным, станет
        привычным.
      </p>
    </section>

    <!-- ═══════════ АВТОР ═══════════ -->
    <section class="section">
      <h2 class="section-title">Кто создал тренажёр?</h2>

      <q-card class="author-card">
        <q-icon name="sym_o_workspace_premium" class="mini-doodle ad1" aria-hidden="true" />

        <q-card-section class="author-layout">
          <!-- БЛОК ПОД ФОТО ПРЕПОДАВАТЕЛЯ -->
          <div class="author-photo">
            <img src="/images/teacher.jpg" alt="Татьяна Захарова" class="photo-img" />
            <!-- <div class="photo-placeholder">
              <q-icon name="sym_o_person" size="72px" />
              <span>Фото преподавателя</span>
            </div> -->
          </div>

          <div class="author-text">
            <h3 class="author-name">Татьяна Захарова</h3>
            <p class="author-role">
              Учитель английского языка высшей категории, эксперт ОГЭ и ЕГЭ
              по английскому языку
            </p>

            <p>
              Много лет готовлю школьников к экзаменам и хорошо знаю не только
              требования и критерии, но и те трудности, с которыми дети
              сталкиваются во время подготовки.
            </p>
            <p>
              Я вижу, как часто ученику мешает не отсутствие знаний, а
              <span class="mark mark-orange">непривычный формат</span>: таймер,
              запись голоса, необходимость быстро сформулировать мысль и
              отсутствие преподавателя рядом. Поэтому мне хотелось создать
              пространство, где всё это можно заранее сделать знакомым.
            </p>
            <p>
              Тренажёр не заменит системную подготовку, но поможет превратить
              экзаменационный формат из источника стресса
              <span class="text-green">в привычную рабочую ситуацию</span>.
            </p>

            <blockquote class="author-quote">
              Моя цель — чтобы в день экзамена тебе не пришлось думать:
              «Что сейчас будет?» А вместо этого ты мог сказать себе:
              <span class="mark mark-green">«Я это уже делал. Я знаю, как
                действовать»</span>.
            </blockquote>
          </div>
        </q-card-section>
      </q-card>
    </section>

    <!-- ═══════════ CTA ═══════════ -->
    <section class="section cta-section">
      <div class="cta-card">
        <h2 class="cta-title">Начинаем?</h2>
        <p class="cta-text">
          Выбери свой экзамен и начни с одного задания.<br />
          Не нужно проходить всё сразу.
        </p>
        <p class="cta-note">
          <span class="mark mark-white">Одна качественная тренировка
            сегодня</span> — это ещё один маленький шаг к результату, который
          ты хочешь получить.
        </p>
        <q-btn unelevated no-caps color="white" text-color="primary" icon="sym_o_play_arrow" label="Начать тренировку"
          class="cta-btn" @click="goToSelect" />
      </div>
    </section>

  </q-page>
</template>

<script>
export default {
  name: 'MainPage',
  methods: {
    goToSelect() {
      this.$router.push('/select')
    }
  }
}
</script>

<style scoped>
.landing {
  background-color: #F7F8FB;
  overflow-x: hidden;
  /* страховка от горизонтального скролла */
}

/* ═══════════ HERO ═══════════ */
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #EEF3FB 0%, #E1EAF8 100%);
  padding: 4.5rem 1.5rem 4rem;
}

/* Школьные каракули */
.doodles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.doodle {
  position: absolute;
  color: #1F3C88;
  opacity: 0.07;
}

.d1 {
  top: 10%;
  left: 4%;
  font-size: 90px;
  transform: rotate(-12deg);
}

.d2 {
  top: 16%;
  right: 5%;
  font-size: 110px;
  transform: rotate(10deg);
}

.d3 {
  bottom: 14%;
  left: 8%;
  font-size: 80px;
  transform: rotate(8deg);
}

.d4 {
  bottom: 10%;
  right: 10%;
  font-size: 95px;
  transform: rotate(-8deg);
}

.d5 {
  top: 42%;
  left: 44%;
  font-size: 140px;
  transform: rotate(-4deg);
  opacity: 0.05;
}

.doodle-letter {
  position: absolute;
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 800;
  color: #1F3C88;
  opacity: 0.08;
}

.dl1 {
  top: 14%;
  left: 24%;
  font-size: 64px;
  transform: rotate(-10deg);
}

.dl2 {
  top: 58%;
  right: 24%;
  font-size: 72px;
  transform: rotate(12deg);
}

.dl3 {
  bottom: 22%;
  left: 32%;
  font-size: 56px;
  transform: rotate(-6deg);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  text-align: left;
}

.hero-icons {
  display: flex;
  gap: 1rem;
}

.hero-icon-circle {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: white;
  color: var(--q-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.25);
}

.hero-icon-circle.accent {
  color: #EF5350;
}

.hero-title {
  font-size: clamp(1.5rem, 4.5vw, 2.4rem);
  font-weight: 800;
  color: #2B2D42;
  line-height: 1.25;
  margin: 1.5rem 0 1.25rem;
}

.hero-accent {
  color: var(--q-primary);
}

.hero-text {
  font-size: 1.1rem;
  color: #5A6178;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.hero-quote {
  font-style: italic;
  color: #444B63;
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 2.25rem;
  padding: 1.25rem 1.5rem;
  background: rgba(255, 255, 255, 0.6);
  border-left: 4px solid var(--q-primary);
  border-radius: 0 12px 12px 0;
}

.hero-btn {
  border-radius: 14px !important;
  padding: 0.75rem 2rem;
  font-weight: 700;
  font-size: 1.05rem;
  letter-spacing: 0.4px;
  box-shadow: 0 6px 20px rgba(124, 147, 195, 0.4) !important;
  transition: all 0.25s ease;
}

.hero-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(124, 147, 195, 0.5) !important;
}

/* ═══════════ МАРКЕРЫ И ЦВЕТА ═══════════ */
.mark {
  padding: 0 4px;
  border-radius: 4px;
  font-weight: 600;
}

.mark-blue {
  background: linear-gradient(180deg, transparent 62%, #BBDEFB 62%);
  color: #1565C0;
}

.mark-green {
  background: linear-gradient(180deg, transparent 62%, #C8E6C9 62%);
  color: #2E7D32;
}

.mark-pink {
  background: linear-gradient(180deg, transparent 62%, #F8BBD0 62%);
  color: #C2185B;
}

.mark-yellow {
  background: linear-gradient(180deg, transparent 62%, #FFF59D 62%);
  color: #8D6E00;
}

.mark-orange {
  background: linear-gradient(180deg, transparent 62%, #FFE0B2 62%);
  color: #E65100;
}

.mark-white {
  background: rgba(255, 255, 255, 0.25);
  color: white;
}

.text-blue {
  color: #1976D2;
  font-weight: 600;
}

.text-red {
  color: #EF5350;
  font-weight: 600;
}

.text-green {
  color: #34A853;
  font-weight: 600;
}

.text-orange {
  color: #F59E0B;
  font-weight: 600;
}

.text-purple {
  color: #8E44C8;
  font-weight: 600;
}

/* ═══════════ СЕКЦИИ ═══════════ */
.section {
  padding: 4rem 1.5rem;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Фон «тетрадный лист в линейку» */
.section-grey {
  max-width: none;
  background:
    repeating-linear-gradient(transparent,
      transparent 31px,
      rgba(124, 147, 195, 0.12) 31px,
      rgba(124, 147, 195, 0.12) 32px),
    #EEF1F7;
}

.section-grey>* {
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
}

.section-title {
  font-size: clamp(1.4rem, 4vw, 2rem);
  font-weight: 800;
  color: #2B2D42;
  text-align: left;
  margin-bottom: 0.75rem;
  padding-left: 1.1rem;
  position: relative;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 6px;
  height: 70%;
  border-radius: 3px;
  background: linear-gradient(180deg, var(--q-primary), #8E44C8);
}

.section-subtitle {
  text-align: left;
  color: #5A6178;
  font-size: 1.05rem;
  margin-bottom: 2.5rem;
}

/* Выравнивание абзацев по ширине */
.hero-text,
.hero-quote,
.section-note,
.author-text p,
.author-quote,
.cta-text,
.cta-note {
  text-align: justify;
  text-align-last: left;
  hyphens: auto;
}

/* ═══════════ ВОЗМОЖНОСТИ ═══════════ */
.features-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1.5rem;
  margin-top: 2.5rem;
  width: 100%;
}

.feature-card {
  grid-column: span 2;
  min-width: 0;
  width: 100%;
  border-radius: 20px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05) !important;
  border: 1px solid rgba(0, 0, 0, 0.03) !important;
  border-top: 4px solid transparent;
  transition: all 0.3s ease;
}

.feature-card:nth-child(4),
.feature-card:nth-child(5) {
  grid-column: span 3;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1) !important;
}

.card-blue {
  border-top-color: #1976D2;
}

.card-red {
  border-top-color: #EF5350;
}

.card-green {
  border-top-color: #34A853;
}

.card-orange {
  border-top-color: #F59E0B;
}

.card-purple {
  border-top-color: #8E44C8;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.feature-icon.blue {
  background: #E3F2FD;
  color: #1976D2;
}

.feature-icon.red {
  background: #FDE7E7;
  color: #EF5350;
}

.feature-icon.green {
  background: #E6F4EA;
  color: #34A853;
}

.feature-icon.orange {
  background: #FEF3E0;
  color: #F59E0B;
}

.feature-icon.purple {
  background: #F0E7FB;
  color: #8E44C8;
}

.feature-card h3 {
  font-size: 1.15rem;
  color: #2B2D42;
  margin-bottom: 0.6rem;
}


/* ═══════════ ШАГИ ═══════════ */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 1rem;
  margin-bottom: 2.5rem;
  width: 100%;
}

.step-card {
  min-width: 0;
  background: white;
  border-radius: 16px;
  padding: 1.5rem 1rem 1.25rem;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.03);
}

.step-number {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--q-primary);
  color: white;
  font-size: 0.85rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(124, 147, 195, 0.4);
}

.step-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.5rem auto 0.9rem;
}

.step-icon.blue {
  background: #E3F2FD;
  color: #1976D2;
}

.step-icon.orange {
  background: #FEF3E0;
  color: #F59E0B;
}

.step-icon.yellow {
  background: #FFF8E1;
  color: #FBC02D;
}

.step-icon.red {
  background: #FDE7E7;
  color: #EF5350;
}

.step-icon.green {
  background: #E6F4EA;
  color: #34A853;
}

.step-icon.purple {
  background: #F0E7FB;
  color: #8E44C8;
}

.step-label {
  font-weight: 600;
  color: #2B2D42;
  font-size: 0.92rem;
}

.tip-banner {
  background: #E3F2FD !important;
  border: 1px solid #90CAF9 !important;
  font-size: 1.02rem;
  color: #2B2D42;
  margin-bottom: 1.5rem;
}

.section-note {
  text-align: justify;
  color: #5A6178;
  font-size: 1.05rem;
  line-height: 1.8;
}

/* ═══════════ АВТОР ═══════════ */
.author-card {
  border-radius: 24px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.07) !important;
  border: 1px solid rgba(0, 0, 0, 0.04) !important;
  margin-top: 2.5rem;
  overflow: hidden;
  width: 100%;
}

.author-layout {
  display: flex;
  gap: 2.5rem;
  padding: 2.5rem;
}

.author-photo {
  flex: 0 0 280px;
  min-width: 0;
}

.photo-placeholder {
  width: 100%;
  aspect-ratio: 3 / 4;
  border-radius: 20px;
  background: linear-gradient(160deg, #EEF3FB, #DCE6F5);
  border: 2px dashed #B9C8E4;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  color: #8A9BC0;
  font-size: 0.9rem;
}

/* Когда появится фото:
.photo-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 20px;
} */

.author-text {
  flex: 1;
  min-width: 0;
}

.author-name {
  font-size: 1.6rem;
  font-weight: 800;
  color: #2B2D42;
  margin-bottom: 0.4rem;
}

.author-role {
  color: var(--q-primary);
  font-weight: 600;
  font-size: 0.98rem;
  margin-bottom: 1.25rem;
}

.author-text p {
  color: #5A6178;
  line-height: 1.8;
  margin-bottom: 1rem;
}

.author-quote {
  margin-top: 1.5rem;
  padding: 1.25rem 1.5rem;
  background: #F4F7FC;
  border-left: 4px solid var(--q-primary);
  border-radius: 0 14px 14px 0;
  font-style: italic;
  color: #3A405A;
  line-height: 1.8;
}

/* ═══════════ CTA ═══════════ */
.cta-section {
  padding-bottom: 5rem;
}

.cta-card {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, var(--q-primary) 0%, #5B79B8 100%);
  border-radius: 24px;
  padding: 3.5rem 3rem;
  text-align: left;
  color: white;
  box-shadow: 0 12px 40px rgba(91, 121, 184, 0.35);
  width: 100%;
  box-sizing: border-box;
}

.cta-doodle {
  position: absolute;
  color: white;
  opacity: 0.1;
  pointer-events: none;
}

.cd1 {
  top: -25px;
  right: -20px;
  font-size: 150px;
  transform: rotate(15deg);
}

.cd2 {
  bottom: -30px;
  left: -20px;
  font-size: 130px;
  transform: rotate(-12deg);
}

/* Контент поверх каракулей */
.cta-card> :not(.cta-doodle) {
  position: relative;
  z-index: 1;
}

.cta-title {
  font-size: clamp(1.5rem, 4vw, 2rem);
  font-weight: 800;
  margin-bottom: 1rem;
}

.cta-text {
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 0.75rem;
}

.cta-note {
  font-size: 0.98rem;
  opacity: 0.95;
  margin-bottom: 2rem;
}

.cta-btn {
  border-radius: 14px !important;
  padding: 0.75rem 2.25rem;
  font-weight: 700;
  font-size: 1.05rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
  transition: all 0.25s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.28) !important;
}

/* ═══════════ ПЛАНШЕТ ═══════════ */
@media (max-width: 900px) {

  .feature-card,
  .feature-card:nth-child(4),
  .feature-card:nth-child(5) {
    grid-column: span 3;
  }

  .feature-card:nth-child(5) {
    grid-column: span 6;
  }

  .steps-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .author-layout {
    flex-direction: column;
    padding: 1.75rem;
    gap: 1.75rem;
  }

  .author-photo {
    flex: none;
    width: 100%;
    max-width: 320px;
  }
}

/* ═══════════ МОБИЛЬНЫЕ (компактно, всё влезает) ═══════════ */
@media (max-width: 600px) {
  .hero-section {
    padding: 2.5rem 1rem 2.25rem;
  }

  .hero-icon-circle {
    width: 48px;
    height: 48px;
  }

  .hero-icon-circle .q-icon {
    font-size: 22px !important;
  }

  .hero-title {
    margin: 1rem 0 0.9rem;
  }

  .hero-text {
    font-size: 0.95rem;
    margin-bottom: 1rem;
  }

  .hero-quote {
    font-size: 0.92rem;
    padding: 0.9rem 1rem;
    margin-bottom: 1.5rem;
  }

  .hero-btn {
    width: 100%;
  }

  /* Каракули мельче, чтобы не мешали */
  .d1 {
    font-size: 60px;
  }

  .d2 {
    font-size: 70px;
  }

  .d3 {
    font-size: 55px;
  }

  .d4 {
    font-size: 60px;
  }

  .d5 {
    display: none;
  }

  .doodle-letter {
    font-size: 40px !important;
  }

  .section {
    padding: 2.5rem 1rem;
  }

  .section-subtitle {
    margin-bottom: 1.75rem;
  }

  .features-grid {
    gap: 1rem;
    margin-top: 1.75rem;
  }

  .feature-card,
  .feature-card:nth-child(4),
  .feature-card:nth-child(5) {
    grid-column: span 6;
  }

  .feature-card :deep(.q-card-section) {
    padding: 1.1rem;
  }

  .feature-icon {
    width: 46px;
    height: 46px;
    margin-bottom: 0.9rem;
  }

  .steps-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.9rem;
    margin-bottom: 1.75rem;
  }

  .step-card {
    padding: 1.1rem 0.6rem 0.9rem;
  }

  .step-icon {
    width: 44px;
    height: 44px;
  }

  .step-label {
    font-size: 0.8rem;
  }

  .tip-banner {
    font-size: 0.92rem;
  }

  .section-note {
    font-size: 0.95rem;
  }

  .author-layout {
    padding: 1.25rem;
  }

  .author-photo {
    max-width: 240px;
  }

  .author-name {
    font-size: 1.35rem;
  }

  .author-quote {
    padding: 1rem 1.1rem;
  }

  .cta-section {
    padding-bottom: 3rem;
  }

  .cta-card {
    padding: 2rem 1.25rem;
  }

  .cta-btn {
    width: 100%;
  }

  /* На узких экранах justify даёт дыры — возвращаем левое выравнивание */
  .hero-text,
  .hero-quote,
  .section-note,
  .author-text p,
  .author-quote,
  .cta-text,
  .cta-note {
    text-align: left;
  }
}
/* ═══════════ ОДИНАКОВАЯ ШИРИНА ВСЕХ БЛОКОВ ═══════════ */
.hero-section { padding: 4.5rem 0 4rem; }

.hero-content,
.section,
.section-grey > * {
  width: 100%;
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
  box-sizing: border-box;
}

/* ═══════════ КАРТОЧКИ: ОДИНАКОВАЯ ВЫСОТА + ЦЕНТР ═══════════ */
.features-grid {
  grid-auto-rows: 1fr;          /* все ряды одной высоты */
  align-items: stretch;
}


.feature-card :deep(.q-card__section) {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;      /* контент по центру карточки */
  align-items: center;
  text-align: center;
}

.feature-icon { margin: 0 auto 1.1rem; }

.feature-card p { text-align: center; }

@media (min-width: 901px) {
  .feature-card { min-height: 320px; }
}

/* ═══════════ ШКОЛЬНАЯ ЛИНЕЙКА-РАЗДЕЛИТЕЛЬ ═══════════ */
.ruler-divider {
  height: 18px;
  background:
    repeating-linear-gradient(90deg, rgba(43, 45, 66, .4) 0 2px, transparent 2px 20px)
      left top / 100% 60% no-repeat,
    linear-gradient(180deg, #FFD54F, #FBC02D);
  border-top: 2px solid rgba(43, 45, 66, .12);
  border-bottom: 2px solid rgba(43, 45, 66, .12);
}

/* ═══════════ МАРКЕР ПОД ЗАГОЛОВКАМИ ═══════════ */
.section-title::after {
  content: '';
  position: absolute;
  left: 1.1rem;
  bottom: -8px;
  width: 140px;
  height: 8px;
  border-radius: 4px;
  background: linear-gradient(90deg, #FFF59D, #FFE082);
}

/* ═══════════ ТЕТРАДЬ С КРАСНЫМ ПОЛЕМ ═══════════ */
@media (min-width: 601px) {
  .section-grey {
    background:
      linear-gradient(90deg,
        transparent 70px,
        rgba(239, 83, 80, .25) 70px,
        rgba(239, 83, 80, .25) 72px,
        transparent 72px),
      repeating-linear-gradient(transparent, transparent 31px,
        rgba(124, 147, 195, .12) 31px, rgba(124, 147, 195, .12) 32px),
      #EEF1F7;
  }
}

/* ═══════════ БАННЕР-СОВЕТ = КЛАССНАЯ ДОСКА ═══════════ */
.tip-banner {
  background: #2E5B4F !important;              /* зелёная доска */
  border: 8px solid #C89B6B !important;        /* деревянная рамка */
  color: #FDFDF6 !important;                   /* мел */
  box-shadow: inset 0 0 30px rgba(0, 0, 0, .25), 0 4px 16px rgba(0, 0, 0, .1);
}

.tip-banner :deep(.q-banner__avatar .q-icon) {
  color: #FFE082 !important;                   /* жёлтый мел */
}

.tip-banner .text-blue { color: #FFE082; }

/* ═══════════ МЕЛКИЕ ДУДЛЫ ═══════════ */
.features-section,
.author-card { position: relative; }

.mini-doodle {
  position: absolute;
  color: #1F3C88;
  opacity: 0.06;
  pointer-events: none;
}

.md1 { top: 3.5rem; right: 2rem;  font-size: 70px; transform: rotate(20deg); }
.md2 { bottom: 2.5rem; left: 1.5rem; font-size: 60px; transform: rotate(-15deg); }
.ad1 { top: 1.2rem; right: 1.4rem; font-size: 54px; transform: rotate(12deg); }

/* ═══════════ МОБИЛЬНЫЕ ПОПРАВКИ ═══════════ */
@media (max-width: 600px) {
  .hero-content,
  .section,
  .section-grey > * {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .md1, .md2, .ad1 { display: none; }  /* дудлы не мешают на узком экране */
}
</style>