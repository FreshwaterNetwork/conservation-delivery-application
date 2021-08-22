define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
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
          // call build template
          areasSelectedElem.innerHTML = this.buildTemplate();

          // append elems to the wrapper elem
          headerWrapperElem.appendChild(mainHeaderElem);
          headerWrapperElem.appendChild(subHeaderElem);
          headerWrapperElem.appendChild(areasSelectedElem);
          // append the entire thing to the renderHook
          this.reportHeaderElem.appendChild(headerWrapperElem);
        };
      };

      state.reportHeaderComponent.prototype.buildTemplate = function () {
        this.tl = state.totalLoadComponent;
        const templete = `
          <div>
            <h5 class="cda-report-sub-headers">Selected Areas:</h5>
            <div><b>HUC12's selected:</b> 123456, 98780623076, 1298637368467836</div>

            <h5 class="cda-report-sub-headers">Total Nutrient Reduction:</h5>
            <table class="cda-report-header-table">
              <thead>
                <tr>
                  <th style="font-weight: bold;">All Load Sources - ${state.UIControls.numComma(
                    this.tl.totalAcres
                  )} acres</th>
                  <th>Nitrogen</th>
                  <th>Phospherous</th>
                  <th>Sediment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Initial Load (MT/yr)</th>
                  <td>${state.UIControls.numComma(
                    this.tl.totalNitLoad.toFixed(2)
                  )}</td>
                  <td>${state.UIControls.numComma(
                    this.tl.totalPhosLoad.toFixed(2)
                  )}</td>
                  <td>${state.UIControls.numComma(
                    this.tl.totalSedLoad.toFixed(2)
                  )}</td>
                </tr>
                <tr>
                  <th>New Load (MT/yr)</th>
                  <td>${state.UIControls.numComma(
                    this.tl.totalNitRedLoad.toFixed(2)
                  )}</td>
                  <td>${state.UIControls.numComma(
                    this.tl.totalPhosRedLoad.toFixed(2)
                  )}</td>
                  <td>${state.UIControls.numComma(
                    this.tl.totalSedRedLoad.toFixed(2)
                  )}</td>
                </tr>
                <tr>
                  <th>Reduction</th>
                  <td>${this.tl.totalNitPercentReduction}%</td>
                  <td>${this.tl.totalPhosPercentReduction}%</td>
                  <td>${this.tl.totalSedPercentReduction}%</td>
                </tr>
              </tbody>
          </table>

          </div>
        `;
        return templete;
      };
    },
  });
});
