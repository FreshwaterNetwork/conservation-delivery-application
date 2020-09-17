define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      console.log("report header");
      state.reportHeaderComponent = function (renderHook) {
        this.template = `<div class="cda-temp-report-header">
			<h1>Nutrient Conservation Application</h1>
			<h4>TNC Freshwater Network</h4>
			<br>
			<div><b>HUC12's selected:</b> 123456, 98780623076, 1298637368467836</div>
		</div>`;
        console.log("report comp", renderHook);
        this.reportHeaderElem = document.querySelector(renderHook);
        this.render = () => {
          //   this.calculateTotals();
          console.log("beofre render header");
          console.log(this.reportHeaderElem);
          this.reportHeaderElem.innerHTML = this.template;
        };
      };
    },
  });
});
