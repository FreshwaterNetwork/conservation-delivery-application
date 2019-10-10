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
						$.each($('.cda-areaScenario-options-wrapper input'), (i,v)=>{
							if(v.checked){
								t.esriapi.displayLayers(t, v.value)
							}
						})
					} else if (evt.currentTarget.value == 'cda-localProject') {
						$('.cda-localProject-options-wrapper').slideDown()
						$('.cda-areaScenario-options-wrapper').slideUp()
						t.esriapi.displayLayers(t, evt.currentTarget.value)
					}
				})

				// on selection of area to (huc, catchment, resource)
				$('.cda-areaScenario-options-wrapper input').on('click', (evt)=>{
					t.esriapi.displayLayers(t, evt.currentTarget.value)
				})

				// to prevent weird sliding, have a seperate click function for the sediment checkbox
				$('#' + t.id + 'sediment-option').on('click', (evt) => {
					if(evt.currentTarget.checked){
						$('.cda-sediment-options-wrapper').slideDown();
					}else{
						$('.cda-sediment-options-wrapper').slideUp();
					}
				})

				// when any input is changed on the site, populate the data object that will be sent to python
				const populateDataObject = (evt)=>{
					let dataObject = t.obj["cda-data-object"];
					$.each($('.cda-sidebar-wrapper input'), (i,v)=>{
						let id = v.id.split(t.id)[1]
						if(v.checked){
							dataObject[id] = true
						}else{
							dataObject[id] = false
						}
					})
					// check to see if sediment option is true, if so populate sediment options
					if (dataObject['sediment-option']) {
						$.each($('.cda-sediment-options-wrapper input'), (i,v)=>{
							if(v.checked){
								let id = v.id.split(t.id)[1]
								dataObject['sed_method'] = id
							}
						})
					} else {
						dataObject['sed_method'] = ''
					}
				}

				// when any main input is changed call the populateDataObject function
				$('.cda-sidebar-wrapper input').on('click', (evt) => {
					populateDataObject(evt);
				})

				// $('.cda-select-bmp-wrapper button').on('click', (evt)=>{
				// 	console.log(evt)

				// })

				$('.cda-build-report-wrapper button').on('click', (evt) => {
					t.report.createReport(t); // this function is in the function.js file
					$('.cda-sidebar-wrapper').hide();
					$('.cda-report-wrapper').show();
				})
				// on back to controls button click
				$('.cda-back-to-controls').on('click', (evt)=>{
					$('.cda-report-wrapper').hide();
					$('.cda-sidebar-wrapper').show();
					// contract plugin width
					$('#' + t.id).parent().parent().css("width", "430");
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
