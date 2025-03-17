/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["../../i18n", "sap/m/Toolbar", "sap/m/library", "sap/m/Button", "sap/m/ToolbarLayoutData", "sap/m/ToolbarSpacer", "sap/m/ActionSheet", "sap/ui/core/InvisibleText", "sap/ui/core/IconPool", "sap/ui/core/delegate/ItemNavigation", "sap/ui/core/Control", "../../sinaNexTS/sina/NavigationTarget", "../SearchLink"], function (__i18n, Toolbar, sap_m_library, Button, ToolbarLayoutData, ToolbarSpacer, ActionSheet, InvisibleText, IconPool, ItemNavigation, Control, ____sinaNexTS_sina_NavigationTarget, __SearchLink) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const i18n = _interopRequireDefault(__i18n);
  const ToolbarDesign = sap_m_library["ToolbarDesign"];
  const ButtonType = sap_m_library["ButtonType"];
  const PlacementType = sap_m_library["PlacementType"];
  const NavigationTarget = ____sinaNexTS_sina_NavigationTarget["NavigationTarget"];
  const SearchLink = _interopRequireDefault(__SearchLink);
  /**
   * @namespace sap.esh.search.ui.controls
   */
  const SearchRelatedObjectsToolbar = Control.extend("sap.esh.search.ui.controls.SearchRelatedObjectsToolbar", {
    renderer: {
      apiVersion: 2,
      render(oRm, oControl) {
        oRm.openStart("div", oControl);
        oRm.class("sapUshellSearchResultListItem-RelatedObjectsToolbar");
        const oModel = oControl.getModel();
        if (oModel.config.optimizeForValueHelp) {
          oRm.class("sapUshellSearchResultListItem-RelatedObjectsToolbarValueHelp");
        }
        oRm.openEnd();
        oRm.renderControl(oControl.getAggregation("_ariaDescriptionForLinks"));
        oControl._renderToolbar(oRm, oControl);
        oRm.close("div");
      }
    },
    metadata: {
      properties: {
        itemId: "string",
        navigationObjects: {
          type: "object",
          multiple: true
        },
        positionInList: "int"
      },
      aggregations: {
        _relatedObjectActionsToolbar: {
          type: "sap.m.Toolbar",
          multiple: false,
          visibility: "hidden"
        },
        _ariaDescriptionForLinks: {
          type: "sap.ui.core.InvisibleText",
          multiple: false,
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(sId, settings) {
      Control.prototype.constructor.call(this, sId, settings);
      const relatedObjectActionsToolbar = new Toolbar(`${this.getId()}--toolbar`, {
        design: ToolbarDesign.Solid
      });
      relatedObjectActionsToolbar.data("sap-ui-fastnavgroup", "false", true /* write into DOM */);
      relatedObjectActionsToolbar.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Toolbar");
      relatedObjectActionsToolbar.addEventDelegate({
        onAfterRendering: this.layoutToolbarElements.bind(this)
      });
      this.setAggregation("_relatedObjectActionsToolbar", relatedObjectActionsToolbar);
      this.setAggregation("_ariaDescriptionForLinks", new InvisibleText({
        text: i18n.getText("result_list_item_aria_has_more_links")
      }));
      $(window).on("resize", () => {
        this.layoutToolbarElements();
      });
    },
    exit: function _exit(...args) {
      if (Control.prototype.exit) {
        // check whether superclass implements the method
        Control.prototype.exit.apply(this, args); // call the method with the original arguments
      }
      if (this._overFlowSheet) {
        this._overFlowSheet.destroy();
      }
    },
    _renderToolbar: function _renderToolbar(oRm, oControl) {
      const oModel = oControl.getModel();
      const _relatedObjectActionsToolbar = oControl.getAggregation("_relatedObjectActionsToolbar");
      _relatedObjectActionsToolbar.destroyContent();
      if (oModel.config.optimizeForValueHelp) {
        _relatedObjectActionsToolbar.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-ToolbarValueHelp");
      }
      const navigationObjects = oControl.getProperty("navigationObjects");
      if (Array.isArray(navigationObjects) && navigationObjects.length > 0) {
        const navigationObjectsLinks = [];
        for (let i = 0; i < navigationObjects.length; i++) {
          const navigationObject = navigationObjects[i];
          const link = new SearchLink(`${oControl.getId()}--link_${i}`, {
            text: navigationObject?.text || "",
            navigationTarget: navigationObject,
            layoutData: new ToolbarLayoutData({
              shrinkable: false
            })
          });
          link.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");
          navigationObjectsLinks.push(link);
        }

        // 1. spacer
        const toolbarSpacer = new ToolbarSpacer();
        toolbarSpacer.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Spacer");
        _relatedObjectActionsToolbar.addContent(toolbarSpacer);

        // 2. navigation objects
        for (let i = 0; i < navigationObjectsLinks.length; i++) {
          _relatedObjectActionsToolbar.addContent(navigationObjectsLinks[i]);
        }

        // 3. overFlowButton
        this._overFlowButton = new Button(`${this.getId()}--overflowButton`, {
          icon: IconPool.getIconURI("overflow")
        });
        this._overFlowButton.addStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-OverFlowButton");
        if (oModel.config.optimizeForValueHelp) {
          this._overFlowButton.addStyleClass("sapUiSmallMarginBegin");
          this._overFlowButton.addStyleClass("sapUiTinyMarginEnd");
          this._overFlowButton.setType(ButtonType.Transparent);
        }
        _relatedObjectActionsToolbar.addContent(this._overFlowButton);

        // 4. overFlowSheet
        if (!this._overFlowSheet) {
          this._overFlowSheet = new ActionSheet(`${this.getId()}--actionSheet`, {
            placement: PlacementType.Top
          });
        }
        this._overFlowButton.attachPress(() => {
          if (this._overFlowSheet.isOpen()) {
            this._overFlowSheet.close();
          } else {
            this._overFlowSheet.openBy(this._overFlowButton);
          }
        });
        oRm.renderControl(_relatedObjectActionsToolbar);
      }
    },
    // after rendering
    // ===================================================================
    onAfterRendering: function _onAfterRendering() {
      if (this.getAggregation("_relatedObjectActionsToolbar")) {
        this._addAriaInformation();
      }
    },
    /**
     * Layout toolbar elements and move overflowing elements to the action sheet.
     * CAUTION: DO NOT CALL ANY UI5 METHODS HERE OR RERENDERING ENDLESS LOOP WILL HAPPEN!!!
     * @returns void
     */
    layoutToolbarElements: function _layoutToolbarElements() {
      if (this.isDestroyed() || this.isDestroyStarted()) {
        return;
      }
      const _relatedObjectActionsToolbar = this.getAggregation("_relatedObjectActionsToolbar");
      if (!(this.getDomRef() && _relatedObjectActionsToolbar.getDomRef())) {
        return;
      }
      const $toolbar = $(_relatedObjectActionsToolbar.getDomRef());
      const toolbarWidth = $toolbar.width();

      // following return can cause issues in case of control being rendered more than once immediately after the first render
      // if (toolbarWidth === 0 || (this.toolbarWidth && this.toolbarWidth === toolbarWidth)) {
      //     return;
      // }

      if ($(this.getDomRef()).css("display") === "none" || $toolbar.css("display") === "none") {
        return;
      }
      this.toolbarWidth = toolbarWidth;
      const $overFlowButton = $(this._overFlowButton.getDomRef());
      $overFlowButton.css("display", "none");
      let toolbarElementsWidth = 0;
      const pressButton = (event, _navigationObject) => {
        if (_navigationObject instanceof NavigationTarget) {
          _navigationObject.performNavigation({
            event: event
          });
        }
      };
      const $toolbarElements = $toolbar.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar-Element" // ToDo
      );
      for (let i = 0; i < $toolbarElements.length; i++) {
        let $element = $($toolbarElements[i]);
        $element.css("display", "");
        let _toolbarElementsWidth = toolbarElementsWidth + $element.outerWidth(true);
        if (_toolbarElementsWidth > toolbarWidth) {
          // if (i < $toolbarElements.length) {
          $overFlowButton.css("display", "");
          const overFlowButtonWidth = $overFlowButton.outerWidth(true);
          for (; i >= 0; i--) {
            $element = $($toolbarElements[i]);
            _toolbarElementsWidth -= $element.outerWidth(true);
            if (_toolbarElementsWidth + overFlowButtonWidth <= toolbarWidth) {
              break;
            }
          }
          // }

          const navigationObjects = this.getProperty("navigationObjects");
          this._overFlowSheet.destroyButtons();
          i = i >= 0 ? i : 0;
          for (; i < $toolbarElements.length; i++) {
            $element = $($toolbarElements[i]);
            $element.css("display", "none");
            const navigationObject = navigationObjects[i];
            const button = new Button({
              text: navigationObject?.text || ""
            });
            button.attachPress(navigationObject, pressButton);
            this._overFlowSheet.addButton(button);
          }
          break;
        }
        toolbarElementsWidth = _toolbarElementsWidth;
      }
      this._setupItemNavigation();
    },
    _setupItemNavigation: function _setupItemNavigation() {
      if (!this._theItemNavigation) {
        this._theItemNavigation = new ItemNavigation(null, []);
        this["addDelegate"](this._theItemNavigation);
      }
      this._theItemNavigation.setCycling(false);
      this._theItemNavigation.setRootDomRef(this.getDomRef());
      const itemDomRefs = [];
      const _relatedObjectActionsToolbar = this.getAggregation("_relatedObjectActionsToolbar");
      const content = _relatedObjectActionsToolbar.getContent();
      for (let i = 0; i < content.length; i++) {
        if (!content[i].hasStyleClass("sapUshellSearchResultListItem-RelatedObjectsToolbar-Element")) {
          continue;
        }
        if (!$(content[i].getDomRef()).attr("tabindex")) {
          let tabindex = "-1";
          if (content[i]["getPressed"] && content[i]["getPressed"]()) {
            tabindex = "0";
          }
          $(content[i].getDomRef()).attr("tabindex", tabindex);
        }
        itemDomRefs.push(content[i].getDomRef());
      }
      const overFlowButtonDomRef = this._overFlowButton.getDomRef();
      itemDomRefs.push(overFlowButtonDomRef);
      $(overFlowButtonDomRef).attr("tabindex", "-1");
      this._theItemNavigation.setItemDomRefs(itemDomRefs);
    },
    _addAriaInformation: function _addAriaInformation() {
      const $toolbar = $(this.getAggregation("_relatedObjectActionsToolbar").getDomRef());
      const $navigationLinks = $toolbar.find(".sapUshellSearchResultListItem-RelatedObjectsToolbar-Element");
      const $overFlowButton = $(this._overFlowButton.getDomRef());
      if ($navigationLinks.length > 0 || $overFlowButton.is(":visible")) {
        const ariaDescriptionId = this.getAggregation("_ariaDescriptionForLinks").getId();
        $navigationLinks.each(function () {
          const $this = $(this);
          let ariaDescription = $this.attr("aria-describedby") || "";
          ariaDescription += " " + ariaDescriptionId;
          $this.attr("aria-describedby", ariaDescription);
        });
        if ($overFlowButton.is(":visible")) {
          let ariaDescription = $overFlowButton.attr("aria-describedby") || "";
          ariaDescription += " " + ariaDescriptionId;
          $overFlowButton.attr("aria-describedby", ariaDescription);
        }
      }
    }
  });
  return SearchRelatedObjectsToolbar;
});
})();