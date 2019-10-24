define([
        "esri/layers/ArcGISDynamicMapServiceLayer", "esri/geometry/Extent", "esri/toolbars/draw", "esri/SpatialReference", "esri/tasks/query", "esri/tasks/QueryTask", "dojo/_base/declare", "esri/layers/FeatureLayer",
        "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleMarkerSymbol", "esri/graphic", "dojo/_base/Color",
    ],
    function (ArcGISDynamicMapServiceLayer, Extent, Draw, SpatialReference, Query, QueryTask, declare, FeatureLayer,
        SimpleLineSymbol, SimpleFillSymbol, SimpleMarkerSymbol, Graphic, Color) {
        "use strict";

        return declare(null, {
            queryFields_getCrops: function (t) {
				console.time('report logic timer')
               	console.log('bmp logic')
               	let areaIdlist;
               	let area_selector;
               	if (t.obj['cda-data-object']['local-option']) {
               		areaIdlist = t.obj['cda-data-object']['local-option-selections']
               		area_selector = 'Fields'
               	} else {
               		if (t.obj['cda-data-object']['huc-option']) {
               			areaIdlist = t.obj['cda-data-object']['huc-option-selections']
               			area_selector = 'HUC 12s'
               		} else if (t.obj['cda-data-object']['catchment-option']) {
               			areaIdlist = t.obj['cda-data-object']['catchment-option-selections']
               			area_selector = 'Catchments'
               		} else if (t.obj['cda-data-object']['resource-option']) {
               			areaIdlist = t.obj['cda-data-object']['resource-option-selections']
               			area_selector = 'Resource Units'
               		}
               	}
               	// console.log(list)
               	// console.log(t.bmp_lut_data)

				// loop through all the field ID's and build where clause
				// we will use the where clause to query the Field_Crop_LUT Table
				let where ='';
               	$.each(areaIdlist, (i, v) => {
					where += `fid = ${v}`
					if (areaIdlist.length != i + 1) {
						where += ` OR `
					}
				})


				console.log(where)

				let q = new Query();
				let qt = new QueryTask('http://cospatial.tnc.org/arcgis/rest/services/NACR/la_tables_map_service/MapServer/5');
				// q.outFields = ["fid,comid,Cpct_slope"];
			//  q.outFields = ["Crop_LUT.CropName", "Crop_LUT.Nitr_EMC", "FINAL_Field_Crop_LUT.fid"];
				q.outFields = ["*"];
				q.returnGeometry = false;
				q.where = where;

				qt.execute(q, function (e) {
					// console.log(e);
					console.timeEnd('report logic timer');
					// let features = e.features;
					// console.log(features)
					// t.bmpLogic.createAreaCropSelectionTable(e.features)
					// console.log(t.areaCropSelection_dissolved_by_id)
					
					t.bmpLogic.createBmpGui(t, e.features);

				})
				qt.on("error", function (err) {
					console.log("error in queryTask: " + err.message);
					// if error have an error handling function
				});
			},
			
			createBmpGui: function (t,features) {
				let area_selections = t.obj['cda-data-object']['local-option-selections']
				$.each(area_selections, (i,v)=>{
					let selectMenuHTML = t.bmpLogic.create_bmp_select_menu(t,v)
					let html = `<div class="cda-bmp-item-wrapper" id="${v}">`
						html += `<h3>Field ID: ${v}</h3>`
						html += `<div>`
							html += `<div>${selectMenuHTML}</div>`
						html += `</div>`
					html += `</div>`

					$('.cda-bmp-selection-item-wrapper').append(html)
				})




				t.bmpLogic.stop_building_bmp_gui() // call this function at the end of the BMP build process
			},

			retreiveBMP: function (t) {
				console.log('bmp logic')
			},

			createAreaCropSelectionTable: function(object){
				// console.log(object)
				// $.each(object, (i,v)=>{
				// 	console.log(v.attributes);
				// })
			},
			 // start and stop building report functions to display gui elements that lets the user know the report is being built
			start_building_bmp_gui: function (t) {
				console.log('start building bmp');
				$('.cda-building-bmp-text').show()
				$('.cda-bmp-gui-wrapper').hide();
			},

			stop_building_bmp_gui: function (t) {
				console.log('stop building bmp');
				$('.cda-building-bmp-text').hide();
				$('.cda-bmp-gui-wrapper').show();
			},

			create_bmp_select_menu: function(t, id){
				
				let selectMenu = `<select placeholder="Pick One Number" id="chosenSingle_${id}" class="cda-bmp-select-menu">
					<option></option>
					<option value="" selected>Please select a BMP</option>
					<option value="Bioreactor">Bioreactor</option>
					<option value="Buffer100">Buffer - Forest (100ft wide)</option>
					<option value="three">Three</option>
					<option value="four">Four</option>
					<option value="five">Five</option>
				</select>`

				return selectMenu;
			},


        })
    }
)