/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/List", "sap/m/Popover", "sap/m/StandardListItem", "sap/m/library", "sap/ui/core/Element", "./utils/FESRUtil"], function (List, Popover, StandardListItem, sap_m_library, Element, ___utils_FESRUtil) {
  "use strict";

  const ListType = sap_m_library["ListType"];
  const addFESRSemanticStepName = ___utils_FESRUtil["addFESRSemanticStepName"];
  const FESR_EVENTS = ___utils_FESRUtil["FESR_EVENTS"];
  const getFESRId = ___utils_FESRUtil["getFESRId"];
  /**
   *
   * Base App class for managing and storing Apps.
   *
   * @extends sap.ui.core.Element
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.121.0
   *
   * @abstract
   * @internal
   * @experimental Since 1.121
   * @private
   * @alias sap.cux.home.BaseApp
   */
  const BaseApp = Element.extend("sap.cux.home.BaseApp", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Title of the app
         */
        title: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Sub header of the app
         */
        subTitle: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Background color of the app
         */
        bgColor: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Icon of the app
         */
        icon: {
          type: "string",
          group: "Misc",
          defaultValue: ""
        },
        /**
         * Whether the app is in loaded or loading status
         */
        status: {
          type: "string",
          group: "Misc",
          defaultValue: "Loaded"
        }
      },
      aggregations: {
        /**
         * MenuItems aggregation of the app. These items will be shown in a popover on click of showMore
         */
        menuItems: {
          type: "sap.cux.home.MenuItem",
          multiple: true,
          singularName: "menuItem",
          visibility: "hidden"
        }
      }
    },
    constructor: function _constructor(id, settings) {
      Element.prototype.constructor.call(this, id, settings);
    },
    /**
     * Base App Press Handler
     * @private
     * @param {GenericTile$PressEvent} event - The event object.
     */
    _onPress: function _onPress(event) {
      const sAction = event.getParameter("action") || "Press";
      if (sAction === "Press") {
        this._handlePress();
      } else if (sAction === "More") {
        this._loadActionsPopover(event);
      }
    },
    /**
     * Loads Actions available for selected app tile in popover
     * @private
     * @param {GenericTile$PressEvent} event - The event object.
     */
    _loadActionsPopover: function _loadActionsPopover(event) {
      const tile = event.getSource?.();
      const actions = this.getAggregation("menuItems");
      const oPopover = ActionsPopover.get(actions);
      //Add Border around current tile
      const onPopoverOpen = () => {
        tile.addStyleClass("sapThemeBrand-asOutlineColor");
      };
      const onPopoverClose = () => {
        tile.removeStyleClass("sapThemeBrand-asOutlineColor");
        oPopover.detachBeforeOpen(onPopoverOpen);
        oPopover.detachAfterClose(onPopoverClose);
      };
      oPopover.attachBeforeOpen(onPopoverOpen);
      oPopover.attachAfterClose(onPopoverClose);
      oPopover.openBy(tile._oMoreIcon);
    }
  });
  class ActionsPopover {
    constructor() {}
    static _closeActionsPopover() {
      ActionsPopover._popover.close();
    }

    // Method to get the singleton instance
    static get(actions) {
      if (!ActionsPopover._popover) {
        ActionsPopover._actionsList = new List({
          id: `appActionsList`
        });
        ActionsPopover._popover = new Popover(`appActionsPopover`, {
          showHeader: false,
          placement: "HorizontalPreferredRight"
        }).addStyleClass("sapContrastPlus").addContent(ActionsPopover._actionsList);
      }
      ActionsPopover._actionsList.destroyItems();
      actions?.forEach(action => {
        const actionType = action.getType();
        const oListItem = new StandardListItem(`${action.getId()}-index`, {
          icon: action.getIcon(),
          title: action.getTitle(),
          tooltip: action.getTitle(),
          type: actionType,
          visible: true,
          press: oEvent => {
            if (actionType !== ListType.Navigation) {
              ActionsPopover._closeActionsPopover();
            }
            action.firePress({
              listItem: oEvent.getSource()
            });
          }
        });
        addFESRSemanticStepName(oListItem, FESR_EVENTS.PRESS, getFESRId(action));
        ActionsPopover._actionsList.addItem(oListItem);
      });
      return ActionsPopover._popover;
    }
  }
  BaseApp.ActionsPopover = ActionsPopover;
  return BaseApp;
});
//# sourceMappingURL=BaseApp-dbg-dbg.js.map
