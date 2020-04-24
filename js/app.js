define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    buildApp: function (state) {
      // build and render assesment radio buttons **********************************************
      state.assesmentRadioButtons = new state.RadioComponent(
        ".cda-assesment-radio-btns",
        state.assesmentRadioData
      );
      state.assesmentRadioButtons.render();

      // build and render area scenario radio buttons ****************************************
      state.areaScenarioRadioButtons = new state.RadioComponent(
        ".cda-areaScenario-radio-btns",
        state.areaScenarioRadioData
      );
      state.areaScenarioRadioButtons.render();

      // build and render delivery method radio buttons *************************************
      state.deliveryRadioButtons = new state.RadioComponent(
        ".cda-delivery-radio-btns",
        state.deliveryRadioData
      );
      state.deliveryRadioButtons.render();

      // build and render the parameters to select checkbox
      state.parametersCheckbox = new state.CheckboxComponent(
        ".cda-parameters-checkbox",
        state.parametersCheckboxData
      );
      state.parametersCheckbox.render();
    },
    // ****************************************

    // to build out field selections object
    // create a field object and populate it.
    // then create a field selected object
    // when a selection is made to a field, create new field,
    // and call the field selections object function addField(field),
    // from there push field to this.arrayOfFields
    // then call render function
    // also create a remove function as well

    // also consider using getters and setters to calculate/validate values before being set

    // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  });
});
