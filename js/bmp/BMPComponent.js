define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      // BMP selected component
      //**************************************************************************************************************
      state.BMPSelectedComponent = function (bmpShortName, crop) {
        this.bmpToggle = true;
        // parent crop
        this.parentCrop = crop;
        // create a wrapper div
        this.bmpWrapperElem = document.createElement("div");
        this.bmpWrapperElem.className = "cda-bmp-selected-wrapper";
        // add bmp data as a property, get the data from the bmp_lut_data object
        this.bmpData = state.bmp_lut_data.find(
          (o) => o.BMP_Short === bmpShortName
        );

        this.bmpData.c_original_value = this.bmpData.C_BMP;
        this.bmpData.p_original_value = this.bmpData.P_BMP;
        this.bmpData.c_mod = false;
        this.bmpData.p_mod = false;

        this.bmpData.phos_eff_value = this.bmpData.Phos_Eff;
        this.bmpData.nit_eff_value = this.bmpData.Nitr_Eff;
        this.bmpData.sed_eff_value = this.bmpData.Sed_Eff;

        this.bmpData.phos_eff_original_val = this.bmpData.Phos_Eff;
        this.bmpData.nit_eff_original_val = this.bmpData.Nitr_Eff;
        this.bmpData.sed_eff_original_val = this.bmpData.Sed_Eff;

        this.bmpData.phos_emc_value = this.bmpData.PhosBMP_EM;
        this.bmpData.nit_emc_value = this.bmpData.NitrBMP_EM;

        this.bmpData.phos_emc_original_val = this.bmpData.PhosBMP_EM;
        this.bmpData.nit_emc_original_val = this.bmpData.NitrBMP_EM;

        // placeholders for user modifications to the default value
        this.bmpData.sed_eff_mod = false;
        this.bmpData.phos_eff_mod = false;
        this.bmpData.nit_eff_mod = false;

        this.bmpData.phos_emc_mod = false;
        this.bmpData.nit_emc_mod = false;

        // handle exclusive type bmp's percent applied to crop
        if (this.bmpData.AppType === "EX") {
          this.bmpData.percentApplied = 0;
          this.bmpData.percentAppliedDisplay = 0;
        }

        // event listeners ***************************************************************
        this.bmpWrapperElem.addEventListener("change", (evt) => {
          if (evt.target.classList[0] === "cda-bmp-percent-applied") {
            this.updatePercentApplied(evt.target);
            this.parentCrop.calculateReducedLoads();
          }
          if (evt.target.classList[0] === "cda-bmp-efficiencies") {
            this.updateEfficiencies(evt.target);
            this.parentCrop.calculateReducedLoads();
          }
          if (evt.target.classList[0] === "cda-bmp-emc") {
            this.updateEMC(evt.target);
            this.parentCrop.calculateReducedLoads();
          }
          if (evt.target.classList[0] === "cda-bmp-c") {
            this.updateC(evt.target);
            this.parentCrop.calculateReducedLoads();
          }
          if (evt.target.classList[0] === "cda-bmp-p") {
            this.updateP(evt.target);
            this.parentCrop.calculateReducedLoads();
          }
        });
        this.bmpWrapperElem.addEventListener("click", (evt) => {
          if (evt.target.classList[0] === "cda-bmp-reset-button") {
            this.bmpData.phos_eff_value = this.bmpData.Phos_Eff;
            this.bmpData.nit_eff_value = this.bmpData.Nitr_Eff;
            this.bmpData.sed_eff_value = this.bmpData.Sed_Eff;
            this.bmpData.sed_eff_mod = false;
            this.bmpData.phos_eff_mod = false;
            this.bmpData.nit_eff_mod = false;

            this.bmpData.phos_emc_value = this.bmpData.PhosBMP_EM;
            this.bmpData.nit_emc_value = this.bmpData.NitrBMP_EM;
            this.bmpData.phos_emc_mod = false;
            this.bmpData.nit_emc_mod = false;

            this.bmpData.C_BMP = this.bmpData.c_original_value;
            this.bmpData.P_BMP = this.bmpData.p_original_value;
            this.bmpData.c_mod = false;
            this.bmpData.p_mod = false;
            this.parentCrop.calculateReducedLoads();
          }
          if (evt.target.classList[0] === "cda-bmp-toggle-button") {
            this.bmpToggle = !this.bmpToggle;
            this.parentCrop.calculateReducedLoads();
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
          let emcInputs = emcElem.querySelectorAll("input");
          let exApplyElem = this.bmpWrapperElem.querySelector(
            ".cda-bmp-ex-wrapper"
          );
          let cElem = this.bmpWrapperElem.querySelector(".cda-bmp-c-wrapper");
          let pElem = this.bmpWrapperElem.querySelector(".cda-bmp-p-wrapper");

          if (this.bmpData.AppType === "EX" && this.bmpData.RedFunc !== "LSC") {
            emcElem.style.display = "none";
            cElem.style.display = "none";
            pElem.style.display = "none";
          } else if (this.bmpData.AppType === "OV") {
            emcElem.style.display = "none";
            exApplyElem.style.display = "none";
            cElem.style.display = "none";
            pElem.style.display = "none";
          } else if (this.bmpData.lscFull) {
            emcInputs.forEach((input) => {
              input.disabled = true;
            });
            exApplyElem.style.display = "none";
          }

          return this.bmpWrapperElem;
        };
      };
      // BMP Selected prototype functions *************************************************************************
      state.BMPSelectedComponent.prototype.updatePercentApplied = function (
        target
      ) {
        this.bmpData.percentAppliedDisplay = target.value;
        this.bmpData.percentApplied = parseFloat(target.value / 100);
        // this.parentCrop.checkExclusiveBMPTotalPercent();
      };
      state.BMPSelectedComponent.prototype.updateEfficiencies = function (
        target
      ) {
        const effValue = target.getAttribute("effValue");
        const value = parseFloat(target.value);
        if (effValue === "phos") {
          this.bmpData.phos_eff_value = value / 100;
        } else if (effValue === "nit") {
          this.bmpData.nit_eff_value = value / 100;
        } else if (effValue === "sed") {
          this.bmpData.sed_eff_value = value / 100;
        }

        this.bmpData.phos_mod = false;
        this.bmpData.nit_mod = false;
        this.bmpData.sed_mod = false;

        if (this.bmpData.phos_eff_value !== this.bmpData.Phos_Eff) {
          this.bmpData.phos_eff_mod = true;
        } else {
          this.bmpData.phos_eff_mod = false;
        }
        if (this.bmpData.nit_eff_value !== this.bmpData.Nitr_Eff) {
          this.bmpData.nit_eff_mod = true;
        } else {
          this.bmpData.nit_eff_mod = false;
        }
        if (this.bmpData.sed_eff_value !== this.bmpData.Sed_Eff) {
          this.bmpData.sed_eff_mod = true;
        } else {
          this.bmpData.sed_eff_mod = false;
        }
      };
      state.BMPSelectedComponent.prototype.updateEMC = function (target) {
        const emcValue = target.getAttribute("emcValue");
        const value = parseFloat(target.value);
        if (emcValue === "phos") {
          this.bmpData.phos_emc_value = value;
        } else if (emcValue === "nit") {
          this.bmpData.nit_emc_value = value;
        }
        this.bmpData.phos_emc_mod = false;
        this.bmpData.nit_emc_mod = false;

        if (this.bmpData.phos_emc_value !== this.bmpData.PhosBMP_EM) {
          this.bmpData.phos_emc_mod = true;
        }
        if (this.bmpData.nit_emc_value !== this.bmpData.NitrBMP_EM) {
          this.bmpData.nit_emc_mod = true;
        }
      };
      state.BMPSelectedComponent.prototype.updateC = function (target) {
        this.bmpData.C_BMP = target.value;
        if (this.bmpData.C_BMP !== this.c_original_value) {
          this.bmpData.c_mod = true;
        }
      };
      state.BMPSelectedComponent.prototype.updateP = function (target) {
        this.bmpData.P_BMP = target.value;
        if (this.bmpData.P_BMP !== this.p_original_value) {
          this.bmpData.p_mod = true;
        }
      };
      state.BMPSelectedComponent.prototype.getTemplate = function (evt) {
        return `
                <div style='display:flex'>
                  <div class='cda-bmp-selected-header'>${
                    this.bmpData.BMP_Name
                  }</div>
                  <div bmpshort="${
                    this.bmpData.BMP_Short
                  }" class='cda-bmp-remove-button'>Remove BMP</div>
                  <div >${
                    this.bmpToggle == true
                      ? "<div class='cda-bmp-toggle-button' style='color: maroon;'>Toggle BMP OFF</div>"
                      : "<div class='cda-bmp-toggle-button' style='color: green;'>Toggle BMP ON</div>"
                  }</div>
                </div>
                <div class="cda-bmp-wrapper-sub-header">Efficiencies (%)</div>
                <div class='cda-bmp-input-wrapper'>
                  <div>
                    <label for="">Nit</label>
                    <br>
                    ${
                      this.bmpData.nit_eff_mod
                        ? `<input class="cda-bmp-efficiencies cda-user-table-cell-modified" effValue='nit' type="text"  name="fname" value='${Math.round(
                            this.bmpData.nit_eff_value * 100
                          )}'>`
                        : `<input class="cda-bmp-efficiencies" effValue='nit' type="text"  name="fname" value='${Math.round(
                            this.bmpData.nit_eff_value * 100
                          )}'>`
                    }
                   
                  </div>
                  <div>
                    <label for="">Phos</label>
                    <br>
                    ${
                      this.bmpData.phos_eff_mod
                        ? `<input class="cda-bmp-efficiencies cda-user-table-cell-modified" effValue='phos' type="text"  name="fname" value='${Math.round(
                            this.bmpData.phos_eff_value * 100
                          )}'>`
                        : `<input class="cda-bmp-efficiencies" effValue='phos' type="text"  name="fname" value='${Math.round(
                            this.bmpData.phos_eff_value * 100
                          )}'>`
                    }
                    
                  </div>
                  
                  <div>
                    <label for="">Sed</label>
                    <br>
                    ${
                      this.bmpData.sed_eff_mod
                        ? `<input class="cda-bmp-efficiencies cda-user-table-cell-modified" effValue='sed' type="text"  name="fname" value='${Math.round(
                            this.bmpData.sed_eff_value * 100
                          )}'>`
                        : `<input class="cda-bmp-efficiencies" effValue='sed' type="text"  name="fname" value='${Math.round(
                            this.bmpData.sed_eff_value * 100
                          )}'>`
                    }
                  </div>
                </div>
                <div class="cda-bmp-emc-wrapper">
                  <div class="cda-bmp-wrapper-sub-header">Event Mean Concentration (mg/L)</div>
                  <div class='cda-bmp-input-wrapper'>
                    <div>
                      <label for="">Phos</label>
                      <br>
                      ${
                        this.bmpData.phos_emc_mod
                          ? `<input class="cda-bmp-emc cda-user-table-cell-modified" emcValue='phos' type="text"  name="fname" value='${this.bmpData.phos_emc_value}'>`
                          : `<input class="cda-bmp-emc" emcValue='phos' type="text"  name="fname" value='${this.bmpData.phos_emc_value}'>`
                      }
                     
                    </div>
                    <div>
                      <label for="">Nit</label>
                      <br>
                      ${
                        this.bmpData.nit_emc_mod
                          ? `<input class="cda-bmp-emc cda-user-table-cell-modified" emcValue='nit' type="text"  name="fname" value='${this.bmpData.nit_emc_value}'>`
                          : `<input class="cda-bmp-emc" emcValue='nit' type="text"  name="fname" value='${this.bmpData.nit_emc_value}'>`
                      }
                    </div>
                  </div>
                </div>
                <div class="cda-c-p-wrapper" >
                  <div class="cda-bmp-sed-header">Sediment Management for BMP area</div>
                  <div class="cda-bmp-c-wrapper">
                    <div class="cda-bmp-wrapper-sub-header">Cover-Management Factor:</div>
                    <div class='cda-bmp-input-wrapper'>
                      <div style="margin-left:-5px;">
                        ${
                          this.bmpData.c_mod
                            ? `<input class="cda-bmp-c cda-user-table-cell-modified"  type="text"  name="fname" value='${this.bmpData.C_BMP}'>`
                            : `<input class="cda-bmp-c"  type="text"  name="fname" value='${this.bmpData.C_BMP}'>`
                        }
                      </div>
                    </div>
                  </div>
                  <div class="cda-bmp-p-wrapper">
                    <div class="cda-bmp-wrapper-sub-header">Support Practice Factor:</div>
                    <div class='cda-bmp-input-wrapper'>
                      <div style="margin-left:11px;">
                        ${
                          this.bmpData.p_mod
                            ? `<input class="cda-bmp-p cda-user-table-cell-modified"  type="text"  name="fname" value='${this.bmpData.P_BMP}'>`
                            : `<input class="cda-bmp-p"  type="text"  name="fname" value='${this.bmpData.P_BMP}'>`
                        }
                      </div>
                    </div>
                  </div>

                </div>
                <div class="cda-bmp-wrapper-sub-header cda-bmp-ex-wrapper">Area of crop to apply BMP to: <input class="cda-bmp-percent-applied" type="text" id="" name="" value='${
                  this.bmpData.percentAppliedDisplay
                }'>%
                </div>
                
                <div class='cda-bmp-reset-button'>${
                  this.bmpData.nit_emc_mod ||
                  this.bmpData.phos_emc_mod ||
                  this.bmpData.sed_eff_mod ||
                  this.bmpData.nit_eff_mod ||
                  this.bmpData.phos_eff_mod ||
                  this.bmpData.c_mod ||
                  this.bmpData.p_mod
                    ? "Reset Values"
                    : ""
                }</div>
          `;
      };
    },
  });
});
