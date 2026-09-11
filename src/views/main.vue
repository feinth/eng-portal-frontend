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
          увереннее перед компьютером
          на ОГЭ или ЕГЭ.
        </p>

        <p class="hero-quote">
          <span class="mark mark-blue">Экзамен не должен впервые случиться с тобой в день экзамена</span>. 
        </br>
          Чем чаще ты
          работаешь в знакомом формате, тем меньше волнения остаётся и тем
          больше внимания можно уделить самому английскому.
        </p>

        <q-btn unelevated no-caps color="primary" icon="sym_o_arrow_forward" label="Выбрать экзамен" class="hero-btn"
          @click="goToSelect" />
      </div>
    </section>

    <!-- ═══════════ НОВЫЙ РАЗДЕЛИТЕЛЬ ═══════════ -->
    <div class="section-divider" aria-hidden="true">
      <span class="divider-line"></span>
      <q-icon name="sym_o_school" class="divider-icon" size="26px" />
      <span class="divider-line"></span>
    </div>

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
              Говори вслух, <span class="text-blue">переслушивай себя</span> и
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
              <span class="text-blue">Разные голоса и интонации</span> помогут
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
              выбрать <span class="text-blue">именно тот тип задания или
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
              свои знания <span class="text-blue">в условиях реального
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



      <p class="section-note">
        <span>
          <span class="mark mark-blue">Регулярные короткие тренировки</span>
          эффективнее одной большой тренировки накануне экзамена.
        </span>
        Начни с одного задания сегодня.
        Через несколько недель то, что сейчас кажется сложным, станет
        привычным.
      </p>
    </section>

    <!-- ═══════════ АВТОР ═══════════ -->
    <section class="section">
      <h2 class="section-title">Кто создал тренажёр?</h2>

      <q-card class="author-card">

        <q-card-section class="author-layout">
          <!-- БЛОК ПОД ФОТО ПРЕПОДАВАТЕЛЯ -->
          <div class="author-photo">
            <img src="/images/teacher.jpg" alt="Татьяна Захарова" class="photo-img" />
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
              Я вижу, как часто ученику мешает не отсутствие знаний, а непривычный формат: таймер,
              запись голоса, необходимость быстро сформулировать мысль и
              отсутствие преподавателя рядом. Поэтому мне хотелось создать
              пространство, где всё это можно заранее сделать знакомым.
            </p>
            <p>
              Тренажёр не заменит системную подготовку, но поможет превратить
              экзаменационный формат из источника стресса
              <span class="mark mark-blue">в привычную рабочую ситуацию</span>.
            </p>

            <blockquote class="author-quote">
              Моя цель — чтобы в день экзамена тебе не пришлось думать:
              «Что сейчас будет?» А вместо этого ты мог сказать себе:
              <span class="mark mark-blue">«Я это уже делал. Я знаю, как
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
/* ═══════════ БАЗА ═══════════ */
.landing {
  background-color: #F7F8FB;
  overflow-x: hidden;
}

/* ═══════════ ОБЩИЙ КОНТЕЙНЕР (одинаковая ширина всех блоков) ═══════════ */
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

/* ═══════════ HERO ═══════════ */
.hero-section {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #EEF3FB 0%, #E1EAF8 100%);
  padding: 4.5rem 0 4rem;
}

.doodles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.doodle,
.doodle-letter {
  position: absolute;
  color: #1F3C88;
  opacity: 0.07;
  pointer-events: none;
}

.doodle-letter {
  font-family: Georgia, 'Times New Roman', serif;
  font-weight: 800;
  opacity: 0.08;
}

.d1  { top: 10%;    left:  calc(50% - 620px); font-size: 90px;  transform: rotate(-12deg); }
.d2  { top: 16%;    right: calc(50% - 640px); font-size: 110px; transform: rotate(10deg); }
.d3  { bottom: 14%; left:  calc(50% - 600px); font-size: 80px;  transform: rotate(8deg); }
.d4  { bottom: 10%; right: calc(50% - 610px); font-size: 95px;  transform: rotate(-8deg); }
.d5  { top: 42%;    left:  calc(50% - 680px); font-size: 120px; opacity: 0.05; transform: rotate(-4deg); }
.dl1 { top: 6%;     left:  calc(50% - 560px); font-size: 64px;  transform: rotate(-10deg); }
.dl2 { top: 58%;    right: calc(50% - 560px); font-size: 72px;  transform: rotate(12deg); }
.dl3 { bottom: 6%;  left:  calc(50% - 590px); font-size: 56px;  transform: rotate(-6deg); }

