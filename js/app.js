define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    buildApp: function (state) {
      console.log(state);
      // build and render assesment radio buttons ********************
      const assesmentRadioButtons = new state.RadioComponent(
        ".cda-assesment-radio-btns",
        state.assesmentRadioData
      );
      assesmentRadioButtons.render();

      // build and render area scenario radio buttons ********************
      const areaScenarioRadioButtons = new state.RadioComponent(
        ".cda-areaScenario-options-wrapper",
        state.areaScenarioRadioData
      );
      areaScenarioRadioButtons.render();
    },
  });
});
