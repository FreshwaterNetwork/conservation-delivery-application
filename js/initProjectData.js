define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    initData: function (state) {
      // data for radio buttons and checkboxes
      state.assesmentRadioData = [
        {
          name: "assesmentRadioButton",
          id: "area-scenario",
          value: "area-scenario",
          display: "Area Scenario",
        },
        {
          name: "assesmentRadioButton",
          id: "local-scenario",
          value: "local-scenario",
          display: "Local Scenario",
        },
      ];
      state.areaScenarioRadioData = [
        {
          name: "areaScenarioRadioButton",
          id: "resource-option",
          value: "resource-option",
          display: "Resource Units",
        },
        {
          name: "areaScenarioRadioButton",
          id: "huc12-option",
          value: "huc12-option",
          display: "HUC 12",
        },
        {
          name: "areaScenarioRadioButton",
          id: "catchment-option",
          value: "catchment-option",
          display: "Catchments",
        },
      ];
      state.deliveryRadioData = [
        {
          name: "deliveryRadioButton",
          id: "edge-field-option",
          value: "edge-field-option",
          display: "Edge of Field",
        },
        {
          name: "deliveryRadioButton",
          id: "stream-option",
          value: "stream-option",
          display: "Delivered to Stream",
        },
      ];

      state.parametersCheckboxData = [
        {
          name: "parametersCheckboxButton",
          id: "nitrogen-option",
          value: "nitrogen-option",
          display: "Nitrogen",
        },
        {
          name: "parametersCheckboxButton",
          id: "phosphorus-option",
          value: "phosphorus-option",
          display: "Phosphorus",
        },
        {
          name: "parametersCheckboxButton",
          id: "sediment-option",
          value: "sediment-option",
          display: "Sediment",
        },
      ];

      // js object of the BMP lut data for faster access
      state.bmp_lut_data = [
        {
          ID: 1,
          BMP_Name: "Bioreactor",
          BMP_Short: "Bioreactor",
          Nitr_Eff: 0.45,
          Phos_Eff: 0,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 2,
          BMP_Name: "Buffer - Forest (100ft wide)",
          BMP_Short: "Buffer100",
          Nitr_Eff: 0.47,
          Phos_Eff: 0.46,
          Sed_Eff: 0.58,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.4,
          NitrBMP_EMC: 0.1,
        },
        {
          ID: 3,
          BMP_Name: "Buffer - Grass (35ft wide)",
          BMP_Short: "Buffer35",
          Nitr_Eff: 0.33,
          Phos_Eff: 0.43,
          Sed_Eff: 0.53,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.2,
          NitrBMP_EMC: 0.11,
        },
        {
          ID: 4,
          BMP_Name: "Conservation Tillage 1 (30-59% Residue)",
          BMP_Short: "Till1",
          Nitr_Eff: 0.15,
          Phos_Eff: 0.35,
          Sed_Eff: 0.4,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "EX",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 5,
          BMP_Name: "Conservation Tillage 2 (equal or more than 60% Residue)",
          BMP_Short: "Till2",
          Nitr_Eff: 0.25,
          Phos_Eff: 0.68,
          Sed_Eff: 0.77,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "EX",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 6,
          BMP_Name: "Contour Farming",
          BMP_Short: "Contour",
          Nitr_Eff: 0.27,
          Phos_Eff: 0.39,
          Sed_Eff: 0.34,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "EX",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 7,
          BMP_Name: "Controlled Drainage",
          BMP_Short: "ContDrain",
          Nitr_Eff: 0.38,
          Phos_Eff: 0.35,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 8,
          BMP_Name:
            "Cover Crop 1 (Group A Commodity) (High Till only for Sediment)",
          BMP_Short: "CoverCrop1",
          Nitr_Eff: 0.008,
          Phos_Eff: 0,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 9,
          BMP_Name:
            "Cover Crop 2 (Group A Traditional Normal Planting Time) (High Till only for TP and Sediment)",
          BMP_Short: "CoverCrop2",
          Nitr_Eff: 0.19,
          Phos_Eff: 0.07,
          Sed_Eff: 0.1,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 10,
          BMP_Name:
            "Cover Crop 3 (Group A Traditional Early Planting Time) (High Till only for TP and Sediment)",
          BMP_Short: "CoverCrop3",
          Nitr_Eff: 0.2,
          Phos_Eff: 0.15,
          Sed_Eff: 0.2,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 11,
          BMP_Name: "Land Retirement",
          BMP_Short: "LandRetire",
          Nitr_Eff: 0.89,
          Phos_Eff: 0.8,
          Sed_Eff: 0.95,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.27,
          NitrBMP_EMC: 0.1,
        },
        {
          ID: 12,
          BMP_Name: "Nutrient Management 1 (Determined Rate)",
          BMP_Short: "NutManage1",
          Nitr_Eff: 0.15,
          Phos_Eff: 0.45,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 13,
          BMP_Name:
            "Nutrient Management 2 (Determined Rate Plus Additional Considerations)",
          BMP_Short: "NutManage2",
          Nitr_Eff: 0.24,
          Phos_Eff: 0.56,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 15,
          BMP_Name: "Terrace",
          BMP_Short: "Terrace",
          Nitr_Eff: 0.25,
          Phos_Eff: 0.3,
          Sed_Eff: 0.4,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "EX",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 16,
          BMP_Name: "Two-Stage Ditch",
          BMP_Short: "Ditch",
          Nitr_Eff: 0.12,
          Phos_Eff: 0.28,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 17,
          BMP_Name: "30m Buffer with Optimal Grazing",
          BMP_Short: "BufferGraze",
          Nitr_Eff: 0.36,
          Phos_Eff: 0.65,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.2,
          NitrBMP_EMC: 0.11,
        },
        {
          ID: 19,
          BMP_Name: "Critical Area Planting",
          BMP_Short: "CritPlanting",
          Nitr_Eff: 0.17,
          Phos_Eff: 0.2,
          Sed_Eff: 0.42,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.27,
          NitrBMP_EMC: 0.1,
        },
        {
          ID: 20,
          BMP_Name: "Forest Buffer (minimum 35 feet wide)",
          BMP_Short: "ForestBuff",
          Nitr_Eff: 0.45,
          Phos_Eff: 0.4,
          Sed_Eff: 0.53,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.4,
          NitrBMP_EMC: 0.1,
        },
        {
          ID: 21,
          BMP_Name: "Grass Buffer (minimum 35 feet wide)",
          BMP_Short: "GrassBuff",
          Nitr_Eff: 0.86,
          Phos_Eff: 0.76,
          Sed_Eff: 0.64,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.2,
          NitrBMP_EMC: 0.11,
        },
        {
          ID: 22,
          BMP_Name:
            "Grazing Land Management (rotational grazing with fenced areas)",
          BMP_Short: "GrzManage",
          Nitr_Eff: 0.43,
          Phos_Eff: 0.26,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 23,
          BMP_Name: "Heavy Use Area Protection",
          BMP_Short: "UseProtection",
          Nitr_Eff: 0.18,
          Phos_Eff: 0.19,
          Sed_Eff: 0.33,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 24,
          BMP_Name: "Litter Storage and Management",
          BMP_Short: "LitterStor",
          Nitr_Eff: 0.14,
          Phos_Eff: 0.14,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 25,
          BMP_Name: "Livestock Exclusion Fencing",
          BMP_Short: "LivstckFence",
          Nitr_Eff: 0.2,
          Phos_Eff: 0.3,
          Sed_Eff: 0.62,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 27,
          BMP_Name:
            "Pasture and Hayland Planting (also called Forage Planting)",
          BMP_Short: "PastPlanting",
          Nitr_Eff: 0.18,
          Phos_Eff: 0.15,
          Sed_Eff: 0,
          Source: "USEPA, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0.2,
          NitrBMP_EMC: 0.11,
        },
        {
          ID: 28,
          BMP_Name: "Prescribed Grazing",
          BMP_Short: "PresGraze",
          Nitr_Eff: 0.4,
          Phos_Eff: 0.22,
          Sed_Eff: 0.33,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 29,
          BMP_Name: "Streambank Protection w/o Fencing",
          BMP_Short: "StrmbnkProt",
          Nitr_Eff: 0.15,
          Phos_Eff: 0.22,
          Sed_Eff: 0.57,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 30,
          BMP_Name: "Streambank Stabilization and Fencing",
          BMP_Short: "StrmbnkStabFenP",
          Nitr_Eff: 0.75,
          Phos_Eff: 0.75,
          Sed_Eff: 0.75,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 31,
          BMP_Name: "Use Exclusion",
          BMP_Short: "UseExcl",
          Nitr_Eff: 0.39,
          Phos_Eff: 0.04,
          Sed_Eff: 0.58,
          Source: "USEPA, 2018",
          RedFunc: "E",
          AppType: "OV",
          PhosBMP_EMC: "",
          NitrBMP_EMC: "",
        },
        {
          ID: 33,
          BMP_Name: "Wetland Restoration",
          BMP_Short: "WetlandRest",
          Nitr_Eff: 0.42,
          Phos_Eff: 0.41,
          Sed_Eff: 0.31,
          Source: "CBP, 2018",
          RedFunc: "LSC",
          AppType: "EX",
          PhosBMP_EMC: 0,
          NitrBMP_EMC: 0,
        },
      ];
    },
  });
});
