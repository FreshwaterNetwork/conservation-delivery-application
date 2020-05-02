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
  "dojo/_base/Color",
], function (
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
    init: function (state) {
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
        let id_identifier;
        let layer;
        if (state.assesmentRadioButtons.selectedValue === "local-scenario") {
          id_identifier = "fid_1";
          layer = 0;
        } else {
          let areaSelected = state.areaScenarioRadioButtons.selectedValue;
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
        }
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
    },
  });
});
