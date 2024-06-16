<template>
  <q-page class="p-6">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-3xl font-bold mb-4">
        Сайт-тренажер по подготовке к ЕГЭ и ОГЭ по английскому языку
      </h1>
      <p class="text-lg mb-4">
        У зарегистрированных пользователей есть возможность платной подписки,
        это значит, что задания будут проверять преподаватели. Главная фишка
        тренажера в том, что он записывает ответы ребенка на микрофон и выдает
        их ссылкой для скачивания. В то время, пока идет подготовка к выполнению
        задания, запись автоматически ставится на паузу, и при ответе она
        возобновляется.
      </p>
      <div class="my-8 bg-grey-100 rounded-lg shadow-md p-6 flex items-center">
        <q-card-section horizontal>
          <q-card-section class="q-pt-xs">
            <div class="text-overline text-gray-600">О преподавателе</div>
            <div class="text-h5">Захарова Татьяна</div>
            <div class="text-caption">
              Я готовлю детей к ЕГЭ и ОГЭ по английскому уже много лет. Среди
              моих учеников очень большое количество сдали ЕГЭ на 100 баллов
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

      <p class="text-lg"></p>
    </div>
  </q-page>
</template>

<script>
export default {
  name: 'MainPage'
}
</script>

<style scoped>
/* Ваши стили для компонента */
</style>
