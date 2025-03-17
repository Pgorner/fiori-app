/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./error/ErrorHandler", "./i18n", "sap/ui/model/resource/ResourceModel", "./controls/searchfieldgroup/SearchFieldGroup", "sap/esh/search/ui/SearchModel", "sap/esh/search/ui/controls/SearchLayoutResponsive", "./controls/resultview/SearchResultContainer", "./controls/resultview/SearchCountBreadcrumbs", "sap/esh/search/ui/controls/SearchFilterBar", "sap/esh/search/ui/SearchHelper", "sap/ui/core/Control", "sap/ui/core/IconPool", "sap/ui/layout/VerticalLayout", "sap/ui/model/BindingMode", "sap/m/Button", "sap/m/library", "sap/m/Bar", "sap/m/OverflowToolbarLayoutData", "sap/m/OverflowToolbar", "sap/m/ViewSettingsItem", "sap/m/MessagePopover", "sap/m/MessageItem", "sap/m/VBox", "./error/errors", "sap/base/Log", "sap/m/IllustratedMessage", "sap/m/IllustratedMessageType", "sap/m/IllustratedMessageSize", "sap/esh/search/ui/error/errors", "sap/ui/core/ResizeHandler", "./controls/OpenShowMoreDialog", "./UIEvents", "./SearchCompositeControlDragDropConfig", "sap/base/assert", "./controls/facets/SearchFacetList", "sap/ui/core/Element", "./compositecontrol/ToolbarAssembler", "./compositecontrol/ResultViewsAssembler", "./controls/SearchSelectionBar", "./controls/resultview/SearchResultPanel"], function (__ErrorHandler, __i18n, ResourceModel, __SearchFieldGroup, SearchModel, SearchLayoutResponsive, __SearchResultContainer, __SearchCountBreadcrumbs, SearchFilterBar, SearchHelper, Control, IconPool, VerticalLayout, BindingMode, Button, sap_m_library, Bar, OverflowToolbarLayoutData, OverflowToolbar, ViewSettingsItem, MessagePopover, MessageItem, VBox, ___error_errors, Log, IllustratedMessage, IllustratedMessageType, IllustratedMessageSize, errors, ResizeHandler, ___controls_OpenShowMoreDialog, __UIEvents, __SearchCompositeControlDragDropConfig, assert, __SearchFacetList, Element, __ToolbarAssembler, __ResultViewsAssembler, __SearchSelectionBar, __SearchResultPanel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const ErrorHandler = _interopRequireDefault(__ErrorHandler);
  const i18n = _interopRequireDefault(__i18n);
  const SearchFieldGroup = _interopRequireDefault(__SearchFieldGroup);
  const SearchResultContainer = _interopRequireDefault(__SearchResultContainer);
  const SearchCountBreadcrumbs = _interopRequireDefault(__SearchCountBreadcrumbs);
  const ButtonType = sap_m_library["ButtonType"];
  const ToolbarDesign = sap_m_library["ToolbarDesign"];
  const PlacementType = sap_m_library["PlacementType"];
  const OverflowToolbarPriority = sap_m_library["OverflowToolbarPriority"];
  const FlexJustifyContent = sap_m_library["FlexJustifyContent"];
  const ProgramError = ___error_errors["ProgramError"];
  const openShowMoreDialog = ___controls_OpenShowMoreDialog["openShowMoreDialog"];
  const UIEvents = _interopRequireDefault(__UIEvents);
  const BarDesign = sap_m_library["BarDesign"];
  const SearchCompositeControlDragDropConfig = _interopRequireDefault(__SearchCompositeControlDragDropConfig);
  const SearchFacetList = _interopRequireDefault(__SearchFacetList);
  const ToolbarAssembler = _interopRequireDefault(__ToolbarAssembler);
  const ResultViewsAssembler = _interopRequireDefault(__ResultViewsAssembler);
  const SearchSelectionBar = _interopRequireDefault(__SearchSelectionBar);
  const SearchResultPanel = _interopRequireDefault(__SearchResultPanel);
  // =============== WARNING ===============================================================
  // do not use async/await in this file
  // --> async/await does work locally but not in barrier
  // because buildNPM does not transpile to Control.extend
  // questions:
  // -why
  // -why do we have different builds local/central
  // =============== WARNING ===============================================================
  /**
   * Search control (input for search terms, suggestions, facets, result list views "list", "table", "grid")
   *
   */
  /**
   * Constructs a new <code>SearchCompositeControl</code> to interact with SAP Enterprise Search Services.
   *
   * @param {string} [sId] ID for the new control, generated automatically if no ID is given
   * @param {object} [mSettings] Initial settings for the new control
   *
   * @class
   *
   * This is the SAPUI5 composite control by the Enterprise Search Team which helps to make full use of the Enterprise Search Engine
   * features built into ABAP and HANA.
   * It includes a search input box including a suggestion dropdown, a result view which can have different visualisation, including tiles, list and table, filtering facets and more.
   * This control is ready to use with an enterprise search backend service but also allows deep extension to match requirements of adopting applications.
   *
   * @extends sap.ui.core.Control
   *
   * @author SAP SE
   * @version 1.132.0
   *
   * @see https://help.sap.com/viewer/691cb949c1034198800afde3e5be6570/2.0.05/en-US/ce86ef2fd97610149eaaaa0244ca4d36.html
   * @see https://help.sap.com/viewer/6522d0462aeb4909a79c3462b090ec51/1709%20002/en-US
   *
   *
   * @constructor
   * @public
   * @alias sap.esh.search.ui.SearchCompositeControl
   * @since 1.93.0
   * @name sap.esh.search.ui.SearchCompositeControl
   *
   */
  /**
   * @namespace sap.esh.search.ui
   */
  const SearchCompositeControl = VerticalLayout.extend("sap.esh.search.ui.SearchCompositeControl", {
    //#region create UI elements
    renderer: {
      apiVersion: 2
    },
    metadata: {
      library: "sap.esh.search.ui",
      dnd: {
        draggable: true,
        droppable: false
      },
      // result view (list/table/grid) support dragging (dropping not supported)
      properties: {
        /**
         * An additional CSS class to add to this control
         * @since 1.93.0
         */
        cssClass: {
          type: "string"
        },
        /**
         * Defines the initial search term for the search input.
         * @since 1.93.0
         */
        searchTerm: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Defines if the search composite control will send a search request directly after loading, using given search term, data source and filter root condition settings.
         * @since 1.93.0
         */
        searchOnStart: {
          type: "boolean",
          group: "Behavior",
          defaultValue: true
        },
        /**
         * Defines the filter root condition of a filter tree which shall be applied to the search request.
         * This control only allows filter trees which have a the following structure:
         * complex condition (root level)
         *      \
         *  complex condition (attribute level)
         *        \
         *      simple condition (attribute value level)
         * Filter root conditions which do not follow this structure won't be accepted and an error will be thrown.
         * Please see the below for a more in-depth example.
         *
         * @since 1.98.0
         * @example A simple use case for filter conditions
         * sap.ui.require(
         *       [
         *          // Adjust the path to the .js files accordingly!
         *          "sap/esh/search/ui/sinaNexTS/sina/LogicalOperator",
         *          "sap/esh/search/ui/sinaNexTS/sina/ComparisonOperator",
         *          "sap/esh/search/ui/sinaNexTS/sina/ComplexCondition",
         *          "sap/esh/search/ui/sinaNexTS/sina/SimpleCondition",
         *      ], function (
         *          LogicalOperatorModule,
         *          ComparisonOperatorModule,
         *          ComplexConditionModule,
         *          SimpleConditionModule
         *      ) {
         *          ("use strict");
         *
         *          // Root condition must always be of type ComplexCondition!
         *          const rootCondition = new ComplexConditionModule.ComplexCondition({
         *              operator: LogicalOperatorModule.LogicalOperator.And,
         *          });
         *
         *          // Conditions of root condition must always be of type ComplexCondition!
         *          // Create one of those for each attribute.
         *          // This condition will hold all values for attribute 'FOLKLORIST':
         *          const complexChildCondition = new ComplexConditionModule.ComplexCondition({
         *              operator: LogicalOperatorModule.LogicalOperator.Or,
         *          });
         *
         *          // Conditions of complexChildCondition have to be simple conditions!
         *          // This filter specfies the value of the attributes.
         *          // The result is an attribute filter like 'FOLKLORIST' = 'Douglas Milford':
         *          const simpleGrandChildCondition = new SimpleConditionModule.SimpleCondition({
         *              operator: ComparisonOperatorModule.ComparisonOperator.Eq, // results should be equal to the filter value
         *              attribute: "FOLKLORIST", // example: name of the attribute
         *              value: "Douglas Milford", // example: value of the filter
         *          });
         *          complexChildCondition.addCondition(simpleGrandChildCondition); // Add the conditions to the condition tree
         *          rootCondition.addCondition(complexChildCondition);
         *
         *          // The filter tree now looks like this:
         *          //                                   rootCondition
         *          //                                  /      And    \
         *          //                   complexChildCondition
         *          //                   /        Or
         *          //        simpleGrandChildCondition ('FOLKLORIST' Eq 'Douglas Milford')
         *          // Additional complex child conditions would be linked by an "And" operator, additional simple attribute
         *          // filter conditions will be linked by an "Or":
         *
         *          // If you would like to apply an additional filter to the 'FOLKLORIST' attribute you can do that, too:
         *          const simpleGrandChildCondition2 = new SimpleConditionModule.SimpleCondition({
         *              operator: ComparisonOperatorModule.ComparisonOperator.Eq, // results should be equal to the filter value
         *              attribute: "FOLKLORIST", // example: name of the attribute
         *              value: "Cynthia MacDonald", // example: value of the filter
         *          });
         *
         *          complexChildCondition.addCondition(simpleGrandChildCondition2);
         *
         *          // The filter tree now looks like this:
         *          //                                   rootCondition
         *          //                                  /      And
         *          //                          complexChildCondition
         *          //                         /         Or          \
         *          // simpleGrandChildCondition               simpleGrandChildCondition2
         *
         *          // create a new search ui:
         *          const searchUI = new SearchCompositeControl({
         *              filterRootCondition: rootCondition,
         *          });
         *
         *          // or if it already exists:
         *          // const searchUI = Element.getElementById("eshCompGenId_0");
         *          // searchUI.setFilterRootCondition(rootCondition);
         *  });
         */
        filterRootCondition: {
          type: "object",
          group: "Misc"
        },
        /**
         * Configuration for the Enterprise Search Client API.
         * @since 1.93.0
         */
        sinaConfiguration: {
          type: "object",
          group: "Misc"
        },
        /**
         * The id of the data source in which it will search right after initialization.
         * @since 1.98.0
         */
        dataSource: {
          type: "string",
          group: "Misc"
        },
        /**
         * Data source id which is set when the UI is loaded and cannot be changed at run time.
         * The following UI parts will be hidden:
         * - data source select (dropdown)
         * - data source tab bar
         * - data source facet (facet panel)
         * - data source name/link on result list (header section of item)
         * @since 1.121.0
         */

        // Stakeholders using a single data source only:
        //  - SAP Datashere ('SEARCH_DESIGN')
        //  - SAC role UIs ('esh_ums_assignment'/'esh_ums_users').

        exclusiveDataSource: {
          type: "string",
          group: "Misc"
        },
        /**
         * Defines selectable search result view types.
         * The value can be set/get in attach event "searchFinished".
         * Case 1: Search in Apps: result is displayed in a mandatory view type <code>["appSearchResult"]</code>, and it is not switchable.
         * Case 2: Search in All or other Category: result is switchable between different view types.
         * Possible values for the array items are <code>"searchResultList"</code> and <code>"searchResultGrid"</code>.
         * Case 3, Search in Business Object: result is switchable between different view types.
         * Possible values for the array items are <code>"searchResultList"</code>, <code>"searchResultTable"</code> and <code>"searchResultGrid"</code>.
         * Note: The value of <code>resultViewTypes</code> and <code>resultViewType</code> must be compatible to each other.
         *
         * After the result view type has been changed, the event 'resultViewTypeChanged' is fired.
         *
         * @since 1.98.0
         */
        resultViewTypes: {
          type: "string[]",
          group: "Misc",
          defaultValue: ["searchResultList", "searchResultTable"]
          //  Case 2.1, Search in All or other Category (configuration.isUshell !== true): result is switchable between different view types.
          //  Possible values for the array items are <code>"searchResultList"</code> and <code>"searchResultGrid"</code>.
          //  Case 2.2, Search in All or other Category (configuration.isUshell === true): result is displayed in a mandatory view type <code>["searchResultList"]</code>.
        },
        /**
         * Defines active search result view type.
         * The value can be set/get in attach event "searchFinished", and it must be contained in resultViewTypes.
         * Case 1, Search in Apps: result is displayed in a mandatory view type <code>"appSearchResult"</code>.
         * Case 2.1, Search in All or other Category (configuration.isUshell !== true): result is switchable between different view types.
         * Possible value is <code>"searchResultList"</code>, or <code>"searchResultGrid"</code>.
         * Case 2.2, Search in All or other Category (configuration.isUshell === true): result is displayed in a mandatory view type <code>"searchResultList"</code>.
         * Case 3, Search in Business Object: result is switchable between different view types.
         * Possible value is <code>"searchResultList"</code>, <code>"searchResultTable"</code> or <code>"searchResultGrid"</code>.
         * Note: The value of <code>resultViewTypes</code> and <code>resultViewType</code> must be compatible to each other.
         *
         * After the result view type has been changed, the event 'resultViewTypeChanged' is fired.
         *
         * @since 1.98.0
         */
        resultViewType: {
          type: "string",
          group: "Misc",
          defaultValue: "searchResultList"
        },
        /**
         * Defines a pair of search result view settings.
         * The value is an object of properties <code>resultViewTypes</code> and <code>resultViewType</code>.
         * An example: <code>{resultViewTypes: ["searchResultList", "searchResultTable"], resultViewType: "searchResultList"}</code>
         * Find more detail in the definition of each child property.
         * The value can be set/get in attached event "searchFinished".
         * Function <code>setResultViewSettings</code> prevents incompatibility of sequential execution of functions <code>setResultViewTypes</code> and <code>setResultViewType</code>.
         * Note: The value of <code>resultViewTypes</code> and <code>resultViewType</code> must be compatible to each other.
         *
         * After the result view type has been changed, the event 'resultViewTypeChanged' is fired.
         *
         * @since 1.100.0
         */
        resultViewSettings: {
          settings: {
            resultViewTypes: "string[]",
            resultViewType: "string"
          },
          group: "Misc",
          defaultValue: {
            resultViewTypes: ["searchResultList", "searchResultTable"],
            resultViewType: "searchResultList"
          }
        },
        /**
         * Function callback for formatting the datasource tabstrips in the top toolbar.
         * To the callback function a list of datasources is passed. The callback functions return a modified list of datasources
         * to be displayed in the tabstrips.
         *
         * @since 1.103.0
         */
        tabStripsFormatter: {
          type: "function",
          group: "Misc"
        },
        /**
         * Activates the folder mode. Precondition for folder mode is
         * 1) Search model:
         * In the search model for the current datasource a hierarchy attribute (representing the folders) is defined
         * 1.1) the hierarchy attribute is annotated with displayType=TREE and for the hierarchy there is a helper
         * connector representing the hierarchy or
         * 1.2) the current datasource is the helper datasource representing the folder hierarchy. The hierarchy attribute
         * is annotated with displayType=FLAT
         * 2) Search query:
         * The folder mode is only active in case the search query has an empty search term and no filter conditions
         * (except the hierarchy attribute) are set.
         *
         * In folder mode and in case a folder filter is set the result view only shows direct children of a folder.
         * In contrast the counts in the facets are calculated by counting direct and not direct children.
         * In case the folder mode is not active the UI uses the search mode: The result list shows direct and
         * not direct children of a folder.
         * * @since 1.106.0
         */
        folderMode: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         *  In case folderMode is set to true this boolean indicates whether for the initial search the folder mode is enabled.
         *  @since 1.114.0
         */
        folderModeForInitialSearch: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * In case folder mode is active:
         * Automatically switch result view type to list in search mode and to table in folder mode.
         * @since 1.106.0
         */
        autoAdjustResultViewTypeInFolderMode: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * Enables the query language for the hana_odata provider.
         * With query language it is possible for the end user to enter complex search
         * queries with logical operators.
         * @since 1.107.0
         */
        enableQueryLanguage: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * Relevant for SAP partners and SAP, the "Application Component" you expect customers to create incidents.
         * @since 1.108.0
         */
        applicationComponent: {
          type: "string",
          group: "Misc",
          defaultValue: "HAN-AS-INA-UI"
        },
        /**
         * Display a splitter bar to resize the left hand panel, containing all facets and filter criteria.
         * @since 1.108.0
         */
        facetPanelResizable: {
          type: "boolean",
          group: "Misc",
          defaultValue: true
        },
        /**
         * Default size (percent) of the left hand panel, containing all facets and filter criteria. If "facetPanelResizable" is true, the width of the facet panel can be changed by the user.
         * @since 1.108.0
         */
        facetPanelWidthInPercent: {
          type: "float",
          group: "Misc",
          defaultValue: 25
        },
        /**
         * Whenever a search has no results, a 'No Results Screen' is displayed. You can provide a custom control to be more specific and add some hints, links, buttons or other content.
         * @since 1.94.0
         */
        getCustomNoResultScreen: {
          type: "function",
          group: "Misc"
        },
        /**
         * A callback which returns customized "label" for placeholder text of search box in case there is no search term.
         * The placeholder text (en) will be "Search In: <customPlaceholderLabel>".
         */
        getSearchInputPlaceholderLabel: {
          type: "function",
          group: "Misc"
        },
        /**
         * Shall the window title be overwritten by this control?
         * If true, the control will set the current search condition as window title.
         * If false, it will not set or update the window title.
         * @since 1.93.0
         */
        overwriteBrowserTitle: {
          type: "boolean",
          group: "Misc"
        },
        /**
         * Data source id which is set when the UI is loaded or filter is reset.
         * If dataSource is also set, dataSource will be used during UI load and this
         * parameter will used only after filter is reset. When setting 'exclusiveDataSource' to 'true', do not set this parameter (will be ignored).
         * @since 1.93.0
         */
        defaultDataSource: {
          type: "string",
          group: "Misc"
        },
        /**
         * The layout is optimized for object selection / value help (narrow view w/o facet panel).
         * @since 1.111.0
         */
        optimizeForValueHelp: {
          type: "boolean",
          group: "Misc"
        },
        /**
         * Callback for filtering the datasources displayed in the datasource dropdown listbox.
         * The callback gets a list of datsources and returns the filtered list of datasources.
         * @since 1.112.0
         */
        filterDataSources: {
          type: "function",
          group: "Misc"
        },
        /**
         * A boolean which indicates whether the facet panel is initially openend or closed.
         * This affects only the initial state of the facet panel.
         * This initial state of the facet panel can be overwritten by the user, depending
         * on the user's personalization settings.
         * @since 1.113.0
         */
        facetVisibility: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * A boolean for enabling (business) object suggestions.
         * @since 1.113.0
         */
        boSuggestions: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * When set to true the facet panel is displayed also in case there are no search results.
         * @since 1.113.0
         */
        displayFacetPanelInCaseOfNoResults: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * A boolean indicating that the search state is written to the URL.
         * @since 1.113.0
         */
        updateUrl: {
          type: "boolean",
          group: "Misc",
          defaultValue: true
        },
        /**
         * A callback for rendering the search URL. The callback gets a list of url encoded parameters and returns the URL string.
         * Typically you need to register this callback in case of 'updateUrl = true'.
         * @since 1.113.0
         * @example
         * <code>
         * const renderSearchUrl = function (properties){
            return (
                "#Action-search&/top=" +
                properties.top +
                (properties.orderby ? "&orderBy=" + properties.orderby : "") +
                (properties.sortorder ? "&sortOrder=" + properties.sortorder : "") +
                "&filter=" +
                properties.filter
            );
          };
          </code>
         */
        renderSearchUrl: {
          type: "function",
          group: "Misc"
        },
        /**
         * A callback for checking whether a URL is a search-relevant URL. The callback receives a URL and returns 'true' in case the URL is a search-relevant URL.
         * Typically you need to register this callback in case of 'updateUrl = true'.
         * @since 1.113.0
         * @example
         * <code>
         * const isSearchUrl =function (url) {
              return url.indexOf("#Action-search") === 0;
           };
           </code>
         */
        isSearchUrl: {
          type: "function",
          group: "Misc"
        },
        /**
         * A callback for parsing URL parameters. The callback receices URL parameters and returns modified URL parameters.
         * This is an optional callback. In case you set 'updateUrl = true' typcically this callback is not needed.
         * @since 1.113.0
         */
        parseSearchUrlParameters: {
          type: "function",
          group: "Misc"
        },
        /**
         * A list of data sources to be displayed in the facet panel in the section "Collection".
         * @since 1.113.0
         */
        quickSelectDataSources: {
          type: "object",
          group: "Misc"
        },
        /**
         * A callback which is called whenever the selection of result view items changes.
         * @since 1.113.0
         */
        selectionChange: {
          type: "function",
          group: "Misc"
        },
        /**
         * An asynchronues callback which is called after the initialization of the search composite control.
         * @since 1.113.0
         */
        initAsync: {
          type: "function",
          group: "Misc"
        },
        /**
         * Enables the multiselection mode of search result items.
         * A checkbox is provided for each result item if the value is set to 'true'.
         * @since 1.96.0
         */
        enableMultiSelectionResultItems: {
          type: "boolean",
          group: "Misc",
          defaultValue: false
        },
        /**
         * The maximum count of search result items displayed on a page after a search.
         * By clicking 'Show More' button, another page of result items of the same count (if available) will be displayed.
         * @since 1.96.0
         */
        pageSize: {
          type: "int",
          group: "Misc",
          defaultValue: 10
        },
        /**
         * Callback for formatting the filter string to be displayed on the filter bar (for closed facet panel).
         * @since 1.120
         */
        formatFilterBarText: {
          type: "function",
          group: "Misc"
        },
        /**
         * Callback for checking whether the filter bar is visible.
         * @since 1.120
         */
        isFilterBarVisible: {
          type: "function",
          group: "Misc"
        },
        /**
         * Adds a callback function which is called whenever there is a user triggered event.
         * @since 1.120
         * @example
         * <pre><code>
         * const logEventConsumer = {
         *     label: "my log event consumer",
         *     logEvent: (event) => {
         *         console.log("user event happened: " + event.type)
         *     }
         * }
         * mySearchCompositeControl.addEventConsumer(logEventConsumer);
         * </code></pre>
         */
        eventConsumers: {
          singularName: "eventConsumer",
          multiple: true,
          group: "Misc"
        },
        /**
         * Limit for length of searchterm.
         */
        searchTermLengthLimit: {
          type: "int",
          group: "Misc",
          defaultValue: 1000
        },
        /**
         * Prevents too many ajax requests in a short time.
         */
        limitAjaxRequests: {
          type: "boolean",
          group: "Misc",
          defaultValue: true
        }
      },
      aggregations: {
        /**
         * Control instances which are part of this composite control.
         * @private
         */
        content: {
          singularName: "content",
          multiple: true
        }
      },
      events: {
        /**
         * Event is fired when search is started.
         * @since 1.121
         */
        searchStarted: {},
        /**
         * Event is fired when search is finished.
         * @since 1.121
         */
        searchFinished: {},
        /**
         * Event is fired when selection on result view (list, table or grid) has changed.
         * @since 1.121
         */
        selectionChanged: {},
        /**
         * Event is fired after result view type got changed (list, table or grid).
         * @since 1.124
         */
        resultViewTypeChanged: {}
      }
    },
    constructor: function _constructor(sId, settings) {
      const initialErrorHandler = ErrorHandler.getInstance({
        label: sId
      });
      let searchModel;
      let createContentRunning = false;
      try {
        // unify input parameters
        const unifiedParameters = SearchCompositeControl.unifyInputParameters(sId, settings);
        sId = unifiedParameters.sId;
        settings = unifiedParameters.settings;

        // application component shall be provided (needed for error messages and supportability)
        assert(settings?.applicationComponent !== undefined && settings?.applicationComponent !== "", `Provide property 'applicationComponent' (example: "LOD-ANA-LS").\nRelevant for SAP partners and SAP, the "Application Component" you expect customers to create incidents.`);

        // if 'exclusiveDataSource' is provided, we (internally) set 'dataSource' and 'defaultDataSource' to same value.
        // to prevent confusion, DO NOT provide 'dataSource' and 'defaultDataSource'
        assert(settings.exclusiveDataSource === undefined || settings.exclusiveDataSource === "" || settings.dataSource === undefined && settings.defaultDataSource === undefined, `Property 'exclusiveDataSource' is provided ('${settings.exclusiveDataSource}').\nDo NOT fill properties 'dataSource' and 'defaultDataSource'.`);

        // create search model (within search model the SearchConfiguration is created and initialized with settings)
        searchModel = settings["model"] || settings["searchModel"]; // ToDo, adjust flp/cflp, user 'searchModel' instead of 'model' (renamed because of syntax check errors with type of existing property 'model')
        if (!searchModel) {
          searchModel = new SearchModel({
            configuration: settings
          });
        } else {
          searchModel.config.id = sId; // FLP use case
        }
        initialErrorHandler.setSearchModel(searchModel);

        // call super constructor with all UI5 relevant settings
        const settingsKnownToUI5 = SearchCompositeControl.getUI5ControlSettings(searchModel.config);
        VerticalLayout.prototype.constructor.call(this, sId, settingsKnownToUI5);
        this.errorHandler = initialErrorHandler;

        // init composite control
        this._oLogger = Log.getLogger("sap.esh.search.ui.SearchCompositeControl");
        this.addStyleClass("sapUshellSearchInputHelpPage"); // obsolete, but could be still used in some applications
        this.addStyleClass("sapElisaSearchCompositeControl");
        if (searchModel.config.optimizeForValueHelp) {
          this.addStyleClass("sapUshellSearchInputHelpPageValueHelp");
        }
        this.setModelInternal(searchModel);
        this.setModelInternal(searchModel.publicSearchModel, searchModel.publicSearchModel.modelName);
        this.setModelInternal(new ResourceModel({
          bundle: i18n
        }), "i18n");
        const scc = this;
        this.oFocusHandler = new SearchHelper.SearchFocusHandler(scc);
        searchModel.focusHandler = this.oFocusHandler;
        this.toolbarAssembler = new ToolbarAssembler(scc);
        this.resultViewsAssembler = new ResultViewsAssembler(scc);

        // create views
        searchModel.config.performanceLogger.enterMethod({
          name: "createContent"
        }, {
          isSearch: true
        });
        createContentRunning = true;
        this.createContent();
        searchModel.config.performanceLogger.leaveMethod({
          name: "createContent"
        });
        createContentRunning = false;

        // drag&drop config (helper)
        this.oSearchCompositeControlDragDropConfig = new SearchCompositeControlDragDropConfig({
          eshComp: this
        });
        ResizeHandler.register(this, () => {
          this._resizeHandler();
        });
        this.attachEvent("searchStarted", function () {
          this.closePopovers();
        });

        // trigger async search init
        this.initSearch();
      } catch (error) {
        initialErrorHandler.onError(error);
        throw error;
      } finally {
        if (createContentRunning) {
          searchModel.config.performanceLogger.leaveMethod({
            name: "createContent"
          });
          createContentRunning = false;
        }
      }
    },
    getModel: function _getModel(sName) {
      // for internal use, see function 'getSearchModelInternal'
      const callStack = new Error().stack;
      if (sName !== undefined || callStack.includes("._setModelInternal") || callStack.includes("setModelInternal") || callStack.includes("onAllSearchFinished") || callStack.includes(".updateBindingContext") ||
      // update of existing binding
      callStack.includes(".updatePropertyValue") || callStack.includes("addContent")) {
        // OK, called by SearchCompositeControl, function setModelInternal
      } else {
        assert(false, `The main model of this control is private.\nTo access the public search model, call function 'getPublicSearchModel' or bind to it (model name 'publicSearchModel').\nThe main model of this control is private and cannot be accessed (for internal use, see function 'getSearchModelInternal').`);
      }
      // for now, return the search model (remove this as all soon as stakeholders have migrated)
      return this.getModelInternal(sName);
    },
    setModel: function _setModel(oModel, sName) {
      const oSearchModelInternal = this.getModelInternal();
      if (!sName) {
        assert(false, `Main model cannot be set (for internal use, see function 'setModelInternal').`);
        return this;
      } else if (sName === oSearchModelInternal?.publicSearchModel?.modelName) {
        assert(false, `Model cannot be set, name '${oSearchModelInternal?.publicSearchModel?.modelName}' is reserved for public search model (for internal use, see function 'setModelInternal').`);
        return this;
      } else {
        return VerticalLayout.prototype.setModel.call(this, oModel, sName);
      }
    },
    setModelInternal: function _setModelInternal(oModel, sName) {
      return VerticalLayout.prototype.setModel.call(this, oModel, sName);
    },
    initSearch: function _initSearch() {
      // TODO in case UI is started with URL: 'fireSearchQuery' is called twice (second call is ignored because query does not change)
      const searchModel = this.getModelInternal();
      searchModel.config.performanceLogger.enterMethod({
        name: "init search"
      }, {
        isSearch: true
      });
      // this handles starting the UI via URL -> triggers 'fireSearchQuery'
      searchModel.searchUrlParser.parse().then(() => {
        searchModel.initAsync().then(() => {
          if (this.getProperty("searchOnStart") && !searchModel.config.isUshell) {
            this.search(); // this handles starting the UI without URL but with initial searchTerm -> triggers 'fireSearchQuery'
          }
          if (searchModel) {
            searchModel.config.performanceLogger.leaveMethod({
              name: "init search"
            });
          }
        });
      });
    },
    exit: function _exit() {
      this.closePopovers();
      if (this.oFilterBar) {
        // ToDo: ugly workaround for "ap22: duplicate id 'eshCompGenId_0-searchFilterBar'"
        // -> after adding a stable id to the filter bar, the existing memory clean-up issue became a duplicate id issue
        this.oFilterBar.destroy();
      }
      if (this.noResultScreen) {
        // in case a custom result screen is used, we need to explicitely destroy the default no result screen
        // in the shadow dom of UI5. Otherwise a duplicate id exception will be thrown if search composite control
        // is instantiated next time.
        this.noResultScreen.destroy();
      }
      if (this.noResultScreenFolder) {
        // in case a custom result screen is used, we need to explicitely destroy the default no result screen
        // in the shadow dom of UI5. Otherwise a duplicate id exception will be thrown if search composite control
        // is instantiated next time.
        this.noResultScreenFolder.destroy();
      }

      // avoid to create same-id-TablePersoDialog by oTablePersoController.activate()
      // destroy TablePersoDialog when exit search app
      this.searchResultTable?.tablePersonalizer?.destroyControllerAndDialog();
      if (this["oFacetDialog"]) {
        // oFacetDialog doesn't have id
        // destroy oFacetDialog when exit search app anyway
        this["oFacetDialog"].destroy(); // ToDo
        this["oFacetDialog"] = null;
      }
      const oModel = this.getModelInternal();
      oModel.unsubscribe(UIEvents.ESHSearchStarted, this.onAllSearchStarted, this);
      oModel.unsubscribe(UIEvents.ESHSearchFinished, this.onAllSearchFinished, this);
      oModel.unsubscribe(UIEvents.ESHSelectionChanged, this.onSelectionChanged, this);
    },
    createContent: function _createContent() {
      const oModel = this.getModelInternal();
      if (!oModel.config.isUshell) {
        this.oSearchFieldGroup = new SearchFieldGroup(this.getId() + "-searchInputHelpPageSearchFieldGroup");
        if (oModel.config.exclusiveDataSource) {
          this.oSearchFieldGroup.setSelectActive(false);
        }
        this.oSearchFieldGroup.setCancelButtonActive(false);
        this.oSearchFieldGroup.addStyleClass("sapUshellSearchInputHelpPageSearchFieldGroup");
        this.oSearchFieldGroup.input.setShowValueHelp(false);
        oModel.setProperty("/inputHelp", this.oSearchFieldGroup.input);
        if (oModel.config.optimizeForValueHelp) {
          this.oSearchFieldGroup.setActionsMenuButtonActive(true);
          this.oSearchFieldGroup.setSelectQsDsActive(true);
          this.oSearchFieldGroup.addStyleClass("sapUiTinyMarginBegin");
          this.oSearchFieldGroup.addStyleClass("sapUiTinyMarginEnd");
        }
      }
      if (oModel?.subscribe) {
        if (!this.subscribeDone_SearchStarted) {
          oModel.subscribe(UIEvents.ESHSearchStarted, this.onAllSearchStarted, this);
          this.subscribeDone_SearchStarted = true;
        }
        if (!this.subscribeDone_SearchFinished) {
          oModel.subscribe(UIEvents.ESHSearchFinished, this.onAllSearchFinished, this);
          this.subscribeDone_SearchFinished = true;
        }
        if (!this.subscribeDone_SelectionChanged) {
          oModel.subscribe(UIEvents.ESHSelectionChanged, this.onSelectionChanged, this);
          this.subscribeDone_SelectionChanged = true;
        }
        if (!this.subscribeDone_ResultViewTypeChanged) {
          oModel.subscribe(UIEvents.ESHResultViewTypeChanged, this.onResultViewTypeChanged, this);
          this.subscribeDone_SelectionChanged = true;
        }
      }
      if (this.oSearchFieldGroup) {
        if (oModel) {
          oModel.subscribe(UIEvents.ESHSearchFinished, () => {
            this.oSearchFieldGroup.input.setValue(oModel.getSearchBoxTerm());
          }, this);
        }
      }
      this.oFilterButton = this.toolbarAssembler.assembleFilterButton();
      this.oDataSourceTabBar = this.toolbarAssembler.assembleDataSourceTabBar();
      const toolbarLeftContent = [this.oFilterButton, this.oDataSourceTabBar];
      const genericButtonsToolbarData = this.toolbarAssembler.assembleGenericButtonsToolbar();
      this.oGenericItemsToolbar = genericButtonsToolbarData.toolbar;
      this.oSearchBar = new OverflowToolbar(this.getId() + "-searchBar", {
        width: "100%",
        visible: {
          parts: [{
            path: "/count"
          }],
          formatter: count => {
            return count !== 0 || oModel?.config?.showSearchBarForNoResults;
          }
        },
        content: toolbarLeftContent.concat(this.oGenericItemsToolbar),
        design: ToolbarDesign.Transparent
      });
      this.oSearchBar.addStyleClass("sapUshellSearchBar");
      if (genericButtonsToolbarData.hasCustomButtons) {
        this.oDataSourceTabBar.addStyleClass("sapUshellSearchBarHasCustomButtons");
      } else {
        this.oDataSourceTabBar.removeStyleClass("sapUshellSearchBarHasCustomButtons");
      }
      if (oModel.config.optimizeForValueHelp) {
        this.oSearchBar.addStyleClass("sapUshellSearchBarValueHelp");
      }
      this.oFilterBar = new SearchFilterBar(this.getId() + "-searchFilterBar");
      this.createSearchPage(this.getId());
    },
    onAfterRendering: function _onAfterRendering() {
      const oModel = this?.getModelInternal();
      if (oModel?.subscribe) {
        // search started
        if (!this.subscribeDone_SearchStarted) {
          oModel.subscribe(UIEvents.ESHSearchStarted, this.onAllSearchStarted, this);
          this.subscribeDone_SearchStarted = true;
        }
        // search finished
        if (!this.subscribeDone_SearchFinished) {
          oModel.subscribe(UIEvents.ESHSearchFinished, this.onAllSearchFinished, this);
          this.subscribeDone_SearchFinished = true;
        }
        // selection changed
        if (!this.subscribeDone_SelectionChanged) {
          oModel.subscribe(UIEvents.ESHSelectionChanged, this.onSelectionChanged, this);
          this.subscribeDone_SelectionChanged = true;
        }
        // result view type changed
        if (!this.subscribeDone_ResultViewTypeChanged) {
          oModel.subscribe(UIEvents.ESHResultViewTypeChanged, this.onResultViewTypeChanged, this);
          this.subscribeDone_ResultViewTypeChanged = true;
        }
      }
    },
    isShowMoreFooterVisible: function _isShowMoreFooterVisible() {
      const oModel = this.getModelInternal();
      return oModel.getProperty("/boCount") > oModel.getProperty("/boResults").length;
    },
    // #endregion
    // #region drag and drop
    assignDragDropConfig: function _assignDragDropConfig() {
      this.oSearchCompositeControlDragDropConfig.assignDragDropConfig();
    },
    addDragDropConfig: function _addDragDropConfig(oDragDropConfig) {
      return this.oSearchCompositeControlDragDropConfig.addDragDropConfig(oDragDropConfig);
    },
    insertDragDropConfig: function _insertDragDropConfig(oDragDropConfig, iIndex) {
      return this.oSearchCompositeControlDragDropConfig.insertDragDropConfig(oDragDropConfig, iIndex);
    },
    indexOfDragDropConfig: function _indexOfDragDropConfig(oDragDropConfig) {
      return this.oSearchCompositeControlDragDropConfig.indexOfDragDropConfig(oDragDropConfig);
    },
    getDragDropConfig: function _getDragDropConfig() {
      return this.oSearchCompositeControlDragDropConfig.getDragDropConfig();
    },
    removeDragDropConfig: function _removeDragDropConfig(vDragDropConfig) {
      return this.oSearchCompositeControlDragDropConfig.removeDragDropConfig(vDragDropConfig);
    },
    removeAllDragDropConfig: function _removeAllDragDropConfig() {
      return this.oSearchCompositeControlDragDropConfig.removeAllDragDropConfig();
    },
    destroyDragDropConfig: function _destroyDragDropConfig() {
      return this.oSearchCompositeControlDragDropConfig.destroyDragDropConfig();
    },
    // #endregion
    onAllSearchStarted: function _onAllSearchStarted() {
      this.fireEvent("searchStarted");
    },
    onAllSearchFinished: function _onAllSearchFinished() {
      const oModel = this.getModelInternal();
      this.assignDragDropConfig(); // reassign drag&drop config (result view regenerated/switched)
      this.chooseNoResultScreen(); // there can be custom no-result-screems, depending on data source
      this.oFocusHandler.setFocus();
      // the search-app container of FLP has ID "viewPortContainer"
      if (oModel.config.isUshell) {
        const viewPortContainer = Element.getElementById("viewPortContainer"); // sap.ushell.ui.AppContainer
        if (viewPortContainer?.switchState) {
          viewPortContainer.switchState("Center");
        }
      }
      this.fireEvent("searchFinished");

      // optimize layout (css)
      setTimeout(() => {
        // search toolbar ('overflow' of buttons at the right)
        this.adjustSearchbarCustomGenericButtonWidth();
      }, 0);
    },
    onSelectionChanged: function _onSelectionChanged() {
      const oModel = this.getModelInternal();
      this.fireEvent("selectionChanged");
      // robustness while stakeholders are migrating to new event 'selectionChanged'
      if (typeof oModel.config.selectionChange === "function") {
        oModel.config.selectionChange(oModel);
      }
    },
    onResultViewTypeChanged: function _onResultViewTypeChanged() {
      this.fireEvent("resultViewTypeChanged");
    },
    // create content
    // ===================================================================
    createSearchPage: function _createSearchPage(idPrefix) {
      const oModel = this.getModelInternal();
      this.oFilterBar.bindProperty("visible", {
        parts: [{
          path: "/count"
        }, {
          path: "/facetVisibility"
        }, {
          path: "/uiFilter/rootCondition"
        }],
        formatter: (count, facetVisibility, rootCondition) => {
          let filterBarVisible = false;
          if (!facetVisibility && rootCondition && rootCondition.hasFilters()) {
            filterBarVisible = true;
          }
          if (rootCondition && oModel.filterWithoutFilterByConditions()) {
            filterBarVisible = false;
          }
          // DWC exit
          if (rootCondition && typeof oModel.config.hasSpaceFiltersOnly === "function") {
            if (oModel.config.hasSpaceFiltersOnly(rootCondition) === true) {
              filterBarVisible = false;
            }
          }
          // exit isFilterBarVisible
          if (rootCondition && typeof oModel.config.isFilterBarVisible === "function") {
            try {
              if (!oModel.config.isFilterBarVisible(rootCondition)) {
                filterBarVisible = false;
              }
            } catch (error) {
              const oError = new errors.ConfigurationExitError("isFilterBarVisible", oModel.config.applicationComponent, error);
              this.errorHandler.onError(oError);
            }
          }
          return filterBarVisible;
        }
      });
      this.oFooter = this.createFooter(this.getId()); // not available for device type 'phone'
      if (this.oFooter) {
        this.oFooter.bindProperty("visible", {
          parts: [{
            path: "/errors/length"
          }],
          formatter: numberErrors => {
            const footerVisible = numberErrors > 0 ? true : false;
            return footerVisible;
          }
        });
      }
      this.searchContainer = this.createSearchContainer(idPrefix);
      let searchPageItems = [];
      if (this.oSearchFieldGroup) {
        searchPageItems.push(this.oSearchFieldGroup);
      }
      searchPageItems = searchPageItems.concat([this.oSearchBar, this.oFilterBar, this.searchContainer, this.oFooter]);
      for (const searchPageItem of searchPageItems) {
        this.addContent(searchPageItem);
      }
      this.setWidth("100%");
    },
    createNoResultScreen: function _createNoResultScreen(idPrefix, type) {
      const additionalContent = [];
      const illustrationSize = IllustratedMessageSize.Auto;
      let title;
      let description;
      let illustrationType;
      if (type === "folder") {
        title = {
          parts: [{
            path: "/queryFilter/searchTerm"
          }],
          formatter: searchTerm => i18n.getText("no_results_info_1_folderEmpty", [searchTerm])
        };
        description = i18n.getText("no_results_info_2_folderEmpty");
        illustrationType = IllustratedMessageType.EmptyList;
      } else {
        title = {
          parts: [{
            path: "/queryFilter/searchTerm"
          }],
          formatter: searchTerm => i18n.getText("no_results_info_1", [searchTerm])
        };
        description = i18n.getText("no_results_info_2");
        illustrationType = IllustratedMessageType.NoSearchResults;
      }
      const illustratedMessageSettings = {
        title: title,
        description: description,
        illustrationSize: illustrationSize,
        illustrationType: illustrationType,
        additionalContent: additionalContent
      };
      let noResultsScreenIdPrefix;
      if (type === "folder") {
        noResultsScreenIdPrefix = `${idPrefix}-searchContainerResultsView-noResultFolderScreen`;
      } else {
        noResultsScreenIdPrefix = `${idPrefix}-searchContainerResultsView-noResultScreen`;
      }
      const oIllustratedMessage = new IllustratedMessage(`${noResultsScreenIdPrefix}-searchContainerResultsView-noResultScreen-illustratedMessage`, illustratedMessageSettings).addStyleClass("sapElisaNoResultScreen");
      oIllustratedMessage.addStyleClass("sapUiMediumMarginTop");
      const noResultScreen = new VBox(`${noResultsScreenIdPrefix}-searchContainerResultsView-noResultScreen`, {
        items: oIllustratedMessage,
        width: "100%",
        justifyContent: FlexJustifyContent.Center,
        visible: {
          parts: [{
            path: "/count"
          }, {
            path: "/isBusy"
          }, {
            path: "/firstSearchWasExecuted"
          }],
          formatter: function (count, isBusy, firstSearchWasExecuted) {
            return count === 0 && !isBusy && firstSearchWasExecuted;
          }
        }
      });
      if (type === "folder") {
        this.noResultScreenFolder = noResultScreen;
      } else {
        this.noResultScreen = noResultScreen;
      }
      return noResultScreen;
    },
    createSearchContainer: function _createSearchContainer(idPrefix) {
      const oModel = this.getModelInternal();

      // total count hidden element for ARIA purposes
      this.countBreadcrumbsHiddenElement = this.resultViewsAssembler.assembleCountBreadcrumbsHiddenElement();

      // center area
      this.centerArea = this.resultViewsAssembler.assembleCenterArea(idPrefix);
      this.centerArea.push(this.createNoResultScreen(idPrefix, "default"));

      // main result list
      this.oSearchCountBreadcrumbs = new SearchCountBreadcrumbs(this.getId() + "-SearchCountBreadcrumbs").addStyleClass("sapElisaSearchContextBarContent");
      this.oContextBar = new Bar(this.getId() + "-searchContextBar", {
        contentLeft: this.oSearchCountBreadcrumbs,
        design: {
          parts: [{
            path: "/isFolderMode"
          }],
          formatter: isFolderMode => {
            if (oModel.config.folderMode === true && isFolderMode === true) {
              this.oContextBar.addStyleClass("sapElisaSearchContextBarFolderMode");
            } else {
              this.oContextBar.removeStyleClass("sapElisaSearchContextBarFolderMode");
            }
            return BarDesign.Auto;
          }
        }
      }).addStyleClass("sapElisaSearchContextBar");
      this.oSearchSelectionBar = new SearchSelectionBar(this.getId() + "-searchSelectionBar");
      this.oContextBarContainer = new VerticalLayout("", {
        content: [this.oSearchSelectionBar, this.oContextBar]
      });
      this.oContextBarContainer.addStyleClass("sapElisaSearchContextBarContainer");
      this.oContextBarContainer.addStyleClass("sapUiNoMarginBegin");
      this.oContextBarContainer.addStyleClass("sapUiNoMarginEnd");
      this.oSearchResultContainer = new SearchResultContainer(`${idPrefix}-searchContainerResultsView`);
      this.centerArea.forEach(element => {
        this.oSearchResultContainer.addContent(element);
      });
      this.oSearchResultPanel = new SearchResultPanel(`${idPrefix}-searchResultPanel`, {
        fixContent: [this.oContextBarContainer],
        flexContent: this.oSearchResultContainer
      });

      // container for normal search result list + facets
      const searchLayoutResponsiveSettings = {
        resultPanelContent: this.oSearchResultPanel,
        searchIsBusy: {
          path: "/isBusy"
        },
        busyDelay: {
          path: "/busyDelay"
        },
        // facets
        facetPanelResizable: oModel.config.facetPanelResizable,
        facetPanelWidthInPercent: oModel.config.facetPanelWidthInPercent,
        facetPanelContent: new SearchFacetList(`${this.getId()}-SearchFacetList`),
        showFacets: {
          parts: [{
            path: "/count"
          }, {
            path: "/facetVisibility"
          }, {
            path: "/uiFilter/rootCondition"
          }, {
            path: "/isBusy"
          }, {
            path: "/config"
          }],
          formatter: (count, facetVisibility, filterConditions, isBusy, config) => {
            let facetVisible = true;
            if (!facetVisibility) {
              facetVisible = false;
            }
            const filterExists = filterConditions && filterConditions.conditions && filterConditions.conditions.length > 0;
            if (count === 0 && !config.displayFacetPanelInCaseOfNoResults && !filterExists && !isBusy) {
              facetVisible = false;
            }
            return facetVisible;
          }
        }
      };
      const searchLayout = new SearchLayoutResponsive(`${this.getId()}-searchLayout`, searchLayoutResponsiveSettings).addStyleClass("sapUshellSearchLayout");
      // .addStyleClass("sapUshellSearchLayoutHeightDefault");

      return searchLayout;
    },
    isSearchFieldGroupLocatedInsideSearchComposite: function _isSearchFieldGroupLocatedInsideSearchComposite(currentControlDomRef) {
      // check if the search field group is a child of the SearchCompositeControl
      if (typeof currentControlDomRef === "undefined" || currentControlDomRef === null) {
        // null: before first rendering
        return false;
      } else if (currentControlDomRef.classList) {
        if (currentControlDomRef.classList.contains("sapUshellSearchInputHelpPage")) {
          return true;
        } else if (typeof currentControlDomRef.parentNode !== "undefined") {
          return this.isSearchFieldGroupLocatedInsideSearchComposite(currentControlDomRef.parentNode);
        } else {
          console.error("function: isSearchFieldGroupLocatedInsideSearchComposite: Element has no property 'parentNode' but has property 'classlist'");
          return false;
        }
      } else if (currentControlDomRef.nodeType === Node.DOCUMENT_NODE) {
        // document node (root)
        return false;
      } else {
        console.error("function: isSearchFieldGroupLocatedInsideSearchComposite: Element has no property 'classlist'");
        return false;
      }
    },
    adjustSearchbarCustomGenericButtonWidth: function _adjustSearchbarCustomGenericButtonWidth() {
      if (this.getDomRef() === null) {
        return; // SearchCompositeControl not rendered ---postponed attachment to dom or not at all (unit tests)
      }
      if (this.oFilterButton.getVisible() && this.oFilterButton.getDomRef() === null) {
        return; // not yet rendered
      }
      const searchCompositeControlSizes = window.document.getElementById(this.getDomRef().id).getBoundingClientRect();
      const filterButtonWidth = this.oFilterButton.getVisible() ? window.document.getElementById(this.oFilterButton.getDomRef().id).getBoundingClientRect().width : 0;
      let dataSourceTabBarWidthPx = 0;
      if (this.oDataSourceTabBar.getVisible()) {
        const totalTextLength = this.oDataSourceTabBar.getItems().reduce((accumulator, item) => accumulator + item["getText"]().length, 0);
        if (totalTextLength < 20) {
          // tiny
          this.oDataSourceTabBar.addStyleClass("searchDataSourceTabStripBarTinyItemsTextLength");
          this.oDataSourceTabBar.removeStyleClass("searchDataSourceTabStripBarMediumItemsTextLength");
        } else if (totalTextLength < 45) {
          // medium
          this.oDataSourceTabBar.addStyleClass("searchDataSourceTabStripBarMediumItemsTextLength");
          this.oDataSourceTabBar.removeStyleClass("searchDataSourceTabStripBarTinyItemsTextLength");
        } else {
          // default
          this.oDataSourceTabBar.removeStyleClass("searchDataSourceTabStripBarTinyItemsTextLength");
          this.oDataSourceTabBar.removeStyleClass("searchDataSourceTabStripBarMediumItemsTextLength");
        }
        const dataSourceTabBarDomRef = this.oDataSourceTabBar.getDomRef();
        if (dataSourceTabBarDomRef?.id) {
          dataSourceTabBarWidthPx = window.document.getElementById(dataSourceTabBarDomRef.id).getBoundingClientRect().width;
        } else {
          // data source tab bar not rendered any longer because of i.e. window/container width less than 500px (see media query)
          // nothing to do, default value dataSourceTabBarWidthPx = 0 is OK
        }
      }
      const genericToolbarWidthPx = searchCompositeControlSizes.width - filterButtonWidth - dataSourceTabBarWidthPx;
      const genericToolbarWidthRem = this.convertPixelToRem(genericToolbarWidthPx);
      if (dataSourceTabBarWidthPx === 0) {
        if (genericToolbarWidthRem < 30) {
          this.oGenericItemsToolbar.setWidth(`${genericToolbarWidthRem - 1.1}rem`);
        } else {
          this.oGenericItemsToolbar.setWidth(`${genericToolbarWidthRem - 3.0}rem`);
        }
      } else {
        this.oGenericItemsToolbar.setWidth(`${genericToolbarWidthRem - 2.75}rem`);
      }
    },
    _resizeHandler: function _resizeHandler() {
      // search toolbar ('overflow' of buttons at the right)
      setTimeout(() => this.adjustSearchbarCustomGenericButtonWidth(), 0);
    },
    convertPixelToRem: function _convertPixelToRem(pxValue) {
      return pxValue / parseFloat(getComputedStyle(document.documentElement).fontSize);
    },
    createFooter: function _createFooter(idPrefix) {
      const oModel = this.getModelInternal();

      // create error message popover
      this.oErrorPopover = new MessagePopover(idPrefix + "-" + messagePopoverId++ + "-" + "-searchMessagePopover", {
        placement: PlacementType.Top
      });
      this.oErrorPopover.setModel(oModel);
      oModel.setProperty("/messagePopoverControlId", this.oErrorPopover.getId());
      this.oErrorPopover.bindAggregation("items", {
        path: "/errors",
        factory: () => {
          const item = new MessageItem("", {
            type: "{type}",
            title: "{title}",
            description: "{description}"
          });
          return item;
        }
      });

      // create error message popover button
      const oErrorButton = new Button(this.getId() + "-searchErrorButton", {
        icon: IconPool.getIconURI("alert"),
        text: {
          parts: [{
            path: "/errors/length"
          }],
          formatter: function (length) {
            return length;
          }
        },
        visible: {
          parts: [{
            path: "/errors/length"
          }],
          formatter: length => {
            return length > 0;
          },
          mode: BindingMode.OneWay
        },
        type: ButtonType.Emphasized,
        tooltip: i18n.getText("errorBtn"),
        press: () => {
          if (this.oErrorPopover.isOpen()) {
            this.oErrorPopover.close();
          } else {
            this.oErrorPopover.setVisible(true);
            this.oErrorPopover.openBy(oErrorButton);
          }
        }
      });
      oErrorButton.addStyleClass("sapUiSmallMarginBegin");
      oErrorButton["addDelegate"]({
        onAfterRendering: () => {
          const oModel = this.getModelInternal();
          if (!oModel.getProperty("/isErrorPopovered")) {
            // automatically open the error popup (only after first rendering of button)
            oErrorButton.firePress();
            oModel.setProperty("/isErrorPopovered", true);
          }
        }
      });
      oErrorButton.setLayoutData(new OverflowToolbarLayoutData("", {
        priority: OverflowToolbarPriority.NeverOverflow
      }));

      // create footer bar
      const footer = new OverflowToolbar(this.getId() + "-searchFooter", {
        content: [oErrorButton]
      });
      footer.addStyleClass("sapUiTinyMarginTop");
      return footer;
    },
    chooseNoResultScreen: function _chooseNoResultScreen() {
      // update "no result screen"
      const oModel = this.getModelInternal();
      let noResultScreen;
      if (typeof oModel?.config?.getCustomNoResultScreen === "function") {
        try {
          const customNoResultScreen = oModel.config.getCustomNoResultScreen(oModel.getDataSource(), oModel);
          if (customNoResultScreen && customNoResultScreen.isDestroyed()) {
            const oError = new errors.ConfigurationExitError("getCustomNoResultScreen", oModel.config.applicationComponent, new Error(`The 'no results screen' instance provided by exit 'getCustomNoResultScreen' is already destroyed.\nWe have switched to standard 'no results screen'.\nFor stability reasons, we are destroying old instances with each roundtrip unless custom 'no results screen' instance stays the same.\nThis is needed to keep a cleaned-up dom with no ghost instances (i.e. still described to events).`));
            this.errorHandler.onError(oError);
            // do not throw oError, use standard 'no results screen'
            noResultScreen = this.oSearchResultContainer.getNoResultScreen();
          }
          // if needed, destroy 'no results screen' instance
          const currentNoResultsPage = this.oSearchResultContainer.getNoResultScreen();
          if (currentNoResultsPage !== this.noResultScreenFolder && currentNoResultsPage !== this.noResultScreen && currentNoResultsPage !== customNoResultScreen) {
            if (currentNoResultsPage instanceof Control) {
              currentNoResultsPage.destroy();
            }
          }
          noResultScreen = customNoResultScreen;
        } catch (err) {
          const oError = new errors.ConfigurationExitError("getCustomNoResultScreen", oModel.config.applicationComponent, err);
          this.errorHandler.onError(oError);
          // do not throw oError, use standard 'no results screen'
          noResultScreen = this.oSearchResultContainer.getNoResultScreen();
        }
      }
      if (!noResultScreen) {
        if (oModel.getProperty("/isFolderMode")) {
          if (!this.noResultScreenFolder) {
            this.noResultScreenFolder = this.createNoResultScreen(this.getId(), "folder");
          }
          noResultScreen = this.noResultScreenFolder;
        } else {
          noResultScreen = this.noResultScreen;
        }
      }
      this.oSearchResultContainer.setNoResultScreen(noResultScreen);
    },
    openSortDialog: function _openSortDialog() {
      // issue: selection information is lost by clicking cancel, multiple reset selection in UI5
      // workaround: rebind sort items by opening dialog
      this.sortDialog.unbindAggregation("sortItems", false);
      this.sortDialog.bindAggregation("sortItems", {
        path: "/sortableAttributes",
        factory: () => {
          return new ViewSettingsItem("", {
            key: {
              path: "key"
            },
            text: {
              path: "name"
            },
            selected: {
              path: "selected"
            }
          });
        }
      });
      this.sortDialog.open();
    },
    openShowMoreDialog: function _openShowMoreDialog(dimension) {
      openShowMoreDialog({
        searchModel: this.getModelInternal(),
        dimension: dimension,
        selectedTabBarIndex: 0,
        tabBarItems: undefined,
        sourceControl: this
      });
    },
    // #region public API
    /**
     * Parse the browser URL, update properties and trigger search call (if needed)
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.122.0
     * @returns this
     */
    parseURL: function _parseURL() {
      this.getModelInternal().parseURL();
      return this;
    },
    /**
     * Get the public part of the search model (JSON)
     * In general the model is read-only but a few properties can be modified.
     * Modifiable properties (i.e. consumtion via two-way binding):
     *  - 'results[i].data.selected'
     * For binding use model 'publicSearchModel' (i.e. "publicSearchModel>results/...")
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.122.0
     * @returns {object} A JSON model containing public artefacts of internal search model
     */
    getPublicSearchModel: function _getPublicSearchModel() {
      return this.getModelInternal("publicSearchModel");
    },
    /**
     * Get the internal search model (JSON)
     * In general the internal search model shall not be accessed by consumers of SearchCompositeControl
     * The preferred consumption of search model data is to use public search model 'publicSearchModel' (i.e. "publicSearchModel>results/..."), also see function getPublicSearchModel
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.122.0
     * @returns {object} A JSON model containing public artefacts of internal search model
     */
    getModelInternal: function _getModelInternal(sName) {
      return VerticalLayout.prototype.getModel.call(this, sName);
    },
    /**
     * Gets the set of result items
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.114.0
     * @returns {object} The result set containg 'items'.
     */
    getSearchResultSet: function _getSearchResultSet() {
      // search never finished (search running, searchOnStart = false or no sinaConfiguration.provider n.a.)
      // -> return empty result set
      let resultSet;
      const searchModel = this.getModelInternal();
      if (typeof searchModel["resultSet"] === "undefined" || searchModel["resultSet"] === null) {
        resultSet = {
          items: []
        };
      } else {
        resultSet = this.getModelInternal("publicSearchModel").getProperty("/results");
      }
      return resultSet;
    },
    /**
     * Gets search result view types
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.98.0
     * @returns {string[]} The array of active search result view types.
     */
    getResultViewTypes: function _getResultViewTypes() {
      const oModel = this.getModelInternal();
      return oModel?.getResultViewTypes();
      // if search model hasn't been instantiated yet (see constructor of SearchCompositeControl)
      // -> do nothing!
    },
    /**
     * Sets search result view types
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.98.0
     * @param {string[]} resultViewTypes The array of active search result view types.
     * @example
     * setResultViewTypes(["searchResultList", "searchResultTable"])
     * @returns this
     */
    setResultViewTypes: function _setResultViewTypes(resultViewTypes) {
      const oModel = this.getModelInternal();
      if (typeof resultViewTypes === "undefined") {
        throw Error("Search Result View Type Error In SearchCompositeControl:\n\n" + "The function parameter 'resultViewTypes' is mandatory.\n" + 'Valid example: setResultViewTypes(["searchResultList"])');
      } else if (typeof oModel === "undefined" || typeof oModel.config === "undefined") {
        // if search model hasn't been instantiated yet (see constructor of SearchCompositeControl)
        // -> do nothing!
        return this;
      }
      this.setResultViewSettings({
        resultViewTypes: resultViewTypes,
        resultViewType: oModel.getResultViewType()
      });
      return this;
    },
    /**
     * Gets search result view type
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.98.0
     * @returns {"appSearchResult" | "searchResultList" | "searchResultTable" | "searchResultGrid" | "" | string} The active search result view type.
     */
    getResultViewType: function _getResultViewType() {
      const oModel = this.getModelInternal();
      return oModel?.getResultViewType();
    },
    /**
     * Sets search result view type
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.98.0
     * @param {"appSearchResult" | "searchResultList" | "searchResultTable" | "searchResultGrid"} resultViewType The active search result view type.
     * @example
     * setResultViewType("searchResultList")
     * @returns this
     */
    setResultViewType: function _setResultViewType(resultViewType) {
      const oModel = this.getModelInternal();
      if (typeof resultViewType === "undefined") {
        throw Error("Search Result View Type Error In SearchCompositeControl:\n\n" + "The function parameter 'resultlViewType' is mandatory.\n" + 'Valid example: setResultViewType("searchResultList")');
      } else if (typeof oModel === "undefined" || typeof oModel.config === "undefined") {
        // if search model hasn't been instantiated yet (see constructor of SearchCompositeControl)
        // -> do nothing!
        return this;
      }
      this.setResultViewSettings({
        resultViewTypes: oModel.getResultViewTypes(),
        resultViewType: resultViewType
      });
      return this;
      // if search model hasn't been instantiated yet (see constructor of SearchCompositeControl)
      // -> do nothing!
    },
    /**
     * Gets search result view type settings
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.100.0
     * @returns {object} The object of resultViewTypes and resultViewType.
     */
    getResultViewSettings: function _getResultViewSettings() {
      const oModel = this.getModelInternal();
      if (oModel) {
        return {
          resultViewTypes: oModel.getResultViewTypes(),
          resultViewType: oModel.getResultViewType()
        };
      }
      // if search model hasn't been instantiated yet (see constructor of SearchCompositeControl)
      // -> do nothing!
    },
    /**
     * Sets search result view type settings
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.100.0
     * @param {object} settings The object of resultViewTypes and resultViewType.
     * @example
     * setResultViewSettings({resultViewTypes: ["searchResultList", "searchResultTable"], resultViewType: "searchResultList"})
     * @returns this
     */
    setResultViewSettings: function _setResultViewSettings(resultlViewSettings) {
      const oModel = this.getModelInternal();
      if (typeof resultlViewSettings === "undefined") {
        throw Error("Search Result View Type Error In SearchCompositeControl:\n\n" + "The function parameter 'resultlViewSettings' is mandatory.\n" + 'Valid example: setResultViewSettings({resultViewTypes: ["searchResultList", "searchResultTable"], resultViewType: "searchResultList"})');
      } else if (typeof oModel === "undefined" || typeof oModel.config === "undefined") {
        // if search model hasn't been instantiated yet (see constructor of SearchCompositeControl) -> do nothing!
        return this;
      }
      if (typeof resultlViewSettings.resultViewTypes === "undefined" || typeof resultlViewSettings.resultViewType === "undefined") {
        throw Error("Search Result View Type Error In SearchCompositeControl:\n\n" + "One of properties of function parameter is undefined.\n" + 'Valid example: setResultViewSettings({resultViewTypes: ["searchResultList", "searchResultTable"], resultViewType: "searchResultList"})');
      }
      oModel.calculateResultViewSwitchVisibility({
        resultViewTypes: resultlViewSettings.resultViewTypes,
        resultViewType: resultlViewSettings.resultViewType
      });
      this.showMoreFooter.setVisible(this.isShowMoreFooterVisible());
      oModel.enableOrDisableMultiSelection();
      this.search(); // search will not be retriggered if model /isQueryInvalidated
      return this;
    },
    getControllerName: function _getControllerName() {
      return "sap.esh.search.ui.container.Search";
    },
    /**
     * Gets the additional CSS class which was applied to this control
     * @public
     * @since 1.98.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns {string} The additional CSS class which was applied to this control
     */
    getCssClass: function _getCssClass() {
      return this._cssClass;
    },
    /**
     * Adds an additional CSS class to this control
     * @public
     * @since 1.98.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {string} cssClass The new CSS class
     * @returns this
     */
    setCssClass: function _setCssClass(cssClass) {
      if (cssClass && !this.hasStyleClass(cssClass)) {
        this._cssClass = cssClass;
        this.addStyleClass(cssClass);
      }
      return this;
    },
    /**
     * Gets the id of the active data source which is selected in the data source drop down list.
     * @public
     * @this sap.esh.search.ui.SearchCompositeControl
     * @since 1.98.0
     * @returns {string} The id of currently selected data source.
     */
    getDataSource: function _getDataSource() {
      if (typeof this.getModelInternal() !== "undefined") {
        const oModel = this.getModelInternal();
        const ds = oModel.getDataSource();
        return ds.id;
      }
    },
    /**
     * Sets the id of the active data source which is selected in the data source drop down list.
     * @public
     * @since 1.98.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {string} dataSource The id of the new to be selected data source
     * @param {boolean} [fireQuery=true] If true, fires a search query right away. Set to false for batch updates.
     * @param {boolean} [resetTop=true] If true, top will be reset to the default number of visible results.
     */
    setDataSource: function _setDataSource(dataSourceId, fireQuery, resetTop) {
      if (typeof this.getModelInternal() !== "undefined") {
        const oModel = this.getModelInternal();
        oModel.setDataSourceById(dataSourceId, fireQuery, resetTop);
      }
      return this;
    },
    /**
     * Resets the active data source which is selected in the data source drop down list to its default (see 'defaultDataSource'/'exclusiveDataSource').
     * @public
     * @since 1.124.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {boolean} [fireQuery=true] If true, fires a search query right away. Set to 'false' for batch updates.
     */
    resetDataSource: async function _resetDataSource(fireQuery = true) {
      if (typeof this.getModelInternal() !== "undefined") {
        const oModel = this.getModelInternal();
        return oModel.resetDataSource(fireQuery); // ToDo: Make 'await' nescessary
      }
      return this;
    },
    /**
     * Invalidate the search cache and optionally fire a new search.
     * Also see functions 'retriggerSearch' and 'invalidateSearchResultCache'.
     * @public
     * @since 1.124.0
     * @param {boolean} [invalidateQuery=false] Indicates wether the search query should be resetted. Set to 'true' to reset the query.
     * @param {boolean} [fireQuery=true] Indicates wether the search query should be sent to the search service or not. Set to 'false', to prevent auto-update of search results.
     */
    search: async function _search(invalidateQuery = false, fireQuery = true) {
      const internalSearchModel = this.getModelInternal();
      if (invalidateQuery) {
        internalSearchModel.invalidateQuery();
      }
      if (fireQuery) {
        return internalSearchModel.fireSearchQuery();
      }
    },
    /**
     * Resets the UI / search results (reset search query and fire a new search).
     * @public
     * @since 1.125.0
     */
    resetSearch: async function _resetSearch() {
      const internalSearchModel = this.getModelInternal();
      internalSearchModel.resetQuery();
      this.retriggerSearch();
    },
    /**
     * Fire a new search (includes invalidation of search cache).
     * To invalidate the search cache w/o triggering a new search, use function 'invalidateSearchResultCache' instead.
     * @public
     * @since 1.124.0
     */
    retriggerSearch: async function _retriggerSearch() {
      this.search(true, true); // invalidateQuery: true, fireQuery: true
    },
    /**
     * Invalidate the search cache.
     * To trigger a search in addition, use function 'retriggerSearch' instead.
     * @public
     * @since 1.124.0
     */
    invalidateSearchResultCache: async function _invalidateSearchResultCache() {
      this.search(true, false); // invalidateQuery: true, fireQuery: false
    },
    /**
     * Gets the search term which is displayed in the search box.
     * @public
     * @since 1.98.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns {string} The search term
     */
    getSearchTerm: function _getSearchTerm() {
      if (typeof this.getModelInternal() !== "undefined") {
        const oModel = this.getModelInternal();
        return oModel.getSearchBoxTerm();
      }
      return SearchCompositeControl.getMetadata().getPropertyDefaults()["searchTerm"];
    },
    /**
     * Sets the search term which is displayed in the search box.
     * @public
     * @since 1.98.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {string} searchTerm Sets the new search term
     * @param {boolean} [fireQuery=true] Indicates wether the search query should be sent to the search service or not.
     * Not sending it could be useful for batch updates, for example if the data source shall also be changed.
     * This way, the search service will not have to deal with outdated queries which will improve overall performance.
     * @returns this
     */
    setSearchTerm: function _setSearchTerm(searchTerm, fireQuery) {
      if (typeof this.getModelInternal() !== "undefined") {
        const oModel = this.getModelInternal();
        oModel.setSearchBoxTerm(searchTerm, fireQuery);
      }
      return this;
    },
    /**
     * Gets the settings.
     * @public
     * @since 1.125.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns {object} The settings (search configuration)
     */
    getConfig: function _getConfig() {
      if (this.getModelInternal()) {
        const oModel = this.getModelInternal();
        return oModel.config;
      }
      return;
    },
    /**
     * Gets the filter containing all attribute filters currently set and functions to manipulate the filter.
     * @public
     * @since 1.124.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns {object} The filter
     */
    getFilter: function _getFilter() {
      if (this.getModelInternal()) {
        const oModel = this.getModelInternal();
        return oModel.getProperty("/uiFilter");
      }
      return;
    },
    /**
     * Gets the filter root condition which contains all attribute filters currently set.
     * @public
     * @since 1.98.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns {object} The filter root condition
     */
    getFilterRootCondition: function _getFilterRootCondition() {
      if (this.getModelInternal()) {
        const oModel = this.getModelInternal();
        return oModel.getFilterRootCondition();
      }
      return SearchCompositeControl.getMetadata().getPropertyDefaults()["filterRootCondition"];
    },
    /**
     * Update hierarchy facet
     * Updates the one and only (static) hierarchy facet (tree control on facet panel).
     * If no hierarchy facet exists, nothing will happen.
     * @public
     * @since 1.126.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns void
     */
    updateStaticHierarchyFacet: async function _updateStaticHierarchyFacet() {
      const oModel = this.getModelInternal();
      const dataSourceId = this.getDataSource();
      const hierarchyAttributeId = oModel.sinaNext.getDataSource(dataSourceId).getStaticHierarchyAttributeMetadata().id;
      if (hierarchyAttributeId) {
        const staticHierarchyFacet = oModel.getProperty("/facets").filter(item => item.attributeId === hierarchyAttributeId);
        if (staticHierarchyFacet.length > 0) {
          await staticHierarchyFacet[0]?.updateTree();
        }
      }
    },
    /**
     * Sets the filter root condition for the search query.
     *
     * The filter root condition can contain multiple attribute filter which are then combined using AND or OR operators.
     * For a more comprehensive explanation and examples, see the description of the filterRootCondition property of this control.
     *
     * @public
     * @since 1.98.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {object} filterRootCondition Sets the new filter root condition.
     * @param {boolean} [fireQuery=true] Indicates wether the search query should be sent to the search service or not.
     * Not sending it could be useful for batch updates, for example if the data source shall also be changed.
     * This way, the search service will not have to deal with outdated queries which will improve overall performance.
     * @returns this
     */
    setFilterRootCondition: function _setFilterRootCondition(filterRootCondition, fireQuery) {
      if (this.getModelInternal()) {
        const oModel = this.getModelInternal();
        oModel.setFilterRootCondition(filterRootCondition, fireQuery);
      }
      return this;
    },
    /**
     * Assembles a search URL.
     *
     * Use this method for the creation of links to the search UI.
     *
     * @public
     * @since 1.103.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {number} top Number of search results to be displayed.
     * @param {object} filter A sina filter object storing the searchterm, datasource  and the filter conditions.
     * @param {boolean} encodeFilter A boolean whether to encode the URL parameters or not.
     * @returns {string} search URL.
     * @deprecated Use createSearchNavigationTarget
     */
    renderSearchUrlFromParameters: function _renderSearchUrlFromParameters(top, filter, encodeFilter) {
      const model = this.getModelInternal();
      if (!model) {
        throw new ProgramError(null, "cannot construct URL because model is undefined");
      }
      return model.createSearchNavigationTarget({
        top: top,
        filter: filter,
        encodeFilter: encodeFilter,
        updateUrl: true // --> always create navigation target with url (overwrites config.updateUrl)
      }).targetUrl;
    },
    /**
     * Create a NavigationTarget instance for filtering/search.
     *
     * Use this method for the creation a NavigationTarget instance with filter and label.
     *
     * @public
     * @since 1.114.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {object} filter A sina filter object storing the searchterm, datasource  and the filter conditions.
     * @param {string} label The label of the navigation target.
     * @returns {object} The NavigationTarget instance. If the configuration parameter updateUrl is true, it contains targetUrl, otherwise it contains targetFunction.
     */
    createSearchNavigationTarget: function _createSearchNavigationTarget(filter, label) {
      const model = this.getModelInternal();
      return model.createSearchNavigationTarget(filter, label);
    },
    /**
     * Create a NavigationTarget instance for hierarchy.
     *
     * Use this method for the creation a NavigationTarget instance by hierarchical node id value and its label.
     *
     * @public
     * @since 1.114.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {object} hierarchyNodeId The hiearchical node id value of the giving datasource or its helper hierarchical datasource.
     * @param {string} hierarchyNodeLabel The label of the hiearchical node id.
     * @param {object} dataSource The datasource instance.
     * @param {string} navigationTargetLabel The label of the NavigatonTarget instance.
     * @returns {object} The NavigationTarget instance. If the configuration parameter updateUrl is true, it contains targetUrl, otherwise it contains targetFunction.
     */
    createStaticHierarchySearchNavigationTarget: function _createStaticHierarchySearchNavigationTarget(
    // Goto Folder
    hierarchyNodeId, hierarchyNodeLabel, dataSource, navigationTargetLabel) {
      const model = this.getModelInternal();
      return model.sinaNext.createStaticHierarchySearchNavigationTarget(hierarchyNodeId, hierarchyNodeLabel, dataSource, navigationTargetLabel);
    },
    /**
     * Adds a callback function which is called whenever there is a user triggered event.
     *
     * @public
     * @since 1.120.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns void
     * @callback eventConsumer This function will be called when the user triggered an UI event. As arguments this
     * function will receive the UI event along with details of the event.
     * @example A simple event consumer which could be passed to the addEventConsumer function
     * const logEventConsumer = {
     *     label: "my log event consumer",
     *     logEvent: (event) => {
     *         console.log("user event happened: " + event.type)
     *     }
     * }
     * mySearchCompositeControl.addEventConsumer(logEventConsumer);
     */
    addEventConsumer: function _addEventConsumer(eventConsumer) {
      const model = this.getModelInternal();
      model?.eventLogger?.addConsumer(eventConsumer);
    },
    /**
     * Returns all event consumers.
     *
     * @public
     * @since 1.120.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns {array} List containing all event consumers.
     */
    getEventConsumers: function _getEventConsumers() {
      const model = this.getModelInternal();
      return model?.eventLogger?.consumers;
    },
    /**
     * Sets a list of event consumers.
     *
     * @public
     * @since 1.120.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @param {array} eventConsumers List containing all event consumers.
     * @returns {SearchCompositeControl}
     */
    setEventConsumers: function _setEventConsumers(eventConsumers) {
      const model = this.getModelInternal();
      model?.eventLogger?.setConsumers(eventConsumers);
      return this;
    },
    /**
     * close old visible dialogs after new search starts
     *
     * List of ui elements: Result Sort Dialog, Result Table Personalization Dialog, Result Export Limitation Dialog, Result Share Action Sheet, Facet Show More Dialog, Result Save/Share Action Sheet.
     *
     * @public
     * @since 1.130.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns void
     */
    closePopovers: function _closePopovers() {
      // Facet Show More Dialog
      let element = document.getElementsByClassName("sapUshellSearchFacetDialog")[0];
      if (element) {
        const ui5Dialog = Element.getElementById(element.id);
        const buttons = ui5Dialog?.getButtons();
        for (const button of buttons) {
          if (button?.getType() === ButtonType.Default) {
            button.firePress();
            break;
          }
        }
      }

      // Result Sort Dialog
      element = document.getElementsByClassName("sapUshellSearchResultSortDialog")[0];
      if (element) {
        const ui5Dialog = Element.getElementById(element.id);
        const buttons = ui5Dialog?.getButtons();
        for (const button of buttons) {
          if (button?.getId()?.endsWith("cancelbutton")) {
            button.firePress();
            break;
          }
        }
      }

      // Result Table Personalization Dialog
      element = document.getElementsByClassName("sapUshellSearchResultTablePersonalizationDialog")[0] || document.getElementsByClassName("sapMP13nPopup")[0];
      if (element) {
        const ui5Dialog = Element.getElementById(element.id);
        const buttons = ui5Dialog?.getButtons();
        for (const button of buttons) {
          if (button?.getId()?.endsWith("cancelBtn")) {
            button.firePress();
            break;
          }
        }
      }

      // Result Export Limitation Dialog
      element = document.getElementsByClassName("sapUshellSearchResultExportDialog")[0];
      if (element) {
        const ui5Dialog = Element.getElementById(element.id);
        ui5Dialog?.close();
      }

      // Result Save/Share Action Sheet
      element = document.getElementsByClassName("sapUshellSearchResultShareActionSheet")[0];
      if (element) {
        const ui5ActionSheet = Element.getElementById(element.id);
        ui5ActionSheet?.close();
      }

      // Related Apps Action Sheet in Result Table closed after new search starts
      // Related Apps Action Sheet in Result List in narrow window closed after new search starts
      // Do nothing
    },
    /**
     * Get the status of initialization. In unsuccessful case, the corresponding error instance is returned either.
     *
     * @public
     * @since 1.132.0
     * @this sap.esh.search.ui.SearchCompositeControl
     * @returns {object} Promise<{success: boolean;error?: Error;}> If success is true, the initialization was successful. If success is false, the error property contains the error instance for further handling.
     *
     * @example Check the initialization status and handle potential ESHNoBusinessObjectDatasourceError
     * const searchCompControl = new SearchCompositeControl(sId, searchConfig);
     * const status = await searchCompControl.getInitializationStatus();
     * if (
     *       status &&
     *       status.success === false &&
     *       status.error instanceof NoValidEnterpriseSearchAPIConfigurationFoundError &&
     *       status.error.previous instanceof ESHNoBusinessObjectDatasourceError
     * ) {
     *       console.error("Error creating SearchCompositeControl: ", status.error.previous.message);
     * }
     */
    getInitializationStatus: function _getInitializationStatus() {
      return this.getModelInternal().getInitializationStatus();
    }
  });
  SearchCompositeControl.eshCompCounter = 0;
  SearchCompositeControl.getUI5ControlSettings = function getUI5ControlSettings(settings) {
    const settingsKnownToUI5 = {}; // this is a subset of settings which contain only parameters and events (aggregations not relevant, there is only 'content') which are also in this controls metadata
    // properties
    const metadataProperties = SearchCompositeControl.getMetadata().getProperties();
    for (const metadataProperty in metadataProperties) {
      if (typeof settings[metadataProperty] === "undefined") {
        continue;
      }
      settingsKnownToUI5[metadataProperty] = settings[metadataProperty];
    }
    // events (added 1.121)
    const metadataEvents = SearchCompositeControl.getMetadata().getEvents();
    for (const metadataEvent in metadataEvents) {
      if (typeof settings[metadataEvent] === "undefined") {
        continue;
      }
      settingsKnownToUI5[metadataEvent] = settings[metadataEvent];
    }
    // aggregations
    // -> not relevant, we only have aggregation 'content' and this shall not be taken over
    return settingsKnownToUI5;
  };
  SearchCompositeControl.unifyInputParameters = function unifyInputParameters(sId, settings) {
    // shift arguments in case sId was missing, but mSettings was given
    if (typeof sId !== "string" && sId !== undefined && settings === undefined) {
      settings = sId;
      sId = settings && settings.id;
    } else if (typeof settings === "undefined") {
      settings = {};
    }

    // add sId to mSettings
    if (typeof sId === "string" && sId.length > 0) {
      settings.id = sId;
    }

    // no id -> create one
    if (!sId || sId.length === 0) {
      sId = "eshComp" + "GenId_" + SearchCompositeControl.eshCompCounter++;
      settings.id = sId;
    }

    // check sId === mSettings.id
    if (typeof sId === "string" && sId.length > 0 && typeof settings.id !== "undefined") {
      if (sId !== settings.id) {
        throw new Error("Constructor of component 'sap.esh.search.ui.SearchCompositeControl' has failed\n\n" + "sId and mSettings.id are not the same. It is sufficient to set either 'id' (sId) or 'settings.id' (mSettings.id).");
      }
    }
    return {
      sId,
      settings
    };
  };
  let messagePopoverId = 1;
  return SearchCompositeControl;
});
})();