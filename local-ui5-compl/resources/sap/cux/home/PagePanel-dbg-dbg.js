/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
"use strict";

sap.ui.define(["sap/m/Button", "sap/m/FlexBox", "sap/m/GenericTile", "sap/m/IllustratedMessage", "sap/m/VBox", "sap/ui/core/EventBus", "sap/ui/core/dnd/DragDropInfo", "sap/ui/core/library", "./BasePagePanel", "./MenuItem", "./Page", "./utils/Constants", "./utils/Device", "./utils/DragDropUtils", "./utils/FESRUtil", "./utils/PageManager", "./utils/PersonalisationUtils", "./utils/UshellPersonalizer"], function (Button, FlexBox, GenericTile, IllustratedMessage, VBox, EventBus, DragDropInfo, sap_ui_core_library, __BasePagePanel, __MenuItem, __Page, ___utils_Constants, ___utils_Device, ___utils_DragDropUtils, ___utils_FESRUtil, __PageManager, __PersonalisationUtils, __UShellPersonalizer) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const dnd = sap_ui_core_library["dnd"];
  const BasePagePanel = _interopRequireDefault(__BasePagePanel);
  const MenuItem = _interopRequireDefault(__MenuItem);
  const Page = _interopRequireDefault(__Page);
  const SETTINGS_PANELS_KEYS = ___utils_Constants["SETTINGS_PANELS_KEYS"];
  const DeviceType = ___utils_Device["DeviceType"];
  const attachKeyboardHandler = ___utils_DragDropUtils["attachKeyboardHandler"];
  const addFESRId = ___utils_FESRUtil["addFESRId"];
  const addFESRSemanticStepName = ___utils_FESRUtil["addFESRSemanticStepName"];
  const PageManager = _interopRequireDefault(__PageManager);
  const PersonalisationUtils = _interopRequireDefault(__PersonalisationUtils);
  const UShellPersonalizer = _interopRequireDefault(__UShellPersonalizer);
  const maxTileSize = 15,
    minTileSize = 7;

  /**
   *
   * CustomFlexBox extending FlexBox to enable drag & drop.
   *
   * @extends sap.m.FlexBox
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.122
   *
   * @internal
   * @experimental Since 1.121
   * @private
   *
   * @alias sap.cux.home.CustomFlexBox
   */
  const CustomFlexBox = FlexBox.extend("sap.cux.home.CustomFlexBox", {
    renderer: {
      apiVersion: 2
    },
    metadata: {
      library: "sap.cux.home",
      aggregations: {
        items: {
          type: "sap.ui.core.Control",
          multiple: true,
          singularName: "item",
          dnd: {
            draggable: true,
            droppable: true
          }
        }
      }
    },
    constructor: function _constructor(id, settings) {
      FlexBox.prototype.constructor.call(this, id, settings);
    }
  });
  /**
   *
   * Panel class for managing and storing Pages.
   *
   * @extends sap.cux.home.BasePagePanel
   *
   * @author SAP SE
   * @version 0.0.1
   * @since 1.122
   *
   * @internal
   * @experimental Since 1.121
   * @public
   *
   * @alias sap.cux.home.PagePanel
   */
  const PagePanel = BasePagePanel.extend("sap.cux.home.PagePanel", {
    metadata: {
      library: "sap.cux.home",
      properties: {
        /**
         * Title for the page panel
         */
        title: {
          type: "string",
          group: "Misc",
          visibility: "hidden"
        },
        /**
         * Key for the page panel
         */
        key: {
          type: "string",
          group: "Misc",
          visibility: "hidden"
        }
      },
      aggregations: {
        /**
         * Aggregation of pages available within the page panel
         */
        pages: {
          type: "sap.cux.home.Page",
          singularName: "page",
          multiple: true,
          visibility: "hidden"
        }
      }
    },
    /**
     * Constructor for a new Page panel.
     *
     * @param {string} [id] ID for the new control, generated automatically if an ID is not provided
     * @param {object} [settings] Initial settings for the new control
     */
    constructor: function _constructor2(id, settings) {
      BasePagePanel.prototype.constructor.call(this, id, settings);
      this.persContainerId = PersonalisationUtils.getPersContainerId(this);
      this.PageManagerInstance = PageManager.getInstance(this.persContainerId, PersonalisationUtils.getOwnerComponent(this));
    },
    init: function _init() {
      BasePagePanel.prototype.init.call(this);
      this._oWrapperFlexBox = new CustomFlexBox({
        justifyContent: "Start",
        height: "100%",
        width: "100%",
        direction: "Row",
        renderType: "Bare",
        wrap: "Wrap"
      }).addStyleClass("newsSlideFlexGap sapUiSmallMarginTop sapUiSmallMarginBottom");
      this._oWrapperFlexBox.addDragDropConfig(new DragDropInfo({
        sourceAggregation: "items",
        targetAggregation: "items",
        dropPosition: dnd.DropPosition.Between,
        dropLayout: dnd.DropLayout.Horizontal,
        drop: oEvent => void this._handlePageDnd(oEvent)
      })).attachBrowserEvent("keydown", event => attachKeyboardHandler(event, true, dragDropEvent => this._handlePageDnd(dragDropEvent)));
      this._addContent(this._oWrapperFlexBox);
      this.setProperty("title", this._i18nBundle.getText("pageTitle"));
      const menuItem = new MenuItem(`${this.getId()}-managePages`, {
        title: this._i18nBundle.getText("mngPage"),
        icon: "sap-icon://edit",
        press: () => this._handleEditPages()
      });
      this.addAggregation("menuItems", menuItem);
      addFESRId(menuItem, "managePages");
      this.oEventBus = EventBus.getInstance();
      // Subscribe to the event
      this.oEventBus.subscribe("importChannel", "favPagesImport", (sChannelId, sEventId, oData) => {
        this.aFavPages = oData;
        this._getInnerControls();
        this._importdone();
      }, this);

      // Subscribe to page changes from pageManager
      this.oEventBus.subscribe("pageChannel", "pageUpdated", () => {
        void this.getData(true);
      }, this);
    },
    _importdone: function _importdone() {
      const stateData = {
        status: true
      };
      this.oEventBus.publish("importChannel", "favPagesImported", stateData);
    },
    getData: function _getData() {
      let forceUpdate = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
      try {
        const _this = this;
        function _temp2() {
          return _this.oPagePromise;
        }
        const _temp = function () {
          if (_this.oPagePromise === undefined || _this.oPagePromise === null || forceUpdate) {
            _this.oPagePromise = _this.PageManagerInstance.getFavoritePages();
            return Promise.resolve(_this.oPagePromise).then(function (aFavPages) {
              _this.aFavPages = aFavPages;
              _this._getInnerControls();
              _this.oPagePromise = null;
            });
          }
        }();
        return Promise.resolve(_temp && _temp.then ? _temp.then(_temp2) : _temp2(_temp));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    /**
     * Handles the edit page event.
     * Opens the page dialog for managing page data.
     * @param {Event} oEvent - The event object.
     * @private
     */
    _handleEditPages: function _handleEditPages() {
      const parent = this.getParent();
      parent?._getLayout().openSettingsDialog(SETTINGS_PANELS_KEYS.PAGES);
    },
    attachResizeHandler: function _attachResizeHandler(bIsNewsTileVisible, containerWidth, pagesContentWrapper, containerWrapper) {
      try {
        const iFavPagesCount = this.aFavPages.length,
          domRef = pagesContentWrapper.getDomRef();
        let domRefClientWidth = 0;
        domRefClientWidth = bIsNewsTileVisible ? domRef.clientWidth : containerWidth;
        let pagesPerRow = 0,
          tileWidth,
          wrapperWidth = domRefClientWidth / 16; // Divide by 16 to convert to rem,
        const gap = 1,
          flexWrapperWidth = containerWidth || domRef.clientWidth;
        if (iFavPagesCount === 1) {
          containerWrapper.setAlignItems("Start");
        }
        if (bIsNewsTileVisible && flexWrapperWidth >= 1520) {
          // As newsTile will grow till 40.75 rem, calculating the remaining width
          wrapperWidth = flexWrapperWidth / 16 - 40.75;
        }
        if (iFavPagesCount > 0) {
          if (!bIsNewsTileVisible) {
            // If Space available display all tiles in a single row
            const spaceRequired = iFavPagesCount * minTileSize + (iFavPagesCount - 1) * gap;
            if (spaceRequired <= wrapperWidth) {
              pagesPerRow = iFavPagesCount;
              tileWidth = (wrapperWidth - (pagesPerRow - 1) * gap) / pagesPerRow;
              tileWidth = tileWidth <= maxTileSize ? tileWidth : maxTileSize;
              this._setPropertyValues({
                hBoxWidth: wrapperWidth + "rem",
                pagesTileWidth: tileWidth + "rem"
              });
              pagesContentWrapper.setWidth(wrapperWidth + "rem");
              return true;
            }
          }
          pagesPerRow = this._handleResizeForDesktop(bIsNewsTileVisible, iFavPagesCount, pagesPerRow);
          tileWidth = (wrapperWidth - (pagesPerRow - 1) * gap) / pagesPerRow;
          tileWidth = tileWidth <= maxTileSize ? tileWidth : maxTileSize;
          const hBoxWidth = pagesPerRow === 0 ? "100%" : pagesPerRow * tileWidth + pagesPerRow * gap + "rem";
          this._setPropertyValues({
            hBoxWidth: hBoxWidth,
            pagesTileWidth: tileWidth + "rem"
          });
          pagesContentWrapper.setWidth(wrapperWidth + "rem");
          return true;
        }
        pagesContentWrapper.setWidth(wrapperWidth + "rem");
        return true;
      } catch (oErr) {
        if (oErr instanceof Error) {}
        return false;
      }
    },
    getUserAvailablePages: function _getUserAvailablePages() {
      try {
        const _this2 = this;
        return Promise.resolve(_this2.PageManagerInstance.fetchAllAvailablePages());
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _handleResizeForDesktop: function _handleResizeForDesktop(bIsNewsTileVisible, iFavPagesCount, pagesPerRow) {
      const sDeviceType = this.getDeviceType();
      const pagesToDisplay = Math.ceil(iFavPagesCount >= 8 ? 4 : iFavPagesCount / 2);
      if (sDeviceType === DeviceType.Desktop || sDeviceType === DeviceType.LargeDesktop) {
        if (bIsNewsTileVisible) {
          pagesPerRow = pagesToDisplay;
        } else {
          pagesPerRow = iFavPagesCount <= 4 ? iFavPagesCount : pagesToDisplay;
        }
      } else if (sDeviceType === DeviceType.Tablet) {
        pagesPerRow = iFavPagesCount <= 4 ? iFavPagesCount : pagesToDisplay;
      }
      return pagesPerRow;
    },
    _getInnerControls: function _getInnerControls() {
      const myFavPage = [];
      this.oInnerControls = [];
      const oParent = this.getParent();
      if (this.aFavPages) {
        this.aFavPages.forEach(oPage => {
          myFavPage.push(new Page("", {
            title: oPage.title,
            subTitle: oPage.title === oPage.spaceTitle ? "" : oPage.spaceTitle,
            icon: oPage.icon,
            bgColor: oPage.BGColor,
            pageId: oPage.pageId,
            spaceId: oPage.spaceId,
            spaceTitle: oPage.spaceTitle,
            url: "#Launchpad-openFLPPage?pageId=" + oPage.pageId + "&spaceId=" + oPage.spaceId
          }));
        });
        myFavPage.forEach(oFav => {
          this.oInnerControls.push(new GenericTile({
            // width: "10rem",
            header: oFav.getTitle(),
            subheader: oFav.getSubTitle(),
            press: () => void oFav.onPageTilePress(oFav),
            sizeBehavior: "Responsive",
            state: "Loaded",
            frameType: "OneByOne",
            mode: "IconMode",
            backgroundColor: oFav.getBgColor(),
            tileIcon: oFav.getIcon(),
            visible: true,
            renderOnThemeChange: true,
            ariaRole: "listitem",
            dropAreaOffset: 8,
            url: oFav.getProperty("url")
          }));
          this.addAggregation("pages", oFav, true);
        });
        this._oWrapperFlexBox.setAlignItems(this.aFavPages.length == 1 ? "Start" : "Center");
        if (this.aFavPages.length) {
          oParent?.panelLoadedFn("Page", {
            loaded: true,
            count: this.aFavPages.length
          });
          this._setFavPagesContent();
        } else {
          oParent?.panelLoadedFn("Page", {
            loaded: true,
            count: 0
          });
          this._setNoPageContent();
        }
      } else {
        oParent?.panelLoadedFn("Page", {
          loaded: false,
          count: 0
        });
        this.removeAggregation("content", this._oWrapperFlexBox);
      }
    },
    _setFavPagesContent: function _setFavPagesContent() {
      this._oWrapperFlexBox.removeAllItems();
      this.oInnerControls.forEach(oTile => {
        this._oWrapperFlexBox.addItem(oTile);
      });
    },
    _createNoPageContent: function _createNoPageContent() {
      if (!this._oIllusMsg) {
        this._oIllusMsg = new IllustratedMessage(this.getId() + "--idNoPages", {
          illustrationSize: "Spot",
          illustrationType: "sapIllus-SimpleNoSavedItems",
          title: this._i18nBundle.getText("noDataPageTitle"),
          description: this._i18nBundle.getText("noPageDescription")
        }).addStyleClass("myHomeIllustratedMsg myHomeIllustratedMessageAlign");
        this.oAddPageBtn = new Button(this.getId() + "--idAddPageBtn", {
          text: this._i18nBundle.getText("addPage"),
          tooltip: this._i18nBundle.getText("addPage"),
          type: "Emphasized",
          press: () => this._handleEditPages()
        });
        addFESRSemanticStepName(this.oAddPageBtn, "press", "addPages");
      }
    },
    _setNoPageContent: function _setNoPageContent() {
      const oWrapperNoPageVBox = new VBox({
        width: "100%",
        height: "17rem",
        backgroundDesign: "Solid",
        justifyContent: "Center"
      }).addStyleClass("sapUiRoundedBorder noCardsBorder");
      this._createNoPageContent();
      this._oIllusMsg.addAdditionalContent(this.oAddPageBtn);
      this._oWrapperFlexBox.removeAllItems();
      this._oWrapperFlexBox.addStyleClass("pagesFlexBox");
      oWrapperNoPageVBox.addItem(this._oIllusMsg);
      this._oWrapperFlexBox.addItem(oWrapperNoPageVBox);
    },
    _setPropertyValues: function _setPropertyValues(oVal) {
      const propNames = Object.keys(oVal);
      propNames.forEach(sProperty => {
        if (sProperty === "hBoxWidth") {
          this._oWrapperFlexBox.setProperty("width", oVal[sProperty]);
        } else if (sProperty === "pagesTileWidth" && this.oInnerControls.length) {
          this.oInnerControls.forEach(function (oTile) {
            oTile.setProperty("width", oVal[sProperty]);
          });
        }
      });
    },
    _handlePageDnd: function _handlePageDnd(oEvent) {
      try {
        const _this3 = this;
        const sInsertPosition = oEvent.getParameter?.("dropPosition"),
          oDragItem = oEvent?.getParameter?.("draggedControl"),
          oDropItem = oEvent.getParameter("droppedControl"),
          iDragItemIndex = oDragItem.getParent()?.indexOfItem(oDragItem);
        let iDropItemIndex = oDragItem.getParent()?.indexOfItem(oDropItem);
        if (sInsertPosition === "Before" && iDragItemIndex === iDropItemIndex - 1) {
          iDropItemIndex--;
        } else if (sInsertPosition === "After" && iDragItemIndex === iDropItemIndex + 1) {
          iDropItemIndex++;
        }
        const _temp3 = function () {
          if (iDragItemIndex !== iDropItemIndex) {
            return Promise.resolve(_this3._DragnDropPages(iDragItemIndex, iDropItemIndex, sInsertPosition)).then(function () {});
          }
        }();
        return Promise.resolve(_temp3 && _temp3.then ? _temp3.then(function () {}) : void 0);
      } catch (e) {
        return Promise.reject(e);
      }
    },
    _DragnDropPages: function _DragnDropPages(iDragItemIndex, iDropItemIndex, sInsertPosition) {
      try {
        const _this4 = this;
        function _temp5() {
          return Promise.resolve(_this4.oPersonalizer.read()).then(function (oPersData) {
            if (!oPersData) oPersData = {
              favouritePages: []
            };
            oPersData.favouritePages = _this4.aFavPages;
            return Promise.resolve(_this4.oPersonalizer.write(oPersData)).then(function () {});
          });
        }
        if (sInsertPosition === "Before" && iDragItemIndex < iDropItemIndex) {
          iDropItemIndex--;
        } else if (sInsertPosition === "After" && iDragItemIndex > iDropItemIndex) {
          iDropItemIndex++;
        }
        // take the moved item from dragIndex and add to dropindex
        const oItemMoved = _this4.aFavPages.splice(iDragItemIndex, 1)[0];
        _this4.aFavPages.splice(iDropItemIndex, 0, oItemMoved);
        _this4._getInnerControls();
        const _temp4 = function () {
          if (_this4.oPersonalizer === undefined) {
            return Promise.resolve(UShellPersonalizer.getInstance(_this4.persContainerId, PersonalisationUtils.getOwnerComponent(_this4))).then(function (_UShellPersonalizer$g) {
              _this4.oPersonalizer = _UShellPersonalizer$g;
            });
          }
        }();
        return Promise.resolve(_temp4 && _temp4.then ? _temp4.then(_temp5) : _temp5(_temp4));
      } catch (e) {
        return Promise.reject(e);
      }
    },
    applyColorPersonalizations: function _applyColorPersonalizations(personalizations) {
      void this.PageManagerInstance?.applyColorPersonalizations(personalizations);
    },
    applyIconPersonalizations: function _applyIconPersonalizations(personalizations) {
      void this.PageManagerInstance?.applyIconPersonalizations(personalizations);
    }
  });
  return PagePanel;
});
//# sourceMappingURL=PagePanel-dbg-dbg.js.map
