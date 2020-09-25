define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // crop obeject, each crop is created and added to the crop selected list object
      // ***********************************************************************************************
      state.Crop = function (
        cropName,
        acres,
        phos_load,
        nit_load,
        sed_load,
        kFact,
        clsFactor,
        runoff_year,
        cropRows,
        cropDisplay
      ) {
        // create parent crop div for each crop, this is what we will attach all our events to
        this.cropDiv = document.createElement("div");
        // bmp selected array
        this.bmpSelected = [];
        // set this when creating the Crop
        // we will then change this up and use this property for any re-renders
        let bmpDropdownMenu = document.createElement("div");
        bmpDropdownMenu.innerHTML = state.BMPselectMenu;
        this.BMPselectMenu = bmpDropdownMenu;
        // content expanded
        this.contentExpandedStyle = "none";

        // crop properties
        this.name = cropName;
        this.acres = parseFloat(acres.toFixed(2));
        this.phos_load = parseFloat(phos_load.toFixed(2));
        this.nit_load = parseFloat(nit_load.toFixed(2));
        this.sed_load = parseFloat(sed_load.toFixed(2));
        this.kFact = parseFloat(kFact.toFixed(2));
        this.clsFactor = parseFloat(clsFactor.toFixed(2));
        this.runoff_year = parseFloat(runoff_year.toFixed(2));
        this.cropRows = cropRows;
        this.cropDisplay = cropDisplay;

        // crop properties after BMP's applied
        this.nit_rpl = 0;
        this.nit_percent_reduce = 0;
        this.phos_rpl = 0;
        this.phos_percent_reduce = 0;
        this.sed_rpl = 0;
        this.sed_percent_reduce = 0;

        // render function for each crop ////////////////////////////////////////////////////////////
        this.render = function () {
          let bmpWrapperElem = document.createElement("div");
          this.bmpSelected.forEach((bmp) => {
            let bmpElem = bmp.render();
            bmpWrapperElem.appendChild(bmpElem);
          });
          // change text value of expand/collapse button
          if (this.contentExpandedStyle === "none") {
            this.contentExpandValue = "Expand";
          } else {
            this.contentExpandValue = "Collapse";
          }
          let template = `
            <div class='cda-crop-wrapper'>
              <div class='cda-crop-header'><span class="cda-crop-header-name">${
                this.name
              }</span> - ${state.UIControls.numComma(this.acres)} acres
                <div class='cda-crop-expand-collapse'>${
                  this.contentExpandValue
                }</div>
              </div>
              <div class='cda-crop-information-wrapper' style="display:${
                this.contentExpandedStyle
              }">
                  <div class="cda-crop-metrics-wrapper"><div>Nit</div><div>Phos</div><div>Sed</div></div>
                  <div class="cda-crop-load-wrapper">Initial Load (Mt):
                    <div style="margin-left:0px">${state.UIControls.numComma(
                      this.nit_load
                    )}</div> 
                    <div style="margin-left:18px">${state.UIControls.numComma(
                      this.phos_load
                    )}</div> 
                    <div style="margin-left:23px">${state.UIControls.numComma(
                      this.sed_load
                    )}</div>
                  </div>
                  <div class="cda-reduction-new-load-wrapper">
                      <div class="cda-crop-load-wrapper">New Load (Mt): 
                        <div style="margin-left:6px">${state.UIControls.numComma(
                          this.nit_rpl
                        )}</div> 
                        <div style="margin-left:18px">${state.UIControls.numComma(
                          this.phos_rpl
                        )}</div> 
                        <div style="margin-left:23px">${state.UIControls.numComma(
                          this.sed_rpl
                        )}</div>
                      </div>

                      <div class="cda-crop-load-wrapper">Reduction: 
                          <div style="margin-left:38px">${state.UIControls.numComma(
                            this.nit_percent_reduce
                          )}%</div> 
                          <div style="margin-left:18px">${state.UIControls.numComma(
                            this.phos_percent_reduce
                          )}%</div> 
                          <div style="margin-left:23px">${state.UIControls.numComma(
                            this.sed_percent_reduce
                          )}%</div>
                      </div>
                  </div>
                  
                
                <div id="bmp-wrapper-${
                  this.name
                }" class="cda-bmp-component-wrapper">
                  <div class='cda-select-menu'></div>
                </div>
                <div class="cda-bmp-exclusive-warning">Exclusive BMP's cannot add up to more than 100%</div>
                <div class="cda-bmp-wrapper"></div>
              </div>
                
            </div>
          `;

          // set the crop div inner html
          this.cropDiv.innerHTML = template;

          // show and hide reduction/new load wrapper based on is there has been any reduction
          let reductionNewLoadWrapper = this.cropDiv.querySelector(
            ".cda-reduction-new-load-wrapper"
          );
          if (this.nit_rpl > 0 || this.phos_rpl > 0 || this.sed_rpl > 0) {
            reductionNewLoadWrapper.style.display = "block";
            this.cropDiv.style.backgroundColor = "#46e24633";
          } else {
            reductionNewLoadWrapper.style.display = "none";
            this.cropDiv.style.backgroundColor = "white";
          }

          // add in bmp element wrapper
          this.cropDiv
            .querySelector(".cda-bmp-wrapper")
            .appendChild(bmpWrapperElem);

          // add in the bmp select meny
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
            this.bmpDDChange(evt);
          }
        });

        this.cropDiv.addEventListener("click", (evt) => {
          // bmp remove button event
          if (evt.target.className === "cda-bmp-remove-button") {
            this.removeBMPSelection(evt.target);
          }
          if (evt.target.className === "cda-crop-expand-collapse") {
            this.expandCollapseCropButton(evt.target);
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

        // calculate reduced load
        this.calculateReducedLoads();

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
          // if lsc full property exists
          if (bmpData.lscFull) {
            // disable all values for that crop
            options.forEach((option) => {
              option.disabled = true;
            });
          } else {
            // disable the entire Load source change area of the dropdown menu
            options.forEach((option) => {
              if (option.getAttribute("redfunc") === "LSC") {
                option.disabled = true;
              }
            });
          }
        } else {
          // disable only the target value option
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
          if (bmpData.lscFull) {
            // enable all values for that crop
            options.forEach((option) => {
              option.disabled = false;
            });
          } else {
            // enable the entire Load source change area of the dropdown menu
            options.forEach((option) => {
              if (option.getAttribute("redfunc") === "LSC") {
                option.disabled = false;
              }
            });
          }
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
        // calculate reduced loads when a BMP is removed
        this.calculateReducedLoads();
      };
      // remove a bmp from the crop
      state.Crop.prototype.expandCollapseCropButton = function (target) {
        let expandContent = target.parentNode.parentNode.querySelector(
          ".cda-crop-information-wrapper"
        );
        if (this.contentExpandedStyle === "none") {
          target.innerHTML = "Collapse";
          expandContent.style.display = "block";
          this.contentExpandedStyle = "block";
        } else if (this.contentExpandedStyle === "block") {
          expandContent.style.display = "none";
          this.contentExpandedStyle = "none";
          target.innerHTML = "Expand";
        }
      };
      state.Crop.prototype.checkExclusiveBMPTotalPercent = function () {
        let percentWarningElem = this.cropDiv.querySelector(
          ".cda-bmp-exclusive-warning"
        );
        this.totalPercentApplied = 0;
        this.bmpSelected.forEach((bmp) => {
          this.totalPercentApplied += bmp.bmpData.percentApplied;
        });
        if (this.totalPercentApplied > 1) {
          percentWarningElem.style.display = "block";
        } else {
          percentWarningElem.style.display = "none";
        }
      };
      state.Crop.prototype.calculateReducedLoads = function () {
        // find out if there are LSC, EX, OV type bmp's
        let nit_rpl = 0;
        let phos_rpl = 0;
        let sed_rpl = 0;

        let lscBMP = [];
        let exBMP = [];
        let ovBMP = [];
        // push the bmp into the correct array to be used in claclulations later on
        this.bmpSelected.forEach((bmp) => {
          if (bmp.bmpData.RedFunc === "LSC") {
            if (bmp.bmpData.percentApplied > 0 || bmp.bmpData.lscFull) {
              lscBMP.push(bmp);
            }
          }
          if (
            bmp.bmpData.AppType === "EX" &&
            bmp.bmpData.RedFunc !== "LSC" &&
            bmp.bmpData.percentApplied > 0
          ) {
            exBMP.push(bmp);
          }
          if (bmp.bmpData.AppType === "OV") {
            ovBMP.push(bmp);
          }
        });
        let lsc_length = lscBMP.length;
        let ex_length = exBMP.length;
        let ov_length = ovBMP.length;

        // EX, OV, and LSC
        if (lsc_length > 0 && ex_length > 0 && ov_length > 0) {
          // nitrogen
          let nit1 = this.calculateLSCbmp1("nit", lscBMP);
          let nit_PFO =
            this.calculateEXbmp("nit", exBMP) *
            this.calculateOVbmp("nit", ovBMP);
          let nit2 = this.calculateLSCbmp2("nit", lscBMP, nit_PFO);

          // phos
          let phos1 = this.calculateLSCbmp1("phos", lscBMP);
          let phos_PFO =
            this.calculateEXbmp("phos", exBMP) *
            this.calculateOVbmp("phos", ovBMP);
          let phos2 = this.calculateLSCbmp2("phos", lscBMP, phos_PFO);

          //sediment
          let sed1 = this.calculateLSCbmp1("sed", lscBMP);
          let sed_PFO =
            this.calculateEXbmp("sed", exBMP) *
            this.calculateOVbmp("sed", ovBMP);
          let sed2 = this.calculateLSCbmp2("sed", lscBMP, sed_PFO);

          nit_rpl = nit1 + nit2;
          phos_rpl = phos1 + phos2;
          sed_rpl = sed1 + sed2;
        }

        // OV and LSC - COMPLTETE
        if (lsc_length > 0 && ov_length > 0 && ex_length === 0) {
          // calculate the OV bmp's first and use as the pass through factor for calculating the LSC bmp
          // nitrogen
          let nit1 = this.calculateLSCbmp1("nit", lscBMP);
          let nit_PFO = this.calculateOVbmp("nit", ovBMP);
          let nit2 = this.calculateLSCbmp2("nit", lscBMP, nit_PFO);
          // phos calcs
          let phos1 = this.calculateLSCbmp1("phos", lscBMP);
          let phos_PFO = this.calculateOVbmp("phos", ovBMP);
          let phos2 = this.calculateLSCbmp2("phos", lscBMP, phos_PFO);
          // sed calcs
          let sed1 = this.calculateLSCbmp1("sed", lscBMP);
          let sed_PFO = this.calculateOVbmp("sed", ovBMP);
          let sed2 = this.calculateLSCbmp2("sed", lscBMP, sed_PFO);

          nit_rpl = nit1 + nit2;
          phos_rpl = phos1 + phos2;
          sed_rpl = sed1 + sed2;
        }
        // EX and LSC - COMPLTETE
        if (ex_length > 0 && lsc_length > 0 && ov_length === 0) {
          // calculate the OV bmp's first and use as the pass through factor for calculating the LSC bmp
          // nitrogen
          let nit1 = this.calculateLSCbmp1("nit", lscBMP);
          let nit_PFO = this.calculateEXbmp("nit", exBMP);
          let nit2 = this.calculateLSCbmp2("nit", lscBMP, nit_PFO);
          // phos calcs
          let phos1 = this.calculateLSCbmp1("phos", lscBMP);
          let phos_PFO = this.calculateEXbmp("phos", exBMP);
          let phos2 = this.calculateLSCbmp2("phos", lscBMP, phos_PFO);
          // sed calcs
          let sed1 = this.calculateLSCbmp1("sed", lscBMP);
          let sed_PFO = this.calculateEXbmp("sed", exBMP);
          let sed2 = this.calculateLSCbmp2("sed", lscBMP, sed_PFO);

          nit_rpl = nit1 + nit2;
          phos_rpl = phos1 + phos2;
          sed_rpl = sed1 + sed2;
        }

        // EX and OV - COMPLETE
        if (ex_length > 0 && ov_length > 0 && lsc_length === 0) {
          nit_rpl =
            this.nit_load *
            this.calculateEXbmp("nit", exBMP) *
            this.calculateOVbmp("nit", ovBMP);

          phos_rpl =
            this.phos_load *
            this.calculateEXbmp("phos", exBMP) *
            this.calculateOVbmp("phos", ovBMP);

          sed_rpl =
            this.sed_load *
            this.calculateEXbmp("sed", exBMP) *
            this.calculateOVbmp("sed", ovBMP);
        }
        // LSC only - COMPLETE
        if (lsc_length > 0 && ex_length === 0 && ov_length === 0) {
          // calc nit lsc reduced load
          let nit1 = this.calculateLSCbmp1("nit", lscBMP);
          let nit2 = this.calculateLSCbmp2("nit", lscBMP, 1);
          nit_rpl = nit1 + nit2;

          // calc phos lsc reduced load
          let phos1 = this.calculateLSCbmp1("phos", lscBMP);
          let phos2 = this.calculateLSCbmp2("phos", lscBMP, 1);
          // console.log(phos1, phos2, "***********");
          phos_rpl = phos1 + phos2;

          // calc sed lsc reduced load
          let sed1 = this.calculateLSCbmp1("sed", lscBMP);
          let sed2 = this.calculateLSCbmp2("sed", lscBMP, 1);
          sed_rpl = sed1 + sed2;
        }

        // EX only - COMPLETE
        if (ex_length > 0 && lsc_length === 0 && ov_length === 0) {
          nit_rpl = this.nit_load * this.calculateEXbmp("nit", exBMP);
          phos_rpl = this.phos_load * this.calculateEXbmp("phos", exBMP);
          sed_rpl = this.sed_load * this.calculateEXbmp("sed", exBMP);
        }
        // OV only - COMPLETE
        if (ov_length > 0 && ex_length === 0 && lsc_length === 0) {
          nit_rpl = this.nit_load * this.calculateOVbmp("nit", ovBMP);
          phos_rpl = this.phos_load * this.calculateOVbmp("phos", ovBMP);
          sed_rpl = this.sed_load * this.calculateOVbmp("sed", ovBMP);
        }

        // set final nitrogen value to the crop object property *****************
        this.nit_rpl = parseFloat(nit_rpl).toFixed(2);
        if (this.nit_rpl > 0) {
          this.nit_percent_reduce = (
            ((this.nit_load - nit_rpl) / this.nit_load) *
            100
          ).toFixed(0);
        } else {
          this.nit_percent_reduce = 0;
        }
        // set final phos value to the crop object property ********************
        this.phos_rpl = parseFloat(phos_rpl).toFixed(2);

        if (this.phos_rpl > 0) {
          this.phos_percent_reduce = (
            ((this.phos_load - phos_rpl) / this.phos_load) *
            100
          ).toFixed(0);
        } else {
          this.phos_percent_reduce = 0;
        }

        // set final phos value to the crop object property ********************
        this.sed_rpl = parseFloat(sed_rpl).toFixed(2);

        if (this.sed_rpl > 0) {
          this.sed_percent_reduce = (
            ((this.sed_load - sed_rpl) / this.sed_load) *
            100
          ).toFixed(0);
        } else {
          this.sed_percent_reduce = 0;
        }
        // re-render crop
        this.render();

        // update the total compoenent to update the overall load
        state.totalLoadComponent.render();
      };

      state.Crop.prototype.calculateLSCbmp1 = function (type, array, PTF) {
        let bmp = array[0];
        let percentApplied = bmp.bmpData.percentApplied;

        // loop through all crop rows
        let rpl_lsc = 0;
        this.cropRows.forEach((cropRow) => {
          let emc_bmp_value = 0;
          let eff_value = 0;
          let R = parseFloat(cropRow.Runoff_in_yr);
          let r_factor_100_ton_acre = cropRow.R_Factor_100ft_ton_in_acre_hr;
          let k_factor = cropRow.KffactF;
          let cls_factor = cropRow.Cls_factor;
          let c_bmp = bmp.bmpData.C_BMP;
          let p_bmp = bmp.bmpData.P_BMP;

          let applied_acres =
            percentApplied * parseFloat(cropRow.CropArea_acres); //  = 0

          // if nit
          if (type === "nit") {
            emc_bmp_value = bmp.bmpData.nit_emc_value;
            eff_value = bmp.bmpData.nit_eff_value;

            // calculate the rpl_lsc for nit
            rpl_lsc += emc_bmp_value * R * applied_acres * 0.000113;

            // if phos
          } else if (type === "phos") {
            emc_bmp_value = bmp.bmpData.phos_emc_value;
            eff_value = bmp.bmpData.phos_eff_value;

            // calculate the rpl_lsc for phos
            rpl_lsc += emc_bmp_value * R * applied_acres * 0.000113;

            // if sed
          } else if (type === "sed") {
            // calculate the rpl_lsc for sed
            rpl_lsc +=
              applied_acres *
              r_factor_100_ton_acre *
              k_factor *
              cls_factor *
              c_bmp *
              p_bmp;
          }
        });
        return rpl_lsc;
      };
      state.Crop.prototype.calculateLSCbmp2 = function (type, array, PTF) {
        let bmp = array[0];
        let percentApplied = bmp.bmpData.percentApplied;

        // loop through all crop rows
        let rpl_non_lsc = 0;
        this.cropRows.forEach((cropRow) => {
          let r_factor_100_ton_acre = cropRow.R_Factor_100ft_ton_in_acre_hr;
          let k_factor = cropRow.KffactF;
          let cls_factor = cropRow.Cls_factor;
          let C = cropRow.C;
          let P = cropRow.P;

          let emc_crop_value = 0;
          let eff_value = 0;

          let R = parseFloat(cropRow.Runoff_in_yr);
          let crop_area = cropRow.CropArea_acres;

          if (type === "nit") {
            emc_crop_value = cropRow.Nitr_EMC;
            eff_value = bmp.bmpData.nit_eff_value;
            rpl_non_lsc +=
              emc_crop_value *
              R *
              (crop_area - percentApplied * crop_area) *
              (1 - eff_value) *
              PTF *
              0.000113;
          } else if (type === "phos") {
            emc_crop_value = cropRow.Phos_EMC;
            eff_value = bmp.bmpData.phos_eff_value;
            rpl_non_lsc +=
              emc_crop_value *
              R *
              (crop_area - percentApplied * crop_area) *
              (1 - eff_value) *
              PTF *
              0.000113;
          } else if (type === "sed") {
            eff_value = bmp.bmpData.sed_eff_value;
            rpl_non_lsc +=
              (crop_area - percentApplied * crop_area) *
              r_factor_100_ton_acre *
              k_factor *
              cls_factor *
              C *
              P *
              (1 - eff_value) *
              PTF;
          }
        });
        return rpl_non_lsc;
      };

      state.Crop.prototype.calculateEXbmp = function (type, array) {
        let PTF;
        let eff_value = 0;
        array.forEach((bmp, i) => {
          if (type === "nit") {
            eff_value = bmp.bmpData.nit_eff_value;
          } else if (type === "phos") {
            eff_value = bmp.bmpData.phos_eff_value;
          } else if (type === "sed") {
            eff_value = bmp.bmpData.sed_eff_value;
          }

          let overallCropArea = bmp.parentCrop.acres;
          let crop_area_applied =
            bmp.bmpData.percentApplied * bmp.parentCrop.acres;
          if (i === 0) {
            PTF = (crop_area_applied / overallCropArea) * eff_value;
          } else {
            PTF += (crop_area_applied / overallCropArea) * eff_value;
          }
        });
        PTF = 1 - PTF;
        return PTF;
      };
      state.Crop.prototype.calculateOVbmp = function (type, array) {
        let PTF;
        let eff_value = 0;
        array.forEach((bmp, i) => {
          // set variables based on what type is being calculated
          if (type === "nit") {
            eff_value = bmp.bmpData.nit_eff_value;
          } else if (type === "phos") {
            eff_value = bmp.bmpData.phos_eff_value;
          } else if (type === "sed") {
            eff_value = bmp.bmpData.sed_eff_value;
          }
          // make the calculations
          if (i === 0) {
            PTF = parseFloat(1 - eff_value);
          } else {
            PTF *= parseFloat(1 - eff_value);
          }
        });
        return PTF;
      };
    },
  });
});
