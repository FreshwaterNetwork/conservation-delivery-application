define([
  "esri/layers/ArcGISDynamicMapServiceLayer",
  "esri/map",
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
  Map,
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
      // build print report map
      console.log(state.id);
      state.printMap = new Map(state.id + "report-map", {
        basemap: "topo",
        center: [-92, 31],
        zoom: 5,
        showAttribution: false,
        isScrollWheel: false,
        logo: false,
      });
      // import { getLayer } from "@esri/arcgis-rest-feature-layer";

      // getLayer({
      //   url:
      //     "https://sampleserver6.arcgisonline.com/arcgis/rest/services/ServiceRequest/FeatureServer/0",
      // }).then(console.log(response)); // { name: "311", id: 0, ... }

      // var featURL =
      //   "https://services.arcgis.com/F7DSX1DSNSiWmOqh/arcgis/rest/services/CDA_AGO_Feat_Service_test/FeatureServer";
      // var featureLayer = new FeatureLayer(featURL, {
      //   mode: FeatureLayer.MODE_ONDEMAND,
      //   outFields: ["*"],
      // });
      // $.ajax({
      //   url: featURL + "?f=pjson",
      //   success: function (result) {
      //     console.log(result);
      //   },
      // });
      // // Make a request for a user with a given ID
      // axios
      //   .get(featURL + "?f=pjson")
      //   .then(function (response) {
      //     console.log(response);
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      // console.log(featureLayer);

      // Add dynamic map service
      state.dynamicLayer = new ArcGISDynamicMapServiceLayer(state.obj.url, {
        opacity: 0.7,
      });
      state.selectionSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 255, 255]),
          2
        ),
        new Color([0, 255, 255, 0.1])
      );
      //   t.selectionSymbolHover = new SimpleFillSymbol(
      //     SimpleFillSymbol.STYLE_SOLID,
      //     new SimpleLineSymbol(
      //       SimpleLineSymbol.STYLE_SOLID,
      //       new Color([255, 255, 0]),
      //       2
      //     ),
      //     new Color([255, 255, 0, 0.1])
      //   );

      // add dynamic layer to map and set visible layers
      state.map.addLayer(state.dynamicLayer);
      state.dynamicLayer.setVisibleLayers(state.obj.visibleLayers);

      // wait until layer is loaded fully before allowing map interaction ************************
      state.dynamicLayer.on("load", function () {
        state.map.on("click", (point) => {
          mapClick(point.mapPoint);
        });
      });
      // map click
      function mapClick(mapPoint) {
        let areaSelected = "resource-option";
        if (areaSelected === "resource-option") {
          id_identifier = "RU";
          layer = 3;
        } else if (areaSelected === "huc12-option") {
          id_identifier = "huc_12";
          layer = 2;
        } else if (areaSelected === "catchment-option") {
          id_identifier = "featureid";
          layer = 1;
        }
        // let id_identifier;
        // let layer;
        // if (state.assesmentRadioButtons.selectedValue === "local-scenario") {
        //   id_identifier = "fid_1";
        //   layer = 0;
        // } else {
        //   let areaSelected = state.areaScenarioRadioButtons.selectedValue;
        //   if (areaSelected === "resource-option") {
        //     id_identifier = "RU";
        //     layer = 3;
        //   } else if (areaSelected === "huc12-option") {
        //     id_identifier = "huc_12";
        //     layer = 2;
        //   } else if (areaSelected === "catchment-option") {
        //     id_identifier = "featureid";
        //     layer = 1;
        //   }
        // }
        esriMapQuery(mapPoint, layer).then(function (features) {
          if (features.length > 0) {
            const id = features[0].attributes[id_identifier];
            const geometry = features[0].geometry;
            // create a new area object
            let area = new state.Area(geometry, id);
            // check to make sure the selected area is not in the array
            // also check to make sure the array is less than 5
            const areaList = state.areaSelectedListComponent.areaList;

            if (!areaList.some((e) => e.id === id) && areaList.length < 5) {
              // add new area to areaSelected array
              state.areaSelectedListComponent.addNewArea(area);
            }
          }
        });
      }
      // esri map click query
      function esriMapQuery(mapPoint, layer) {
        return new Promise(function (resolve, reject) {
          const q = new Query();
          const qt = new QueryTask(state.obj.url + "/" + layer);
          q.geometry = mapPoint;
          q.outFields = ["*"];
          q.returnGeometry = true;
          // execute map query
          qt.execute(q, function (e) {
            // check to see if you clicked on a feature
            if (e.features.length > 0) {
              const features = e.features;
              return resolve(features);
            } else {
              const features = "";
              return resolve(features);
            }
          });
        });
      }
      state.displayMapLayers = function (val) {
        state.obj.visibleLayers = [val];
        state.dynamicLayer.setVisibleLayers(state.obj.visibleLayers);
      };
      state.displayMapGraphics = function () {
        const areaList = state.areaSelectedListComponent.areaList;
        state.map.graphics.clear();
        areaList.forEach((area) => {
          state.map.graphics.add(
            new Graphic(area.geometry, state.selectionSymbol)
          );
        });
      };

      // from the map graphics find out which fields are selected
      state.getFieldsFromAreaSelection = function () {
        return new Promise(function (getFieldsResolve, reject) {
          // const selectedFieldsArray = [];
          // function queryFields(geometry) {
          //   return new Promise(function (resolve, reject) {
          //     const q = new Query();
          //     const qt = new QueryTask(state.obj.url + "/0");
          //     q.geometry = geometry;
          //     q.outFields = ["*"];
          //     q.returnGeometry = true;
          //     // execute map query
          //     qt.execute(q, function (e) {
          //       return resolve(e);
          //     });
          //   });
          // }
          // if (state.map.graphics.graphics.length > 0) {
          //   // const selectedFieldsArray = [];
          //   // start a loop counter
          //   let c = 1;
          //   state.map.graphics.graphics.forEach((graphic, i) => {
          //     queryFields(graphic.geometry).then(function (features) {
          //       features.features.forEach((feature) => {
          //         selectedFieldsArray.push(feature.attributes.fid_1);
          //       });
          //       // once completed the loop and pushing data to array, resolve promise and
          //       // send the selectedFieldsArray
          //       // test against loop counter to make sure we have looped through all graphics
          //       if (state.map.graphics.graphics.length === c) {
          //         getFieldsResolve(selectedFieldsArray);
          //       }
          //       c += 1;
          //     });
          //   });
          // } else {
          //   throw new Error("You must select an area.....");
          // }
        });
      };
      // // use the selected fields array to select all the rows from the data table
      // // Field_Crop_LUT is the table
      // state.selectRowsFromTable = function (fieldsArray) {
      //   return new Promise(function (getRowsResolve, reject) {
      //     let where = state.buildFieldTableQuery(fieldsArray);
      //     const q = new Query();
      //     const qt = new QueryTask(state.obj.url + "/4");
      //     // q.geometry = mapPoint;
      //     q.outFields = ["*"];
      //     q.returnGeometry = true;
      //     q.where = where;
      //     // execute map query
      //     qt.execute(q, function (e) {
      //       return getRowsResolve(e);
      //     });
      //   });
      // };

      // // from the selecetd rows in the data table, aggregate the crop data
      // // use the aggregated crop data to build out the UI
      // state.aggregateCropData = function (rows) {
      //   return new Promise(function (getCropsResolve, reject) {
      //     return getCropsResolve("get crops resolve");
      //   });
      // };

      // state.buildFieldTableQuery = function (fieldsArray) {
      //   let where = "";
      //   let c = 1;
      //   fieldsArray.forEach((field, i) => {
      //     if (c === fieldsArray.length) {
      //       where += `fid = ${field}`;
      //     } else {
      //       where += `fid = ${field} OR `;
      //     }
      //     c += 1;
      //   });
      //   return where;
      // };
    },
  });
});
