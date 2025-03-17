/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap */
sap.ui.define("sap/sac/df/types/configuration/StylingPanelItem", [], function () {
  /**
     * Item of the styling panel
     *
     * @enum {string}
     * @alias sap.sac.df.types.configuration.StylingPanelItem
     * @experimental since version 1.132
     * @since 1.132
     * @public
     */
  var StylingPanelItem = {
    /** Table Properties **/
    TableProperties: "TableProperties",
    /** Number Formatting **/
    NumberFormatting: "NumberFormatting",
    /** Conditional Formatting **/
    ConditionalFormatting: "ConditionalFormatting"
  };
  return StylingPanelItem;
});
