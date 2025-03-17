/* SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
   */
/*global sap*/
sap.ui.define("sap/sac/df/FilterPanel", [
  "sap/ui/mdc/p13n/panels/FilterPanel",
  "sap/ui/core/Lib",
  "sap/ui/core/Element",
  "sap/sac/df/FilterField",
  "sap/sac/df/thirdparty/lodash"
], function (MDCFilterPanel, Library, Element, FilterField, _) {

  /**
   * Constructor for a new Filter Panel.
   *
   * @class A Filter Panel based on Multidimensional Model
   * @extends sap.ui.mdc.p13n.panels.FilterPanel
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @constructor
   * @public
   * @experimental since version 1.128
   * @alias sap.sac.df.FilterPanel
   */
  const FilterPanel = MDCFilterPanel.extend("sap.sac.df.FilterPanel",/** @lends sap.sac.df.FilterPanel.prototype */ {
    metadata: {
      library: "sap.sac.df",
      properties: {
        /**
         * Defines the relative path of the property in the metamodel, based on the current contextPath.
         **/
        metaPath: {
          type: "string"
        },
        /**
         * Determines whether the reordering of personalization items is enabled.
         */
        enableReorder: {
          type: "boolean",
          defaultValue: false
        }
      }
    },
    renderer: {
      apiVersion: 2,
      render: function (oRm, oControl) {
        oRm.openStart("div", oControl);
        oRm.style("height", "100%");
        oRm.style("width", "100%");
        oRm.openEnd();
        oRm.renderControl(oControl.getAggregation("_content"));
        oRm.close("div");
      }
    },

    init: function () {
      if (MDCFilterPanel.prototype.init) {
        MDCFilterPanel.prototype.init.apply(this, arguments);
      }
      this.setEnableReorder(false);
      this.attachChange(null, this.onChange, this);
    },

    onAfterRendering: function () {
      if (this.getP13nData().length === 0) {
        this._setPaths();
        if (!_.isEmpty(this._getMetaObject())) {
          this._setupFilterPanel();
        } else {
          this._getMultiDimModel().attachEventOnce("dataProviderAdded", null, this._setupFilterPanel.bind(this));
        }
      }
    },

    _updateP13nData: function (oEvent){
      const sDataProviderName = oEvent.getParameter("dataProviderName");
      const oDataProvider = this._getDataProvider();
      if(sDataProviderName === oDataProvider.Name){
        let aP13nData = _.clone(this.getP13nData());
        _.map(aP13nData,  (oObject) =>{
          const oMetaObject = this._getMetaObject()[oObject.name];
          if(oObject.active !== Boolean(oMetaObject.MemberFilter && oMetaObject.MemberFilter.length > 0)){
            oObject.active = Boolean(oMetaObject.MemberFilter && oMetaObject.MemberFilter.length > 0);
          }
        });
        this._setP13nData(aP13nData);
      }
    },

    _setupFilterPanel: function () {
      this.setItemFactory(function (oItem) {
        return this.createFilterField(oItem.name);
      });
      this._getMultiDimModel().attachEvent("dataLoaded", null, this._updateP13nData.bind(this));
      this._setP13nData();
    },

    _setP13nData: function () {
      const aP13nData = [];
      _.map(this._getMetaObject(), function (oObject) {
        aP13nData.push(
          {
            active: Boolean(oObject.MemberFilter && oObject.MemberFilter.length > 0),
            label: oObject.Description,
            name: oObject.Name
          });
      }.bind(this));
      this.setP13nData(aP13nData);
    },

    _setPaths: function () {
      this._metaObjectPath = this.getMetaPath().split(">")[1];
    },

    _getMetaObjectType: function () {
      if (this.getMetaPath().includes("/VariableGroups")) {
        return "sap.sac.df.model.VariableGroup";
      } else if (this.getMetaPath().includes("/Variables")) {
        return "sap.sac.df.model.Variable";
      } else if (this.getMetaPath().includes("/Dimensions")) {
        return "sap.sac.df.model.Dimension";
      }
    },

    _isVariableGroup: function () {
      return this._getMetaObjectType() === "sap.sac.df.model.VariableGroup";
    },

    _getMetaObjectPath: function () {
      return this._metaObjectPath;
    },

    _getMultiDimModel: function () {
      return this.getModel(this._getMultiDimModelName());
    },

    _getDataProvider: function () {
      if (this.getMetaPath().includes("/DataProviders")) {
        const sDataProviderName = this.getMetaPath().split(">")[1].split("/DataProviders/")[1].split("/")[0];
        return this._getMultiDimModel().getDataProvider(sDataProviderName);
      }
    },

    _getMultiDimModelName: function () {
      return this.getMetaPath().split(">")[0];
    },

    _getMetaObject: function () {
      return this._getMultiDimModel().getProperty(this._metaObjectPath);
    },

    createFilterField: function (sMetaObjectName) {
      let oFilterField = Element.getElementById(this.getFilterFieldId(sMetaObjectName));
      if (!oFilterField) {
        oFilterField = new FilterField(this.getFilterFieldId(sMetaObjectName), {
          width: "100%",
          metaPath: this.getMetaPath() + "/" + sMetaObjectName,
          propertyKey: sMetaObjectName,
          delegate: {name: "sap/sac/df/filter/delegate/FieldBaseDelegate"}
        });
      }
      return oFilterField;
    },

    getFilterFieldId: function (sPropertyName) {
      return this.getId() + "::FilterField::" + sPropertyName.replace(/[^0-9A-Z_.:-]/gi, "");
    },

    onChange: function (oEvent) {
      if (oEvent.getParameter("reason") === "Remove") {
        let oFilterField = Element.getElementById(this.getFilterFieldId(oEvent.getParameter("item").name));
        if (oFilterField && oFilterField._getMetaObject().getMemberFilter().length > 0) {
          oFilterField._getMetaObject().clearMemberFilter();
        }
        return oFilterField.destroy();
      }
    }

  });

  return FilterPanel;
});
