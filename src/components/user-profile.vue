<template>
  <q-page>
    <div class="row q-col-gutter-sm q-ma-xs">
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card class="my-card" flat bordered>
          <q-card-section horizontal>
            <q-card-section class="q-pt-xs">
              <div class="text-h5 q-mt-sm q-mb-xs">Калужских Григорий</div>
            </q-card-section>
          </q-card-section>

          <q-separator />

          <q-card-section> </q-card-section>
        </q-card>
      </div>
      <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
        <q-card>
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input filled v-model="user.first_name" label="Имя" />

              <q-input filled v-model="user.last_name" label="Фамилия" />
              <q-input
                filled
                v-model="user.birthday"
                type="date"
                label="Дата рождения"
                class="no-autofill"
              />

              <q-input filled v-model="user.email" label="Email" />

              <q-input filled v-model="user.phone" label="Phone" />

              <div>
                <q-btn
                  label="Обновить информацию"
                  type="submit"
                  color="primary"
                />
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      user: {
        first_name: 'Григорий',
        last_name: 'Калужских',
        birthday: '1995-11-19',
        age: 28,
        email: 'm@gmail.com',
        phone: '9144204846'
      }
    }
  }
}
</script>

<style scoped></style>
