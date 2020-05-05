define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      console.log("init bmp");
      state.CropSelectedList = function (renderHook) {
        this.selectedCrops = [];
        console.log(renderHook);
        this.cropSelectedElem = document.querySelector(renderHook);

        this.render = function () {
          this.cropSelectedElem.innerHTML = "<div>Hi!!</div>";
        };
      };
      state.Crop = function () {};
      state.BMPSelectionList = function () {};
      state.BMP = function () {};
    },
  });
});
