define(["dojo/_base/declare", "../vue", "../vuex", "../store"], function (
  declare,
  Vue,
  Vuex,
  store
) {
  const template = `<div>
    Main text is here
  </div>`;

  const mainSection = Vue.component("mainSection", {
    template: template,
    data: function () {
      return {
        // count: 56,
      };
    },
    // computed: {
    //   stocks() {
    //     console.log(store.getters.stocks);
    //     return store.getters.stocks;
    //   },
    // },
    // methods: {
    //   clickMe() {
    //     console.log("clicked");
    //     const payload = {
    //       // change password action in the authState file
    //       text: "test text kjgsdhljghjgfj,sg",
    //     };
    //     store.dispatch("testAction", payload);
    //   },
    // },
  });
  return mainSection;
});
