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
            // console.log(crop);
            // let div = document.createElement("div");
            // crop.render();
            let cropDiv = crop.render();
            // crop.render(this.cropSelectedElem);
            this.cropSelectedElem.appendChild(cropDiv);
          });
        };
        // DOM Events *************************************************************************************
        // add click event for overall cropSelectedElem, listen for BMP DD changes, and input changes
        // this.cropSelectedElem.addEventListener("change", (evt) => {
        //   // if its a bmp dropdown menu change
        //   if (evt.target.className === "cda-bmp-select-menu") {
        //     this.bmpDDChange(evt);
        //   }
        //   // efficiencies input changes
        //   if (evt.target.className === "cda-bmp-efficiencies") {
        //     this.updateEfficiencies(evt.target);
        //   }
        //   // percent bmp applied input changes
        //   if (evt.target.className === "cda-bmp-percent-applied") {
        //     this.updatePercentApplied(evt.target);
        //   }
        // });
        // // bmp remove button event
        // this.cropSelectedElem.addEventListener("click", (evt) => {
        //   if (evt.target.className === "cda-bmp-remove-button") {
        //     this.removeBMPSelection(evt.target);
        //   }
        // });
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

        this.checkExclusiveBMPTotalPercent();
        // let totalPercentApplied = 0;
        // cropObj.bmpSelected.forEach((bmp) => {
        //   totalPercentApplied += bmp.bmpData.percentApplied;
        // });
        // if (totalPercentApplied > 100) {
        //   // ex type bmps applications can not add up to over 100%
        //   // throw error somewhere
        //   // maybe consider turning this into a function so it can be called other places
        // }
        // console.log(totalPercentApplied);
        // // add the total percent applied to the crop
        // cropObj.totalExPercentApplied = value;
      };
      state.CropSelectedList.prototype.checkExclusiveBMPTotalPercent = function () {
        console.log(this.selectedCrops);
        this.selectedCrops.forEach((crop) => {
          let totalPercentApplied = 0;
          console.log(crop);
          crop.bmpSelected.forEach((bmp) => {
            console.log(bmp);
          });
        });
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

      // crop obeject, each crop is created and added to the crop selected list object
      // ***********************************************************************************************
      state.Crop = function (cropName, acres, phos_load, nit_load, sed_load) {
        // create parent crop div for each crop, this is what we will attach all our events to
        this.cropDiv = document.createElement("div");
        // bmp selected array
        this.bmpSelected = [];
        // select BMP options dropdown
        this.selectBMPMenu = state.BMPselectMenu;
        // crop properties
        this.name = cropName;
        this.acres = parseFloat(acres.toFixed(2));
        this.phos_load = parseFloat(phos_load.toFixed(2));
        this.nit_load = parseFloat(nit_load.toFixed(2));
        this.sed_load = parseFloat(sed_load.toFixed(2));

        // render function for each crop
        this.render = function () {
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
                <div class='cda-select-menu'>${this.selectBMPMenu}</div>
              </div>
              <div class="cda-bmp-exclusive-warning">You cannot have Exclusive BMP's add up to more than 100%</div>
              <div class="cda-bmp-wrapper"></div>
            </div>
          `;

          // set the crop div inner html
          this.cropDiv.innerHTML = template;
          this.cropDiv
            .querySelector(".cda-bmp-wrapper")
            .appendChild(bmpWrapperElem);
          // make the select menu a property in the Crop object
          this.bmpSelectMenu = this.cropDiv.querySelector(".cda-select-menu");
          // return the cropDiv on initial render
          return this.cropDiv;
        };
        // DOM events for Crop **************************************************************************************
        this.cropDiv.addEventListener("change", (evt) => {
          // if its a bmp dropdown menu change
          if (evt.target.className === "cda-bmp-select-menu") {
            this.bmpDDChange(evt);
            this.render();
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
          evt.target.value
        );
        //  when a new bmp is selected, add that selection to the crop object
        this.bmpSelected.push(this.bmpSelectedComponent);
        // disable used BMP's from the select menu
        this.disableUsedBMPfromDD(evt.target);
        console.log(evt.target);
        evt.target.options[4].disabled = true;
        // reset the select menu to the default
        evt.target.options[0].selected = true;

        // re-render the crop
        // this.render();
      };
      // disable used
      state.Crop.prototype.disableUsedBMPfromDD = function (target) {
        console.log((target.options[4].disabled = true));
        console.log(target.parentNode.parentNode);
        let ddMenu = target.parentNode.parentNode;
        const options = ddMenu.querySelectorAll("option");
        console.log(options);
        // console.log(this);
        // console.log(this["bmpSelectMenu"]);
        // console.log(this.bmpSelectMenu.childNodes[0]);

        // let array = this.bmpSelectMenu.querySelectorAll("option");
        // console.log(array);
        // array[3].setAttribute("disabled", true);
        // let array2 = this.cropDiv.querySelectorAll("option");
        // console.log(array2);
        // console.log(array2[3]);
      };
      // remove a bmp from the crop
      state.Crop.prototype.removeBMPSelection = function (target) {
        // remove bmp from bmp selected array
        const bmpShortName = target.getAttribute("bmpshort");
        this.bmpSelected = this.bmpSelected.filter(
          (bmp) => bmp.bmpData.BMP_Short !== bmpShortName
        );
        // re-render the crop
        this.render();
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

        // handle exclusive type bmp's percent applied to crop
        if (this.bmpData.AppType === "EX") {
          this.bmpData.percentApplied = 0;
        }
        // create a wrapper div
        this.bmpWrapperElem = document.createElement("div");
        this.bmpWrapperElem.className = "cda-bmp-selected-wrapper";

        this.bmpWrapperElem.addEventListener("click", (evt) => {
          console.log(evt);
          // if (evt.target.className === "cda-bmp-remove-button") {
          //   console.log("remove");
          // }
        });
        this.bmpWrapperElem.addEventListener("change", (evt) => {
          console.log(evt);
        });
        // render function
        this.render = function () {
          // apply template to the inner html of the div based on whether bmp is ex type
          let template;
          if (this.bmpData.AppType === "EX") {
            template = this.getExTemplate();
          } else {
            template = this.getDefaultTemplate();
          }
          // this.bmpWrapper.innerHTML = this.getDefaultTemplate();
          this.bmpWrapperElem.innerHTML = template;
          return this.bmpWrapperElem;
        };
      };
      // BMP Selected prototype functions *************************************************************************
      state.BMPSelectedComponent.prototype.getExTemplate = function (evt) {
        return `
                <div style='display:flex'>
                  <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
                  <div bmpshort="${this.bmpData.BMP_Short}" class='cda-bmp-remove-button'>Remove</div>
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
      };
      state.BMPSelectedComponent.prototype.getDefaultTemplate = function (evt) {
        return `
                <div style='display:flex'>
                  <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
                  <div bmpshort="${this.bmpData.BMP_Short}" class='cda-bmp-remove-button'>Remove</div>
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
      };

      // // render the elem
      // this.render = function (renderHook) {
      // const template = `
      //       <div style='display:flex'>
      //         <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
      //         <div class='cda-bmp-remove-button'>Remove</div>
      //       </div>

      //       <div class='cda-bmp-input-wrapper' style='display:flex'>
      //         <div>
      //           <label for="phosVal">Phos</label>
      //           <br>
      //           <input class="cda-bmp-efficiencies" type="text" id="phosVal" name="fname" value='${this.bmpData.Phos_Eff}'>
      //         </div>

      //         <div>
      //           <label for="nitVal">Nit</label>
      //           <br>
      //           <input class="cda-bmp-efficiencies" type="text" id="nitVal" name="fname" value='${this.bmpData.Nitr_Eff}'>
      //         </div>

      //         <div>
      //           <label for="sedVal">Sed</label>
      //           <br>
      //           <input class="cda-bmp-efficiencies" type="text" id="sedVal" name="fname" value='${this.bmpData.Sed_Eff}'>
      //         </div>
      //       </div>
      // `;

      //   const templateEx = `
      //         <div style='display:flex'>
      //           <div class='cda-bmp-selected-header'>${this.bmpData.BMP_Name}</div>
      //           <div class='cda-bmp-remove-button'>Remove</div>
      //         </div>

      //         <div class='cda-bmp-input-wrapper' style='display:flex'>
      //           <div>
      //             <label for="phosVal">Phos</label>
      //             <br>
      //             <input class="cda-bmp-efficiencies" type="text" id="phosVal" name="fname" value='${this.bmpData.Phos_Eff}'>
      //           </div>

      //           <div>
      //             <label for="nitVal">Nit</label>
      //             <br>
      //             <input class="cda-bmp-efficiencies" type="text" id="nitVal" name="fname" value='${this.bmpData.Nitr_Eff}'>
      //           </div>

      //           <div>
      //             <label for="sedVal">Sed</label>
      //             <br>
      //             <input class="cda-bmp-efficiencies" type="text" id="sedVal" name="fname" value='${this.bmpData.Sed_Eff}'>
      //           </div>
      //         </div>
      //         <div>Apply exclusive BMP to crop: <input class="cda-bmp-percent-applied" type="text" id="" name="" value='0'>%</div>
      //   `;
      //   // create a new elem, in this case bmp inputs
      //   let div = document.createElement("div");
      //   div.className = "cda-bmp-selected-wrapper";
      //   // add data attributes
      //   div.setAttribute("bmpShortName", this.bmpData.BMP_Short);
      //   div.setAttribute("crop", this.crop);

      //   // set the html based on what app type the BMP is
      //   if (this.bmpData.AppType === "EX") {
      //     div.innerHTML = templateEx;
      //   } else {
      //     div.innerHTML = template;
      //   }
      //   // append the new div to the parent elem
      //   renderHook.appendChild(div);
      // };
    },
  });
});
