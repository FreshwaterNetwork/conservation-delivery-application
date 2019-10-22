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
				t.selectionSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.0]));
				t.selectionSymbolHover = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0]), 2), new Color([255, 255, 0, 0.1]));
				// add dynamic layer to map and set visible layers
				t.map.addLayer(t.dynamicLayer);
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
				
				// wait until layer is loaded fully before allowing map interaction
				t.dynamicLayer.on("load", function () {
					t.layersArray = t.dynamicLayer.layerInfos;
					t.map.on('click', (point) => {
						mapClick(point);
					})
				})
				// map click function, used for all main map clicks
				const mapClick = (point)=>{
					let q = new Query();
					let qt = new QueryTask(t.url + "/" + t.obj.visibleLayers);
					q.geometry = point.mapPoint;
					q.outFields = ["*"];
					q.returnGeometry = true;
					// only excute the map click query function if the selected areas is less than 5
					if (t.obj['cda-data-object']['area-selected-counter'] < 5) {
						qt.execute(q, function (e) {
							// check to see if you clicked on a feature
							if (e.features.length > 0) {
								t.areaSelected = '';
								// check to see which area is selected, then add each selected id to 
								// that area of the main data object
								if (t.obj['cda-data-object']['local-option']) {
									if (t.obj['cda-data-object']['local-option-selections'].indexOf(e.features[0].attributes.fid_1) == -1) {
										t.obj['cda-data-object']['local-option-selections'].push(e.features[0].attributes.fid_1)
										map.graphics.add(new Graphic(e.features[0].geometry, t.selectionSymbol, {
											id: e.features[0].attributes.fid_1
										}));
									}
									t.obj['cda-data-object']['area-selected'] = 'local-option';

								} else if (t.obj['cda-data-object']['area-option']) {
									if (t.obj['cda-data-object']['resource-option']) {
										if (t.obj['cda-data-object']['resource-option-selections'].indexOf(e.features[0].attributes.RU) == -1) {
											t.obj['cda-data-object']['resource-option-selections'].push(e.features[0].attributes.RU)
											map.graphics.add(new Graphic(e.features[0].geometry, t.selectionSymbol, {
												id: e.features[0].attributes.RU
											}));
										}
										t.obj['cda-data-object']['area-selected'] = 'resource-option';

									} else if (t.obj['cda-data-object']['huc-option']) {
										if (t.obj['cda-data-object']['huc-option-selections'].indexOf(e.features[0].attributes.gid) == -1) {
											t.obj['cda-data-object']['huc-option-selections'].push(e.features[0].attributes.gid)
											map.graphics.add(new Graphic(e.features[0].geometry, t.selectionSymbol, {
												id: e.features[0].attributes.gid
											}));
										}
										t.obj['cda-data-object']['area-selected'] = 'huc-option';

									} else if (t.obj['cda-data-object']['catchment-option']) {
										if (t.obj['cda-data-object']['catchment-option-selections'].indexOf(e.features[0].attributes.featureid) == -1) {
											t.obj['cda-data-object']['catchment-option-selections'].push(e.features[0].attributes.featureid)
											map.graphics.add(new Graphic(e.features[0].geometry, t.selectionSymbol, {
												id: e.features[0].attributes.featureid
											}));
										}
										t.obj['cda-data-object']['area-selected'] = 'catchment-option';
									}
								}
							
								t.esriapi.handleAreaSelections(t);
							}
						})
					}else{
						console.log('you can only select 5 areas')
					}
				}
			},
			// whenever the map is clicked, IDs of the clicked polygons are saved
			// in an object, handle the UI portion, display and delete selections
			handleAreaSelections: function (t) {
				$('.cda-selected-areas').empty();
				$.each(t.obj['cda-data-object'][`${t.obj['cda-data-object']['area-selected']}-selections`], (i, v) => {
					let idText = ''
					if(t.obj['cda-data-object']['local-option']){
						idText = 'Field ID: ' 
					}else{
						if (t.obj['cda-data-object']['huc-option']) {
							idText = 'HUC 12: '
						} else if (t.obj['cda-data-object']['catchment-option']) {
							idText = 'Catchment ID: '
						} else if (t.obj['cda-data-object']['resource-option']) {
							idText = 'Resource Unit ID: '
						}
					}
					let html = `<div id="${v}" class="cda-selected">${idText} <span> ${v}</span><div class="cda-selected-close"><div>&#10005;</div></div></div>`
					$('.cda-selected-areas').append(html);
				})

				// on area selection button close, remove that specififc graphic from the map and remove that specific div from the DOM
				$(document).on('click', '.cda-selected-close', function (evt) {
					let id = $(evt.currentTarget).parent()[0].id;
					$.each(map.graphics.graphics, (i, v) => {
						if(v){
							if (v.attributes) {
								if (id == v.attributes.id) {
									map.graphics.remove(v); // remove graphic form the map
									$($(evt.currentTarget).parent()[0]).remove();
									let index = t.obj['cda-data-object'][`${t.obj['cda-data-object']['area-selected']}-selections`].indexOf(v.attributes.id)
									if (index > -1) {
										t.obj['cda-data-object'][`${t.obj['cda-data-object']['area-selected']}-selections`].splice(index, 1);
									}
									// update selected area counter when clicking on map or on area close button
									t.esriapi.handleAreaSelectionsCounter(t);
								}
							}
						}
					})
					// update selected area counter when clicking on map or on area close button
					// t.esriapi.handleAreaSelectionsCounter(t);
				})

				$(document).on('mouseover mouseleave', '.cda-selected', function (evt) {
					let id = evt.currentTarget.id
					$.each(map.graphics.graphics, (i,v)=>{
						if(v.attributes){
							if (id == v.attributes.id) {
								if (evt.type == 'mouseover') {
									v.setSymbol(t.selectionSymbolHover);
								} else if (evt.type == 'mouseleave') {
									v.setSymbol(t.selectionSymbol);
								}
							}
						}
					})
				})
				// update selected area counter when clicking on map or on area close button
				t.esriapi.handleAreaSelectionsCounter(t);
			}, // end of handle area selections function

			handleAreaSelectionsCounter: function (t) {
				// console.log('counter')
				t.obj['cda-data-object']['area-selected-counter']
				if (t.obj['cda-data-object']['local-option']) {
					t.obj['cda-data-object']['area-selected-counter'] = t.obj['cda-data-object']['local-option-selections'].length
				} else {
					if (t.obj['cda-data-object']['huc-option']) {
						t.obj['cda-data-object']['area-selected-counter'] = t.obj['cda-data-object']['huc-option-selections'].length
					} else if (t.obj['cda-data-object']['catchment-option']) {
						t.obj['cda-data-object']['area-selected-counter'] = t.obj['cda-data-object']['catchment-option-selections'].length
					} else if (t.obj['cda-data-object']['resource-option']) {
						t.obj['cda-data-object']['area-selected-counter'] = t.obj['cda-data-object']['resource-option-selections'].length
					}
				}
				$('.cda-number-selected-area span').html(t.obj['cda-data-object']['area-selected-counter'])
			}, // end of area selections counter function 


			// whenever the map is clicked, IDs of the clicked polygons are saved
			// in an object, handle the UI portion, display and delete selections
			displayLayers: function (t, value) {
				console.log('area chnage')
				// reset area selected counter
				t.obj['cda-data-object']['area-selected-counter'] = 0
				// reset area selected HTML	
				$('.cda-number-selected-area span').html(0)

				t.obj['cda-data-object']['local-option-selections'] = []
				t.obj['cda-data-object']['resource-option-selections'] = []
				t.obj['cda-data-object']['huc-option-selections'] = []
				t.obj['cda-data-object']['catchment-option-selections'] = []
				t.map.graphics.clear();

				$('.cda-selected-areas').empty();

				if (value == 'cda-localProject') {
					t.obj.visibleLayers = [0]
				} else if (value == 'cda-huc12') {
					t.obj.visibleLayers = [1]
				} else if (value == 'cda-catchment') {
					t.obj.visibleLayers = [4]
				} else if (value == 'cda-resourceUnit') {
					t.obj.visibleLayers = [5]
				}
				// display visible layers
				t.dynamicLayer.setVisibleLayers(t.obj.visibleLayers);
			}
		});
    }
);