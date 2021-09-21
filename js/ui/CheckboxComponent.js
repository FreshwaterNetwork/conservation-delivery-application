define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // checkbox component *********************************************
      state.CheckboxComponent = function (renderHook, values) {
        this.selectedValues = [];
        this.checkboxElem = document.querySelector(renderHook);
        this.checkboxElemID = this.checkboxElem.id;
        // render the checkbox component
        this.render = function () {
          values.forEach((value) => {
            // ${
            //   this.bmpToggle == true
            //     ? "<div class='cda-bmp-toggle-button' style='color: maroon;'>Toggle BMP OFF</div>"
            //     : "<div class='cda-bmp-toggle-button' style='color: green;'>Toggle BMP ON</div>"
            // }
            const template = `
                <label class="form-component" for"${value.id}">
                    <input ${value.checked == true ? "checked" : ""} 
                    type="checkbox" id="${value.id}" name="${
              value.name
            }" value="${value.value}"></input>
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
        if (this.checkboxElemID === state.id + "cda-field-toggle") {
          this.fieldToggleCheckboxClick(evt);
          return;
        }
      };
      state.CheckboxComponent.prototype.fieldToggleCheckboxClick = function (
        evt
      ) {
        state.toggleFieldVisibility(evt.target);
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
          state.UIControls.showElement(".cda-sediment-option-wrapper");
        } else if (
          evt.target.value === "sediment-option" &&
          !evt.target.checked
        ) {
          state.UIControls.hideElement(".cda-sediment-option-wrapper");
        }
      };
    },
  });
});
