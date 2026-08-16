<template>
  <!-- q-layout должен быть КОРНЕВЫМ элементом, без обертки в div -->
  <q-layout view="lHh Lpr lFf">
    
    <!-- Хедер: наш пастельный primary цвет -->
    <q-header elevated class="bg-primary text-white">
      <q-toolbar class="q-px-md md:q-px-lg">
        <!-- Кнопка "Назад" с иконкой стрелки -->
        <q-btn
          flat
          dense
          no-caps
          to="/"
          icon="sym_o_arrow_back"
          class="back-btn text-weight-medium"
        >
          <!-- На мобильных показываем только иконку -->
          <template v-slot:default>
            <span class="gt-xs">Назад на главную</span>
            <span class="xs">Назад</span>
          </template>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <slot />
    </q-page-container>

  </q-layout>
</template>

<script>
export default {
  name: 'TrainerLayout'
}
</script>

<style scoped>
/* Кнопка "Назад" */
:deep(.back-btn) {
  border-radius: 10px !important;
  transition: all 0.2s ease !important;
  padding: 8px 16px !important;
}

:deep(.back-btn:hover) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  transform: translateX(-2px);
}

:deep(.back-btn .q-icon) {
  font-size: 1.3rem !important;
  margin-right: 6px !important;
}

/* Адаптивность */
@media (max-width: 600px) {
  :deep(.q-toolbar) {
    padding-left: 12px !important;
    padding-right: 12px !important;
  }

  :deep(.back-btn) {
    padding: 6px 12px !important;
  }
}
</style>