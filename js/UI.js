define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // #############################################################
      // Object that uses methods to control flow of all UI related functionality
      // UI controls *************************************************
      state.UI = function () {
        // these properties can flow throughout all ui related methods
        // wrapper elements
        // this.mainSelectionWrapper = document.querySelector(".cda-main-wrapper");
        // this.bmpSelectionWrapper = document.querySelector(
        //   ".cda-bmp-select-wrapper"
        // );
        // button elements
        this.selectBMPButtonElem = document.querySelector(
          ".cda-select-bmp-button"
        );
        this.backToMainButtonElem = document.querySelector(
          ".cda-back-to-main-button"
        );
        // add an event listener to the BMP button
        this.selectBMPButtonElem.addEventListener("click", (evt) => {
          this.bmpButtonClick(evt);
        });
        this.backToMainButtonElem.addEventListener("click", (evt) => {
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
        if (state.areaSelectedListComponent.areaList.length > 0) {
          this.hideElement(".cda-main-wrapper");
          this.showElement(".cda-retreiving-data-wrapper");
          // get fields from area selection
          state.getFieldsFromAreaSelection().then(function (fieldArray) {
            // get rows from data table using selected fields
            state.selectRowsFromTable(fieldArray).then(function (rows) {
              // aggregate crop data
              state.aggregateCropData(rows).then(function (data) {
                console.log(data);
                // show and hide elements when everything is done loading and being built
                state.UI.prototype.hideElement(".cda-retreiving-data-wrapper");
                state.UI.prototype.showElement(".cda-bmp-select-wrapper");
              });
            });
          });
        }
      };
      state.UI.prototype.backToMainButtonClick = function (evt) {
        console.log("backToMainButtonClick", evt);
        this.showElement(".cda-main-wrapper");
        this.hideElement(".cda-bmp-select-wrapper");
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
