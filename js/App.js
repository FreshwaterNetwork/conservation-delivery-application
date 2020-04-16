define(["./libs/vue", "./store/store", "./components/MainSection"], function (
  Vue,
  store,
  MainSection
) {
  const template = `<div>
        <h1>App compoennet</h1>
        <div>Click on map to + Counter: {{counter}}</div>
        <div><mainSection></mainSection></div>
        
  </div>`;

  const app = Vue.component("app", {
    data: function () {
      return {
        show: "report",
      };
    },
    computed: {
      counter() {
        console.log(store.getters.counter);
        return store.getters.counter;
      },
    },
    methods: {
      //   clickMe() {
      //     console.log("clicked");
      //     const payload = {
      //       // change password action in the authState file
      //       text: "te text kjgsdhljghjgfj,sg",
      //     };
      //   },
    },
    template: template,
    mounted: function () {
      console.log(store);
    },
    components: {
      MainSection: MainSection,
      //   BMPSection: BMPSection,
      //   reportSection: reportSection,
    },
  });
  return app;
});
