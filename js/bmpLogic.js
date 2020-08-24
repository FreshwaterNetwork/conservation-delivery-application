define([
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/geometry/Extent",
  "esri/toolbars/draw",
  "esri/SpatialReference",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "esri/tasks/Geoprocessor",
  "dojo/_base/declare",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/graphic",
  "dojo/_base/Color",
], function (
  ArcGISDynamicMapServiceLayer,
  Extent,
  Draw,
  SpatialReference,
  Query,
  QueryTask,
  Geoprocessor,
  declare,
  FeatureLayer,
  SimpleLineSymbol,
  SimpleFillSymbol,
  SimpleMarkerSymbol,
  Graphic,
  Color
) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // when area selection is checked ************************************************
      state.getCropsFromAreaSelection = function () {
        // var gp = new Geoprocessor(
        //   "https://cumulus.tnc.org/arcgis/rest/services/nascience/testGpService/GPServer/testGpService"
        // );
        // console.log(gp);
        // let params = {
        //   one: "test text",
        //   two: "test text 2",
        // };
        // function statusCallback(e, a) {
        //   console.log("status", e, a);
        // }
        // // statusCallback = function (status) {
        // //   console.log(status);
        // // };
        // function completeCallback(e, a) {
        //   // console.log("complete", e, a);
        //   gp.getResultData(e.jobId, "setText", (data) => {
        //     console.log(data);
        //   });
        // }
        // // console.log("before submit job");
        // gp.submitJob(params, completeCallback, statusCallback);
        // console.log("click here");

        // chain multiple promises to handle async queries
        return new Promise(function (getCropsResolve, reject) {
          state.getFieldsFromGraphics().then(function (fields) {
            state.selectRowsFromTable(fields).then(function (cropRows) {
              state.aggregateCropData(cropRows).then(function (cropData) {
                state.pushCropDataToComponent(cropData).then(function () {
                  getCropsResolve();
                });
              });
            });
          });
        });
      };

      // when local selection is checked ************************************************
      state.getFieldsFromLocalSelection = function () {
        return new Promise(function (getFieldsResolve, reject) {
          getFieldsResolve("crop data should be sent back here");
        });
      };

      // logic code for area selection function ********************************************************
      // **********************************************************************************
      // from the selected rows in the data table, aggregate the crop data
      // use the aggregated crop data to build out the UI
      state.aggregateCropData = function (cropRows) {
        const cropData = {};
        return new Promise(function (resolve, reject) {
          cropRows.features.forEach((crop) => {
            cropData[crop.attributes.CropName] = {
              acres: 0.0,
              orig_phos_load: 0.0,
              orig_nit_load: 0.0,
              orig_sed_load: 0.0,
              cropRows: [],
            };
          });
          cropRows.features.forEach((crop) => {
            cropData[crop.attributes.CropName]["cropRows"].push(
              crop.attributes
            );
            cropData[crop.attributes.CropName]["acres"] += parseFloat(
              crop.attributes.CropArea_acres
            );
            cropData[crop.attributes.CropName]["orig_phos_load"] += parseFloat(
              crop.attributes.orig_phos_load
            );
            // if (crop.attributes.CropName === "Soybeans") {
            //   console.log(cropData[crop.attributes.CropName]["orig_phos_load"]);
            // }

            cropData[crop.attributes.CropName]["orig_nit_load"] += parseFloat(
              crop.attributes.orig_nit_load
            );
            cropData[crop.attributes.CropName]["orig_sed_load"] += parseFloat(
              crop.attributes.orig_sed_load
            );
            cropData[crop.attributes.CropName]["kFact"] = parseFloat(
              crop.attributes.KffactF
            );
            cropData[crop.attributes.CropName]["clsFactor"] = parseFloat(
              crop.attributes.Cls_factor
            );
            cropData[crop.attributes.CropName]["cropAreaAcres"] = parseFloat(
              crop.attributes.CropArea_acres
            );
            cropData[crop.attributes.CropName]["runoff_year"] = parseFloat(
              crop.attributes.Runoff_in_yr
            );
          });
          console.log(cropData);
          return resolve(cropData);
        });
      };

      state.pushCropDataToComponent = function (cropData) {
        return new Promise(function (resolve, reject) {
          state.cropSelectedListComponent.selectedCrops = [];
          // loop through created object and create a new crop object
          // push new crop object to Crop Selected array
          for (var key in cropData) {
            const name = key;
            const acres = cropData[key].acres;
            const phos_load = cropData[key].orig_phos_load;
            const nit_load = cropData[key].orig_nit_load;
            const sed_load = cropData[key].orig_sed_load;
            const kFact = cropData[key].kFact;
            const clsFactor = cropData[key].clsFactor;
            const runoff_year = cropData[key].runoff_year;
            const cropRows = cropData[key].cropRows;
            let crop = new state.Crop(
              name,
              acres,
              phos_load,
              nit_load,
              sed_load,
              kFact,
              clsFactor,
              runoff_year,
              cropRows
            );
            state.cropSelectedListComponent.addCrop(crop);
          }
          resolve();
        });
      };

      // use the selected fields array to select all the rows from the data table
      // Field_Crop_LUT is the table
      state.selectRowsFromTable = function (fieldsArray) {
        return new Promise(function (getRowsResolve, reject) {
          let where = state.buildFieldTableQuery(fieldsArray);
          // let where = "RU = 11";
          // let where = "RU = 7 OR RU = 3 OR RU = 2";
          // let where = "RU = 7 OR RU = 6";
          // console.log(where);
          const q = new Query();
          const qt = new QueryTask(state.obj.url + "/4");
          q.outFields = ["*"];
          q.returnGeometry = true;
          q.where = where;
          // execute map query
          qt.execute(q, function (e) {
            return getRowsResolve(e);
          });
        });
      };
      state.buildFieldTableQuery = function (fieldsArray) {
        let where = "";
        let c = 1;
        fieldsArray.forEach((field, i) => {
          if (c === fieldsArray.length) {
            where += `fid = ${field}`;
          } else {
            where += `fid = ${field} OR `;
          }
          c += 1;
        });
        return where;
      };
      state.getFieldsFromGraphics = function () {
        const selectedFieldsArray = [];
        return new Promise(function (resolve, reject) {
          function queryFields(geometry) {
            return new Promise(function (resolve, reject) {
              const q = new Query();
              const qt = new QueryTask(state.obj.url + "/0");
              q.geometry = geometry;
              q.outFields = ["*"];
              q.returnGeometry = true;
              // execute map query
              qt.execute(q, function (e) {
                return resolve(e);
              });
            });
          }
          if (state.map.graphics.graphics.length > 0) {
            // start a loop counter
            let c = 1;
            state.map.graphics.graphics.forEach((graphic, i) => {
              queryFields(graphic.geometry).then(function (features) {
                features.features.forEach((feature) => {
                  selectedFieldsArray.push(feature.attributes.fid_1);
                });
                // once completed the loop and pushing data to array, resolve promise and
                // send the selectedFieldsArray
                // test against loop counter to make sure we have looped through all graphics
                if (state.map.graphics.graphics.length === c) {
                  resolve(selectedFieldsArray);
                }
                c += 1;
              });
            });
          } else {
            throw new Error("You must select an area.....");
          }
        });
      };
      // create html for bmp selection dropdown menu
      state.createBMPDropDown = function () {
        let dropdowElem = document.createElement("div");
        const lscValuesFull = [];
        const lscValuesDefined = [];
        const ovValues = [];
        const exValues = [];
        state.bmp_lut_data.forEach((bmp) => {
          if (bmp.RedFunc === "LSC") {
            // if lsc full exists
            if (bmp.lscFull) {
              lscValuesFull.push(bmp);
            } else {
              lscValuesDefined.push(bmp);
            }
          }
          if (bmp.AppType === "EX" && bmp.RedFunc !== "LSC") {
            exValues.push(bmp);
          }
          if (bmp.AppType === "OV") {
            ovValues.push(bmp);
          }
        });
        state.BMPselectMenu = `<select placeholder="Pick One Number"  class="cda-bmp-select-menu">`;
        state.BMPselectMenu += `<option>Select a Best Management Practice(s)</option>`;

        state.BMPselectMenu += `<optgroup label="Load Source Change BMP's (Full Coverage)">`;
        lscValuesFull.forEach((bmp) => {
          state.BMPselectMenu += `<option data-sed_eff="${bmp.Sed_Eff}" data-phos_eff="${bmp.Phos_Eff}" data-nitr_eff="${bmp.Nitr_Eff}" data-nitrBMP_Emc="${bmp.NitrBMP_EMC}" data-phosBMP_EMC="${bmp.PhosBMP_EMC}" appType="${bmp.AppType}" redFunc="${bmp.RedFunc}" value="${bmp.BMP_Short}">${bmp.BMP_Name}</option>`;
        });
        state.BMPselectMenu += `optgroup`;

        state.BMPselectMenu += `<optgroup label="Load Source Change BMP's (Defined Area)">`;
        lscValuesDefined.forEach((bmp) => {
          state.BMPselectMenu += `<option data-sed_eff="${bmp.Sed_Eff}" data-phos_eff="${bmp.Phos_Eff}" data-nitr_eff="${bmp.Nitr_Eff}" data-nitrBMP_Emc="${bmp.NitrBMP_EMC}" data-phosBMP_EMC="${bmp.PhosBMP_EMC}" appType="${bmp.AppType}" redFunc="${bmp.RedFunc}" value="${bmp.BMP_Short}">${bmp.BMP_Name}</option>`;
        });
        state.BMPselectMenu += `optgroup`;

        state.BMPselectMenu += `<optgroup label="Exclusive BMP's">`;
        exValues.forEach((bmp) => {
          state.BMPselectMenu += `<option data-sed_eff="${bmp.Sed_Eff}" data-phos_eff="${bmp.Phos_Eff}" data-nitr_eff="${bmp.Nitr_Eff}" data-nitrBMP_Emc="${bmp.NitrBMP_EMC}" data-phosBMP_EMC="${bmp.PhosBMP_EMC}" appType="${bmp.AppType}" redFunc="${bmp.RedFunc}" value="${bmp.BMP_Short}">${bmp.BMP_Name}</option>`;
        });
        state.BMPselectMenu += `optgroup`;

        state.BMPselectMenu += `<optgroup label="Overlapping BMP's">`;
        ovValues.forEach((bmp) => {
          state.BMPselectMenu += `<option data-sed_eff="${bmp.Sed_Eff}" data-phos_eff="${bmp.Phos_Eff}" data-nitr_eff="${bmp.Nitr_Eff}" data-nitrBMP_Emc="${bmp.NitrBMP_EMC}" data-phosBMP_EMC="${bmp.PhosBMP_EMC}" appType="${bmp.AppType}" redFunc="${bmp.RedFunc}" value="${bmp.BMP_Short}">${bmp.BMP_Name}</option>`;
        });
        state.BMPselectMenu += `optgroup`;

        state.BMPselectMenu += `</select>`;

        // dropdowElem.innerHTML = state.BMPselectMenu;
        // state.BMPselectMenu = dropdowElem;
      };
      state.createBMPDropDown();
    },
  });
});
