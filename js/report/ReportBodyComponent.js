define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      console.log("report comp");
      state.reportBodyComponent = function (renderHook) {
        console.log("report comp", renderHook);
        this.reportBodyElem = document.querySelector(renderHook);
        this.render = () => {
          //   this.calculateTotals();
          console.log("beofre render");
          this.reportBodyElem.innerHTML = "<div>hello report<div>";
        };
      };
    },
  });
});
