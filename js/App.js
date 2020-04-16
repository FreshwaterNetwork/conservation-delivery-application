define(["./libs/vue", "./components/MainSection"], function (Vue, MainSection) {
  const template = `<div>
        <h1>App compoennet</h1>
        <div><mainSection></mainSection></div>
        
  </div>`;

  const app = Vue.component("app", {
    data: function () {
      return {
        show: "report",
      };
    },
    computed: {
      //   stocks() {
      //     console.log(store.getters.stocks);
      //     return store.getters.stocks;
      //   },
    },
    methods: {
      //   clickMe() {
      //     console.log("clicked");
      //     const payload = {
      //       // change password action in the authState file
      //       text: "te text kjgsdhljghjgfj,sg",
      //     };
      //     store.dispatch("testAction", payload);
      //   },
    },
    template: template,
    components: {
      MainSection: MainSection,
      //   BMPSection: BMPSection,
      //   reportSection: reportSection,
    },
  });
  return app;
});
