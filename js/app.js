define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // area selected compoenent ***************************************************************
      state.areaSelectedListComponent = new state.AreaSelectedList(
        ".cda-selected-areas"
      );
      state.areaSelectedListComponent.render();

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

      // build and render sediment options radio buttons *************************************
      state.sedimentOptionsRadioButton = new state.RadioComponent(
        ".cda-sediment-options-radio-btns",
        state.sedimentOptionRadioButtonData
      );
      state.sedimentOptionsRadioButton.render();

      // build and render the parameters to select checkbox
      state.comparisonTypeRadioButtons = new state.RadioComponent(
        ".cda-comparison-type-radio-btns",
        state.comparisonTypeRadioData
      );
      state.comparisonTypeRadioButtons.render();
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
