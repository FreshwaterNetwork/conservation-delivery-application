define(["./vue_libs/vue", "./vue_libs/vuex"], function (Vue, Vuex) {
  "use strict";
  Vue.use(Vuex);
  const store = new Vuex.Store({
    state: {
      counter: 0,
      // stock trader code ********************************
      stocks: "test stocks getter",

      myFunds: 100000,
      myStocks: [],
    },
    mutations: {
      counterIncrement(state, payload) {
        console.log("counter mutation", payload);
        state.counter += payload.num;
      },
    },
    getters: {
      // stock trader code ********************************
      stocks: (state) => {
        return state.stocks;
      },
    },
    actions: {
      testAction(context, payload) {
        console.log("action", payload);
      },
      counterIncrement(context, payload) {
        console.log("counter action", payload);
        // commit the action to the mutation after all code here runs
        context.commit("counterIncrement", payload);
      },
    },
  });
  return store;
});
