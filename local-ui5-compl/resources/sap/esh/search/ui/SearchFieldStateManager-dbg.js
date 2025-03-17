/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./SearchShellHelperHorizonTheme", "sap/ui/core/Element"], function (__SearchShellHelperHorizonTheme, Element) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const SearchShellHelperHorizonTheme = _interopRequireDefault(__SearchShellHelperHorizonTheme);
  // import Rendering from "sap/ui/core/Rendering"; // no yet available in UI5 2.0

  class State {
    isSearchInputFocused;
    isNoResultsScreen;
    isSearchFieldExpandedByDefault;
    constructor(props) {
      this.isSearchInputFocused = props.isSearchInputFocused;
      this.isNoResultsScreen = props.isNoResultsScreen;
      this.isSearchFieldExpandedByDefault = props.isSearchFieldExpandedByDefault;
    }
    equals(other) {
      return this.isSearchInputFocused === other.isSearchInputFocused && this.isNoResultsScreen === other.isNoResultsScreen && this.isSearchFieldExpandedByDefault === other.isSearchFieldExpandedByDefault;
    }
    toString() {
      return `focused:${this.isSearchInputFocused} no-results:${this.isNoResultsScreen} shall-be-expanded:${this.isSearchFieldExpandedByDefault}`;
    }
  }
  class SearchFieldStateManager {
    shellHeader;
    cancelButton;
    searchInput;
    model;
    isNoResultsScreen;
    focusInputFieldTimeout;
    state;
    checkState;
    checkMode;
    constructor(props) {
      this.shellHeader = props.shellHeader;
      this.cancelButton = props.cancelButton;
      this.searchInput = props.searchInput;
      this.model = props.model;
      this.isNoResultsScreen = props.isNoResultsScreen;
      const checkInterval = this?.model?.config?.searchFieldCheckInterval ?? 100;
      if (checkInterval > 0) {
        setInterval(this.checkStateChange.bind(this), checkInterval);
      }
    }
    checkStateChange() {
      const currentState = this.getState();
      if (!this.checkMode) {
        if (!this.state || !currentState.equals(this.state)) {
          this.checkMode = true;
          this.checkState = currentState;
        }
      } else {
        if (currentState.equals(this.checkState)) {
          this.handleStateChanged(currentState);
        }
        this.checkMode = false;
      }
    }
    getState() {
      return new State({
        isNoResultsScreen: this.isNoResultsScreen(),
        isSearchInputFocused: this.isSearchInputFocused(),
        isSearchFieldExpandedByDefault: SearchShellHelperHorizonTheme.isSearchFieldExpandedByDefault()
      });
    }
    isOverlayShown() {
      return !!document.querySelector(".sapUshellShellShowSearchOverlay");
    }
    isSearchInputFocused() {
      if (!this.searchInput || !this.searchInput.getDomRef()) {
        return false;
      }
      return this.searchInput.getDomRef().contains(document.activeElement);
    }
    handleStateChanged(newState) {
      const oldState = this.state;
      this.state = newState;
      if (this.model) {
        this.model.calculateSearchButtonStatus();
      }
      const shallShowOverlay = newState.isSearchInputFocused && !newState.isNoResultsScreen;
      switch (this.shellHeader.getSearchState()) {
        case "EXP":
          if (!newState.isSearchFieldExpandedByDefault && oldState && oldState.isSearchFieldExpandedByDefault && this.searchInput.getValue() === "") {
            this.collapseSearch();
            return;
          }
          if (shallShowOverlay && !this.isOverlayShown()) {
            this.shellHeader.setSearchState("EXP_S", 35, false); // intermediate state to force shell to show overlay
            this.shellHeader.setSearchState("EXP", 35, true);
          }
          if (!shallShowOverlay && this.isOverlayShown) {
            this.shellHeader.setSearchState("EXP_S", 35, false); // intermediate state to force shell to disable overlay
            this.shellHeader.setSearchState("EXP", 35, false);
          }
          break;
        case "COL":
          if (newState.isSearchFieldExpandedByDefault) {
            this.expandSearch();
          }
          break;
      }
    }
    getShellSearchButton() {
      return Element.getElementById("sf");
    }
    expandSearch(focusSearchField) {
      const shellSearchButton = this.getShellSearchButton();
      if (!shellSearchButton) {
        return;
      }
      this.shellHeader.setSearchState("EXP", 35, false);
      this.cancelButton.setVisible(true);
      shellSearchButton.setVisible(false);
      if (focusSearchField) {
        this.focusInputField({
          selectContent: false
        });
      }
    }
    collapseSearch(focusMagnifier) {
      const shellSearchButton = this.getShellSearchButton();
      if (!shellSearchButton) {
        return;
      }
      this.model.abortSuggestions();
      this.shellHeader.setSearchState("COL", 35, false);
      this.cancelButton.setVisible(false);
      shellSearchButton.setVisible(true);
      if (focusMagnifier) {
        window.setTimeout(() => {
          Element.getElementById("sf").focus();
        }, 1000);
      }
    }
    focusInputField(options = {}) {
      if (this.focusInputFieldTimeout) {
        window.clearTimeout(this.focusInputFieldTimeout);
        this.focusInputFieldTimeout = null;
      }
      const doFocus = retry => {
        if (!this.searchInput) {
          return;
        }
        this.focusInputFieldTimeout = null;
        const domRef = this.searchInput.getDomRef();
        // if (domRef && jQuery(domRef).is(":visible") && !sap.ui.getCore().getUIDirty()) {
        if (domRef && jQuery(domRef).is(":visible")) {
          if (this.searchInput.getEnabled()) {
            this.searchInput.focus();
            if (options.selectContent) {
              this.searchInput.selectText(0, 9999);
            }
            return;
          }
        }
        if (retry > 0) {
          this.focusInputFieldTimeout = window.setTimeout(() => {
            if (!this.model.getProperty("/initializingObjSearch")) {
              retry--;
            }
            doFocus(retry);
          }, 100);
        }
      };
      doFocus(10);
    }
  }
  return SearchFieldStateManager;
});
})();