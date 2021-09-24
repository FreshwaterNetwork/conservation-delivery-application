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
  "esri/graphicsUtils",
  "esri/layers/GraphicsLayer",
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
  graphicsUtils,
  GraphicsLayer,
  Color
) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // build print report map
      state.printMap = new Map(state.id + "report-map", {
        basemap: "topo",
        center: [-94.07, 31.14],
        zoom: 6,
        showAttribution: false,
        isScrollWheel: false,
        logo: false,
        autoResize: true,
      });
      state.fieldsVisible = true;
      // Add dynamic map service
      state.dynamicLayer = new ArcGISDynamicMapServiceLayer(state.obj.url, {
        opacity: 0.7,
      });
      state.printLayer = new ArcGISDynamicMapServiceLayer(state.obj.url, {
        opacity: 0.7,
      });
      state.printMap.addLayer(state.printLayer);
      state.printLayer.setVisibleLayers([4]);

      state.selectionSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 255, 255]),
          2
        ),
        new Color([0, 255, 255, 0.1])
      );
      state.selectionPrintSymbol = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
          SimpleLineSymbol.STYLE_SOLID,
          new Color([0, 0, 0]),
          2
        ),
        new Color([252, 252, 0, 0.0])
      );

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
        if (!state.bmpSelectionOpen) {
          let areaSelected = state.currentlySelectedArea;
          let id_identifier, layer;
          if (areaSelected === "LARU") {
            id_identifier = "LARU";
            layer = 2;
          } else if (areaSelected === "HUC12") {
            id_identifier = "HUC_12";
            layer = 1;
          } else if (areaSelected === "Catchment") {
            id_identifier = "Catchment_ID";
            layer = 0;
          } else if (areaSelected === "Field") {
            id_identifier = "fid";
            layer = 3;
          }

          esriMapQuery(mapPoint, layer).then(function (features) {
            if (features.length > 0) {
              const id = features[0].attributes[id_identifier];
              const geometry = features[0].geometry;
              // create a new area object
              let area = new state.Area(geometry, String(id), id_identifier);
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
        if (state.fieldsVisible) {
          state.obj.visibleLayers = [val, 4];
        } else {
          state.obj.visibleLayers = [val];
        }
        state.dynamicLayer.setVisibleLayers(state.obj.visibleLayers);
      };
      state.toggleFieldVisibility = function (val) {
        let value = parseInt(val.value);
        if (val.checked) {
          if (value === 4) {
            state.fieldsVisible = true;
          }
          state.obj.visibleLayers.push(value);
          state.dynamicLayer.setVisibleLayers(state.obj.visibleLayers);
        } else {
          if (value === 4) {
            state.fieldsVisible = false;
          }
          const index = state.obj.visibleLayers.indexOf(value);
          if (index > -1) {
            state.obj.visibleLayers.splice(index, 1);
          }
          state.dynamicLayer.setVisibleLayers(state.obj.visibleLayers);
        }
      };
      state.displayMapGraphics = function () {
        const areaList = state.areaSelectedListComponent.areaList;
        state.map.graphics.clear();
        areaList.forEach((area) => {
          state.map.graphics.add(
            new Graphic(area.areaGeometry, state.selectionSymbol)
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
          //         selectedFieldsArray.push(feature.attributes.fid);
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
      state.updateReportMap = function () {
        state.printMap.graphics.clear();
        // create a graphics layer
        var printMapGraphics = new GraphicsLayer();
        const areaList = state.areaSelectedListComponent.areaList;

        areaList.forEach((area) => {
          state.printMap.graphics.add(
            new Graphic(area.areaGeometry, state.selectionPrintSymbol)
          );
        });

        var extent = graphicsUtils.graphicsExtent(
          state.printMap.graphics.graphics
        );
        state.printMap.setExtent(extent.expand(2), false);
        state.printLayer.setVisibleLayers([4]);
      };
    },
  });
});
