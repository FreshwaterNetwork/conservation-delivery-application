define([
	"dojo/_base/declare", "esri/tasks/query", "esri/tasks/QueryTask","esri/geometry/Extent", "esri/SpatialReference", "esri/layers/FeatureLayer", "esri/dijit/Search", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
	"esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color","esri/layers/GraphicsLayer","esri/renderers/SimpleRenderer",'dojo/_base/lang',"dojo/on",'dojo/domReady!'
],
function ( declare, Query, QueryTask,Extent,SpatialReference,FeatureLayer, Search, SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color, GraphicsLayer, SimpleRenderer,lang,on, domReady) {
        "use strict";

        return declare(null, {
			eventListeners: function(t){
				// on toggle of local/area scenario radio buttons
				$('.cda-assessmentDD-wrapper input').on('click', (evt)=>{
					if (evt.currentTarget.value == 'cda-areaScenario') {
						$('.cda-areaScenario-options-wrapper').slideDown()
						$('.cda-localProject-options-wrapper').slideUp()
					} else if (evt.currentTarget.value == 'cda-localProject') {
						$('.cda-localProject-options-wrapper').slideDown()
						$('.cda-areaScenario-options-wrapper').slideUp()
					}
				})

				// parameters clicks checkboxes
				$('.cda-parameter-option-wrapper input').on('click', (evt)=>{
					$.each($('.cda-parameter-option-wrapper input'), (i, v) => {
						console.log(v.checked);
						console.log(v.value);
						// if checked add true to data array
						if(v.checked){

							
						}
					})
				})
				// to prevent weird sliding, have a seperate click function for the sediment checkbox
				$('#' + t.id + 'sediment-option').on('click', (evt) => {
					if(evt.currentTarget.checked){
						$('.cda-sediment-options-wrapper').slideDown();
					}else{
						$('.cda-sediment-options-wrapper').slideUp();
					}
				})

			}, // end of event listeners function
		
			commaSeparateNumber: function(val){
				while (/(\d+)(\d{3})/.test(val.toString())){
					val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
				}
				return val;
			},
			abbreviateNumber: function(num) {
			    if (num >= 1000000000) {
			        return (num / 1000000000).toFixed(1).replace(/\.0$/, '') + 'B';
			     }
			     if (num >= 1000000) {
			        return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
			     }
			     if (num >= 1000) {
			        return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
			     }
			     return num;
			}
        });
    }
);