.hero-content {
  position: relative;
  z-index: 1;
  text-align: left;
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

/* ═══════════ МАРКЕРЫ И ЦВЕТОВЫЕ АКЦЕНТЫ ═══════════ */
.mark {
  padding: 0 4px;
  border-radius: 4px;
  font-weight: 600;
}

.mark-blue   { background: linear-gradient(180deg, transparent 62%, #BBDEFB 62%); color: #1565C0; }
.mark-white  { background: rgba(255, 255, 255, 0.25); color: white; }

/* Универсальный цвет выделения текста — теперь везде синий */
.text-blue { color: #1565C0; font-weight: 700; }

/* ═══════════ СЕКЦИИ ═══════════ */
.section {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

/* «Тетрадный лист в линейку» */
.section-grey {
  max-width: none;
  padding-left: 0;
  padding-right: 0;
  background:
    repeating-linear-gradient(transparent, transparent 31px,
      rgba(124, 147, 195, 0.12) 31px, rgba(124, 147, 195, 0.12) 32px),
    #EEF1F7;
}

@media (min-width: 601px) {
  .section-grey {
    background:
      linear-gradient(90deg, transparent 70px,
        rgba(239, 83, 80, 0.25) 70px, rgba(239, 83, 80, 0.25) 72px,
        transparent 72px),
      repeating-linear-gradient(transparent, transparent 31px,
        rgba(124, 147, 195, 0.12) 31px, rgba(124, 147, 195, 0.12) 32px),
      #EEF1F7;
  }
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

.section-subtitle {
  text-align: left;
  color: #5A6178;
  font-size: 1.05rem;
  margin-bottom: 2.5rem;
}

.section-note {
  color: #5A6178;
  font-size: 1.05rem;
  line-height: 1.8;
}

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

/* ═══════════ НОВЫЙ РАЗДЕЛИТЕЛЬ ═══════════ */
.section-divider {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem 3rem;
  gap: 1.25rem;
  max-width: 1000px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.divider-line {
  flex: 1;
  height: 1.5px;
  background: linear-gradient(90deg, transparent 0%, #BBDEFB 30%, var(--q-primary) 50%, #BBDEFB 70%, transparent 100%);
  border-radius: 1px;
  opacity: 0.9;
}

.divider-icon {
  color: var(--q-primary);
  background: white;
  padding: 0.55rem;
  border-radius: 50%;
  box-shadow: 0 4px 14px rgba(124, 147, 195, 0.25);
  border: 2px solid #BBDEFB;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* ═══════════ КАРТОЧКИ ВОЗМОЖНОСТЕЙ ═══════════ */
.features-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: 1fr;
  align-items: stretch;
  gap: 1.5rem;
  margin-top: 2.5rem;
  width: 100%;
}

.feature-card {
  grid-column: span 2;
  min-width: 0;
  width: 100%;
  flex-direction: column;
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

.card-blue   { border-top-color: #1976D2; }
.card-red    { border-top-color: #EF5350; }
.card-green  { border-top-color: #34A853; }
.card-orange { border-top-color: #F59E0B; }
.card-purple { border-top-color: #8E44C8; }

.feature-card :deep(.q-card__section) {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.feature-icon {
  width: 56px;
  height: 56px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.1rem;
}

.feature-icon.blue   { background: #E3F2FD; color: #1976D2; }
.feature-icon.red    { background: #FDE7E7; color: #EF5350; }
.feature-icon.green  { background: #E6F4EA; color: #34A853; }
.feature-icon.orange { background: #FEF3E0; color: #F59E0B; }
.feature-icon.purple { background: #F0E7FB; color: #8E44C8; }

.feature-card h3 {
  font-size: 1.15rem;
  color: #2B2D42;
  margin-bottom: 0.6rem;
}

.feature-card p {
  color: #5A6178;
  line-height: 1.7;
  font-size: 0.95rem;
  text-align: center;
  margin: 0;
}

@media (min-width: 901px) {
  .feature-card { min-height: 320px; }
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

.step-icon.blue   { background: #E3F2FD; color: #1976D2; }
.step-icon.orange { background: #FEF3E0; color: #F59E0B; }
.step-icon.yellow { background: #FFF8E1; color: #FBC02D; }
.step-icon.red    { background: #FDE7E7; color: #EF5350; }
.step-icon.green  { background: #E6F4EA; color: #34A853; }
.step-icon.purple { background: #F0E7FB; color: #8E44C8; }

.step-label {
  font-weight: 600;
  color: #2B2D42;
  font-size: 0.92rem;
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

.photo-img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border-radius: 20px;
  display: block;
}

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
  background: linear-gradient(135deg, var(--q-primary) 0%, #5B79B8 100%);
  border-radius: 24px;
  padding: 3.5rem 3rem;
  text-align: left;
  color: white;
  box-shadow: 0 12px 40px rgba(91, 121, 184, 0.35);
  width: 100%;
  box-sizing: border-box;
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

  .section-divider {
    padding: 1rem 2rem;
  }
}

/* ═══════════ МОБИЛЬНЫЕ ═══════════ */
@media (max-width: 600px) {
  .hero-content,
  .section,
  .section-grey > * {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  .hero-section {
    padding: 2.5rem 0 2.25rem;
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

  .section {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
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

  .feature-card :deep(.q-card__section) {
    padding: 1.1rem;
  }

  .feature-icon {
    width: 46px;
    height: 46px;
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

  .hero-text,
  .hero-quote,
  .section-note,
  .author-text p,
  .author-quote,
  .cta-text,
  .cta-note {
    text-align: left;
  }

  .section-divider {
    padding: 0.75rem 1rem;
    gap: 0.75rem;
  }

  .divider-icon {
    padding: 0.4rem;
  }
}
</style>