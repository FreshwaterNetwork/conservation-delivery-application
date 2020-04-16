define(["../libs/vue", "../libs/vuex"], function (Vue, Vuex) {
  "use strict";
  Vue.use(Vuex);
  const store = new Vuex.Store({
    state: {
      counter: 10,
      stocks: "test stocks getter",
    },
    mutations: {
      counterIncrement(state, payload) {
        console.log("counter mutation", payload);
        state.counter += payload.num;
      },
    },
    getters: {
      // stock trader code ********************************
      counter: (state) => {
        return state.counter;
      },
    },
    actions: {
      counterIncrement(context, payload) {
        console.log("counter action", payload);
        // commit the action to the mutation after all code here runs
        context.commit("counterIncrement", payload);
      },
    },
  });
  return store;
});
