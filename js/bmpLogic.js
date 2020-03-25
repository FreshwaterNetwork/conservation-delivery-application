define([
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/geometry/Extent",
  "esri/toolbars/draw",
  "esri/SpatialReference",
  "esri/tasks/query",
  "esri/tasks/QueryTask",
  "dojo/_base/declare",
  "esri/layers/FeatureLayer",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/graphic",
  "dojo/_base/Color"
], function(
  ArcGISDynamicMapServiceLayer,
  Extent,
  Draw,
  SpatialReference,
  Query,
  QueryTask,
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
    queryFields_getCrops: function(t) {
      let areaIdlist;
      let area_selector;
      if (t.obj["cda-data-object"]["local-option"]) {
        areaIdlist = t.obj["cda-data-object"]["local-option-selections"];
        area_selector = "Fields";
      } else {
        if (t.obj["cda-data-object"]["huc-option"]) {
          areaIdlist = t.obj["cda-data-object"]["huc-option-selections"];
          area_selector = "HUC 12s";
        } else if (t.obj["cda-data-object"]["catchment-option"]) {
          areaIdlist = t.obj["cda-data-object"]["catchment-option-selections"];
          area_selector = "Catchments";
        } else if (t.obj["cda-data-object"]["resource-option"]) {
          areaIdlist = t.obj["cda-data-object"]["resource-option-selections"];
          area_selector = "Resource Units";
        }
      }
      // loop through all the field ID's and build where clause
      // we will use the where clause to query the Field_Crop_LUT Table
      let where = "";
      $.each(areaIdlist, (i, v) => {
        where += `fid = ${v}`;
        if (areaIdlist.length != i + 1) {
          where += ` OR `;
        }
      });
      let q = new Query();
      let qt = new QueryTask(
        "http://cospatial.tnc.org/arcgis/rest/services/NACR/la_tables_map_service/MapServer/5"
      );
      // q.outFields = ["fid,comid,Cpct_slope"];
      //  q.outFields = ["Crop_LUT.CropName", "Crop_LUT.Nitr_EMC", "FINAL_Field_Crop_LUT.fid"];
      q.outFields = ["*"];
      q.returnGeometry = false;
      q.where = where;
      qt.execute(q, function(e) {
        // t.bmpLogic.createAreaCropSelectionTable(e.features)
        t.bmpLogic.createBmpGui(t, e.features);
      });
      // if error have an error handling function
      qt.on("error", function(err) {
        console.log("error in queryTask: " + err.message);
      });
    },

    createBmpGui: function(t, features) {
      $(".cda-bmp-selection-item-wrapper").empty();
      let area_selections = t.obj["cda-data-object"]["local-option-selections"];
      $.each(area_selections, (i, v) => {
        let selectMenuHTML = t.bmpLogic.create_bmp_select_menu(t, v);
        let html = `<div class="cda-bmp-item-wrapper" id="${v}">`;
        html += `<h3 class="cda-bmp-items-header">Field ID: ${v}</h3>`;

        html += `${selectMenuHTML}`;

        html += `</div>`;

        $(".cda-bmp-selection-item-wrapper").append(html);
      });

      t.bmpLogic.stop_building_bmp_gui(); // call this function at the end of the BMP build process
    },

    populateBMPValues: function(evt) {
      $.each(evt.options, (i, v) => {
        if (v.value == evt.value) {
          let optionData = $(v).data();
          console.log(optionData);
        }
      });
    },

    // start and stop building report functions to display gui elements that lets the user know the report is being built
    start_building_bmp_gui: function(t) {
      console.time("report logic timer");
      console.log("start building bmp");
      $(".cda-building-bmp-text").show();
      $(".cda-bmp-gui-wrapper").hide();
    },

    stop_building_bmp_gui: function(t) {
      console.timeEnd("report logic timer");
      // console.log('stop building bmp');
      $(".cda-building-bmp-text").hide();
      $(".cda-bmp-gui-wrapper").show();
    },

    create_bmp_select_menu: function(t, id) {
      let selectMenu = `<select placeholder="Pick One Number" id="chosenSingle_${id}" class="cda-bmp-select-menu">`;
      selectMenu += `<option>Select a BMP</option>`;
      $.each(t.bmp_lut_data, (i, v) => {
        // let bmp_values = `{"sed_eff": ${v.Sed_Eff}, "phos_eff": ${v.Phos_Eff}, "nitr_eff":${v.Nitr_Eff}, "nitrBMP_Emc": ${v.NitrBMP_EMC}, "phosBMP_EMC": ${v.PhosBMP_EMC}, "appType:": ${v.AppType}, "redFunc": ${v.RedFunc}}`
        // let bmp_values = `{sed_eff: ${v.Sed_Eff}, phos_eff: ${v.Phos_Eff}, nitr_eff:${v.Nitr_Eff}, nitrBMP_Emc: ${v.NitrBMP_EMC}, phosBMP_EMC: ${v.PhosBMP_EMC}, appType: ${v.AppType}, redFunc: ${v.RedFunc}}`
        selectMenu += `<option data-sed_eff="${v.Sed_Eff}" data-phos_eff="${v.Phos_Eff}" data-nitr_eff="${v.Nitr_Eff}" data-nitrBMP_Emc="${v.NitrBMP_EMC}" data-phosBMP_EMC="${v.PhosBMP_EMC}" data-appType="${v.AppType}" data-redFunc="${v.RedFunc}" value="${v.BMP_Short}">${v.BMP_Name}</option>`;
      });
      selectMenu += `</select>`;
      return selectMenu;
    }
  });
});
