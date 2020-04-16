define(["dojo/_base/declare", "../vue", "../vuex", "../store"], function (
  declare,
  Vue,
  Vuex,
  store
) {
  const template = `<div>
    report Section
  </div>`;

  const reportSection = Vue.component("reportSection", {
    template: template,
    data: function () {
      return {
        // count: 56,
      };
    },
  });
  return reportSection;
});
