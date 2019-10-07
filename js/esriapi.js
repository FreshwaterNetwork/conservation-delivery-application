define([
	"esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent","esri/toolbars/draw", "esri/SpatialReference", "esri/tasks/query" ,"esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer", 
	"esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol","esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color", 
],
function ( 	ArcGISDynamicMapServiceLayer, Extent,Draw, SpatialReference, Query, QueryTask, declare, FeatureLayer, 
			SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
        "use strict";

        return declare(null, {
			esriApiFunctions: function(t){	
				// Add dynamic map service
				t.url = 'http://cirrus-web-adapter-241060755.us-west-1.elb.amazonaws.com/arcgis/rest/services/FN_Louisiana/CDA/MapServer';
				t.dynamicLayer = new ArcGISDynamicMapServiceLayer(t.url, {opacity:0.7});
				// t.selectionSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([88, 116, 215, 1]), 2), new Color([88, 116, 215]);
				t.selectionSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.0]));
				// add dynamic layer to map and set visible layers
				t.map.addLayer(t.dynamicLayer);
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				
				// wait until layer is loaded fully before allowing map interaction
				t.dynamicLayer.on("load", function () {
					t.layersArray = t.dynamicLayer.layerInfos;
					// map clicks
					t.map.on('click', (point) => {
						mapClick(point);
					})
				})
				// map click function, used for all main map clicks
				const mapClick = (point)=>{
					console.log('map click')
					let q = new Query();
					let qt = new QueryTask(t.url + "/" + t.obj.visibleLayers);
					q.geometry = point.mapPoint;
					q.outFields = ["*"];
					q.returnGeometry = true;
					qt.execute(q, function (e) {
						
						if(e.features.length > 0){
							e.features[0].setSymbol(t.selectionSymbol);
							map.graphics.add(new Graphic(e.features[0].geometry, t.selectionSymbol));
						}
					})
				}


			},
		});
    }
);