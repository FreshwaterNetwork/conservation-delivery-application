define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // area selected compoenent ***************************************************************
      state.areaSelectedListComponent = new state.AreaSelectedList(
        ".cda-selected-areas"
      );
      state.areaSelectedListComponent.render();

      // instantiate UI Controls
      state.UIControls = new state.UI();

      // build and render assesment radio buttons **********************************************
      // state.assesmentRadioButtons = new state.RadioComponent(
      //   ".cda-assesment-radio-btns",
      //   state.assesmentRadioData
      // );
      // state.assesmentRadioButtons.render();

      // build and render area scenario radio buttons ****************************************
      state.areaScenarioRadioButtons = new state.RadioComponent(
        ".cda-areaScenario-radio-btns",
        state.areaScenarioRadioData
      );
      state.areaScenarioRadioButtons.render();

      // build and render delivery method radio buttons *************************************
      // state.deliveryRadioButtons = new state.RadioComponent(
      //   ".cda-delivery-radio-btns",
      //   state.deliveryRadioData
      // );
      // state.deliveryRadioButtons.render();

      // build and render the parameters to select checkbox
      // state.parametersCheckbox = new state.CheckboxComponent(
      //   ".cda-parameters-checkbox",
      //   state.parametersCheckboxData
      // );
      // state.parametersCheckbox.render();

      // build and render sediment options radio buttons *************************************
      state.sedimentOptionsRadioButton = new state.RadioComponent(
        ".cda-sediment-options-radio-btns",
        state.sedimentOptionRadioButtonData
      );
      state.sedimentOptionsRadioButton.render();

      // // build and render the parameters to select checkbox
      // state.comparisonTypeRadioButtons = new state.RadioComponent(
      //   ".cda-comparison-type-radio-btns",
      //   state.comparisonTypeRadioData
      // );
      // state.comparisonTypeRadioButtons.render();

      // BMP Selection area *************************************************************************
      // build and render the crop list
      state.cropSelectedListComponent = new state.CropSelectedList(
        ".cda-crop-selected-wrapper"
      );

      // build and render the total load wrapper
      state.totalLoadComponent = new state.TotalLoadComponent(
        ".cda-total-load-wrapper"
      );
      // build report header component
      state.reportHeaderComponent = new state.reportHeaderComponent(
        ".cda-report-header-wrapper"
      );
      // build report body component
      state.reportBodyComponent = new state.reportBodyComponent(
        ".cda-report-body-wrapper"
      );
    },
  });
});
