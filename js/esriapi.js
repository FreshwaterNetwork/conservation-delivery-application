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
  "./store/store",
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
  Color,
  store
) {
  // "use strict";
  // console.log(store);
  return declare(null, {
    initEsriApi: function (t) {
      console.log(store);
      console.log(t.map);
      t.map.on("click", (evt) => {
        console.log(evt);
        const payload = {
          num: 90,
        };
        store.dispatch("counterIncrement", payload);
        console.log(store.state);
      });
    },
  });
});
