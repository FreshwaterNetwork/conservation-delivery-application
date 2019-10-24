define([
            "esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/toolbars/draw", "esri/SpatialReference", "esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer",
            "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color",
        ],
        function (ArcGISDynamicMapServiceLayer, Extent, Draw, SpatialReference, Query, QueryTask, declare, FeatureLayer,
            SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
            "use strict";

            return declare(null, {
                    reportLogic: function (t) {
                        t.reportLogic.start_building_report_gui(t);
                        console.time('report logic timer') 
                        let where = "fid = 67 OR fid = 68 OR fid = 69"
                        t.reportLogic.field_crop_lut_query(t, where);
                    },

                    field_crop_lut_query: function(t, where){
                        let q = new Query();
                        let qt = new QueryTask('http://cospatial.tnc.org/arcgis/rest/services/NACR/la_tables_map_service/MapServer/5');
                        // q.outFields = ["fid,comid,Cpct_slope"];
                        q.outFields = ["*"];
                        q.returnGeometry = false;
                        q.where = where;

                        qt.execute(q, function (e) {
                            console.log(e);
                            console.timeEnd('report logic timer');
                            let features = e.features;
                            t.reportLogic.stop_building_report_gui(t);
                        })
                        qt.on("error", function (err) {
                            console.log("error in queryTask: " + err.message);
                            // if error have an error handling function
                        });
                    },

                    // start and stop building report functions to display gui elements that lets the user know the report is being built
                    start_building_report_gui: function(t){
                        console.log('start building report');
                        $('.cda-building-report-text').show()
                    },

                    stop_building_report_gui: function (t) {
                        console.log('stop building report');
                        $('.cda-building-report-text').hide()
                    }
                }
            )
        }
)