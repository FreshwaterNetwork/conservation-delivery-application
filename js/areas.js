define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    initAreas: function (state) {
      state.AreaSelectedList = function (renderHook) {
        const selectedAreaElement = document.querySelector(renderHook);
        this.areaList = [];

        this.addNewArea = function (area) {
          this.areaList.push(area);
          // re render field list UI
          this.render();
        };
        this.removeArea = function (evt) {
          // remove field here
          const areaID = parseInt(evt.target.parentElement.dataset.areaid);
          // remove item from areaList based on ID
          this.areaList = this.areaList.filter((area) => {
            return area.id !== areaID;
          });
          // re render field list UI
          this.render();
        };
        // this.checkIfAreaHasBeenSelected = function (id) {
        //   console.log(id);
        //   this.areaList.filter((area) => {
        //     console.log(area.id, id);
        //     if (area.id === id) {
        //       console.log(id);
        //       // return "yes";
        //       return true;
        //     }
        //   });
        // };

        this.render = function () {
          // clear out parent element on each re-render
          selectedAreaElement.innerHTML = "";
          // if no areas selected let user know to click on map
          if (this.areaList.length === 0) {
            // console.log(selectedAreaElement.parentElement);
            // selectedAreaElement.parentElement.style.display = "none";
            const noSelectedAreasHTML =
              "<div>Please click on map to select an area</div>";
            selectedAreaElement.innerHTML += noSelectedAreasHTML;
            return;
          }
          this.areaList.forEach((area) => {
            const template = `
                <div class='cda-area-wrapper' data-areaid="${area.id}">
                  <div>ID: ${area.id}</div>
                  <div class='cda-area-close'>X</div>
                </div>
            `;
            // append template to selected area element
            selectedAreaElement.innerHTML += template;
          });
          // attach click event to area close buttons
          let closeButtons = document.querySelectorAll(".cda-area-close");
          closeButtons.forEach((elem) => {
            elem.addEventListener("click", this.removeArea.bind(this));
          });
        };
      };

      state.Area = function (geometry, areaID) {
        this.id = areaID;
        this.geometry = geometry;
      };
    },
  });
});
