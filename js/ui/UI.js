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

        // button elements
        this.selectBMPButtonElem = document.querySelector(
          ".cda-select-bmp-button"
        );
        this.backToMainButtonElem = document.querySelector(
          ".cda-back-to-main-button"
        );
        this.backToMainButtonFromErrorElem = document.querySelector(
          ".cda-back-to-main-from-error-button"
        );
        this.createReportButtonElem = document.querySelector(
          ".cda-create-report-button"
        );
        this.printReportButtonElem = document.querySelector(
          ".cda-print-report-button"
        );
        this.backToBMPButtonElem = document.querySelector(
          ".cda-back-to-bmp-button"
        );
        // add an event listener to the BMP button
        this.selectBMPButtonElem.addEventListener("click", (evt) => {
          this.bmpButtonClick(evt);
        });
        this.backToMainButtonElem.addEventListener("click", (evt) => {
          this.backToMainButtonClick(evt);
        });
        this.backToMainButtonFromErrorElem.addEventListener("click", (evt) => {
          this.backToMainButtonClick(evt);
        });
        this.createReportButtonElem.addEventListener("click", (evt) => {
          this.createReportButtonClick(evt);
        });
        this.printReportButtonElem.addEventListener("click", (evt) => {
          this.printReportButtonClick(evt);
        });
        this.backToBMPButtonElem.addEventListener("click", (evt) => {
          this.backToBMPButtonClick(evt);
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
            state.displayMapLayers(1);
          } else if (value === "resource-option") {
            state.displayMapLayers(2);
          } else if (value === "catchment-option") {
            state.displayMapLayers(0);
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
          state.displayMapLayers(1);
          state.currentlySelectedArea = "HUC12";
        } else if (value === "resource-option") {
          state.displayMapLayers(2);
          state.currentlySelectedArea = "LARU";
        } else if (value === "catchment-option") {
          state.displayMapLayers(0);
          state.currentlySelectedArea = "Catchment";
        } else if (value === "field-option") {
          state.displayMapLayers(3);
          state.currentlySelectedArea = "Field";
        } else {
          throw new Error("The Value does not match any options");
        }
      };
      // delivery radio button change
      state.UI.prototype.deliveryRadioClick = function (value) {};

      // select bmp and back buttons functionality
      state.UI.prototype.bmpButtonClick = function (evt) {
        if (state.areaSelectedListComponent.areaList.length > 0) {
          state.bmpSelectionOpen = true;
          this.hideElement(".cda-main-wrapper");
          this.showElement(".cda-retreiving-data-wrapper");
          state.getCropsFromAreaSelection().then(function () {
            state.totalLoadComponent.render();
            // once data processing is finished render the cropSelectedComponent and show hide UI related
            state.cropSelectedListComponent.render();
            state.UI.prototype.hideElement(".cda-retreiving-data-wrapper");
            state.UI.prototype.showElement(".cda-bmp-select-wrapper");
          });
        }
      };
      state.UI.prototype.backToMainButtonClick = function (evt) {
        state.bmpSelectionOpen = false;
        this.showElement(".cda-main-wrapper");
        this.hideElement(".cda-bmp-select-wrapper");
        this.hideElement(".cda-error-retreiving-data-wrapper");
        $("#left-pane").css("overflow-y", "auto");
        // on back button click clear out other crops that have already been rendered
        state.cropSelectedListComponent.selectedCrops = [];
        state.cropSelectedListComponent.cropSelectedElem.innerHTML = "";
      };

      state.UI.prototype.createReportButtonClick = function (evt) {
        this.showElement(".cda-report-wrapper");
        this.hideElement(".cda-bmp-select-wrapper");
        $(".dijitContentPane").css("overflow", "hidden");
        $(".sidebar").css("box-shadow", "none");
        $(".map-container").hide();
        $("header").hide();
        $(".nav-apps").hide();
        $(".sidebar-nav").hide();
        state.reportHeaderComponent.render();
        state.reportBodyComponent.render();
        const sidebarWrapper = document.querySelector(".cda-sidebar-wrapper")
          .parentElement.parentElement.parentElement;
        sidebarWrapper.style.width = "750px";
        const simpleSlider = document.querySelector(".esriSimpleSlider");
        simpleSlider.style.top = "18px";
        // update report map
        state.updateReportMap();
      };
      state.UI.prototype.printReportButtonClick = function (evt) {
        $("#left-pane").css("overflow-y", "initial");
        window.print();
      };
      window.onafterprint = (event) => {
        $(".dijitContentPane").css("overflow", "auto");
        $("#left-pane").css("overflow-y", "auto");
      };

      state.UI.prototype.backToBMPButtonClick = function (evt) {
        this.hideElement(".cda-report-wrapper");
        this.showElement(".cda-bmp-select-wrapper");
        $(".sidebar").css("box-shadow", "0px 0px 26px 0px rgb(51 51 51 / 42%)");
        $(".map-container").show();
        $("header").show();
        $(".nav-apps").show();
        $(".sidebar-nav").show();

        const sidebarWrapper = document.querySelector(".cda-sidebar-wrapper")
          .parentElement.parentElement.parentElement;
        sidebarWrapper.style.width = "450px";
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
      state.UI.prototype.numComma = function (x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
      };
    },
  });
});
