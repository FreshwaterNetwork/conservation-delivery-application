define(["../libs/vue", "../store/store", "../esriapi"], function (
  Vue,
  store,
  esriapi
) {
  const template = `<div>
    <div v-for="(field, index) in fieldsSelected" v-bind:key="index">
      {{ field }}
    </div>
    <button @click="alterMap">Alter Map</button>
  </div>`;

  const fieldsSelected = Vue.component("fieldsSelected", {
    template: template,
    methods: {
      alterMap() {
        console.log(esriapi);
        esriapi.initEsriApi();
        console.log("alter map");
      },
    },
    computed: {
      fieldsSelected() {
        return store.getters.fieldsSelected;
      },
    },
  });
  return fieldsSelected;
});
