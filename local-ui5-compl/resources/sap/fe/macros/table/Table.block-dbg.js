/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/base/BindingToolkit", "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport", "sap/fe/core/converters/ManifestSettings", "sap/fe/core/converters/MetaModelConverter", "sap/fe/core/converters/controls/Common/DataVisualization", "sap/fe/core/converters/controls/Common/Table", "sap/fe/core/converters/controls/Common/table/StandardActions", "sap/fe/core/helpers/StableIdHelper", "sap/fe/core/helpers/TypeGuards", "sap/fe/core/templating/DataModelPathHelper", "sap/fe/macros/MacroAPI", "sap/ui/core/library", "sap/fe/core/buildingBlocks/templating/BuildingBlockTemplatingBase", "sap/fe/macros/table/MdcTableTemplate", "sap/fe/macros/table/TableAPI", "sap/fe/macros/table/TableCreationOptions", "sap/m/FlexItemData", "../TSXUtils", "./TableEventHandlerProvider", "sap/fe/base/jsx-runtime/jsx"], function (Log, BindingToolkit, BuildingBlockSupport, ManifestSettings, MetaModelConverter, DataVisualization, Table, StandardActions, StableIdHelper, TypeGuards, DataModelPathHelper, MacroAPI, library, BuildingBlockTemplatingBase, MdcTableTemplate, TableAPI, TableCreationOptions, FlexItemData, TSXUtils, TableEventHandlerProvider, _jsx) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _dec29, _dec30, _dec31, _dec32, _dec33, _dec34, _dec35, _dec36, _dec37, _dec38, _dec39, _dec40, _dec41, _dec42, _dec43, _dec44, _dec45, _dec46, _dec47, _dec48, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _descriptor31, _descriptor32, _descriptor33, _descriptor34, _descriptor35, _descriptor36, _descriptor37, _descriptor38, _descriptor39, _descriptor40, _descriptor41, _descriptor42, _descriptor43, _descriptor44, _descriptor45, _descriptor46, _descriptor47, _TableBlock;
  var _exports = {};
  var createCustomData = TSXUtils.createCustomData;
  var getMDCTableTemplate = MdcTableTemplate.getMDCTableTemplate;
  var TitleLevel = library.TitleLevel;
  var getContextRelativeTargetObjectPath = DataModelPathHelper.getContextRelativeTargetObjectPath;
  var isAnnotationOfTerm = TypeGuards.isAnnotationOfTerm;
  var generate = StableIdHelper.generate;
  var StandardActionKeys = StandardActions.StandardActionKeys;
  var getCustomFunctionInfo = Table.getCustomFunctionInfo;
  var getVisualizationsFromAnnotation = DataVisualization.getVisualizationsFromAnnotation;
  var getDataVisualizationConfiguration = DataVisualization.getDataVisualizationConfiguration;
  var getInvolvedDataModelObjects = MetaModelConverter.getInvolvedDataModelObjects;
  var VisualizationType = ManifestSettings.VisualizationType;
  var CreationMode = ManifestSettings.CreationMode;
  var defineBuildingBlock = BuildingBlockSupport.defineBuildingBlock;
  var blockEvent = BuildingBlockSupport.blockEvent;
  var blockAttribute = BuildingBlockSupport.blockAttribute;
  var blockAggregation = BuildingBlockSupport.blockAggregation;
  var ref = BindingToolkit.ref;
  var fn = BindingToolkit.fn;
  var compileExpression = BindingToolkit.compileExpression;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  const setCustomActionProperties = function (childAction) {
    let menuContentActions = null;
    const act = childAction;
    let menuActions = [];
    const actionKey = act.getAttribute("key")?.replace("InlineXML_", "");
    // For the actionGroup we authorize the both entries <sap.fe.macros:ActionGroup> (compliant with old FPM examples) and <sap.fe.macros.table:ActionGroup>
    if (act.children.length && act.localName === "ActionGroup" && act.namespaceURI && ["sap.fe.macros", "sap.fe.macros.table"].includes(act.namespaceURI)) {
      const actionsToAdd = Array.prototype.slice.apply(act.children);
      let actionIdx = 0;
      menuContentActions = actionsToAdd.reduce((acc, actToAdd) => {
        const actionKeyAdd = actToAdd.getAttribute("key")?.replace("InlineXML_", "") || actionKey + "_Menu_" + actionIdx;
        const curOutObject = {
          key: actionKeyAdd,
          text: actToAdd.getAttribute("text"),
          __noWrap: true,
          press: actToAdd.getAttribute("press"),
          requiresSelection: actToAdd.getAttribute("requiresSelection") === "true",
          enabled: actToAdd.getAttribute("enabled") === null ? true : actToAdd.getAttribute("enabled")
        };
        acc[curOutObject.key] = curOutObject;
        actionIdx++;
        return acc;
      }, {});
      menuActions = Object.values(menuContentActions).slice(-act.children.length).map(function (menuItem) {
        return menuItem.key;
      });
    }
    return {
      key: actionKey,
      text: act.getAttribute("text"),
      position: {
        placement: act.getAttribute("placement"),
        anchor: act.getAttribute("anchor")
      },
      __noWrap: true,
      press: act.getAttribute("press") === null ? undefined : act.getAttribute("press"),
      requiresSelection: act.getAttribute("requiresSelection") === "true",
      enabled: act.getAttribute("enabled") === null ? true : act.getAttribute("enabled"),
      menu: menuActions.length ? menuActions : null,
      menuContentActions: menuContentActions
    };
  };
  const setCustomColumnProperties = function (childColumn, aggregationObject) {
    aggregationObject.key = aggregationObject.key.replace("InlineXML_", "");
    childColumn.setAttribute("key", aggregationObject.key);
    function safeGetAttribute(name) {
      return childColumn.getAttribute(name) ?? undefined;
    }
    return {
      // Defaults are to be defined in Table.ts
      key: aggregationObject.key,
      type: "Slot",
      width: safeGetAttribute("width"),
      widthIncludingColumnHeader: childColumn.getAttribute("widthIncludingColumnHeader") ? childColumn.getAttribute("widthIncludingColumnHeader") === "true" : undefined,
      importance: safeGetAttribute("importance"),
      horizontalAlign: safeGetAttribute("horizontalAlign"),
      availability: childColumn.getAttribute("availability") || "Default",
      header: safeGetAttribute("header"),
      tooltip: safeGetAttribute("tooltip"),
      template: childColumn.children[0]?.outerHTML || safeGetAttribute("template"),
      properties: childColumn.getAttribute("properties") ? childColumn.getAttribute("properties")?.split(",") : undefined,
      position: {
        placement: safeGetAttribute("placement") || safeGetAttribute("positionPlacement"),
        //positionPlacement is kept for backwards compatibility
        anchor: safeGetAttribute("anchor") || safeGetAttribute("positionAnchor") //positionAnchor is kept for backwards compatibility
      },
      required: safeGetAttribute("required")
    };
  };

  /**
   * Building block used to create a table based on the metadata provided by OData V4.
   * <br>
   * Usually, a LineItem, PresentationVariant or SelectionPresentationVariant annotation is expected, but the Table building block can also be used to display an EntitySet.
   * <br>
   * If a PresentationVariant is specified, then it must have UI.LineItem as the first property of the Visualizations.
   * <br>
   * If a SelectionPresentationVariant is specified, then it must contain a valid PresentationVariant that also has a UI.LineItem as the first property of the Visualizations.
   *
   * Usage example:
   * <pre>
   * &lt;macros:Table id="MyTable" metaPath="@com.sap.vocabularies.UI.v1.LineItem" /&gt;
   * </pre>
   * @mixes sap.fe.macros.table.TableAPI
   * @augments sap.fe.macros.MacroAPI
   * @public
   */
  let TableBlock = (_dec = defineBuildingBlock({
    name: "Table",
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",
    returnTypes: ["sap.fe.macros.table.TableAPI"]
  }), _dec2 = blockAttribute({
    type: "sap.ui.model.Context",
    underlyingType: "string",
    expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
    expectedAnnotations: ["com.sap.vocabularies.UI.v1.LineItem", "com.sap.vocabularies.UI.v1.PresentationVariant", "com.sap.vocabularies.UI.v1.SelectionPresentationVariant"],
    isPublic: true,
    required: true
  }), _dec3 = blockAttribute({
    type: "boolean",
    isPublic: true,
    bindable: true
  }), _dec4 = blockAttribute({
    type: "sap.ui.model.Context",
    underlyingType: "string",
    expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
    isPublic: true
  }), _dec5 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec6 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec7 = blockAttribute({
    type: "int",
    isPublic: true
  }), _dec8 = blockAttribute({
    type: "int",
    isPublic: true
  }), _dec9 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec10 = blockAttribute({
    type: "string",
    allowedValues: ["Auto", "Fixed"],
    isPublic: true
  }), _dec11 = blockAttribute({
    type: "int",
    isPublic: true
  }), _dec12 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec13 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec14 = blockAttribute({
    type: "number",
    isPublic: true
  }), _dec15 = blockAttribute({
    type: "string",
    isPublic: true,
    isAssociation: true
  }), _dec16 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec17 = blockAttribute({
    type: "sap.ui.core.TitleLevel",
    isPublic: true
  }), _dec18 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec19 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec20 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec21 = blockAttribute({
    type: "sap.ui.model.Context",
    underlyingType: "string",
    expectedTypes: ["EntitySet", "EntityType", "Singleton", "NavigationProperty"],
    expectedAnnotations: ["com.sap.vocabularies.UI.v1.SelectionVariant"],
    isPublic: true
  }), _dec22 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec23 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec24 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec25 = blockAttribute({
    type: "string",
    isPublic: true,
    allowedValues: ["GridTable", "ResponsiveTable", "AnalyticalTable"]
  }), _dec26 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec27 = blockAttribute({
    type: "string",
    isPublic: true,
    allowedValues: ["None", "Single", "Multi", "Auto", "ForceMulti", "ForceSingle"]
  }), _dec28 = blockAttribute({
    type: "string",
    isPublic: true,
    allowedValues: ["Control"]
  }), _dec29 = blockAttribute({
    type: "string",
    isPublic: true
  }), _dec30 = blockAttribute({
    type: "string",
    isPublic: true,
    allowedValues: ["illustratedMessage-Auto", "illustratedMessage-Base", "illustratedMessage-Dialog", "illustratedMessage-Dot", "illustratedMessage-Scene", "illustratedMessage-Spot", "text"]
  }), _dec31 = blockAttribute({
    type: "sap.ui.core.TitleLevel"
  }), _dec32 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec33 = blockAttribute({
    type: "string"
  }), _dec34 = blockAttribute({
    type: "boolean"
  }), _dec35 = blockAttribute({
    type: "boolean"
  }), _dec36 = blockAttribute({
    type: "string"
  }), _dec37 = blockAttribute({
    type: "boolean"
  }), _dec38 = blockAttribute({
    type: "object",
    underlyingType: "sap.fe.macros.table.TableCreationOptions",
    isPublic: true,
    validate: function (creationOptionsInput) {
      if (creationOptionsInput.name && !["NewPage", "Inline", "InlineCreationRows", "External", "CreationDialog"].includes(creationOptionsInput.name)) {
        throw new Error(`Allowed value ${creationOptionsInput.name} for creationMode does not match`);
      }
      return creationOptionsInput;
    }
  }), _dec39 = blockAggregation({
    type: "sap.fe.macros.table.Action",
    altTypes: ["sap.fe.macros.table.ActionGroup"],
    isPublic: true,
    multiple: true,
    processAggregations: setCustomActionProperties
  }), _dec40 = blockAggregation({
    type: "sap.fe.macros.table.Column",
    isPublic: true,
    multiple: true,
    hasVirtualNode: true,
    processAggregations: setCustomColumnProperties
  }), _dec41 = blockEvent(), _dec42 = blockEvent(), _dec43 = blockEvent(), _dec44 = blockEvent(), _dec45 = blockEvent(), _dec46 = blockEvent(), _dec47 = blockEvent(), _dec48 = blockAttribute({
    type: "boolean",
    isPublic: true
  }), _dec(_class = (_class2 = (_TableBlock = /*#__PURE__*/function (_BuildingBlockTemplat) {
    function TableBlock(props, controlConfiguration, settings) {
      var _this;
      _this = _BuildingBlockTemplat.call(this, props, controlConfiguration, settings) || this;
      //  *************** Public & Required Attributes ********************
      /**
       * Defines the relative path to a LineItem, PresentationVariant or SelectionPresentationVariant in the metamodel, based on the current contextPath.
       * @public
       */
      _initializerDefineProperty(_this, "metaPath", _descriptor, _this);
      //  *************** Public Attributes ********************
      /**
       * An expression that allows you to control the 'busy' state of the table.
       * @public
       */
      _initializerDefineProperty(_this, "busy", _descriptor2, _this);
      /**
       * Defines the path of the context used in the current page or block.
       * This setting is defined by the framework.
       * @public
       */
      _initializerDefineProperty(_this, "contextPath", _descriptor3, _this);
      /**
       * Controls whether the table can be opened in fullscreen mode or not.
       * @public
       */
      _initializerDefineProperty(_this, "enableFullScreen", _descriptor4, _this);
      /**
       * Controls if the export functionality of the table is enabled or not.
       * @public
       */
      _initializerDefineProperty(_this, "enableExport", _descriptor5, _this);
      /**
       * Maximum allowed number of records to be exported in one request.
       * @public
       */
      _initializerDefineProperty(_this, "exportRequestSize", _descriptor6, _this);
      /**
       * Number of columns that are fixed on the left. Only columns which are not fixed can be scrolled horizontally.
       *
       * This property is not relevant for responsive tables
       * @public
       */
      _initializerDefineProperty(_this, "frozenColumnCount", _descriptor7, _this);
      /**
       * Indicates if the column header should be a part of the width calculation.
       * @public
       */
      _initializerDefineProperty(_this, "widthIncludingColumnHeader", _descriptor8, _this);
      /**
       * Defines how the table handles the visible rows. Does not apply to Responsive tables.
       *
       * Allowed values are `Auto`, `Fixed`.<br/>
       * - If set to `Fixed`, the table always has as many rows as defined in the rowCount property.<br/>
       * - If set to `Auto`, the number of rows is changed by the table automatically. It will then adjust its row count to the space it is allowed to cover (limited by the surrounding container) but it cannot have less than defined in the `rowCount` property.<br/>
       * @public
       */
      _initializerDefineProperty(_this, "rowCountMode", _descriptor9, _this);
      /**
       * Number of rows to be displayed in the table. Does not apply to responsive tables.
       * @public
       */
      _initializerDefineProperty(_this, "rowCount", _descriptor10, _this);
      /**
       * Controls if the paste functionality of the table is enabled or not.
       * @public
       */
      _initializerDefineProperty(_this, "enablePaste", _descriptor11, _this);
      /**
       * Controls if the copy functionality of the table is disabled or not.
       * @public
       */
      _initializerDefineProperty(_this, "disableCopyToClipboard", _descriptor12, _this);
      /**
       * Defines how many additional data records are requested from the back-end system when the user scrolls vertically in the table.
       * @public
       */
      _initializerDefineProperty(_this, "scrollThreshold", _descriptor13, _this);
      /**
       * ID of the FilterBar building block associated with the table.
       * @public
       */
      _initializerDefineProperty(_this, "filterBar", _descriptor14, _this);
      /**
       * Specifies the header text that is shown in the table.
       * @public
       */
      _initializerDefineProperty(_this, "header", _descriptor15, _this);
      /**
       * Defines the "aria-level" of the table header
       */
      _initializerDefineProperty(_this, "headerLevel", _descriptor16, _this);
      /**
       * Controls if the header text should be shown or not.
       * @public
       */
      _initializerDefineProperty(_this, "headerVisible", _descriptor17, _this);
      _initializerDefineProperty(_this, "id", _descriptor18, _this);
      _initializerDefineProperty(_this, "annotationId", _descriptor19, _this);
      /**
       * Additionnal SelectionVariant to be applied on the table content.
       */
      _initializerDefineProperty(_this, "associatedSelectionVariantPath", _descriptor20, _this);
      /**
       * Defines whether to display the search action.
       * @public
       */
      _initializerDefineProperty(_this, "isSearchable", _descriptor21, _this);
      /**
       * Controls which options should be enabled for the table personalization dialog.
       *
       * If it is set to `true`, all possible options for this kind of table are enabled.<br/>
       * If it is set to `false`, personalization is disabled.<br/>
       * <br/>
       * You can also provide a more granular control for the personalization by providing a comma-separated list with the options you want to be available.<br/>
       * Available options are:<br/>
       * - Sort<br/>
       * - Column<br/>
       * - Filter<br/>
       * @public
       */
      _initializerDefineProperty(_this, "personalization", _descriptor22, _this);
      /**
       * An expression that allows you to control the 'read-only' state of the table.
       *
       * If you do not set any expression, SAP Fiori elements hooks into the standard lifecycle to determine the current state.
       * @public
       */
      _initializerDefineProperty(_this, "readOnly", _descriptor23, _this);
      /**
       * Defines the type of table that will be used by the building block to render the data.
       *
       * Allowed values are `GridTable`, `ResponsiveTable` and `AnalyticalTable`.
       * @public
       */
      _initializerDefineProperty(_this, "type", _descriptor24, _this);
      /**
       * Specifies whether the table is displayed with condensed layout (true/false). The default setting is `false`.
       */
      _initializerDefineProperty(_this, "useCondensedLayout", _descriptor25, _this);
      /**
       * Defines the selection mode to be used by the table.
       *
       * Allowed values are `None`, `Single`, `ForceSingle`, `Multi`, `ForceMulti` or `Auto`.
       * If set to 'Single', 'Multi' or 'Auto', SAP Fiori elements hooks into the standard lifecycle to determine the consistent selection mode.
       * If set to 'ForceSingle' or 'ForceMulti' your choice will be respected but this might not respect the Fiori guidelines.
       * @public
       */
      _initializerDefineProperty(_this, "selectionMode", _descriptor26, _this);
      /**
       * Controls the kind of variant management that should be enabled for the table.
       *
       * Allowed value is `Control`.<br/>
       * If set with value `Control`, a variant management control is seen within the table and the table is linked to this.<br/>
       * If not set with any value, control level variant management is not available for this table.
       * @public
       */
      _initializerDefineProperty(_this, "variantManagement", _descriptor27, _this);
      /**
       * Comma-separated value of fields that must be ignored in the OData metadata by the Table building block.<br>
       * The table building block is not going to create built-in columns or offer table personalization for comma-separated value of fields that are provided in the ignoredfields.<br>
       * Any column referencing an ignored field is to be removed.<br>
       * @since 1.124.0
       * @public
       */
      _initializerDefineProperty(_this, "ignoredFields", _descriptor28, _this);
      /**
       * Changes the size of the IllustratedMessage in the table, or removes it completely.
       * Allowed values are `illustratedMessage-Auto`, `illustratedMessage-Base`, `illustratedMessage-Dialog`, `illustratedMessage-Dot`, `illustratedMessage-Scene`, `illustratedMessage-Spot` or `text`.
       * @since 1.129.0
       * @public
       */
      _initializerDefineProperty(_this, "modeForNoDataMessage", _descriptor29, _this);
      /**
       * Defines the header style of the table header
       */
      _initializerDefineProperty(_this, "headerStyle", _descriptor30, _this);
      /**
       * Specifies if the column width is automatically calculated.
       * @public
       */
      _initializerDefineProperty(_this, "enableAutoColumnWidth", _descriptor31, _this);
      _initializerDefineProperty(_this, "fieldMode", _descriptor32, _this);
      _initializerDefineProperty(_this, "isAlp", _descriptor33, _this);
      /**
       * True if the table is in a ListReport multi view
       */
      _initializerDefineProperty(_this, "inMultiView", _descriptor34, _this);
      _initializerDefineProperty(_this, "tabTitle", _descriptor35, _this);
      _initializerDefineProperty(_this, "visible", _descriptor36, _this);
      /**
       * A set of options that can be configured.
       * @public
       */
      _initializerDefineProperty(_this, "creationMode", _descriptor37, _this);
      /**
       * Aggregate actions of the table.
       * @public
       */
      _initializerDefineProperty(_this, "actions", _descriptor38, _this);
      /**
       * Aggregate columns of the table.
       * @public
       */
      _initializerDefineProperty(_this, "columns", _descriptor39, _this);
      /**
       * Before a table rebind, an event is triggered that contains information about the binding.
       *
       * You can use this event to add selects, and add or read the sorters and filters.
       * @public
       */
      _initializerDefineProperty(_this, "beforeRebindTable", _descriptor40, _this);
      /**
       * An event is triggered when the user chooses a row; the event contains information about which row is chosen.
       *
       * You can set this in order to handle the navigation manually.
       * @public
       */
      _initializerDefineProperty(_this, "rowPress", _descriptor41, _this);
      /**
       * Event handler to react to the contextChange event of the table.
       */
      // FIXME only internal
      _initializerDefineProperty(_this, "onContextChange", _descriptor42, _this);
      /**
       * Event handler called when the user chooses an option of the segmented button in the ALP View
       */
      _initializerDefineProperty(_this, "onSegmentedButtonPressed", _descriptor43, _this);
      _initializerDefineProperty(_this, "variantSaved", _descriptor44, _this);
      /**
       * An event triggered when the selection in the table changes.
       * @public
       */
      _initializerDefineProperty(_this, "selectionChange", _descriptor45, _this);
      _initializerDefineProperty(_this, "variantSelected", _descriptor46, _this);
      _initializerDefineProperty(_this, "initialLoad", _descriptor47, _this);
      const contextObjectPath = getInvolvedDataModelObjects(_this.metaPath, _this.contextPath);
      _this.contextObjectPath = contextObjectPath;
      const tableSettings = _this.getTableSettings();
      _this.tableDefinition = TableBlock.createTableDefinition(_this, settings, tableSettings);
      _this.tableDefinitionContext = MacroAPI.createBindingContext(_this.tableDefinition, settings);
      _this.convertedMetadata = _this.contextObjectPath.convertedTypes;
      _this.metaModel = settings.models.metaModel;
      _this.collectionEntity = _this.convertedMetadata.resolvePath(_this.tableDefinition.annotation.collection).target;
      _this.appComponent = settings.appComponent;
      _this.setUpId();
      _this.creationMode.name ??= _this.tableDefinition.annotation.create.mode;
      _this.creationMode.createAtEnd ??= _this.tableDefinition.annotation.create.append;
      // Special code for readOnly
      // readonly = false -> Force editable
      // readonly = true -> Force display mode
      // readonly = undefined -> Bound to edit flow
      if (_this.readOnly === undefined && _this.tableDefinition.annotation.displayMode === true) {
        _this.readOnly = true;
      }

      // getCustomInfo and buildEventHandlerWrapper are done in one location so that the format of the custom function names is unconverted
      // and contains "." instead of "/". "/" cannot be used in the table adaption dialog.
      _this.beforeRebindTable ??= _this.buildEventHandlerWrapper(getCustomFunctionInfo(_this.tableDefinition.control.beforeRebindTable, _this.tableDefinition.control));
      _this.selectionChange ??= _this.buildEventHandlerWrapper(getCustomFunctionInfo(_this.tableDefinition.control.selectionChange, _this.tableDefinition.control));
      TableAPI.updateColumnsVisibility(_this.ignoredFields, [], _this.tableDefinition);
      let useBasicSearch = false;

      // Note for the 'filterBar' property:
      // 1. ID relative to the view of the Table.
      // 2. Absolute ID.
      // 3. ID would be considered in association to TableAPI's ID.
      if (!_this.filterBar) {
        // filterBar: Public property for building blocks
        // filterBarId: Only used as Internal private property for FE templates
        _this.filterBar = generate([_this.id, "StandardAction", "BasicSearch"]);
        useBasicSearch = true;
      }
      // Internal properties
      _this.useBasicSearch = useBasicSearch;
      if (_this.modeForNoDataMessage && _this.modeForNoDataMessage !== "text") {
        _this.modeForNoDataMessage = _this.modeForNoDataMessage.split("-")[1];
      }
      if (!_this.modeForNoDataMessage && _this.tableDefinition.control.modeForNoDataMessage) {
        if (_this.tableDefinition.control.modeForNoDataMessage === "text") {
          _this.modeForNoDataMessage = _this.tableDefinition.control.modeForNoDataMessage;
        } else {
          _this.modeForNoDataMessage = _this.tableDefinition.control.modeForNoDataMessage.split("-")[1];
        }
      }
      return _this;
    }

    /**
     * Returns the annotation path pointing to the visualization annotation (LineItem).
     * @param contextObjectPath The datamodel object path for the table
     * @param converterContext The converter context
     * @returns The annotation path
     */
    _exports = TableBlock;
    _inheritsLoose(TableBlock, _BuildingBlockTemplat);
    TableBlock.getVisualizationPath = function getVisualizationPath(contextObjectPath, converterContext) {
      const metaPath = getContextRelativeTargetObjectPath(contextObjectPath);

      // fallback to default LineItem if metapath is not set
      if (!metaPath) {
        Log.error(`Missing meta path parameter for LineItem`);
        return `@${"com.sap.vocabularies.UI.v1.LineItem"}`;
      }
      if (isAnnotationOfTerm(contextObjectPath.targetObject, "com.sap.vocabularies.UI.v1.LineItem")) {
        return metaPath; // MetaPath is already pointing to a LineItem
      }
      //Need to switch to the context related the PV or SPV
      const resolvedTarget = converterContext.getEntityTypeAnnotation(metaPath);
      let visualizations = [];
      if (isAnnotationOfTerm(contextObjectPath.targetObject, "com.sap.vocabularies.UI.v1.SelectionPresentationVariant") || isAnnotationOfTerm(contextObjectPath.targetObject, "com.sap.vocabularies.UI.v1.PresentationVariant")) {
        visualizations = getVisualizationsFromAnnotation(contextObjectPath.targetObject, metaPath, resolvedTarget.converterContext, true);
      } else {
        Log.error(`Bad metapath parameter for table : ${contextObjectPath.targetObject.term}`);
      }
      const lineItemViz = visualizations.find(viz => {
        return viz.visualization.term === "com.sap.vocabularies.UI.v1.LineItem";
      });
      if (lineItemViz) {
        return lineItemViz.annotationPath;
      } else {
        // fallback to default LineItem if annotation missing in PV
        Log.error(`Bad meta path parameter for LineItem: ${contextObjectPath.targetObject.term}`);
        return `@${"com.sap.vocabularies.UI.v1.LineItem"}`; // Fallback
      }
    };
    var _proto = TableBlock.prototype;
    _proto.getTableSettings = function getTableSettings() {
      const tableSettings = {};
      TableBlock.addSetting(tableSettings, "enableExport", this.enableExport);
      TableBlock.addSetting(tableSettings, "exportRequestSize", this.exportRequestSize);
      TableBlock.addSetting(tableSettings, "frozenColumnCount", this.frozenColumnCount);
      TableBlock.addSetting(tableSettings, "widthIncludingColumnHeader", this.widthIncludingColumnHeader);
      TableBlock.addSetting(tableSettings, "rowCountMode", this.rowCountMode);
      TableBlock.addSetting(tableSettings, "rowCount", this.rowCount);
      TableBlock.addSetting(tableSettings, "enableFullScreen", this.enableFullScreen);
      TableBlock.addSetting(tableSettings, "enablePaste", this.enablePaste);
      TableBlock.addSetting(tableSettings, "disableCopyToClipboard", this.disableCopyToClipboard);
      TableBlock.addSetting(tableSettings, "scrollThreshold", this.scrollThreshold);
      TableBlock.addSetting(tableSettings, "selectionMode", this.selectionMode);
      TableBlock.addSetting(tableSettings, "type", this.type);
      const creationMode = {};
      TableBlock.addSetting(creationMode, "name", this.creationMode.name);
      TableBlock.addSetting(creationMode, "creationFields", this.creationMode.creationFields);
      TableBlock.addSetting(creationMode, "createAtEnd", this.creationMode.createAtEnd);
      TableBlock.addSetting(creationMode, "inlineCreationRowsHiddenInEditMode", this.creationMode.inlineCreationRowsHiddenInEditMode);
      if (Object.entries(creationMode).length > 0) {
        tableSettings["creationMode"] = creationMode;
      }
      return tableSettings;
    };
    TableBlock.createTableDefinition = function createTableDefinition(table, settings, tableSettings) {
      const initialConverterContext = table.getConverterContext(table.contextObjectPath, table.contextPath?.getPath(), settings);
      const visualizationPath = TableBlock.getVisualizationPath(table.contextObjectPath, initialConverterContext);
      const extraParams = {};

      // Check if we have ActionGroup and add nested actions
      if (table.actions) {
        Object.values(table.actions)?.forEach(item => {
          table.actions = {
            ...table.actions,
            ...item.menuContentActions
          };
          delete item.menuContentActions;
        });
      }

      // table actions and columns as {} if not provided to allow merge with manifest settings
      extraParams[visualizationPath] = {
        actions: table.actions || {},
        columns: table.columns || {},
        tableSettings: tableSettings
      };
      const converterContext = table.getConverterContext(table.contextObjectPath, table.contextPath?.getPath(), settings, extraParams);
      let associatedSelectionVariant;
      if (table.associatedSelectionVariantPath) {
        const svObjectPath = getInvolvedDataModelObjects(table.associatedSelectionVariantPath, table.contextPath);
        associatedSelectionVariant = svObjectPath.targetObject;
      }
      const visualizationDefinition = getDataVisualizationConfiguration(table.inMultiView && table.contextObjectPath.targetObject ? converterContext.getRelativeAnnotationPath(table.contextObjectPath.targetObject.fullyQualifiedName, converterContext.getEntityType()) : getContextRelativeTargetObjectPath(table.contextObjectPath), converterContext, {
        isCondensedTableLayoutCompliant: table.useCondensedLayout,
        associatedSelectionVariant,
        isMacroOrMultipleView: table.inMultiView ?? true
      });

      // take the (first) Table visualization
      const tableDefinition = visualizationDefinition.visualizations.find(viz => viz.type === VisualizationType.Table);
      if (table.annotationId) {
        tableDefinition.annotation.id = table.annotationId;
        tableDefinition.annotation.apiId = generate([table.annotationId, "Table"]);
      }
      return tableDefinition;
    };
    _proto.setUpId = function setUpId() {
      if (this.id) {
        // The given ID shall be assigned to the TableAPI and not to the MDC Table
        this._apiId = this.id;
        this.id = this.getContentId(this.id);
      } else {
        // We generate the ID. Due to compatibility reasons we keep it on the MDC Table but provide assign
        // the ID with a ::Table suffix to the TableAPI
        const tableDefinition = this.tableDefinition;
        this.id ??= tableDefinition.annotation.id;
        this._apiId = tableDefinition.annotation.apiId;
      }
    };
    _proto._getEntityType = function _getEntityType() {
      return this.collectionEntity?.entityType || this.collectionEntity?.targetType;
    };
    _proto.getEmptyRowsEnabled = function getEmptyRowsEnabled() {
      const enabled = this.creationMode.name === CreationMode.InlineCreationRows ? this.tableDefinition.actions.find(a => a.key === StandardActionKeys.Create)?.enabled : undefined;
      return enabled === "false" ? undefined : enabled;
    };
    _proto.buildEventHandlerWrapper = function buildEventHandlerWrapper(eventHandler) {
      if (!eventHandler) {
        return undefined;
      }

      // FPM.getCustomFunction returns a function, that's why we have 2 nested function calls below
      return compileExpression(fn(compileExpression(fn("FPM.getCustomFunction", [eventHandler.moduleName, eventHandler.methodName, ref("$event")])), [ref("$event")]));
    };
    _proto.getTemplate = function getTemplate() {
      const entityType = this._getEntityType();
      const tableProps = this;
      tableProps.rowPressHandlerPath = this.rowPress;
      tableProps.variantSavedHandlerPath = this.variantSaved;
      tableProps.variantSelectedHandlerPath = this.variantSelected;
      tableProps.onSegmentedButtonPressedHandlerPath = this.onSegmentedButtonPressed;
      const collectionEntity = this.convertedMetadata.resolvePath(tableProps.tableDefinition.annotation.collection).target;
      const handlerProvider = new TableEventHandlerProvider(tableProps, collectionEntity);
      return _jsx(TableAPI, {
        "core:require": "{FPM: 'sap/fe/core/helpers/FPMHelper'}",
        binding: `{internal>controls/${this.id}}`,
        id: this._apiId,
        contentId: this.id,
        visible: this.visible,
        headerLevel: this.headerLevel,
        headerStyle: this.headerStyle,
        headerVisible: this.headerVisible,
        tabTitle: this.tabTitle,
        exportRequestSize: this.exportRequestSize,
        disableCopyToClipboard: this.disableCopyToClipboard,
        scrollThreshold: this.scrollThreshold,
        isSearchable: this.isSearchable,
        busy: this.busy,
        initialLoad: this.initialLoad,
        header: this.header,
        isAlp: this.isAlp,
        fieldMode: this.fieldMode,
        personalization: this.personalization,
        rowPressHandlerPath: this.rowPress,
        variantSavedHandlerPath: this.variantSaved,
        variantSelectedHandlerPath: this.variantSelected,
        variantManagement: this.variantManagement,
        ignoredFields: this.ignoredFields,
        tableDefinition: `{_pageModel>${this.tableDefinitionContext.getPath()}}`,
        entityTypeFullyQualifiedName: entityType?.fullyQualifiedName,
        metaPath: this.metaPath?.getPath(),
        useBasicSearch: this.useBasicSearch,
        enableFullScreen: this.enableFullScreen,
        enableExport: this.enableExport,
        frozenColumnCount: this.frozenColumnCount,
        enablePaste: this.enablePaste,
        rowCountMode: this.rowCountMode,
        rowCount: this.rowCount,
        contextPath: this.contextPath?.getPath(),
        selectionChange: this.selectionChange,
        contextChange: this.onContextChange,
        readOnly: this.readOnly,
        selectionMode: this.selectionMode,
        useCondensedLayout: this.useCondensedLayout,
        type: this.type,
        filterBar: this.filterBar,
        emptyRowsEnabled: this.getEmptyRowsEnabled(),
        enableAutoColumnWidth: this.enableAutoColumnWidth,
        beforeRebindTable: this.beforeRebindTable,
        widthIncludingColumnHeader: this.widthIncludingColumnHeader,
        modeForNoDataMessage: this.modeForNoDataMessage,
        children: {
          customData: createCustomData("tableAPILocalId", this._apiId),
          creationMode: _jsx(TableCreationOptions, {
            name: this.creationMode.name,
            createAtEnd: this.creationMode.createAtEnd,
            inlineCreationRowsHiddenInEditMode: this.creationMode.inlineCreationRowsHiddenInEditMode,
            outbound: this.creationMode.outbound
          }),
          layoutData: _jsx(FlexItemData, {
            maxWidth: "100%"
          }),
          content: getMDCTableTemplate(tableProps, this.convertedMetadata, this.metaModel, handlerProvider, this.appComponent)
        }
      });
    };
    return TableBlock;
  }(BuildingBlockTemplatingBase), _TableBlock.addSetting = (target, key, value) => {
    if (value !== undefined) {
      target[key] = value;
    }
  }, _TableBlock), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "metaPath", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "busy", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "contextPath", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "enableFullScreen", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "enableExport", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "exportRequestSize", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "frozenColumnCount", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "widthIncludingColumnHeader", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "rowCountMode", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "rowCount", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "enablePaste", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "disableCopyToClipboard", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "scrollThreshold", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "filterBar", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "header", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "headerLevel", [_dec17], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return TitleLevel.Auto;
    }
  }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "headerVisible", [_dec18], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec19], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "annotationId", [_dec20], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "associatedSelectionVariantPath", [_dec21], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "isSearchable", [_dec22], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "personalization", [_dec23], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "readOnly", [_dec24], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "type", [_dec25], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "useCondensedLayout", [_dec26], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "selectionMode", [_dec27], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "variantManagement", [_dec28], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "ignoredFields", [_dec29], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "modeForNoDataMessage", [_dec30], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "headerStyle", [_dec31], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor31 = _applyDecoratedDescriptor(_class2.prototype, "enableAutoColumnWidth", [_dec32], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return true;
    }
  }), _descriptor32 = _applyDecoratedDescriptor(_class2.prototype, "fieldMode", [_dec33], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "";
    }
  }), _descriptor33 = _applyDecoratedDescriptor(_class2.prototype, "isAlp", [_dec34], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return false;
    }
  }), _descriptor34 = _applyDecoratedDescriptor(_class2.prototype, "inMultiView", [_dec35], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor35 = _applyDecoratedDescriptor(_class2.prototype, "tabTitle", [_dec36], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return "";
    }
  }), _descriptor36 = _applyDecoratedDescriptor(_class2.prototype, "visible", [_dec37], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor37 = _applyDecoratedDescriptor(_class2.prototype, "creationMode", [_dec38], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return {};
    }
  }), _descriptor38 = _applyDecoratedDescriptor(_class2.prototype, "actions", [_dec39], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor39 = _applyDecoratedDescriptor(_class2.prototype, "columns", [_dec40], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor40 = _applyDecoratedDescriptor(_class2.prototype, "beforeRebindTable", [_dec41], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor41 = _applyDecoratedDescriptor(_class2.prototype, "rowPress", [_dec42], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor42 = _applyDecoratedDescriptor(_class2.prototype, "onContextChange", [_dec43], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor43 = _applyDecoratedDescriptor(_class2.prototype, "onSegmentedButtonPressed", [_dec44], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor44 = _applyDecoratedDescriptor(_class2.prototype, "variantSaved", [_dec45], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor45 = _applyDecoratedDescriptor(_class2.prototype, "selectionChange", [_dec46], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor46 = _applyDecoratedDescriptor(_class2.prototype, "variantSelected", [_dec47], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor47 = _applyDecoratedDescriptor(_class2.prototype, "initialLoad", [_dec48], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = TableBlock;
  return _exports;
}, false);
//# sourceMappingURL=Table.block-dbg.js.map
