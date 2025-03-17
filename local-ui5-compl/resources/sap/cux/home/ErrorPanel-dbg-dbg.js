/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/IllustratedMessage", "sap/m/VBox", "./BasePanel"], function (IllustratedMessage, VBox, __BasePanel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BasePanel = _interopRequireDefault(__BasePanel);
  /**
   *
   * Panel class for displaying Error Message.
   *
   * @extends sap.cux.home.BasePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.122.0
   *
   * @internal
   * @experimental Since 1.122
   * @private
   *
   * @alias sap.cux.home.ErrorPanel
   */
  const ErrorPanel = BasePanel.extend("sap.cux.home.ErrorPanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        messageTitle: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        messageDescription: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        actionButton: {
          type: "sap.m.Button",
          group: "Misc"
        }
      }
    },
    constructor: function _constructor(id, settings) {
      BasePanel.prototype.constructor.call(this, id, settings);
    },
    getData: function _getData() {
      this.setProperty("enableSettings", false);
      if (!this._oWrapperNoCardsVBox) {
        const oIllustratedMessage = new IllustratedMessage({
          illustrationSize: "Spot",
          illustrationType: "sapIllus-AddDimensions",
          title: this.getProperty("messageTitle"),
          description: this.getProperty("messageDescription")
        });
        this._oWrapperNoCardsVBox = new VBox({
          backgroundDesign: "Solid"
        }).addStyleClass("sapUiSmallMarginTop");
        const oActionButton = this.getProperty("actionButton");
        if (oActionButton) {
          oIllustratedMessage.insertAdditionalContent(oActionButton, 0);
        }
        this._oWrapperNoCardsVBox.addItem(oIllustratedMessage);
        this._addContent(this._oWrapperNoCardsVBox);
      }
    }
  });
  return ErrorPanel;
});
//# sourceMappingURL=ErrorPanel-dbg-dbg.js.map
