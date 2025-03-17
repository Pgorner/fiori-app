sap.ui.define([
  "sap/ui/base/Object",
  "sap/base/util/extend",
  "sap/f/FlexibleColumnLayout",
  "sap/f/FlexibleColumnLayoutData",
  "sap/f/FlexibleColumnLayoutDataForDesktop",
  "sap/f/FlexibleColumnLayoutDataForTablet"
], function (
  BaseObject,
  extend,
  FlexibleColumnLayout,
  FlexibleColumnLayoutData,
  FlexibleColumnLayoutDataForDesktop,
  FlexibleColumnLayoutDataForTablet
) {
  "use strict";

  var appComponent;
  var shellPersonalizationService;

  function getMethods({ oAppComponent, oShellPersonalizationService }) {

    appComponent = oAppComponent;
    shellPersonalizationService = oShellPersonalizationService;

    /**
     * Retieves the FCL state from the personalization service.
     * @returns The FCL state
     */
    async function getFCLPersonalizationData() {
      var oEmptyFCLState = {
        defaultLayouts: {},
        columnsDistribution: {
          desktop: {},
          tablet: {}
        }
      };
      return ((await shellPersonalizationService.getApplicationPersonalizationData("FCL-Personalization")) ?? oEmptyFCLState);
    }

    /**
     * Sets the FCL state in the personalization service.
     * @param fclState The FCL state
     */
    function setFCLPersonalizationData(fclState) {
      shellPersonalizationService.setApplicationPersonalizationData("FCL-Personalization", fclState);
    }

    /**
     * Requests the FCL state from the personalization service and sets the model accordingly.
     */
    async function setColumnDistributionModel() {
      if (!shellPersonalizationService.hasInitialized()) {
        return;
      }
      var oColumnsDistribution = (await getFCLPersonalizationData()).columnsDistribution;
      if (oColumnsDistribution) {
        var oTemplatePrivateGlobalModel = appComponent.getModel("_templPrivGlobal");
        oTemplatePrivateGlobalModel.setProperty("/generic/FCL/FCLColumnsDistribution", oColumnsDistribution);
      }
    }

    /**
     * Gets the number of columns displayed in the FCL based on the layout.
     * @param {LayoutTypeType} layout  The layout
     * @returns {1 | 2 | 3 | null} The number of columns displayed
     */
    function getNumberOfColumnsFromLayout(layout) {
      var iColumnsDisplayed = /^(One|Two|Three)Column/.exec(layout)?.[1];
      switch (iColumnsDisplayed) {
        case "One":
          return 1;
        case "Two":
          return 2;
        case "Three":
          return 3;
        default:
          return null;
      }
    }

    /**
     * Gets the layout stored in the personalization service based on the proposed layout.
     * @param {LayoutTypeType | undefined } proposedLayout
     * @returns The FCL layout stored in the personalization service
     */
    async function getStoredLayout(oProposedLayout) {
      if (shellPersonalizationService.hasInitialized()) {
        var iColumnsDisplayed = getNumberOfColumnsFromLayout(oProposedLayout);
        if (iColumnsDisplayed) {
          var defaultLayouts = (await getFCLPersonalizationData()).defaultLayouts;
          return defaultLayouts?.[iColumnsDisplayed] ?? oProposedLayout;
        }
      }
      return oProposedLayout;
    }

    /**
     * Is called when the user changes the FCL columns distribution.
     * Updates the FCL state in the personalization service.
     * @param {Event<{ media: "tablet" | "desktop"; layout: LayoutTypeType; columnsSizes: string }>} event
     */
    async function onColumnsDistributionChange(event) {
      if (!shellPersonalizationService.hasInitialized()) {
        return;
      }

      var { media, layout, columnsSizes } = event.getParameters();

      var oTemplatePrivateGlobalModel = appComponent.getModel("_templPrivGlobal");
      oTemplatePrivateGlobalModel.setProperty(`/generic/FCL/FCLColumnsDistribution/${media}/${layout}`, columnsSizes);

      var oFclState = await getFCLPersonalizationData();
      var iColumnsDisplayed = getNumberOfColumnsFromLayout(layout);
      if (iColumnsDisplayed) {
        oFclState.defaultLayouts[iColumnsDisplayed] = layout;
        oFclState.columnsDistribution[media][layout] = columnsSizes;
        setFCLPersonalizationData(oFclState);
      }
    }

    function initFlexibleColumnLayout() {
      var oFCL = new FlexibleColumnLayout();

      var oLayoutData = new FlexibleColumnLayoutData();
      var oDesktopLayoutData = new FlexibleColumnLayoutDataForDesktop();
      var oTabletLayoutData = new FlexibleColumnLayoutDataForTablet();

      var sFCLColumnsDistributionPath = "_templPrivGlobal>/generic/FCL/FCLColumnsDistribution";
      var sDesktopFCLColumnsDistributionPath = `${sFCLColumnsDistributionPath}/desktop`;
      var sTabletFCLColumnsDistributionPath = `${sFCLColumnsDistributionPath}/tablet`;

      oDesktopLayoutData.bindProperty("twoColumnsBeginExpanded", `${sDesktopFCLColumnsDistributionPath}/TwoColumnsBeginExpanded`);
      oDesktopLayoutData.bindProperty("twoColumnsMidExpanded", `${sDesktopFCLColumnsDistributionPath}/TwoColumnsMidExpanded`);
      oDesktopLayoutData.bindProperty("threeColumnsBeginExpandedEndHidden", `${sDesktopFCLColumnsDistributionPath}/ThreeColumnsBeginExpandedEndHidden`);
      oDesktopLayoutData.bindProperty("threeColumnsEndExpanded", `${sDesktopFCLColumnsDistributionPath}/ThreeColumnsEndExpanded`);
      oDesktopLayoutData.bindProperty("threeColumnsMidExpanded", `${sDesktopFCLColumnsDistributionPath}/ThreeColumnsMidExpanded`);
      oDesktopLayoutData.bindProperty("threeColumnsMidExpandedEndHidden", `${sDesktopFCLColumnsDistributionPath}/ThreeColumnsMidExpandedEndHidden`);

      oTabletLayoutData.bindProperty("twoColumnsBeginExpanded", `${sTabletFCLColumnsDistributionPath}/TwoColumnsBeginExpanded`);
      oTabletLayoutData.bindProperty("twoColumnsMidExpanded", `${sTabletFCLColumnsDistributionPath}/TwoColumnsMidExpanded`);
      oTabletLayoutData.bindProperty("threeColumnsBeginExpandedEndHidden", `${sTabletFCLColumnsDistributionPath}/ThreeColumnsBeginExpandedEndHidden`);
      oTabletLayoutData.bindProperty("threeColumnsEndExpanded", `${sTabletFCLColumnsDistributionPath}/ThreeColumnsEndExpanded`);
      oTabletLayoutData.bindProperty("threeColumnsMidExpanded", `${sTabletFCLColumnsDistributionPath}/ThreeColumnsMidExpanded`);
      oTabletLayoutData.bindProperty("threeColumnsMidExpandedEndHidden", `${sTabletFCLColumnsDistributionPath}/ThreeColumnsMidExpandedEndHidden`);

      oLayoutData.setDesktopLayoutData(oDesktopLayoutData);
      oLayoutData.setTabletLayoutData(oTabletLayoutData);
      oFCL.setAggregation("layoutData", oLayoutData);

      oFCL.attachColumnsDistributionChange(onColumnsDistributionChange);

      return oFCL;
    }

    return {
      initFlexibleColumnLayout: initFlexibleColumnLayout,
      getStoredLayout: getStoredLayout,
      setColumnDistributionModel: setColumnDistributionModel
    };
  }

  return BaseObject.extend("sap.suite.ui.generic.template.lib.FlexibleColumnLayoutHelper", {
    constructor: function (oTemplateContract) {
      extend(this, getMethods(oTemplateContract));
    }
  });
});