// Bring in dojo and javascript api classes as well as varObject.json, js files, and content.html
define([
  "dojo/_base/declare",
  "framework/PluginBase",
  "dijit/layout/ContentPane",
  "dojo/dom",
  "dojo/text!./obj.json",
  "dojo/text!./html/content.html",
  "./js/initProjectData",
  "./js/UIControls",
  "./js/CheckboxComponent",
  "./js/RadioBtnComponent",
  "./js/bmp",
  "./js/areas",
  "./js/esriapi",
  "./js/app",
  "dojo/domReady!",
], function (
  declare,
  PluginBase,
  ContentPane,
  dom,
  obj,
  content,
  initProjectData,
  UIControls,
  CheckboxComponent,
  RadioBtnComponent,
  bmp,
  areas,
  esriapi,
  app
) {
  return declare(PluginBase, {
    // The height and width are set here when an infographic is defined. When the user click Continue it rebuilds the app window with whatever you put in.
    toolbarName: "Conservation Delivery Application",
    showServiceLayersInLegend: true,
    allowIdentifyWhenActive: false,
    rendered: false,
    resizable: false,
    hasCustomPrint: true,
    size: "custom",
    width: 430,
    hasHelp: true,

    // First function called when the user clicks the pluging icon.
    initialize: function (frameworkParameters) {
      // Access framework parameters
      declare.safeMixin(this, frameworkParameters);
      // Define object to access gFlobal variables from JSON object. Only add variables to varObject.json that are needed by Save and Share.
      this.obj = dojo.eval("[" + obj + "]")[0];
      this.url =
        "http://cirrus-web-adapter-241060755.us-west-1.elb.amazonaws.com/arcgis/rest/services/FN_Wisconsin/ScoringExplore_All/MapServer";
      this.layerDefs = [];
    },
    // Called after initialize at plugin startup (why the tests for undefined). Also called after deactivate when user closes app by clicking X.
    hibernate: function () {
      if (this.appDiv != undefined) {
        // set viz layers back to -1 to remove layers from the map screen
        this.dynamicLayer.setVisibleLayers([-1]);
        this.dynamicLayer2.setVisibleLayers([-1]);
      }
      this.open = "no";
    },

    // Called after hibernate at app startup. Calls the render function which builds the plugins elements and functions.
    activate: function (showHelpOnStart) {
      if (this.rendered == false) {
        this.rendered = true;
        this.render();
        $(this.printButton).hide();
      } else {
        $("#search").hide(); // hide main search bar when app is open.
        this.dynamicLayer.setVisibleLayers(this.obj.visibleLayers);
        $("#" + this.id)
          .parent()
          .parent()
          .css("display", "flex");
      }
      if (showHelpOnStart) {
        this.showHelp();
      } else {
        $("#" + this.id + "-shosu").attr("checked", true);
        $("#" + this.id + "wfa-wrap").show();
        $("#" + this.id + " .wfa-help").hide();
      }
      this.open = "yes";
    },
    showHelp: function (h) {
      $("#" + this.id + " .wfa-wrap").hide();
      $("#" + this.id + " .wfa-help").show();

      // Show this help on startup anymore, after the first time
      // this.app.suppressHelpOnStartup(true);
    },
    // Called when user hits the minimize '_' icon on the pluging. Also called before hibernate when users closes app by clicking 'X'.
    deactivate: function () {
      this.open = "no";
    },
    // Called when user hits 'Save and Share' button. This creates the url that builds the app at a given state using JSON.
    // Write anything to you varObject.json file you have tracked during user activity.
    getState: function () {
      // remove this conditional statement when minimize is added
      if ($("#" + this.id).is(":visible")) {
        //extent
        this.obj.extent = this.map.geographicExtent;
        this.obj.stateSet = "yes";
        var state = new Object();
        state = this.obj;
        return state;
      }
    },
    // Called before activate only when plugin is started from a getState url.
    //It's overwrites the default JSON definfed in initialize with the saved stae JSON.
    setState: function (state) {
      this.obj = state;
    },
    // Called when the user hits the print icon
    beforePrint: function (printDeferred, $printArea, mapObject) {
      printDeferred.resolve();
    },
    // Called by activate and builds the plugins elements and functions
    render: function () {
      // $('#legend-container-0').find('.legend-body').css('height', '99%'); // fix the legend overlap problem
      // $('#search').hide() // hide main search bar when app is open.
      // $('.nav-main-title').html('Wetlands by Design: A Watershed Approach')
      this.obj.extent = this.map.geographicExtent;
      //$('.basemap-selector').trigger('change', 3);
      this.mapScale = this.map.getScale();

      // ADD HTML TO APP
      // Define Content Pane as HTML parent
      this.appDiv = new ContentPane({
        style:
          "padding:0; color:#000; flex:1; display:flex; flex-direction:column;}",
      });
      this.id = this.appDiv.id;
      dom.byId(this.container).appendChild(this.appDiv.domNode);
      $("#" + this.id)
        .parent()
        .addClass("flexColumn");
      // $('#' + this.id).addClass('accord')
      if (this.obj.stateSet == "no") {
        $("#" + this.id)
          .parent()
          .parent()
          .css("display", "flex");
      }
      // Get html from content.html, prepend appDiv.id to html element id's, and add to appDiv
      var idUpdate0 = content.replace(/for="/g, 'for="' + this.id);
      var idUpdate = idUpdate0.replace(/id="/g, 'id="' + this.id);
      $("#" + this.id).html(idUpdate);

      // BRING IN OTHER JS FILES
      // instatiate esriapi, ui
      this.esriapi = new esriapi();
      this.UIControls = new UIControls();
      this.initProjectData = new initProjectData();
      this.areas = new areas();
      this.bmp = new bmp();
      this.RadioBtnComponent = new RadioBtnComponent();
      this.CheckboxComponent = new CheckboxComponent();

      // call the init function to build objects
      this.initProjectData.init(this);
      this.UIControls.init(this);
      this.esriapi.init(this);
      this.areas.init(this);
      this.bmp.init(this);
      this.RadioBtnComponent.init(this);
      this.CheckboxComponent.init(this);

      // instantiate and call the App component to control everything
      this.app = new app();
      this.app.init(this);

      // set rendered to true
      this.rendered = true;
    },
  });
});
