define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // #############################################################
      // Object that uses methods to control flow of all UI related functionality
      // UI controls *************************************************
      state.UI = function () {
        // these properties can flow throughout all ui related methods
        const selectBMPButtonElem = document.querySelector(
          ".cda-select-bmp-button"
        );
        const backToMainButtonElem = document.querySelector(
          ".cda-back-to-main-button"
        );
        // add an event listener to the BMP button
        selectBMPButtonElem.addEventListener("click", (evt) => {
          this.bmpButtonClick(evt);
        });
        backToMainButtonElem.addEventListener("click", (evt) => {
          console.log(evt);
          this.backToMainButtonClick(evt);
        });
      };

      // assesment radio button change
      state.UI.prototype.assesmentRadioClick = function (value) {
        //  reset the area selected array and re-render the component
        state.areaSelectedListComponent.removeAllAreas();

        this.hideElement(".cda-areaScenario-wrapper");
        this.hideElement(".cda-delivery-wrapper");
        //
        if (value === "area-scenario") {
          this.showElement(".cda-areaScenario-wrapper");
          let value = state.areaScenarioRadioButtons.selectedValue;
          if (value === "huc12-option") {
            state.displayMapLayers(2);
          } else if (value === "resource-option") {
            state.displayMapLayers(3);
          } else if (value === "catchment-option") {
            state.displayMapLayers(1);
          } else {
            throw new Error("The Value does not match any options");
          }
        } else if (value === "local-scenario") {
          this.showElement(".cda-delivery-wrapper");
          state.displayMapLayers(0);
        } else {
          throw new Error("The Value does not match and element to display");
        }
      };
      // area radio button change
      state.UI.prototype.areaRadioClick = function (value) {
        // reset the area selected array and re-render the component
        state.areaSelectedListComponent.removeAllAreas();

        // display layers on the map
        if (value === "huc12-option") {
          state.displayMapLayers(2);
        } else if (value === "resource-option") {
          state.displayMapLayers(3);
        } else if (value === "catchment-option") {
          state.displayMapLayers(1);
        } else {
          throw new Error("The Value does not match any options");
        }
      };
      // delivery radio button change
      state.UI.prototype.deliveryRadioClick = function (value) {
        console.log("area", value);
      };

      // select bmp and back buttons functionality
      state.UI.prototype.bmpButtonClick = function (evt) {
        console.log("button click", evt);
      };
      state.UI.prototype.backToMainButtonClick = function (evt) {
        console.log("backToMainButtonClick", evt);
      };

      // show/hide DOM elements
      state.UI.prototype.showElement = function (selector) {
        const elem = document.querySelector(selector);
        elem.style.display = "block";
      };
      state.UI.prototype.hideElement = function (selector) {
        const elem = document.querySelector(selector);
        elem.style.display = "none";
      };
    },
  });
});
