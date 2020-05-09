define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      console.log("init bmp");
      state.CropSelectedList = function (renderHook) {
        this.cropSelectedElem = document.querySelector(renderHook);
        this.selectedCrops = [];

        this.addCrop = function (crop) {
          // consider creating a new BMP here..... and pushing it into crop
          this.selectedCrops.push(crop);
        };

        this.sortSelectedCrops = function () {
          this.selectedCrops.sort(function (a, b) {
            return b.acres - a.acres;
          });
        };
        // add click event for overall cropSelectedElem, listen for DD changes
        this.cropSelectedElem.addEventListener("change", (evt) => {
          console.log(this);
          //**********  look here for next instructions *********
          // grab the crop name, and look it up in the cropList
          // from there populate the current efficeinces for the selectd bmp
          // then when an input is changed, you can write that change to teh crop lisr as well

          // if its a bmp dropdown menu change
          if (evt.target.className === "cda-bmp-select-menu") {
            console.log(this.selectedCrops);
            console.log(evt);
            // current dropdown
            console.log(evt.target);
            // current value
            console.log(evt.target.value);
            // current crop wrapper
            console.log(evt.target.parentNode.parentNode);
            const parent = evt.target.parentNode.parentNode;
            // create a new elem, in this case bmp inputs
            let div = document.createElement("div");
            div.innerHTML = `<div>test add elem of ${evt.target.value}</div>`;
            // append the new div to the parent elem
            parent.appendChild(div);
          }
        });

        this.render = function () {
          // on each render sort by crop acres
          this.sortSelectedCrops();
          // loop through all the selected crops array and call render on each one
          this.selectedCrops.forEach((crop) => {
            // let cropWrapper = document.createElement("div");
            crop.render(this.cropSelectedElem);
            // this.cropSelectedElem.innerHTML += cropWrapper;

            // this.cropSelectedElem.innerHTML += crop.render();
          });
          console.log(this.selectedCrops);
        };
      };
      state.Crop = function (cropName, acres, phos_load, nit_load, sed_load) {
        // add BMP component
        this.bmpSelected = [];
        this.bmpComponent = new state.BMPSelectionComponent();
        // crop properties
        this.name = cropName;
        this.acres = parseFloat(acres.toFixed(2));
        this.phos_load = parseFloat(phos_load.toFixed(2));
        this.nit_load = parseFloat(nit_load.toFixed(2));
        this.sed_load - parseFloat(sed_load.toFixed(2));

        // add click event for overall cropSelectedElem, listen for DD changes
        console.log();
        // state.cropSelectedListComponent.cropSelectedElem.addEventListener(
        //   "change",
        //   (evt) => {
        //     console.log(this);
        //     // if its a bmp dropdown menu change
        //     if (evt.target.className === "cda-bmp-select-menu") {
        //       console.log(evt);
        //       // current dropdown
        //       console.log(evt.target);
        //       // current value
        //       console.log(evt.target.value);
        //       // current crop wrapper
        //       console.log(evt.target.parentNode.parentNode);
        //       const parent = evt.target.parentNode.parentNode;
        //       // create a new elem, in this case bmp inputs
        //       let div = document.createElement("div");
        //       div.innerHTML = `<div>test add elem of ${evt.target.value}</div>`;
        //       // append the new div to the parent elem
        //       parent.appendChild(div);
        //     }
        //   }
        // );

        this.render = function (renderHook) {
          console.log(state.BMPselectMenu);
          let template = `
            <div class='cda-crop-wrapper'>
              <div class='cda-crop-header'>
                <div>Crop Name: ${cropName}</div>
              </div>
              <div id="bmp-wrapper-${cropName}" class="cda-bmp-component-wrapper">
                ${state.BMPselectMenu}
              </div>
            </div>
          `;
          console.log(template);
          renderHook.innerHTML += template;

          // now add a BMP component to each crop **********************
          // let bmpWrapperElem = document.getElementById(
          //   `bmp-wrapper-${cropName}`
          // );
          // this.bmpComponent.render(bmpWrapperElem);

          // ******* this works somewhat ************
          // let clickElem = renderHook.querySelectorAll(".cda-look-here");
          // clickElem.forEach((element) => {
          //   element.addEventListener("click", (evt) => {
          //     console.log(evt.target);
          //   });
          // });
        };
      };
      state.Crop.prototype.BmpDDChange = function (evt) {
        console.log(evt);
        console.log(this);
      };
      state.BMPSelectionComponent = function () {
        this.bmpValues = [
          {
            name: "coverCrop",
            sed_eff: 0.34,
            nit_eff: 0.2,
            phos_eff: 0.42,
          },
        ];
        // bmp dropdown
        this.value = "test value";

        // handle the bmp logic, ie: ex, ov, lsc, etc...
        // store values from the inputs, add an indicator if input values were changed from default
        this.render = function (renderHook) {
          const template = `
            <div>
              <div class="cda-look-here">look here</div>
              <div>look here again</div>
            </div>
          `;
          renderHook.innerHTML = template;
          console.log(renderHook);

          let clickElem = renderHook.querySelectorAll(".cda-look-here");
          clickElem.forEach((element) => {
            element.addEventListener("click", (evt) => {
              console.log(evt.target);
            });
          });
        };
      };
    },
  });
});
