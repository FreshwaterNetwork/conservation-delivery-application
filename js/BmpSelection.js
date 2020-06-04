define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // crop selected list
      state.CropSelectedList = function (renderHook) {
        this.cropSelectedElem = document.querySelector(renderHook);
        this.selectedCrops = [];

        // render function ********************************************************************************
        this.render = function () {
          // on each render sort by crop acres
          this.sortSelectedCrops();
          // loop through all the selected crops array and call render on each one
          this.selectedCrops.forEach((crop) => {
            crop.render(this.cropSelectedElem);
          });
        };
        // DOM Events *************************************************************************************
        // add click event for overall cropSelectedElem, listen for BMP DD changes
        this.cropSelectedElem.addEventListener("change", (evt) => {
          // if its a bmp dropdown menu change
          if (evt.target.className === "cda-bmp-select-menu") {
            this.bmpDDChange(evt);
          }
        });
      };
      // Crop selected list prototype functions
      // *******************************************************************************************************************
      state.CropSelectedList.prototype.bmpDDChange = function (evt) {
        // get parent elem
        const parent = evt.target.parentNode.parentNode;
        // grab the crop name, and look it up in the cropList
        const cropSelected = evt.target.parentNode.id.split("bmp-wrapper-")[1];
        // create a new BMP selecd object
        this.bmpSelectedComponent = new state.BMPSelectedComponent(
          evt.target.value
        );
        // add the crop selected to the properties of the object
        this.bmpSelectedComponent.crop = cropSelected;
        this.addBMPSelectionToCrop(cropSelected, this.bmpSelectedComponent);
        //render the new elem
        this.bmpSelectedComponent.render(parent);
        console.log("change the dropdown back to default");
      };
      // disable value in dropdown menu for future selections
      state.CropSelectedList.prototype.disableUsedBMPfromDD = function () {
        console.log("diable chossen values");
      };
      // enable value in dropdown menu after a bmp was unselected
      state.CropSelectedList.prototype.enableBMPfromDD = function () {
        console.log("enable DD value");
      };
      // reset bmp dropdown menu after bmp was selected
      state.CropSelectedList.prototype.resetBMPDropdown = function () {
        console.log("reset dd");
      };
      // add a new crop to the selected crops array
      state.CropSelectedList.prototype.addCrop = function (crop) {
        this.selectedCrops.push(crop);
      };
      // sort selected crops array
      state.CropSelectedList.prototype.sortSelectedCrops = function () {
        this.selectedCrops.sort(function (a, b) {
          return b.acres - a.acres;
        });
      };
      // when a new bmp is selected, add that selection to the crop object
      state.CropSelectedList.prototype.addBMPSelectionToCrop = function (
        value,
        bmpSelected
      ) {
        let crop = this.selectedCrops.find((o) => o.name === value);
        crop.bmpSelected.push(bmpSelected);
      };

      // crop obeject, each crop is created and added to the crop selected list object
      // ***********************************************************************************************
      state.Crop = function (cropName, acres, phos_load, nit_load, sed_load) {
        this.bmpSelected = [];
        // crop properties
        this.name = cropName;
        this.acres = parseFloat(acres.toFixed(2));
        this.phos_load = parseFloat(phos_load.toFixed(2));
        this.nit_load = parseFloat(nit_load.toFixed(2));
        this.sed_load = parseFloat(sed_load.toFixed(2));

        // render function for each crop
        this.render = function (renderHook) {
          let template = `
            <div class='cda-crop-wrapper'>
              <div class='cda-crop-header'>
                <div>${this.name} - ${this.acres} acres</div>
                <div>Initial Load (MT): Nit ${this.nit_load} - Phos ${this.phos_load} - Sed ${this.sed_load}</div>
              </div>
              <div id="bmp-wrapper-${this.name}" class="cda-bmp-component-wrapper">
                ${state.BMPselectMenu}
              </div>
            </div>
          `;
          renderHook.innerHTML += template;
        };
      };
      // BMP selected component
      //**************************************************************************************************************
      state.BMPSelectedComponent = function (bmpShortName) {
        // add bmp data as a property, get the data from the bmp_lut_data object
        this.bmpData = state.bmp_lut_data.find(
          (o) => o.BMP_Short === bmpShortName
        );
        // render the elem
        this.render = function (renderHook) {
          console.log(this);
          const template = `
                <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
                <div class='cda-bmp-input-wrapper' style='display:flex'>
                  <div>
                    <label for="fname">Phos</label>
                    <br>
                    <input type="text" id="fname" name="fname" value='${this.bmpData.Phos_Eff}'>
                  </div>                
                 
                  <div>
                    <label for="fname">Nit</label>
                    <br>
                    <input type="text" id="fname" name="fname" value='${this.bmpData.Nitr_Eff}'>
                  </div> 
                  
                  <div>
                    <label for="fname">Sed</label>
                    <br>
                    <input type="text" id="fname" name="fname" value='${this.bmpData.Sed_Eff}'>
                  </div> 
                </div>
          `;
          // create a new elem, in this case bmp inputs
          let div = document.createElement("div");
          div.className = "cda-bmp-selected-wrapper";
          div.innerHTML = template;
          // append the new div to the parent elem
          renderHook.appendChild(div);
        };
      };
    },
  });
});
