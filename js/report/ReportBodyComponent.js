define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      state.reportBodyComponent = function (renderHook) {
        this.reportBodyElem = document.querySelector(renderHook);
        this.filteredCropList = [];
        this.template = ``;
        this.render = () => {
          this.filterCropList(state.cropSelectedListComponent.selectedCrops);
          this.buildCropTemplate(this.filteredCropList);
          this.reportBodyElem.innerHTML = this.template;
        };
      };
      // build out the crop table for the report
      state.reportBodyComponent.prototype.buildCropTemplate = function (
        filteredCropList
      ) {
        this.template = "";
        filteredCropList.forEach((crop) => {
          const cropTableTemplate = this.createCropTableTemplate(crop);
          const bmpTableTemplate = this.createBMPhtmlTemplate(crop);
          this.template += `
          <div>
            <h5 class="cda-report-sub-headers">${crop.name}</h5>
            ${cropTableTemplate}
            ${bmpTableTemplate}
          </div>`;
        });
      };

      state.reportBodyComponent.prototype.filterCropList = function (cropList) {
        this.filteredCropList = [];
        cropList.forEach((crop) => {
          // if any of the crops have reduced loads
          if (crop.nit_rpl || crop.phos_rpl || crop.sed_rpl) {
            this.filteredCropList.push(crop);
          }
        });
      };
      state.reportBodyComponent.prototype.createBMPhtmlTemplate = function (
        crop
      ) {
        this.bmpHTMLTable = "";
        crop.bmpSelected.forEach((bmp) => {
          if (bmp.bmpToggle) {
            let percentApplied, nit_emc_value, phos_emc_value;
            let nit_eff_mod,
              phos_eff_mod,
              sed_eff_mod,
              nit_emc_mod,
              phos_emc_mod,
              p_mod,
              c_mod;
            let user_modified_class = "cda-user-table-cell-modified";
            let bmpName = bmp.bmpData.BMP_Name;

            if (bmp.bmpData.percentAppliedDisplay) {
              percentApplied = bmp.bmpData.percentAppliedDisplay;
            } else if (
              bmp.bmpData.percentAppliedDisplay == 0 &&
              bmp.bmpData.AppType == "EX"
            ) {
              percentApplied = "0";
            } else {
              percentApplied = "100";
            }
            if (bmp.bmpData.nit_emc_value) {
              nit_emc_value = bmp.bmpData.nit_emc_value;
            } else {
              nit_emc_value = "N/A";
            }
            if (bmp.bmpData.phos_emc_value) {
              phos_emc_value = bmp.bmpData.phos_emc_value;
            } else {
              phos_emc_value = "N/A";
            }
            if (bmp.bmpData.C_BMP) {
              bmp.bmpData.C_BMP = bmp.bmpData.C_BMP;
            } else {
              bmp.bmpData.C_BMP = "N/A";
            }
            if (bmp.bmpData.P_BMP) {
              bmp.bmpData.P_BMP = bmp.bmpData.P_BMP;
            } else {
              bmp.bmpData.P_BMP = "N/A";
            }
            if (bmp.bmpData.nit_eff_mod) {
              nit_eff_mod = user_modified_class;
            }
            if (bmp.bmpData.phos_eff_mod) {
              phos_eff_mod = user_modified_class;
            }
            if (bmp.bmpData.sed_eff_mod) {
              sed_eff_mod = user_modified_class;
            }
            if (bmp.bmpData.nit_emc_mod) {
              nit_emc_mod = user_modified_class;
            }
            if (bmp.bmpData.phos_emc_mod) {
              phos_emc_mod = user_modified_class;
            }
            if (bmp.bmpData.c_mod) {
              c_mod = user_modified_class;
            }
            if (bmp.bmpData.p_mod) {
              p_mod = user_modified_class;
            }
            this.bmpHTMLTable += `
              <div class="cda-bmp-table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th class="cda-bmp-report-table-header" colspan="9">${bmpName}</th>
                    </tr>
                    <tr>
                      <th>Percent Applied</th>
                      <th>Nitrogen Effecincy</th>
                      <th>Phospherous Effecincy</th>
                      <th>Sediment Effecincy</th>
                      <th>Nitrogen EMC</th>
                      <th>Phospherous EMC</th>
                      <th>C</th>
                      <th>P</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>${percentApplied}%</td>
                      <td class="${nit_eff_mod}">${bmp.bmpData.nit_eff_value}</td>
                      <td class="${phos_eff_mod}">${bmp.bmpData.phos_eff_value}</td>
                      <td class="${sed_eff_mod}">${bmp.bmpData.sed_eff_value}</td>
                      <td class="${nit_emc_mod}">${nit_emc_value}</td>
                      <td class="${phos_emc_mod}">${phos_emc_value}</td>
                      <td class="${c_mod}">${bmp.bmpData.C_BMP}</td>
                      <td class="${p_mod}">${bmp.bmpData.P_BMP}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
          `;
          }
        });
        return this.bmpHTMLTable;
      };
      state.reportBodyComponent.prototype.createCropTableTemplate = function (
        crop
      ) {
        this.cropTableHTML = `
          <div>
            <table>
              <thead>
                <tr>
                  <th style="font-weight: bold;">${crop.name}</th>
                  <th>Nitrogen</th>
                  <th>Phospherous</th>
                  <th>Sediment</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th>Initial Load (MT/yr)</th>
                  <td>${crop.nit_load}</td>
                  <td>${crop.phos_load}</td>
                  <td>${crop.sed_load}</td>
                </tr>
                <tr>
                  <th>Reduced Load (MT/yr)</th>
                  <td>${crop.nit_rpl}</td>
                  <td>${crop.phos_rpl}</td>
                  <td>${crop.sed_rpl}</td>
                </tr>
                <tr>
                  <th>Reduction</th>
                  <td>${crop.nit_percent_reduce}%</td>
                  <td>${crop.phos_percent_reduce}%</td>
                  <td>${crop.sed_percent_reduce}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        `;
        return this.cropTableHTML;
      };
    },
  });
});
