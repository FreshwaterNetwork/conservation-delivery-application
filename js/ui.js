define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    initUI: function (state) {
      state.CheckboxComponent = function (renderHook, values) {};
      // radio component button **********************************************
      state.RadioComponent = function (renderHook, values) {
        // this.selectedValue = [];
        this.radioElem = document.querySelector(renderHook);
        // build out the radio button component
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
          // call the function to make sure first radio button is always checked on render
          this.checkFirstRadioBtn();
          // add event listener to the checkbox
          // bind the this object to carry it through to the next function
          this.radioElem.addEventListener("change", this.onClick);
        };
        this.onClick = function (evt) {
          console.log(this);
          console.log(evt);
        };
      };
      //   // radio component prototype functions
      //   state.RadioComponent.prototype.onClick = function (evt) {
      //     console.log(this);
      //     console.log(evt);
      //   };
      state.RadioComponent.prototype.checkFirstRadioBtn = function () {
        const button = this.radioElem.querySelector("input");
        button.checked = true;
      };
      state.RadioComponent.prototype.testFunc = function () {
        console.log("test function in prototype");
      };
    },
  });
});
