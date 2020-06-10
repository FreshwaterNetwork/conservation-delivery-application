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
        // add click event for overall cropSelectedElem, listen for BMP DD changes, and input changes
        this.cropSelectedElem.addEventListener("change", (evt) => {
          // if its a bmp dropdown menu change
          if (evt.target.className === "cda-bmp-select-menu") {
            this.bmpDDChange(evt);
          }
          // efficiencies input changes
          if (evt.target.className === "cda-bmp-efficiencies") {
            this.updateEfficiencies(evt.target);
          }
          // percent bmp applied input changes
          if (evt.target.className === "cda-bmp-percent-applied") {
            this.updatePercentApplied(evt.target);
          }
        });
        // bmp remove button event
        this.cropSelectedElem.addEventListener("click", (evt) => {
          if (evt.target.className === "cda-bmp-remove-button") {
            this.removeBMPSelection(evt.target);
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
        // call utility functions
        this.addBMPSelectionToCrop(cropSelected, this.bmpSelectedComponent);
        this.disableUsedBMPfromDD(evt.target);
        this.resetBMPDropdown(evt.target);
        //render the new elem
        this.bmpSelectedComponent.render(parent);
      };
      // when a user changes and default efficiency, update the value in the object
      // and add a value stating that the default value was changed by the user
      state.CropSelectedList.prototype.updateEfficiencies = function (target) {
        // set constants
        const id = target.id;
        const inputValue = parseFloat(target.value);
        const cropName = target.parentNode.parentNode.parentNode.getAttribute(
          "crop"
        );
        const bmpShortName = target.parentNode.parentNode.parentNode.getAttribute(
          "bmpshortname"
        );

        // find the current crop in the selected crop array
        const cropObj = this.selectedCrops.find((o) => o.name === cropName);

        // find the current bmp in the selected bmp array
        const bmpObj = cropObj.bmpSelected.find(
          (o) => o.bmpData.BMP_Short === bmpShortName
        );
        // update the values
        if (id === "phosVal") {
          bmpObj.bmpData.Phos_Eff = inputValue;
          bmpObj.bmpData.phos_mod = true;
        }
        if (id === "nitVal") {
          bmpObj.bmpData.Nit_Eff = inputValue;
          bmpObj.bmpData.nit_mod = true;
        }
        if (id === "sedVal") {
          bmpObj.bmpData.Sed_Eff = inputValue;
          bmpObj.bmpData.sed_mod = true;
        }
      };
      // for EX type BMP's the user is allowed to choose a percentage applied
      // this precentage cannot add up to above 100%.
      // add the percentage applied to the obj and add a running total percentage to the crop obj
      state.CropSelectedList.prototype.updatePercentApplied = function (
        target
      ) {
        const value = parseInt(target.value);
        const cropName = target.parentNode.parentNode.getAttribute("crop");
        const bmpShortName = target.parentNode.parentNode.getAttribute(
          "bmpshortname"
        );
        // find the current crop in the selected crop array
        const cropObj = this.selectedCrops.find((o) => o.name === cropName);

        // find the current bmp in the selected bmp array
        const bmpObj = cropObj.bmpSelected.find(
          (o) => o.bmpData.BMP_Short === bmpShortName
        );

        bmpObj.bmpData.percentApplied = value;

        let totalPercentApplied = 0;
        cropObj.bmpSelected.forEach((bmp) => {
          totalPercentApplied += bmp.bmpData.percentApplied;
        });
        if (totalPercentApplied > 100) {
          // ex type bmps applications can not add up to over 100%
          // throw error somewhere
          // maybe consider turning this into a function so it can be called other places
        }
        console.log(totalPercentApplied);
        // add the total percent applied to the crop
        cropObj.totalExPercentApplied = value;
      };
      // disable value in dropdown menu for future selections
      state.CropSelectedList.prototype.disableUsedBMPfromDD = function (
        target
      ) {
        // get app type and redfunc from the bmp_lut table
        const bmpData = state.bmp_lut_data.find(
          (o) => o.BMP_Short === target.value
        );
        const redfunc = bmpData.RedFunc;

        // loop through all the options in the select menu and disable the options that qualify
        let options = target.querySelectorAll("option");
        if (redfunc === "LSC") {
          // disable the entire Load source change area of the dropdown menu
          options.forEach((option) => {
            if (option.getAttribute("redfunc") === "LSC") {
              option.disabled = true;
            }
          });
        } else {
          options.forEach((option) => {
            if (option.value === target.value) {
              option.disabled = true;
            }
          });
        }
      };
      // enable value in dropdown menu after a bmp was unselected
      state.CropSelectedList.prototype.enableBMPfromDD = function (
        target,
        bmpShortName
      ) {
        // get app type and redfunc from the bmp_lut table
        const bmpData = state.bmp_lut_data.find(
          (o) => o.BMP_Short === bmpShortName
        );
        const redfunc = bmpData.RedFunc;
        // get the crop dropdown menu and list options
        const cropDDMenu = target.parentNode.parentNode.parentNode;
        const options = cropDDMenu.querySelectorAll("option");
        // check if the BMP was redfunc type LSC, if so enable all LSC's
        if (redfunc === "LSC") {
          // disable the entire Load source change area of the dropdown menu
          options.forEach((option) => {
            if (option.getAttribute("redfunc") === "LSC") {
              option.disabled = false;
            }
          });
        } else {
          options.forEach((option) => {
            if (option.value === bmpShortName) {
              option.disabled = false;
            }
          });
        }
      };
      // reset bmp dropdown menu after bmp was selected
      state.CropSelectedList.prototype.resetBMPDropdown = function (target) {
        target.options[0].selected = true;
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
      // remove a bmp from the crop
      state.CropSelectedList.prototype.removeBMPSelection = function (target) {
        const cropName = target.parentNode.parentNode.getAttribute("crop");
        const bmpShortName = target.parentNode.parentNode.getAttribute(
          "bmpshortname"
        );
        // find the crop compoenent in the crop selected array
        const cropComponent = this.selectedCrops.find(
          (o) => o.name === cropName
        );
        // remove the bmp from the crop bmp selected array
        cropComponent.bmpSelected.splice(
          cropComponent.bmpSelected.findIndex(
            (item) => item.bmpData.BMP_Short === bmpShortName
          ),
          1
        );
        // enable bmp in the dropdown list once its been deleted
        this.enableBMPfromDD(target, bmpShortName);
        // remove the bmp component html
        target.parentNode.parentNode.remove();
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
                <div><span class="cda-crop-header-name">${this.name}</span> - ${this.acres} acres</div>
                <div>Initial Load (MT): Nit ${this.nit_load} - Phos ${this.phos_load} - Sed ${this.sed_load}</div>
                <div>New Load (MT): </div>
                <div>Reduction (%): </div>
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

        // placeholders for user modifications to the default value
        this.bmpData.sed_mod = false;
        this.bmpData.phos_mod = false;
        this.bmpData.nit_mod = false;

        if (this.bmpData.AppType === "EX") {
          this.bmpData.percentApplied = 0;
        }

        // render the elem
        this.render = function (renderHook) {
          const template = `
                <div style='display:flex'>
                  <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
                  <div class='cda-bmp-remove-button'>Remove</div>
                </div>
                
                <div class='cda-bmp-input-wrapper' style='display:flex'>
                  <div>
                    <label for="phosVal">Phos</label>
                    <br>
                    <input class="cda-bmp-efficiencies" type="text" id="phosVal" name="fname" value='${this.bmpData.Phos_Eff}'>
                  </div>                
                 
                  <div>
                    <label for="nitVal">Nit</label>
                    <br>
                    <input class="cda-bmp-efficiencies" type="text" id="nitVal" name="fname" value='${this.bmpData.Nitr_Eff}'>
                  </div> 
                  
                  <div>
                    <label for="sedVal">Sed</label>
                    <br>
                    <input class="cda-bmp-efficiencies" type="text" id="sedVal" name="fname" value='${this.bmpData.Sed_Eff}'>
                  </div> 
                </div>
          `;

          const templateEx = `
                <div style='display:flex'>
                  <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
                  <div class='cda-bmp-remove-button'>Remove</div>
                </div>
                
                <div class='cda-bmp-input-wrapper' style='display:flex'>
                  <div>
                    <label for="phosVal">Phos</label>
                    <br>
                    <input class="cda-bmp-efficiencies" type="text" id="phosVal" name="fname" value='${this.bmpData.Phos_Eff}'>
                  </div>                
                 
                  <div>
                    <label for="nitVal">Nit</label>
                    <br>
                    <input class="cda-bmp-efficiencies" type="text" id="nitVal" name="fname" value='${this.bmpData.Nitr_Eff}'>
                  </div> 
                  
                  <div>
                    <label for="sedVal">Sed</label>
                    <br>
                    <input class="cda-bmp-efficiencies" type="text" id="sedVal" name="fname" value='${this.bmpData.Sed_Eff}'>
                  </div> 
                </div>
                <div>Apply exclusive BMP to crop: <input class="cda-bmp-percent-applied" type="text" id="" name="" value='0'>%</div>
          `;
          // create a new elem, in this case bmp inputs
          let div = document.createElement("div");
          div.className = "cda-bmp-selected-wrapper";
          // add data attributes
          div.setAttribute("bmpShortName", this.bmpData.BMP_Short);
          div.setAttribute("crop", this.crop);

          // set the html based on what app type the BMP is
          if (this.bmpData.AppType === "EX") {
            div.innerHTML = templateEx;
          } else {
            div.innerHTML = template;
          }
          // append the new div to the parent elem
          renderHook.appendChild(div);
        };
      };
    },
  });
});
