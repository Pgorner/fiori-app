/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/CommonUtils", "sap/fe/core/converters/ManifestSettings"], function (CommonUtils, ManifestSettings) {
  "use strict";

  var _exports = {};
  var TemplateType = ManifestSettings.TemplateType;
  /*!
   * Find the current values of the table configuration that is provided in the table adapt dialog
   */
  function getPropertyPath(table) {
    const tablePath = table.getProperty("metaPath").split(table.getProperty("contextPath"))[1];
    let propertyPath = "controlConfiguration/";
    if (tablePath.includes("LineItem")) {
      // metaPath points to a LineItem annotation, we can use that
      propertyPath += tablePath + "/tableSettings";
    } else {
      //metaPath points to a different annotation
      propertyPath += tablePath.split("@")[0] + "@com.sap.vocabularies.UI.v1.LineItem/tableSettings";
    }
    return propertyPath;
  }

  /**
   * Return the available designtime settings for Table building blocks.
   * @returns The available designtime settings for Table building blocks
   */
  _exports.getPropertyPath = getPropertyPath;
  function getDesigntimeProperties() {
    const tableType = {
      id: "type",
      name: "RTA_CONFIGURATION_TABLE_TYPE_NAME",
      description: "RTA_CONFIGURATION_TABLE_TYPE_DESC",
      value: "ResponsiveTable",
      type: "string",
      enums: [{
        id: "ResponsiveTable",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_RESP"
      }, {
        id: "GridTable",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_GRID"
      }, {
        id: "TreeTable",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_TREE"
      }, {
        id: "AnalyticalTable",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_ANLT"
      }]
    };
    const showTitle = {
      id: "headerVisible",
      name: "RTA_CONFIGURATION_TABLE_HEADER_VIS_NAME",
      description: "RTA_CONFIGURATION_HEADER_VIS_DESC",
      type: "boolean",
      value: true
    };
    const titleText = {
      id: "header",
      name: "RTA_CONFIGURATION_TABLE_HEADER_TEXT_NAME",
      description: "RTA_CONFIGURATION_HEADER_TEXT_DESC",
      type: "string",
      value: "This should be actually retrieved from HeaderInfo>TypeNamePlural if not yet set"
    };
    const showFullScreen = {
      id: "enableFullScreen",
      name: "RTA_CONFIGURATION_TABLE_FULL_SCREEN_NAME",
      description: "RTA_CONFIGURATION_FULL_SCREEN_DESC",
      restrictedTo: [TemplateType.ObjectPage],
      type: "boolean",
      value: true
    };
    const enableExport = {
      id: "enableExport",
      name: "RTA_CONFIGURATION_TABLE_ENABLEEXPORT_NAME",
      description: "RTA_CONFIGURATION_TABLE_ENABLEEXPORT_DESC",
      type: "boolean",
      value: true,
      keyUser: true
    };
    const creationModeName = {
      id: "creationModeName",
      path: "creationMode/name",
      name: "RTA_CONFIGURATION_TABLE_CREATE_MODE_NAME",
      description: "RTA_CONFIGURATION_TABLE_CREATE_MODE_DESC",
      restrictedTo: [TemplateType.ObjectPage],
      type: "string",
      value: "NewPage",
      enums: [{
        id: "NewPage",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_CREATE_NEW"
      }, {
        id: "Inline",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_CREATE_INLINE"
      }, {
        id: "CreationRow",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_CREAT_ROW"
      }, {
        id: "External",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_EXTERNAL"
      }, {
        id: "InlineCreationRows",
        name: "RTA_CONFIGURATION_TABLE_TYPE_ENUM_INLINE_ROW"
      }]
    };
    const creationModeCreateAtEnd = {
      id: "creationModeCreateAtEnd",
      path: "creationMode/createAtEnd",
      name: "RTA_CONFIGURATION_TABLE_CREATE_WHERE_NAME",
      description: "RTA_CONFIGURATION_TABLE_WHERE_MODE_DESC",
      restrictedTo: [TemplateType.ObjectPage],
      type: "boolean",
      value: false
    };
    const frozenColumnCount = {
      id: "frozenColumnCount",
      name: "RTA_CONFIGURATION_TABLE_FROZENCOLUMNCOUNT_NAME",
      description: "RTA_CONFIGURATION_TABLE_FROZENCOLUMNCOUNT_DESC",
      type: "number",
      value: 0,
      keyUser: true
    };
    const showCounts = {
      id: "showCounts",
      path: "quickVariantSelection/showCounts",
      name: "RTA_CONFIGURATION_TABLE_QUICK_COUNT_NAME",
      description: "RTA_CONFIGURATION_TABLE_QUICK_COUNT_DESC",
      type: "boolean",
      value: false
    };

    // Property needs to be added later, dependance between headerVisible and hideTableTitle needs to be investigated
    /* const hideTableTitle: DesigntimeSetting = {
    	id: "hideTableTitle",
    	path: "quickVariantSelection/hideTableTitle",
    	name: "Hide Table Title",
    	description: "Define whether the table title should be hidden",
    	type: "boolean",
    	value: false
    };*/

    const personalization = {
      id: "personalization",
      name: "RTA_CONFIGURATION_TABLE_PERSONALIZATION_NAME",
      description: "RTA_CONFIGURATION_TABLE_PERSONALIZATION_DESC",
      type: "booleanOrString",
      value: undefined,
      enums: [{
        id: "True",
        name: "RTA_CONFIGURATION_TABLE_PERSONALIZATION_ENUM_TRUE"
      }, {
        id: "False",
        name: "RTA_CONFIGURATION_TABLE_PERSONALIZATION_ENUM_FALSE"
      }, {
        id: "Own Settings",
        name: "RTA_CONFIGURATION_TABLE_PERSONALIZATION_ENUM_OWNSETTINGS"
      }],
      writeObjectFor: "Own Settings",
      writeObject: [{
        id: "personalizationSort",
        path: "sort"
      }, {
        id: "personalizationColumn",
        path: "column"
      }, {
        id: "personalizationFilter",
        path: "filter"
      }, {
        id: "personalizationGroup",
        path: "group"
      }, {
        id: "personalizationAggregate",
        path: "aggregate"
      }],
      keyUser: true
    };
    const personalizationSort = {
      id: "personalizationSort",
      path: "personalization/sort",
      name: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONSORT_NAME",
      description: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONSORT_DESC",
      type: "boolean",
      value: true,
      skipChange: true,
      keyUser: true
    };
    const personalizationColumn = {
      id: "personalizationColumn",
      path: "personalization/column",
      name: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONCOLUMN_NAME",
      description: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONCOLUMN_DESC",
      type: "boolean",
      value: true,
      skipChange: true,
      keyUser: true
    };
    const personalizationFilter = {
      id: "personalizationFilter",
      path: "personalization/filter",
      name: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONFILTER_NAME",
      description: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONFILTER_DESC",
      type: "boolean",
      value: true,
      skipChange: true,
      keyUser: true
    };
    const personalizationGroup = {
      id: "personalizationGroup",
      path: "personalization/group",
      name: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONGROUP_NAME",
      description: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONGROUP_DESC",
      type: "boolean",
      value: true,
      skipChange: true,
      keyUser: true
    };
    const personalizationAggregate = {
      id: "personalizationAggregate",
      path: "personalization/aggregate",
      name: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONAGGREGATE_NAME",
      description: "RTA_CONFIGURATION_TABLE_PERSONALIZATIONAGGREGATE_DESC",
      type: "boolean",
      value: true,
      skipChange: true
    };
    const rowCount = {
      id: "rowCount",
      name: "RTA_CONFIGURATION_TABLE_ROWCOUNT_NAME",
      description: "RTA_CONFIGURATION_TABLE_ROWCOUNT_DESC",
      restrictedTo: [TemplateType.ObjectPage],
      type: "number",
      value: 5,
      keyUser: true
    };
    const rowCountMode = {
      id: "rowCountMode",
      name: "RTA_CONFIGURATION_TABLE_ROWCOUNTMODE_NAME",
      description: "RTA_CONFIGURATION_TABLE_ROWCOUNTMODE_DESC",
      restrictedTo: [TemplateType.ObjectPage],
      type: "string",
      value: "Fixed",
      enums: [{
        id: "Fixed",
        name: "RTA_CONFIGURATION_TABLE_ROWCOUNTMODE_ENUM_FIXED"
      }, {
        id: "Auto",
        name: "RTA_CONFIGURATION_TABLE_ROWCOUNTMODE_ENUM_AUTO"
      }]
    };
    const condensedTableLayout = {
      id: "condensedTableLayout",
      name: "RTA_CONFIGURATION_TABLE_CONDENSEDLAYOUT_NAME",
      description: "RTA_CONFIGURATION_TABLE_CONDENSEDLAYOUT_DESC",
      type: "boolean",
      value: false,
      keyUser: true
    };
    const widthIncludingColumnHeader = {
      id: "widthIncludingColumnHeader",
      name: "RTA_CONFIGURATION_TABLE_WIDTHCOLUMNHEADER_NAME",
      description: "RTA_CONFIGURATION_TABLE_WIDTHCOLUMNHEADER_DESC",
      type: "boolean",
      value: false,
      keyUser: true
    };
    const selectionMode = {
      id: "selectionMode",
      name: "RTA_CONFIGURATION_TABLE_SELECTIONMODE_NAME",
      description: "RTA_CONFIGURATION_TABLE_SELECTIONMODE_DESC",
      type: "string",
      value: "Single",
      enums: [{
        id: "Auto",
        name: "RTA_CONFIGURATION_TABLE_SELECTIONMODE_ENUM_AUTO"
      }, {
        id: "Single",
        name: "RTA_CONFIGURATION_TABLE_SELECTIONMODE_ENUM_SINGLE"
      }, {
        id: "Multi",
        name: "RTA_CONFIGURATION_TABLE_SELECTIONMODE_ENUM_MULTI"
      }, {
        id: "None",
        name: "RTA_CONFIGURATION_TABLE_SELECTIONMODE_ENUM_NONE"
      }]
    };
    const selectAll = {
      id: "selectAll",
      name: "RTA_CONFIGURATION_TABLE_SELECTALL_NAME",
      description: "RTA_CONFIGURATION_TABLE_SELECTALL_DESC",
      type: "boolean",
      value: false,
      keyUser: true
    };
    const selectionLimit = {
      id: "selectionLimit",
      name: "RTA_CONFIGURATION_TABLE_SELECTIONLIMIT_NAME",
      description: "RTA_CONFIGURATION_TABLE_SELECTIONLIMIT_DESC",
      type: "number",
      value: 200,
      keyUser: true
    };
    const hierarchyQualifier = {
      id: "hierarchyQualifier",
      name: "RTA_CONFIGURATION_TABLE_HIERQUALIF_NAME",
      description: "RTA_CONFIGURATION_TABLE_HIERQUALIF_DESC",
      type: "string",
      value: ""
    };
    const enableAddCardToInsights = {
      id: "enableAddCardToInsights",
      name: "RTA_CONFIGURATION_TABLE_ENABLEADDCARD_NAME",
      description: "RTA_CONFIGURATION_TABLE_ENABLEADDCARD_DESC",
      type: "boolean",
      value: false,
      keyUser: true
    };
    const beforeRebindTable = {
      id: "beforeRebindTable",
      name: "RTA_CONFIGURATION_TABLE_BEFOREREBIND_NAME",
      description: "RTA_CONFIGURATION_TABLE_BEFOREREBIND_DESC",
      type: "string",
      value: ""
    };
    const selectionChange = {
      id: "selectionChange",
      name: "RTA_CONFIGURATION_TABLE_SELECTIONCHANGE_NAME",
      description: "RTA_CONFIGURATION_TABLE_SELECTIONCHANGE_DESC",
      type: "string",
      value: ""
    };
    return [tableType, showTitle, titleText, showFullScreen, enableExport, creationModeName, creationModeCreateAtEnd, frozenColumnCount, showCounts,
    //hideTableTitle,
    personalization, personalizationSort, personalizationColumn, personalizationFilter, personalizationGroup, personalizationAggregate, rowCount, rowCountMode, condensedTableLayout, widthIncludingColumnHeader, selectionMode, selectAll, selectionLimit, hierarchyQualifier, enableAddCardToInsights, beforeRebindTable, selectionChange];
  }

  /**
   * Return the available designtime settings for a specific Table building block.
   * @param table The TableAPI instance of a specific Table building block
   * @returns The available designtime settings for the current building block
   */
  _exports.getDesigntimeProperties = getDesigntimeProperties;
  function getDesigntimeSettings(table) {
    const instanceSpecificDesigntimeSettings = [];
    const isOnListReport = CommonUtils.getTargetView(table).getControllerName() === "sap.fe.templates.ListReport.ListReportController";
    getDesigntimeProperties().forEach(setting => {
      if (!isOnListReport || !setting.restrictedTo || setting.restrictedTo.includes(TemplateType.ListReport)) {
        instanceSpecificDesigntimeSettings.push(setting);
      }
    });
    return instanceSpecificDesigntimeSettings;
  }
  _exports.getDesigntimeSettings = getDesigntimeSettings;
  return _exports;
}, false);
//# sourceMappingURL=Table.designtime.helper-dbg.js.map
