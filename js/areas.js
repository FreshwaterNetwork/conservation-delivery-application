define(["dojo/_base/declare"], function (declare) {
  "use strict";
  return declare(null, {
    init: function (state) {
      state.AreaSelectedList = function (renderHook) {
        const selectedAreaElement = document.querySelector(renderHook);
        this.areaList = [];
        // add a new area to the array and re-render the component
        this.addNewArea = function (area) {
          this.areaList.push(area);
          console.log(this.areaList);
          // re render field list UI
          this.render();

          // update map graphics
          state.displayMapGraphics();
        };
        // remove area from array and re-render the component
        this.removeArea = function (evt) {
          const areaID = evt.target.parentElement.dataset.areaid;
          // remove item from areaList based on ID
          this.areaList = this.areaList.filter((area) => {
            return area.areaID != String(areaID);
          });
          // re render field list UI
          this.render();
          // update map graphics
          state.displayMapGraphics();
        };
        // empty all areas
        this.removeAllAreas = function () {
          this.areaList = [];
          // re render field list UI
          this.render();
          // update map graphics
          state.displayMapGraphics();
        };
        // render function attached to the render hook
        this.render = function () {
          // clear out parent element on each re-render
          selectedAreaElement.innerHTML = "";
          // if no areas selected let user know to click on map
          if (this.areaList.length === 0) {
            const noSelectedAreasHTML =
              "<div>Please click on map to select an area</div>";
            selectedAreaElement.innerHTML += noSelectedAreasHTML;
            return;
          }
          // loop through the area list and build HTML template
          this.areaList.forEach((area) => {
            const template = `
                <div class='cda-area-wrapper' data-areaid="${area.areaID}">
                  <div>ID: ${area.areaID}</div>
                  <div class='cda-area-close'>&#10005;</div>
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

      state.Area = function (geometry, areaID, areaType) {
        this.areaID = areaID;
        this.areaGeometry = geometry;
        this.areaType = areaType;
      };
    },
  });
});
