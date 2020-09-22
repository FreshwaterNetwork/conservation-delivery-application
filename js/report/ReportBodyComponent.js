define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      state.reportBodyComponent = function (renderHook) {
        this.reportBodyElem = document.querySelector(renderHook);
        this.filteredCropList = [];
        this.template = ``;
        this.render = () => {
          console.log(state.cropSelectedListComponent);
          this.filterCropList(state.cropSelectedListComponent.selectedCrops);
          this.buildCropTemplate(this.filteredCropList);
          this.reportBodyElem.innerHTML = this.template;
        };
      };
      // build out the crop table for the report
      state.reportBodyComponent.prototype.buildCropTemplate = function (
        filteredCropList
      ) {
        this.template = "";
        console.log(filteredCropList);
        filteredCropList.forEach((crop) => {
          console.log(crop);
          const bmpTableTemplate = this.createBMPhtmlTemplate(crop);
          this.template += `
          <h5 class="cda-report-sub-headers">${crop.name}</h5>
          <div>crop table goes here</div>
          ${bmpTableTemplate}
          `;
        });
      };

      state.reportBodyComponent.prototype.filterCropList = function (cropList) {
        this.filteredCropList = [];
        cropList.forEach((crop) => {
          // if any of the crops have reduced loads
          if (crop.nit_rpl || crop.phos_rpl || crop.sed_rpl) {
            this.filteredCropList.push(crop);
          }
        });
      };
      state.reportBodyComponent.prototype.createBMPhtmlTemplate = function (
        crop
      ) {
        console.log(crop);
        return `<div>bmp table goes here</div>`;
      };
    },
  });
});
