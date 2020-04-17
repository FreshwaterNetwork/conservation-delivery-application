define([
  "./libs/vue",
  "./store/store",
  "./components/FieldsSelected",
], function (Vue, store, FieldsSelected) {
  const template = `<div class="cda-app-wrapper">
                        <fields-selected></fields-selected>
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
    methods: {},
    template: template,
    mounted: function () {
      console.log(store);
    },
    components: {
      FieldsSelected: FieldsSelected,
    },
  });
  return app;
});
