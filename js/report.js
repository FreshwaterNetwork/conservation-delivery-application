define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color","esri/layers/GraphicsLayer","esri/renderers/SimpleRenderer",'dojo/_base/lang',"dojo/on",
	'dojo/domReady!',"dojo/dom", "dojo/dom-style", "esri/dijit/Print","esri/tasks/PrintTemplate", "esri/config", "esri/request","dojo/parser","dojo/_base/array",
],
function ( declare, Query, QueryTask,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, 
	SimpleMarkerSymbol, Graphic, Color, GraphicsLayer, 
	SimpleRenderer,lang,on, domReady, dom, domStyle, Print, PrintTemplate, esriConfig, esriRequest, parser, arrayUtils
	) {
        "use strict";

        return declare(null, {
			createReport: function(t){
				console.log('create report')
				console.log(t.obj["cda-data-object"]);
				// expand plugin width
				$('#' + t.id).parent().parent().css("width", "650");

				t.reportLogic.reportLogic(t);
			}
		})
	}
)