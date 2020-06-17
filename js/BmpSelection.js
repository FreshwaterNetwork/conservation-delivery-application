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
            let cropDiv = crop.render();
            this.cropSelectedElem.appendChild(cropDiv);
          });
        };
      };
      // CropSelected prototype functions ***********************************************************************
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

      // crop obeject, each crop is created and added to the crop selected list object
      // ***********************************************************************************************
      state.Crop = function (cropName, acres, phos_load, nit_load, sed_load) {
        // create parent crop div for each crop, this is what we will attach all our events to
        this.cropDiv = document.createElement("div");
        // bmp selected array
        this.bmpSelected = [];
        // set this when creating the Crop
        // we will then change this up and use this property for any re-renders
        let bmpDropdownMenu = document.createElement("div");
        bmpDropdownMenu.innerHTML = state.BMPselectMenu;
        this.BMPselectMenu = bmpDropdownMenu;

        // crop properties
        this.name = cropName;
        this.acres = parseFloat(acres.toFixed(2));
        this.phos_load = parseFloat(phos_load.toFixed(2));
        this.nit_load = parseFloat(nit_load.toFixed(2));
        this.sed_load = parseFloat(sed_load.toFixed(2));

        // render function for each crop
        this.render = function () {
          console.log("####### crop render #######");
          let bmpWrapperElem = document.createElement("div");
          this.bmpSelected.forEach((bmp) => {
            let bmpElem = bmp.render();
            bmpWrapperElem.appendChild(bmpElem);
          });
          let template = `
            <div class='cda-crop-wrapper'>
              <div class='cda-crop-header'>
                <div><span class="cda-crop-header-name">${this.name}</span> - ${this.acres} acres</div>
                <div>Initial Load (MT): Nit ${this.nit_load} - Phos ${this.phos_load} - Sed ${this.sed_load}</div>
                <div>New Load (MT): </div>
                <div>Reduction (%): </div>
              </div>
              <div id="bmp-wrapper-${this.name}" class="cda-bmp-component-wrapper">
                <div class='cda-select-menu'></div>
              </div>
              <div class="cda-bmp-exclusive-warning">Exclusive BMP's cannot add up to more than 100%</div>
              <div class="cda-bmp-wrapper"></div>
            </div>
          `;

          // set the crop div inner html
          this.cropDiv.innerHTML = template;
          // add in bmp element wrapper
          this.cropDiv
            .querySelector(".cda-bmp-wrapper")
            .appendChild(bmpWrapperElem);
          this.cropDiv
            .querySelector(".cda-select-menu")
            .appendChild(this.BMPselectMenu);

          // return the cropDiv on initial render
          return this.cropDiv;
        };
        // DOM events for Crop **************************************************************************************
        this.cropDiv.addEventListener("change", (evt) => {
          // if its a bmp dropdown menu change
          if (evt.target.className === "cda-bmp-select-menu") {
            console.log("anotehr change");
            this.bmpDDChange(evt);
          }
        });

        this.cropDiv.addEventListener("click", (evt) => {
          // bmp remove button event
          if (evt.target.className === "cda-bmp-remove-button") {
            this.removeBMPSelection(evt.target);
          }
        });
      };
      // Crop prototype functions
      // *******************************************************************************************************************
      state.Crop.prototype.bmpDDChange = function (evt) {
        // create a new BMP selected component
        this.bmpSelectedComponent = new state.BMPSelectedComponent(
          evt.target.value,
          this
        );
        //  when a new bmp is selected, add that selection to the crop object
        this.bmpSelected.push(this.bmpSelectedComponent);

        // re-render the crop
        this.render();
        // disable used BMP's from the select menu
        this.disableUsedBMPfromDD(evt.target);

        // reset the dropdown menu to the default option
        let defaultOption = this.BMPselectMenu.querySelectorAll("option")[0];
        defaultOption.selected = true;
      };
      // disable used bmp's from dropdown list
      state.Crop.prototype.disableUsedBMPfromDD = function (target) {
        let options = this.BMPselectMenu.querySelectorAll("option");
        const bmpData = state.bmp_lut_data.find(
          (o) => o.BMP_Short === target.value
        );
        const redfunc = bmpData.RedFunc;
        // loop through all the options in the select menu and disable the options that qualify
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
      // enable bmp's from dropdown list when removed from the crop
      state.Crop.prototype.enableBMPfromDD = function (bmpShortName) {
        // get the crop dropdown menu and list options
        let options = this.BMPselectMenu.querySelectorAll("option");
        // get app type and redfunc from the bmp_lut table
        const bmpData = state.bmp_lut_data.find(
          (o) => o.BMP_Short === bmpShortName
        );
        const redfunc = bmpData.RedFunc;

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
      // remove a bmp from the crop
      state.Crop.prototype.removeBMPSelection = function (target) {
        // remove bmp from bmp selected array
        const bmpShortName = target.getAttribute("bmpshort");
        this.bmpSelected = this.bmpSelected.filter(
          (bmp) => bmp.bmpData.BMP_Short !== bmpShortName
        );
        // enable BMP's in dropdown menu
        this.enableBMPfromDD(bmpShortName);
        // re-render the crop
        this.render();
      };
      state.Crop.prototype.checkExclusiveBMPTotalPercent = function () {
        let percentWarningElem = this.cropDiv.querySelector(
          ".cda-bmp-exclusive-warning"
        );
        this.totalPercentApplied = 0;
        this.bmpSelected.forEach((bmp) => {
          this.totalPercentApplied += bmp.bmpData.percentApplied;
        });
        if (this.totalPercentApplied > 100) {
          percentWarningElem.style.display = "block";
        } else {
          percentWarningElem.style.display = "none";
        }
      };
      state.Crop.prototype.calculatePhosLoad = function () {
        console.log("calc phos load");
      };

      // BMP selected component
      //**************************************************************************************************************
      state.BMPSelectedComponent = function (bmpShortName, crop) {
        // parent crop
        this.parentCrop = crop;
        // create a wrapper div
        this.bmpWrapperElem = document.createElement("div");
        this.bmpWrapperElem.className = "cda-bmp-selected-wrapper";
        // add bmp data as a property, get the data from the bmp_lut_data object
        this.bmpData = state.bmp_lut_data.find(
          (o) => o.BMP_Short === bmpShortName
        );
        this.bmpData.phos_eff_value = this.bmpData.Phos_Eff;
        this.bmpData.nit_eff_value = this.bmpData.Nitr_Eff;
        this.bmpData.sed_eff_value = this.bmpData.Sed_Eff;

        this.bmpData.phos_emc_value = this.bmpData.PhosBMP_EMC;
        this.bmpData.nit_emc_value = this.bmpData.NitrBMP_EMC;

        // placeholders for user modifications to the default value
        this.bmpData.sed_mod = false;
        this.bmpData.phos_mod = false;
        this.bmpData.nit_mod = false;

        this.bmpData.phos_emc_mod = false;
        this.bmpData.nit_emc_mod = false;

        // handle exclusive type bmp's percent applied to crop
        if (this.bmpData.AppType === "EX") {
          this.bmpData.percentApplied = 0;
        }

        // event listeners ***************************************************************
        this.bmpWrapperElem.addEventListener("change", (evt) => {
          if (evt.target.className === "cda-bmp-percent-applied") {
            this.updatePercentApplied(evt.target);
          }
          if (evt.target.className === "cda-bmp-efficiencies") {
            this.updateEfficiencies(evt.target);
          }
          if (evt.target.className === "cda-bmp-emc") {
            this.updateEMC(evt.target);
          }
        });
        // render function
        this.render = function () {
          // apply template to the inner html of the div based on whether bmp is ex type
          let template = this.getTemplate();

          this.bmpWrapperElem.innerHTML = template;

          let emcElem = this.bmpWrapperElem.querySelector(
            ".cda-bmp-emc-wrapper"
          );
          let exApplyElem = this.bmpWrapperElem.querySelector(
            ".cda-bmp-ex-wrapper"
          );
          if (this.bmpData.AppType === "EX" && this.bmpData.RedFunc !== "LSC") {
            emcElem.style.display = "none";
          } else if (this.bmpData.AppType === "OV") {
            emcElem.style.display = "none";
            exApplyElem.style.display = "none";
          }

          return this.bmpWrapperElem;
        };
      };
      // BMP Selected prototype functions *************************************************************************
      state.BMPSelectedComponent.prototype.updatePercentApplied = function (
        target
      ) {
        console.log("update percent applied");
        this.bmpData.percentApplied = parseInt(target.value);
        this.parentCrop.checkExclusiveBMPTotalPercent();
      };
      state.BMPSelectedComponent.prototype.updateEfficiencies = function (
        target
      ) {
        const effValue = target.getAttribute("effValue");
        const value = parseFloat(target.value);
        if (effValue === "phos") {
          this.bmpData.phos_eff_value = value;
        } else if (effValue === "nit") {
          this.bmpData.nit_eff_value = value;
        } else if (effValue === "sed") {
          this.bmpData.sed_eff_value = value;
        }

        this.bmpData.phos_mod = false;
        this.bmpData.nit_mod = false;
        this.bmpData.sed_mod = false;

        if (this.bmpData.phos_eff_value !== this.bmpData.Phos_Eff) {
          this.bmpData.phos_mod = true;
        }
        if (this.bmpData.nit_eff_value !== this.bmpData.Nitr_Eff) {
          this.bmpData.nit_mod = true;
        }
        if (this.bmpData.sed_eff_value !== this.bmpData.Sed_Eff) {
          this.bmpData.sed_mod = true;
        }

        // console.log(state.cropSelectedListComponent);
        console.log(this);
      };
      state.BMPSelectedComponent.prototype.updateEMC = function (target) {
        const emcValue = target.getAttribute("emcValue");
        const value = parseFloat(target.value);
        console.log(emcValue, value);
        if (emcValue === "phos") {
          this.bmpData.phos_emc_value = value;
        } else if (emcValue === "nit") {
          this.bmpData.nit_emc_value = value;
        }

        this.bmpData.phos_emc_mod = false;
        this.bmpData.nit_emc_mod = false;

        if (this.bmpData.phos_emc_value !== this.bmpData.PhosBMP_EMC) {
          this.bmpData.phos_emc_mod = true;
        }
        if (this.bmpData.nit_emc_value !== this.bmpData.NitrBMP_EMC) {
          this.bmpData.nit_emc_mod = true;
        }
        console.log(this);
      };
      state.BMPSelectedComponent.prototype.getTemplate = function (evt) {
        return `
                <div style='display:flex'>
                  <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
                  <div bmpshort="${this.bmpData.BMP_Short}" class='cda-bmp-remove-button'>Remove</div>
                </div>
                <div class="cda-bmp-wrapper-sub-header">Efficiencies</div>
                <div class='cda-bmp-input-wrapper'>
                  <div>
                    <label for="">Phos</label>
                    <br>
                    <input class="cda-bmp-efficiencies" effValue='phos' type="text"  name="fname" value='${this.bmpData.phos_eff_value}'>
                  </div>
                  <div>
                    <label for="">Nit</label>
                    <br>
                    <input class="cda-bmp-efficiencies" effValue='nit' type="text"  name="fname" value='${this.bmpData.nit_eff_value}'>
                  </div>
                  <div>
                    <label for="">Sed</label>
                    <br>
                    <input class="cda-bmp-efficiencies" effValue='sed' type="text"  name="fname" value='${this.bmpData.sed_eff_value}'>
                  </div>
                </div>
                <div class="cda-bmp-emc-wrapper">
                  <div class="cda-bmp-wrapper-sub-header">Event Mean Concentration</div>
                  <div class='cda-bmp-input-wrapper'>
                    <div>
                      <label for="">Phos</label>
                      <br>
                      <input class="cda-bmp-emc" emcValue='phos' type="text"  name="fname" value='${this.bmpData.PhosBMP_EMC}'>
                    </div>
                    <div>
                      <label for="">Nit</label>
                      <br>
                      <input class="cda-bmp-emc" emcValue='nit' type="text"  name="fname" value='${this.bmpData.NitrBMP_EMC}'>
                    </div>
                  </div>
                </div>
                
                <div class="cda-bmp-wrapper-sub-header cda-bmp-ex-wrapper">Apply exclusive BMP to crop: <input class="cda-bmp-percent-applied" type="text" id="" name="" value='${this.bmpData.percentApplied}'>%</div>
          `;
      };
    },
  });
});
