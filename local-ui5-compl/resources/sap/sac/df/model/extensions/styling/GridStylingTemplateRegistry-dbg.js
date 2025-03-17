/*
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define("sap/sac/df/model/extensions/styling/GridStylingTemplateRegistry",
  [
    "sap/ui/base/Object",
    "sap/sac/df/model/extensions/styling/FinStyle",
    "sap/sac/df/firefly/library"
  ],
  function (BaseObject, FinStyle, FF) {
    "use strict";
    /* eslint-disable-next-line no-unused-vars */
    var defaultTemplate = {
      "TableDefinition": {
        "CType": "VisualizationTableDefinition",
        "ScopedStyle": [],
        "ShowFormulas": false,
        "ShowFreezeLines": true,
        "ShowGrid": false,
        "ShowReferences": false,
        "ShowSubtitle": false,
        "ShowTableDetails": false,
        "ShowTableTitle": false,
        "StripeDataColumns": false,
        "StripeDataRows": false,
        "Styles": [],
        "TableHeaderCompactionType": "PreferablyColumn",
        "TableMarkup": []
      }
    };

    /**
         * Styling template registry for grid
         *
         * @author SAP SE
         * @version 1.132.0
         * @private
         * @experimental since version 1.132
         * @since 1.132
         * @alias sap.sac.df.model.extensions.styling.GridStylingTemplateRegistry
         */
    var GridStylingTemplateRegistry = BaseObject.extend("sap.sac.df.model.extensions.styling.GridStylingTemplateRegistry", {

      constructor: function (oModel) {
        this._Model = oModel;

        this._StylingTemplateRegistry = {};
        this._getVisualizationTemplateManager = function () {
          return this._Model.kernelProgram.getApplication().getOlapEnvironment().getVisualizationTemplateManager();
        };
        this._getTableTemplateList = function () {
          return this._getVisualizationTemplateManager().getOrCreateTableTemplateList(FF.OlapVisualizationConstants.TABLE_TEMPLATE_LINK);
        };
      }
    });

    /**
         * Add styling template
         * @param sName name
         * @param {Object} oStylingProvider styling template
         * @return {Object} created styling template
         * @private
         */
    GridStylingTemplateRegistry.prototype.addTemplate = function (sName, oStylingProvider) {
      if (!this.getTemplate(sName)) {
        this._StylingTemplateRegistry[sName] = oStylingProvider;
      }
      const oTemplateList = this._getVisualizationTemplateManager().getOrCreateTableTemplateList(FF.OlapVisualizationConstants.TABLE_TEMPLATE_LINK);
      oTemplateList.addNewTemplate(sName, sName);

      return oStylingProvider;
    };

    /**
         * Activate template
         * @param sName name
         * @return {Object} active template
         * @public
         */
    GridStylingTemplateRegistry.prototype.activateTemplate = function (sName) {
      const oTemplate = this.getTemplate(sName);
      if (oTemplate) {
        return this._Model.fireStylingTemplateActivated({stylingTemplateName: sName});
      }
      return false;
    };

    /**
         * Get styling template
         * @param sName name
         * @return {Object} styling template
         * @public
         */
    GridStylingTemplateRegistry.prototype.getTemplate = function (sName) {
      if (sName === "fin" && !this._StylingTemplateRegistry[sName]) {
        this._StylingTemplateRegistry[sName] = new FinStyle();
        this._getTableTemplateList().addNewTemplate(sName, sName);
      }
      return this._StylingTemplateRegistry[sName];
    };


    /**
         * Set styling styles
         * JSON in form
         * {
         *   "MeasureStructure"{
         *     "MeasureMember1":[
         *       "style1", "style2"
         *     ]
         *   },
         *   "NonMeasureStructure":{
         *     "StructureMember":["style1","style2"]
         *   }
         * }
         * @param oDimensionMemberMapping dimension mapping of the following structure
         * @public
         */
    GridStylingTemplateRegistry.prototype.setSemanticStyles = function (oDimensionMemberMapping) {
      return this.getTemplate("fin").setSemanticStylingMapping(oDimensionMemberMapping);
    };

    return GridStylingTemplateRegistry;
  });
