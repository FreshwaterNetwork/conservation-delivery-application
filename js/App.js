define([
  "./vue_libs/vue",
  "./store",
  "./components/MainSection",
  "./components/BMPSection",
  "./components/reportSection",
], function (Vue, store, MainSection, BMPSection, reportSection) {
  const template = `<div>
        <h1>Title goes here</h1>
        <mainSection v-if="show === 'main'" class="cda-main-section"></mainSection>
        <bmpSection v-if="show === 'bmp'"></bmpSection>
        <reportSection v-if="show === 'report'"></reportSection>
  </div>`;

  const app = Vue.component("app", {
    data: function () {
      return {
        show: "report",
      };
    },
    computed: {
      stocks() {
        console.log(store.getters.stocks);
        return store.getters.stocks;
      },
    },
    methods: {
      clickMe() {
        console.log("clicked");
        const payload = {
          // change password action in the authState file
          text: "te text kjgsdhljghjgfj,sg",
        };
        store.dispatch("testAction", payload);
      },
    },
    template: template,
    components: {
      MainSection: MainSection,
      BMPSection: BMPSection,
      reportSection: reportSection,
    },
  });
  return app;
});
