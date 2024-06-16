import { router } from '../router/router'
import { useUserStore } from '../stores/user.store'
export default {
  install: (app, options) => {
    // app.mixin({
    //   created() {
    //     this.initTokenExpirationCheck();
    //   },
    //   data() {
    //     return {
    //       store: useUserStore(),
    //     };
    //   },
    //   methods: {
    //     initTokenExpirationCheck() {
    //       const timer = setInterval(this.tokenExpirationCheck, 10000);
    //     },
    //     tokenExpirationCheck() {
    //       const current = new Date();
    //       if (this.store.user) {
    //         const expiration = new Date(this.store.user.expiration);
    //         if (expiration < current) {
    //           this.store.logout();
    //         }
    //       }
    //     },
    //   },
    //   watch: {
    //     "store.user": (newValue) => {
    //       if (!newValue) {
    //         router.push("/login");
    //       }
    //     },
    //   },
    // });
  }
}
