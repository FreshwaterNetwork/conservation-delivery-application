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
        // chain multiple promises to handle async queries
        return new Promise(function (getCropsResolve, reject) {
          // state.getFieldsFromGraphics().then(function (fields) {
          state.selectRowsFromTable().then(function (cropRows) {
            state.aggregateCropData(cropRows).then(function (cropData) {
              state.pushCropDataToComponent(cropData).then(function () {
                getCropsResolve();
              });
            });
          });
          // });
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
        // console.log(cropRows);
        const cropData = {};
        return new Promise(function (resolve, reject) {
          cropRows.forEach((crop) => {
            cropData[crop.attributes.CropName] = {
              acres: 0.0,
              orig_phos_load: 0.0,
              orig_nit_load: 0.0,
              orig_sed_load: 0.0,
              cropRows: [],
            };
          });
          cropRows.forEach((crop) => {
            cropData[crop.attributes.CropName]["cropRows"].push(
              crop.attributes
            );
            cropData[crop.attributes.CropName]["crop_display"] = parseInt(
              crop.attributes.cropYN
            );
            cropData[crop.attributes.CropName]["acres"] += parseFloat(
              crop.attributes.CropArea_acres
            );
            cropData[crop.attributes.CropName]["orig_phos_load"] += parseFloat(
              crop.attributes.orig_phos_load
            );

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
            const cropDisplay = cropData[key].crop_display;
            let crop = new state.Crop(
              name,
              acres,
              phos_load,
              nit_load,
              sed_load,
              kFact,
              clsFactor,
              runoff_year,
              cropRows,
              cropDisplay
            );
            state.cropSelectedListComponent.addCrop(crop);
          }
          resolve();
        });
      };

      // use the selected fields array to select all the rows from the data table
      // Field_Crop_LUT is the table
      state.selectRowsFromTable = function () {
        return new Promise(function (getRowsResolve, reject) {
          let where = "";
          state.areaSelectedListComponent.areaList.forEach((area, i) => {
            console.log("areaaaa", area);
            where += `${area.areaType} = ${area.areaID} OR `;
          });
          // remove the trailing "OR" from the where clause
          where = where.slice(0, -4);
          // table queries
          const query1 = new Promise((resolve) => {
            const q = new Query();
            const qt = new QueryTask(state.obj.url + "/5");
            q.outFields = ["*"];
            q.returnGeometry = true;
            q.where = where;
            qt.execute(q, getResults, getError);

            function getResults(e) {
              resolve(e);
            }
            function getError(error) {
              // if error, show back to main button and an error message
              state.UIControls.showElement(
                ".cda-error-retreiving-data-wrapper"
              );
              state.UIControls.hideElement(".cda-retreiving-data-wrapper");
              const errorElem = document.querySelector(".cda-request-error");
              errorElem.innerHTML = error;
            }
          });
          const query2 = new Promise((resolve) => {
            const q = new Query();
            const qt = new QueryTask(state.obj.url + "/6");
            q.outFields = ["*"];
            q.returnGeometry = true;
            q.where = where;
            qt.execute(q, getResults, getError);
            function getResults(e) {
              resolve(e);
            }
            function getError(error) {
              // if error, show back to main button and an error message
              state.UIControls.showElement(
                ".cda-error-retreiving-data-wrapper"
              );
              state.UIControls.hideElement(".cda-retreiving-data-wrapper");
              const errorElem = document.querySelector(".cda-request-error");
              errorElem.innerHTML = error;
            }
          });

          const query3 = new Promise((resolve) => {
            const q = new Query();
            const qt = new QueryTask(state.obj.url + "/7");
            q.outFields = ["*"];
            q.returnGeometry = true;
            q.where = where;
            // console.log(state.areaSelectedListComponent);
            qt.execute(q, getResults, getError);

            function getResults(e) {
              resolve(e);
            }
            function getError(error) {
              console.log(error);
              // if error, show back to main button and an error message
              state.UIControls.showElement(
                ".cda-error-retreiving-data-wrapper"
              );
              state.UIControls.hideElement(".cda-retreiving-data-wrapper");
              const errorElem = document.querySelector(".cda-request-error");
              errorElem.innerHTML = error;
            }
          });
          const query4 = new Promise((resolve) => {
            const q = new Query();
            const qt = new QueryTask(state.obj.url + "/8");
            q.outFields = ["*"];
            q.returnGeometry = true;
            q.where = where;
            qt.execute(q, getResults, getError);
            function getResults(e) {
              resolve(e);
            }
            function getError(error) {
              console.log(error);
              // if error, show back to main button and an error message
              state.UIControls.showElement(
                ".cda-error-retreiving-data-wrapper"
              );
              state.UIControls.hideElement(".cda-retreiving-data-wrapper");
              const errorElem = document.querySelector(".cda-request-error");
              errorElem.innerHTML = error;
            }
          });
          // once all table promises are finished...
          const data = Promise.all([query1, query2, query3, query4]).then(
            (data) => {
              let features1 = data[0].features;
              let features2 = data[1].features;
              let features3 = data[2].features;
              let features4 = data[3].features;
              // combine the various feature sets into one
              let newArr = features1.concat(features2);
              let newArr2 = newArr.concat(features3);
              let newArr3 = newArr2.concat(features4);
              let features = newArr3;
              // resolve promise and send features
              return getRowsResolve(features);
            }
          );
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
                  selectedFieldsArray.push(feature.attributes.fid);
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

        state.BMPselectMenu += `<optgroup label="Load Source Change BMPs (Full Coverage)">`;
        lscValuesFull.forEach((bmp) => {
          state.BMPselectMenu += `<option data-sed_eff="${bmp.Sed_Eff}" data-phos_eff="${bmp.Phos_Eff}" data-nitr_eff="${bmp.Nitr_Eff}" data-nitrBMP_Emc="${bmp.NitrBMP_EMC}" data-phosBMP_EMC="${bmp.PhosBMP_EMC}" appType="${bmp.AppType}" redFunc="${bmp.RedFunc}" value="${bmp.BMP_Short}">${bmp.BMP_Name}</option>`;
        });
        state.BMPselectMenu += `optgroup`;

        state.BMPselectMenu += `<optgroup label="Load Source Change BMPs (Defined Area)">`;
        lscValuesDefined.forEach((bmp) => {
          state.BMPselectMenu += `<option data-sed_eff="${bmp.Sed_Eff}" data-phos_eff="${bmp.Phos_Eff}" data-nitr_eff="${bmp.Nitr_Eff}" data-nitrBMP_Emc="${bmp.NitrBMP_EMC}" data-phosBMP_EMC="${bmp.PhosBMP_EMC}" appType="${bmp.AppType}" redFunc="${bmp.RedFunc}" value="${bmp.BMP_Short}">${bmp.BMP_Name}</option>`;
        });
        state.BMPselectMenu += `optgroup`;

        state.BMPselectMenu += `<optgroup label="Exclusive BMPs">`;
        exValues.forEach((bmp) => {
          state.BMPselectMenu += `<option data-sed_eff="${bmp.Sed_Eff}" data-phos_eff="${bmp.Phos_Eff}" data-nitr_eff="${bmp.Nitr_Eff}" data-nitrBMP_Emc="${bmp.NitrBMP_EMC}" data-phosBMP_EMC="${bmp.PhosBMP_EMC}" appType="${bmp.AppType}" redFunc="${bmp.RedFunc}" value="${bmp.BMP_Short}">${bmp.BMP_Name}</option>`;
        });
        state.BMPselectMenu += `optgroup`;

        state.BMPselectMenu += `<optgroup label="Overlapping BMPs">`;
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
