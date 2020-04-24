define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    initUI: function (state) {
      // checkbox component *********************************************
      state.CheckboxComponent = function (renderHook, values) {
        this.selectedValues = [];
        this.checkboxElem = document.querySelector(renderHook);
        this.checkboxElemID = this.checkboxElem.id;
        // render the checkbox component
        this.render = function () {
          values.forEach((value) => {
            const template = `
                <label class="form-component" for"${value.id}">
                    <input type="checkbox" id="${value.id}" name="${value.name}" value="${value.value}"></input>
                    <div class="check"></div>
                    <span class="form-text">${value.display}</span>
                </label>`;
            this.checkboxElem.innerHTML += template;
          });

          // add event listener to the checkbox
          // bind the this object to carry it through to the next function
          this.checkboxElem.addEventListener(
            "change",
            this.onClickHandler.bind(this)
          );
        };
      };
      // generic checkbox click handler
      state.CheckboxComponent.prototype.onClickHandler = function (evt) {
        if (this.checkboxElemID === state.id + "parameters-checkbox") {
          this.parameterCheckboxClick(evt);
        }
      };

      state.CheckboxComponent.prototype.parameterCheckboxClick = function (
        evt
      ) {
        this.selectedValues = [];
        const inputElems = this.checkboxElem.querySelectorAll("input");
        inputElems.forEach((input) => {
          if (input.checked) {
            this.selectedValues.push(input.value);
          }
        });
        if (evt.target.value === "sediment-option" && evt.target.checked) {
          state.UIControls.prototype.showElement(
            ".cda-sediment-option-wrapper"
          );
        } else if (
          evt.target.value === "sediment-option" &&
          !evt.target.checked
        ) {
          state.UIControls.prototype.hideElement(
            ".cda-sediment-option-wrapper"
          );
        }
      };
      // radio component  **********************************************
      state.RadioComponent = function (renderHook, values) {
        this.selectedValue = "";
        this.radioElem = document.querySelector(renderHook);
        this.radioElemID = this.radioElem.id;
        // render the radio button component
        this.render = function () {
          values.forEach((value) => {
            const template = `
                <label class="form-component" for"${value.id}">
                    <input type="radio" id="${value.id}" name="${value.name}" value="${value.value}"></input>
                    <div class="check"></div>
                    <span class="form-text">${value.display}</span>
                </label>`;
            this.radioElem.innerHTML += template;
          });
          // make sure first radio button is always checked on render
          this.radioElem.querySelector("input").checked = true;

          // add event listener to the checkbox
          // bind the this object to carry it through to the next function
          this.radioElem.addEventListener(
            "change",
            this.onClickHandler.bind(this)
          );
        };
      };

      state.RadioComponent.prototype.onClickHandler = function (evt) {
        this.selectedValue = evt.target.value;
        // const parentId = this.radioElemID.split(state.id)[1];
        if (this.radioElemID === state.id + "assesment-radio-btns") {
          state.UIControls.prototype.assesmentRadioClick(this.selectedValue);
          return;
        }
        if (this.radioElemID === state.id + "areaScenario-radio-btns") {
          state.UIControls.prototype.areaRadioClick(this.selectedValue);
          return;
        }
      };
      // #############################################################
      // Object that uses methods to control flow of all UI related functionality
      // UI controls *************************************************
      state.UIControls = function () {
        // these properties can flow throughout all ui related methods
        this.color = "red";
        this.speed = "slow";
      };
      // assesment radio button change
      state.UIControls.prototype.assesmentRadioClick = function (value) {
        this.hideElement(".cda-areaScenario-wrapper");
        this.hideElement(".cda-delivery-wrapper");
        if (value === "area-scenario") {
          this.showElement(".cda-areaScenario-wrapper");
        } else if (value === "local-scenario") {
          this.showElement(".cda-delivery-wrapper");
        } else {
          throw new Error("The Value does not match and element to display");
        }
      };
      // area radio button change
      state.UIControls.prototype.areaRadioClick = function (value) {
        console.log("area", value);
      };
      // delivery radio button change
      state.UIControls.prototype.deliveryRadioClick = function (value) {
        console.log("area", value);
      };

      // show/hide DOM elements
      state.UIControls.prototype.showElement = function (selector) {
        const elem = document.querySelector(selector);
        console.log("show", elem);
        elem.style.display = "block";
      };
      state.UIControls.prototype.hideElement = function (selector) {
        const elem = document.querySelector(selector);
        console.log("hide", elem);
        elem.style.display = "none";
      };
    },
  });
});
