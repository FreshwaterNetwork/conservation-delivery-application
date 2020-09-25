define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
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

        this.bmpData.phos_emc_value = this.bmpData.PhosBMP_EM;
        this.bmpData.nit_emc_value = this.bmpData.NitrBMP_EM;

        // placeholders for user modifications to the default value
        this.bmpData.sed_mod = false;
        this.bmpData.phos_mod = false;
        this.bmpData.nit_mod = false;

        this.bmpData.phos_emc_mod = false;
        this.bmpData.nit_emc_mod = false;

        // handle exclusive type bmp's percent applied to crop
        if (this.bmpData.AppType === "EX") {
          this.bmpData.percentApplied = 0;
          this.bmpData.percentAppliedDisplay = 0;
        }

        // event listeners ***************************************************************
        this.bmpWrapperElem.addEventListener("change", (evt) => {
          if (evt.target.className === "cda-bmp-percent-applied") {
            this.updatePercentApplied(evt.target);
            this.parentCrop.calculateReducedLoads();
          }
          if (evt.target.className === "cda-bmp-efficiencies") {
            this.updateEfficiencies(evt.target);
            this.parentCrop.calculateReducedLoads();
          }
          if (evt.target.className === "cda-bmp-emc") {
            this.updateEMC(evt.target);
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
          let exApplyElem = this.bmpWrapperElem.querySelector(
            ".cda-bmp-ex-wrapper"
          );
          if (this.bmpData.AppType === "EX" && this.bmpData.RedFunc !== "LSC") {
            emcElem.style.display = "none";
          } else if (this.bmpData.AppType === "OV") {
            emcElem.style.display = "none";
            exApplyElem.style.display = "none";
          } else if (this.bmpData.lscFull) {
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
                      <input class="cda-bmp-emc" emcValue='phos' type="text"  name="fname" value='${this.bmpData.phos_emc_value}'>
                    </div>
                    <div>
                      <label for="">Nit</label>
                      <br>
                      <input class="cda-bmp-emc" emcValue='nit' type="text"  name="fname" value='${this.bmpData.nit_emc_value}'>
                    </div>
                  </div>
                </div>
                <div class="cda-bmp-wrapper-sub-header cda-bmp-ex-wrapper">Apply exclusive BMP to crop: <input class="cda-bmp-percent-applied" type="text" id="" name="" value='${this.bmpData.percentAppliedDisplay}'>%</div>
          `;
      };
    },
  });
});
