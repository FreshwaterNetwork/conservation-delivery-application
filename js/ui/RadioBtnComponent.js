define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // radio component  **********************************************
      state.RadioComponent = function (renderHook, values) {
        this.selectedValue = "";
        console.log(renderHook);
        this.radioElem = document.querySelector(renderHook);
        console.log(this.radioElem);
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
          // set the selected value on render to be the first CB
          this.selectedValue = this.radioElem.querySelector("input").value;

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
          state.UIControls.assesmentRadioClick(this.selectedValue);
          // state.UIControls.prototype.assesmentRadioClick(this.selectedValue);
          return;
        }
        if (this.radioElemID === state.id + "areaScenario-radio-btns") {
          state.UIControls.areaRadioClick(this.selectedValue);
          return;
        }
      };
    },
  });
});
