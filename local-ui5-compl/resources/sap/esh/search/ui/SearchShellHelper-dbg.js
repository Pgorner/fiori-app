/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./i18n", "./controls/searchfieldgroup/SearchFieldGroup", "sap/esh/search/ui/SearchHelper", "sap/esh/search/ui/SearchModel", "./SearchFieldStateManager", "./SearchShellHelperHorizonTheme", "./UIEvents", "sap/ui/core/Element", "sap/ui/core/EventBus", "sap/ui/model/resource/ResourceModel"], function (__i18n, __SearchFieldGroup, SearchHelper, SearchModel, __SearchFieldStateManager, __SearchShellHelperHorizonTheme, __UIEvents, Element, EventBus, ResourceModel) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  // logging
  // autofocus collapse
  // test:
  // page reload
  // navigation facet sheet and back
  // all occurences of expand collapse
  const i18n = _interopRequireDefault(__i18n);
  const SearchFieldGroup = _interopRequireDefault(__SearchFieldGroup);
  const SearchFieldStateManager = _interopRequireDefault(__SearchFieldStateManager);
  const SearchShellHelperHorizonTheme = _interopRequireDefault(__SearchShellHelperHorizonTheme);
  const UIEvents = _interopRequireDefault(__UIEvents);
  class SearchShellHelper {
    static isInitialized;
    static SearchModel;
    static sSearchOverlayCSS;
    static oModel;
    static oShellHeader;
    static oSearchFieldGroup;
    static oSearchSelect;
    static oSearchInput;
    static oSearchButton;
    static oSearchCancelButton;
    static focusInputFieldTimeout;
    static isFocusHandlerActive;
    static searchFieldStateManager;
    constructor() {
      throw new Error("Cannot instantiate static class 'SearchShellHelper'");
    }
    static init() {
      // check already initialized
      if (this.isInitialized) {
        return;
      }
      this.isInitialized = true;

      // pre-fetch all app tiles
      window.sap.ushell.Container.getServiceAsync("Search").then(service => {
        service.prefetch();
      });

      // get search model
      this.oModel = SearchModel.getModelSingleton({}, "flp");

      // create search field group control
      this.oSearchFieldGroup = new SearchFieldGroup("searchFieldInShell");
      this.oSearchFieldGroup.setModel(this.oModel);
      this.oSearchFieldGroup.setModel(new ResourceModel({
        bundle: i18n
      }), "i18n");

      // initialize search input
      this.oSearchInput = this.oSearchFieldGroup.input;
      this.oSearchInput.setMaxSuggestionWidth("30rem");
      this.oSearchInput.setValue(this.oModel.getSearchBoxTerm());

      // initialize search select
      this.oSearchSelect = this.oSearchFieldGroup.select;
      this.oSearchSelect.setTooltip(i18n.getText("searchInTooltip"));
      this.oSearchSelect.addEventDelegate({
        onAfterRendering: () => {
          jQuery('[id$="searchFieldInShell-select-icon"]').attr("title", i18n.getText("searchIn"));
        }
      }, this.oSearchSelect);
      this.oSearchSelect.setTooltip(i18n.getText("searchIn"));
      this.oSearchSelect.attachChange(() => {
        this.searchFieldStateManager.focusInputField({
          selectContent: true
        });
      });

      // initialize search button
      this.oSearchButton = this.oSearchFieldGroup.button;
      this.oSearchButton.attachPress(() => {
        this.handleClickSearchButton();
      });

      // initialize cancel button
      this.oSearchCancelButton = this.oSearchFieldGroup.cancelButton;
      this.oSearchCancelButton.attachPress(() => {
        this.collapseSearch(true);
      });
      this.oSearchFieldGroup.setCancelButtonActive(false);

      // add search field to shell header
      this.oShellHeader = Element.getElementById("shell-header");
      this.oShellHeader.setSearch(this.oSearchFieldGroup);

      // create search field state manager
      this.searchFieldStateManager = new SearchFieldStateManager({
        shellHeader: this.oShellHeader,
        searchInput: this.oSearchInput,
        model: this.oModel,
        cancelButton: this.oSearchCancelButton,
        isNoResultsScreen: this.isNoSearchResultsScreen.bind(this)
      });

      // esc key handler
      jQuery(document).on("keydown", this.fnEscCallBack.bind(this));

      // register for global events
      EventBus.getInstance().subscribe("shell", "searchCompLoaded", this.onSearchComponentLoaded.bind(this), {});
      this.oModel.subscribe(UIEvents.ESHSearchFinished, this.onAllSearchFinished.bind(this), {});
      Element.getElementById("viewPortContainer").attachAfterNavigate(this.onAfterNavigate.bind(this), {}); // ToDo 'any' -> sap.m.NavContainer
      EventBus.getInstance().subscribe("sap.ushell", "appComponentLoaded", () => {
        if (this?.oModel?.focusHandler && SearchHelper.isSearchAppActive()) {
          this.oModel.focusHandler.setFocus();
        }
      });
      this.oShellHeader.attachSearchSizeChanged(this.sizeSearchFieldChanged.bind(this));
    }
    static fnEscCallBack(oEvent) {
      // check for ESC
      if (oEvent.keyCode !== 27) {
        return;
      }
      // check that search field is focused
      if (!this.oSearchInput.getDomRef().contains(document.activeElement)) {
        return;
      }
      // check that search app is active
      if (SearchHelper.isSearchAppActive()) {
        return;
      }
      oEvent.preventDefault(); // browser would delete value
      if (this.oSearchInput.getValue() === "") {
        this.collapseSearch(true);
      } else if (this.oSearchInput.getValue() === " ") {
        this.oSearchInput.setValue(""); // ??
      }
    }
    static sizeSearchFieldChanged(event) {
      const size = event.getParameters()["remSize"];
      // display mode of connector dropdown
      let limit = 24;
      if (size <= limit) {
        this.oSearchSelect.setDisplayMode("icon");
      } else {
        this.oSearchSelect.setDisplayMode("default");
      }
      // visibility of search button
      limit = 9;
      if (size < limit) {
        this.oSearchButton.setVisible(false);
      } else {
        this.oSearchButton.setVisible(true);
      }
      // cancel button
      if (event.getParameter("isFullWidth")) {
        this.oSearchFieldGroup.setCancelButtonActive(true);
        this.oSearchFieldGroup.addStyleClass("sapUshellSearchInputFullWidth");
      } else {
        this.oSearchFieldGroup.setCancelButtonActive(false);
        this.oSearchFieldGroup.removeStyleClass("sapUshellSearchInputFullWidth");
      }
    }
    static sizeChanged(params) {
      switch (params.name) {
        case "Phone":
          this.oSearchFieldGroup.setCancelButtonActive(true);
          break;
        case "Tablet":
          this.oSearchFieldGroup.setCancelButtonActive(false);
          break;
        case "Desktop":
          this.oSearchFieldGroup.setCancelButtonActive(false);
          break;
        default:
          break;
      }
    }
    static expandSearch(focusSearchField) {
      this.searchFieldStateManager.expandSearch(focusSearchField);
    }
    static collapseSearch(focusMagnifier) {
      this.searchFieldStateManager.collapseSearch(focusMagnifier);
    }
    static isNoSearchResultsScreen() {
      return SearchHelper.isSearchAppActive() && this.oModel.getProperty("/boCount") === 0 && this.oModel.getProperty("/appCount") === 0;
    }
    static onShellSearchButtonPressed() {
      SearchShellHelper.init();
      if (!SearchHelper.isSearchAppActive() && this.oShellHeader.getSearchState() === "COL") {
        this.resetModel();
      }
      this.expandSearch(true);
    }
    static handleClickSearchButton() {
      if (this.oSearchInput.getValue() === "" && this.oModel.getDataSource() === this.oModel.getDefaultDataSource()) {
        if (SearchShellHelperHorizonTheme.isSearchFieldExpandedByDefault()) {
          // screen size XL: focus input field
          this.searchFieldStateManager.focusInputField();
        } else {
          // small screen size: collapse input field + focus shell magnifier
          this.collapseSearch(true);
          window.setTimeout(() => {
            Element.getElementById("sf").focus();
          }, 1000);
        }
      }
    }
    static getSearchInput() {
      return this.oSearchFieldGroup ? this.oSearchFieldGroup.input : null;
    }
    static onAfterNavigate(oEvent) {
      // navigation tries to restore the focus -> but application knows better how to set the focus
      // -> after navigation call focus setter of search application
      if (oEvent.getParameter("toId") !== "shellPage-Action-search" && oEvent.getParameter("toId") !== "applicationShellPage-Action-search" && oEvent.getParameter("toId") !== "application-Action-search") {
        return;
      }
      this.oModel.focusHandler.setFocus();
      this.oModel.notifySubscribers(UIEvents.ESHSearchLayoutChanged);
    }
    static onAllSearchFinished() {
      this.oSearchInput.setValue(this.oModel.getSearchBoxTerm());
    }
    static onSearchComponentLoaded() {
      // triggered by shell after search component is loaded
      // (search field is created in search component)
      if (!SearchHelper.isSearchAppActive()) {
        return;
      }
      this.expandSearch();
    }
    static resetModel() {
      this.oSearchInput.setValue("");
      this.oModel.resetQuery();
    }

    // ====================================================================
    // from here:
    // compatability functions for outdated ushell versions
    // to be removed
    // ====================================================================

    static setSearchState(state) {
      switch (state) {
        case "EXP":
        case "EXP_S":
          this.searchFieldStateManager.expandSearch();
          break;
        case "COL":
          this.searchFieldStateManager.collapseSearch();
          break;
      }
    }
    static setSearchStateSync(state) {
      this.setSearchState(state);
    }
    static isDefaultOpen;
    static getDefaultOpen() {
      return this.isDefaultOpen;
    }
    static setDefaultOpen(isDefaultOpen) {
      this.isDefaultOpen = isDefaultOpen;
    }
  }
  return SearchShellHelper;
});
})();