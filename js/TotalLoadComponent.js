define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      console.log("init total load");
      state.TotalLoadComponent = function (renderHook) {
        this.totalLoadElem = document.querySelector(renderHook);
        this.render = () => {
          this.calculateTotals();
          console.log("beofre render", this.totalAcres);
          this.totalLoadElem.innerHTML = this.template;
        };
      };
      state.TotalLoadComponent.prototype.calculateTotals = function () {
        this.selectedCrops = state.cropSelectedListComponent.selectedCrops;
        console.log(this.selectedCrops);

        this.totalAcres = 0;

        this.totalNitLoad = 0;
        this.totalPhosLoad = 0;
        this.totalSedLoad = 0;

        this.totalNitRedLoad = 0;
        this.totalPhosRedLoad = 0;
        this.totalSedRedLoad = 0;

        this.totalNitPercentReduction = 0;
        this.totalPhosPercentReduction = 0;
        this.totalSedPercentReduction = 0;

        this.selectedCrops.forEach((crop) => {
          this.totalAcres += parseInt(crop.acres);
          if (!isNaN(crop.nit_load)) {
            this.totalNitLoad += crop.nit_load;
            if (crop.nit_rpl > 0) {
              this.totalNitRedLoad += parseFloat(crop.nit_rpl);
            } else {
              this.totalNitRedLoad += parseFloat(crop.nit_load);
            }
          }
          if (!isNaN(crop.phos_load)) {
            this.totalPhosLoad += crop.phos_load;
            if (crop.phos_rpl > 0) {
              this.totalPhosRedLoad += parseFloat(crop.phos_rpl);
            } else {
              this.totalPhosRedLoad += parseFloat(crop.phos_load);
            }
          }
          if (!isNaN(crop.sed_load)) {
            this.totalSedLoad += crop.sed_load;
            if (crop.sed_rpl > 0) {
              this.totalSedRedLoad += parseFloat(crop.sed_rpl);
            } else {
              this.totalSedRedLoad += parseFloat(crop.sed_load);
            }
          }
        });

        // if (this.totalNitRedLoad > 0) {
        //   this.totalNitRedLoad = this.totalNitLoad - this.totalNitRedLoad;
        // } else {
        //   this.totalNitRedLoad = 0;
        // }
        // if (this.totalPhosRedLoad > 0) {
        //   this.totalPhosRedLoad = this.totalPhosLoad - this.totalPhosRedLoad;
        // } else {
        //   this.totalPhosRedLoad = 0;
        // }
        // if (this.totalSedRedLoad > 0) {
        //   this.totalSedRedLoad = this.totalSedLoad - this.totalSedRedLoad;
        // } else {
        //   this.totalSedRedLoad = 0;
        // }

        this.totalNitPercentReduction = (
          ((this.totalNitLoad - this.totalNitRedLoad) / this.totalNitLoad) *
          100
        ).toFixed(0);
        this.totalPhosPercentReduction = (
          ((this.totalPhosLoad - this.totalPhosRedLoad) / this.totalPhosLoad) *
          100
        ).toFixed(0);
        this.totalSedPercentReduction = (
          ((this.totalSedLoad - this.totalSedRedLoad) / this.totalSedLoad) *
          100
        ).toFixed(0);

        // update template with new values
        this.updateTemplate();
      };
      state.TotalLoadComponent.prototype.updateTemplate = function () {
        this.template = `
            <div class=" cda-total-header">
				<span class="cda-crop-header-name">All Load Sources</span>
				- ${state.UIControls.numComma(this.totalAcres)} acres
            </div>
            
            <div class="cda-crop-metrics-wrapper"><div>Nit</div><div>Phos</div><div>Sed</div></div>

            <div class="cda-crop-load-wrapper">Initial Load (MT):
                <div style="margin-left:0px">${state.UIControls.numComma(
                  this.totalNitLoad.toFixed(2)
                )}</div> 
                <div style="margin-left:18px">${state.UIControls.numComma(
                  this.totalPhosLoad.toFixed(2)
                )}</div> 
                <div style="margin-left:23px">${state.UIControls.numComma(
                  this.totalSedLoad.toFixed(2)
                )}</div>
            </div>
            <div class="cda-reduction-new-load-wrapper">
                <div class="cda-crop-load-wrapper">New Load (MT): 
                    <div style="margin-left:6px">${state.UIControls.numComma(
                      this.totalNitRedLoad.toFixed(2)
                    )}</div> 
                    <div style="margin-left:18px">${state.UIControls.numComma(
                      this.totalPhosRedLoad.toFixed(2)
                    )}</div> 
                    <div style="margin-left:23px">${state.UIControls.numComma(
                      this.totalSedRedLoad.toFixed(2)
                    )}</div>
                </div>

                <div class="cda-crop-load-wrapper">Reduction: 
                    <div style="margin-left:38px">${state.UIControls.numComma(
                      this.totalNitPercentReduction
                    )}%</div> 
                    <div style="margin-left:18px">${state.UIControls.numComma(
                      this.totalPhosPercentReduction
                    )}%</div> 
                    <div style="margin-left:23px">${state.UIControls.numComma(
                      this.totalSedPercentReduction
                    )}%</div>
                </div>
            </div>
        `;
      };
    },
  });
});
