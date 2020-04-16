define(["dojo/_base/declare", "../vue", "../vuex", "../store"], function (
  declare,
  Vue,
  Vuex,
  store
) {
  const template = `<div>
    BMP Section
  </div>`;

  const bmpSection = Vue.component("bmpSection", {
    template: template,
    data: function () {
      return {
        // count: 56,
      };
    },
  });
  return bmpSection;
});
