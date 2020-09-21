define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      console.log("report header");
      state.reportHeaderComponent = function (renderHook) {
        // main render hook
        this.reportHeaderElem = document.querySelector(renderHook);

        // title text, this can be edited
        this.mainHeaderText = "Nutrient Conservation Application";
        this.subHeaderText = "TNC Freshwater Network";

        this.render = () => {
          // empty the report header elem on render
          this.reportHeaderElem.innerHTML = "";

          // create elements and render text
          let headerWrapperElem = document.createElement("div");
          let mainHeaderElem = document.createElement("h1");
          mainHeaderElem.innerText = this.mainHeaderText;
          let subHeaderElem = document.createElement("h4");
          subHeaderElem.innerText = this.subHeaderText;
          let areasSelectedElem = document.createElement("div");
          areasSelectedElem.innerHTML = `
          <div>
            <h5 class="cda-report-sub-headers">Total Nutrient Reduction:</h5>
            <div><b>HUC12's selected:</b> 123456, 98780623076, 1298637368467836</div>
          </div>
          
          `;
          // append elems to the wrapper elem
          headerWrapperElem.appendChild(mainHeaderElem);
          headerWrapperElem.appendChild(subHeaderElem);
          headerWrapperElem.appendChild(areasSelectedElem);
          // append the entire thing to the renderHook
          this.reportHeaderElem.appendChild(headerWrapperElem);
        };
      };
    },
  });
});
