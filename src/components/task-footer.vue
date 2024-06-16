<template>
  <div class="fixed bottom-0 left-0 w-full border border-gray-300">
    <q-toolbar>
      <div class="flex items-center">
        <div class="mr-4 flex items-center">
          <q-btn
            :color="footerColor"
            icon="sym_o_mic"
            :label="footerLabel"
            no-caps
            class="w-32"
          />
        </div>
      </div>

      <div class="flex-grow flex items-center justify-center">
        <q-linear-progress
          stripe
          class="q-my-md"
          size="25px"
          :value="timeLeft / timeout"
          :max="100"
          :color="footerColor"
        >
          <div class="absolute-full flex flex-center">
            <q-badge color="white" text-color="black" :label="countdown" />
          </div>
        </q-linear-progress>
      </div>

      <div class="flex items-center ml-4">
        <q-btn
          :color="footerColor"
          @click="stop"
          label="Завершить"
          no-caps
          class="w-32"
        />
      </div>
    </q-toolbar>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeLeft: 0,
      timer: null,
    };
  },
  props: {
    timeout: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      required: true
    },
  },
  methods: {
    start() {
      this.timeLeft = 0;
      this.timer = setInterval(() => {
        this.timeLeft += 1;
        if (this.timeLeft >= this.timeout) {
          this.stop();
        }
      }, 1000);
      this.$emit('start');
    },
    stop() {
      clearInterval(this.timer);
      this.$emit('stop');
    },
  },
  computed: {
    countdown() {
      const remainingSeconds = this.timeout - this.timeLeft;
      const minutes = Math.floor(remainingSeconds / 60);
      const seconds = remainingSeconds % 60;
      return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    },
    footerColor() {
      if (this.type == "prepare") {
        return "blue";
      } else {
        return "red";
      }
    },
    footerLabel() {
      if (this.type == "prepare") {
        return "Preparation";
      } else {
        return "Recording";
      }
    },
  },
  emits: ['start', 'stop'],
  mounted() {
    this.start();
  }
};
</script>