<template>
  <div class="q-pa-md">
    <q-layout view="lHh Lpr lFf">
      <q-header elevated>
        <q-toolbar class="bg-teal-9">
          <div class="flex items-center justify-center text-center w-full">
            <q-tabs>
              <q-route-tab label="Назад на главную" to="/" no-caps />
            </q-tabs>
          </div>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <slot />
      </q-page-container>
    </q-layout>
  </div>
</template>

<script>
import { useUserStore } from '../stores/user.store'
export default {
  name: 'TrainerLayout',
  data() {
    return {
      store: useUserStore()
    }
  },
  methods: {}
}
</script>

<style scoped></style>
