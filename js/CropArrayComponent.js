define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // crop selected list
      state.CropSelectedList = function (renderHook) {
        this.cropSelectedElem = document.querySelector(renderHook);
        this.selectedCrops = [];

        // render function ********************************************************************************
        this.render = function () {
          // on each render sort by crop acres
          this.sortSelectedCrops();
          // loop through all the selected crops array and call render on each one
          this.selectedCrops.forEach((crop) => {
            let cropDiv = crop.render();
            this.cropSelectedElem.appendChild(cropDiv);
          });
        };
      };
      // CropSelected prototype functions ***********************************************************************
      // add a new crop to the selected crops array
      state.CropSelectedList.prototype.addCrop = function (crop) {
        this.selectedCrops.push(crop);
      };
      // sort selected crops array
      state.CropSelectedList.prototype.sortSelectedCrops = function () {
        this.selectedCrops.sort(function (a, b) {
          return b.acres - a.acres;
        });
      };
      // update overall load and reductions panel
      state.CropSelectedList.prototype.updateOverallLoadReductionPanel = function () {};
    },
  });
});
