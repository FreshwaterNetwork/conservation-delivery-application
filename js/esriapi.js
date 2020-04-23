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
    initEsriApi: function (state) {
      state.NewObj = function (test, test2) {
        this.testData = test;
        this.otherData = test2;
        this.readMessage = function () {
          console.log("read message");
        };
        this.concatMsg = function () {
          this.readMessage();
          this.newMsg = this.testData + " -- " + this.otherData;
        };
        this.render = function () {
          let div = document.createElement("div");
          div.append(this.newMsg);
          let elem = document.getElementsByClassName("cda-render-list");
          elem[0].append(div);
        };
      };

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
        esriQuery(mapPoint).then(function (features) {
          if (features.length > 0) {
            // push feature to a list
            // console.log(features[0]);
            pushFieldIdToArray(features[0].attributes.fid_1);
          }
        });
      }
      // esri map click query
      function esriQuery(mapPoint) {
        return new Promise(function (resolve, reject) {
          const q = new Query();
          const qt = new QueryTask(state.obj.url + "/0");
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
      // push field id to selected field array
      function pushFieldIdToArray(fieldId) {
        const field = new state.FieldSelected();
        state.obj.selectedFields.push(field);
        const fieldsArray = new state.AllFieldsSelected(
          state.obj.selectedFields
        );
        // call the render field list function when a new field object is added
        fieldsArray.render();
      }
      state.FieldSelected = function (fieldId) {
        this.fieldId = fieldId;
        this.fieldGeometry = "geometry goes here";
        this.load1 = 567;
        this.load2 = 897;
        this.calculateLoad = function (one, two) {
          return one + two;
        };
        this.newLoad = this.calculateLoad(this.load1, this.load2);
      };
      state.AllFieldsSelected = function (fieldsArray) {
        this.fieldsArray = fieldsArray;
        this.removeOne = function (evt) {
          this.fieldsArray.pop();
          this.render();
        };
        document
          .getElementsByClassName("cda-remove-one")[0]
          .addEventListener("click", function (evt) {
            this.removeOne;
          });
        this.render = function () {
          const renderHook = document.getElementsByClassName(
            "cda-fields-selected-wrapper"
          )[0];
          // empty the render hook dom pointer
          renderHook.innerHTML = "";
          this.fieldsArray.forEach((field) => {
            // create new div
            const fieldElem = document.createElement("div");
            // append data to new div
            fieldElem.append(field.newLoad);
            // append new div to fields selected render hook
            renderHook.append(fieldElem);
          });
        };
      };
    },
  });
});
