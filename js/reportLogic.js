define([
            "esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/toolbars/draw", "esri/SpatialReference", "esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer",
            "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color",
        ],
        function (ArcGISDynamicMapServiceLayer, Extent, Draw, SpatialReference, Query, QueryTask, declare, FeatureLayer,
            SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
            "use strict";

            return declare(null, {
                    reportLogic: function (t) {
                        console.log('report logic')
                        










                    },
                }
            )
        }
)