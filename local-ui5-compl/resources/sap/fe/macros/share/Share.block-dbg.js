/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/base/Log", "sap/fe/base/BindingToolkit", "sap/fe/base/ClassSupport", "sap/fe/core/CommonUtils", "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport", "sap/fe/core/buildingBlocks/templating/RuntimeBuildingBlock", "sap/fe/core/controls/CommandExecution", "sap/fe/core/helpers/BindingHelper", "sap/m/Menu", "sap/m/MenuItem", "sap/ui/core/CustomData", "sap/ui/performance/trace/FESRHelper", "sap/m/OverflowToolbarMenuButton", "sap/ui/base/BindingParser", "./ShareAPI", "sap/fe/base/jsx-runtime/jsx"], function (Log, BindingToolkit, ClassSupport, CommonUtils, BuildingBlockSupport, RuntimeBuildingBlock, CommandExecution, BindingHelper, Menu, MenuItem, CustomData, FESRHelper, OverflowToolbarMenuButton, BindingParser, ShareAPI, _jsx) {
  "use strict";

  var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15;
  function __ui5_require_async(path) {
    return new Promise((resolve, reject) => {
      sap.ui.require([path], module => {
        if (!(module && module.__esModule)) {
          module = module === null || !(typeof module === "object" && path.endsWith("/library")) ? {
            default: module
          } : module;
          Object.defineProperty(module, "__esModule", {
            value: true
          });
        }
        resolve(module);
      }, err => {
        reject(err);
      });
    });
  }
  var _exports = {};
  var UI = BindingHelper.UI;
  var defineBuildingBlock = BuildingBlockSupport.defineBuildingBlock;
  var blockAttribute = BuildingBlockSupport.blockAttribute;
  var defineReference = ClassSupport.defineReference;
  var resolveBindingString = BindingToolkit.resolveBindingString;
  var or = BindingToolkit.or;
  var not = BindingToolkit.not;
  var constant = BindingToolkit.constant;
  var compileExpression = BindingToolkit.compileExpression;
  var and = BindingToolkit.and;
  function _initializerDefineProperty(e, i, r, l) { r && Object.defineProperty(e, i, { enumerable: r.enumerable, configurable: r.configurable, writable: r.writable, value: r.initializer ? r.initializer.call(l) : void 0 }); }
  function _inheritsLoose(t, o) { t.prototype = Object.create(o.prototype), t.prototype.constructor = t, _setPrototypeOf(t, o); }
  function _setPrototypeOf(t, e) { return _setPrototypeOf = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function (t, e) { return t.__proto__ = e, t; }, _setPrototypeOf(t, e); }
  function _applyDecoratedDescriptor(i, e, r, n, l) { var a = {}; return Object.keys(n).forEach(function (i) { a[i] = n[i]; }), a.enumerable = !!a.enumerable, a.configurable = !!a.configurable, ("value" in a || a.initializer) && (a.writable = !0), a = r.slice().reverse().reduce(function (r, n) { return n(i, e, r) || r; }, a), l && void 0 !== a.initializer && (a.value = a.initializer ? a.initializer.call(l) : void 0, a.initializer = void 0), void 0 === a.initializer ? (Object.defineProperty(i, e, a), null) : a; }
  function _initializerWarningHelper(r, e) { throw Error("Decorating class property failed. Please ensure that transform-class-properties is enabled and runs after the decorators transform."); }
  /**
   * Microsoft Teams options to provide as part of Share.
   * @alias sap.fe.macros.share.MsTeamsOptions
   */
  /**
   * Share Options.
   * @alias sap.fe.macros.share.ShareOptions
   * @public
   */
  // MS Teams options are not public via Share building block.
  // So, 'showMsTeamsOptions' is internal and shall be only picked from template manifest.
  const enumMSTeamsOption = {
    COLLABORATION_MSTEAMS_CARD: "COLLABORATION_MSTEAMS_CARD",
    COLLABORATION_MSTEAMS_TAB: "COLLABORATION_MSTEAMS_TAB",
    COLLABORATION_MSTEAMS_CHAT: "COLLABORATION_MSTEAMS_CHAT"
  };
  const enumShareOption = {
    ...enumMSTeamsOption,
    ...{
      SEND_EMAIL: "SEND_EMAIL",
      SHARE_JAM: "SHARE_JAM",
      SAVE_AS_TILE: "SAVE_AS_TILE",
      MS_TEAMS_GROUP: "MS_TEAMS_GROUP",
      SHARE_COLLABORATION_MANAGER: "SHARE_COLLABORATION_MANAGER"
    }
  };
  /**
   * Building block used to create the ‘Share’ functionality.
   * <br>
   * Please note that the 'Share in SAP Jam' option is only available on platforms that are integrated with SAP Jam.
   * <br>
   * If you are consuming this macro in an environment where the SAP Fiori launchpad is not available, then the 'Save as Tile' option is not visible.
   *
   *
   * Usage example:
   * <pre>
   * &lt;macros:Share
   * id="someID"
   * visible="true"
   * /&gt;
   * </pre>
   * @hideconstructor
   * @public
   * @since 1.93.0
   */
  let ShareBlock = (_dec = defineBuildingBlock({
    name: "Share",
    namespace: "sap.fe.macros.internal",
    publicNamespace: "sap.fe.macros",
    returnTypes: ["sap.fe.macros.share.ShareAPI"]
  }), _dec2 = blockAttribute({
    type: "string",
    required: true,
    isPublic: true
  }), _dec3 = blockAttribute({
    type: "boolean",
    isPublic: true,
    bindable: true
  }), _dec4 = blockAttribute({
    type: "object",
    isPublic: true
  }), _dec5 = blockAttribute({
    type: "object",
    isPublic: false
  }), _dec6 = defineReference(), _dec7 = defineReference(), _dec8 = defineReference(), _dec9 = defineReference(), _dec10 = defineReference(), _dec11 = defineReference(), _dec12 = defineReference(), _dec13 = defineReference(), _dec14 = defineReference(), _dec15 = defineReference(), _dec16 = defineReference(), _dec(_class = (_class2 = /*#__PURE__*/function (_RuntimeBuildingBlock) {
    function ShareBlock() {
      var _this;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      _this = _RuntimeBuildingBlock.call(this, ...args) || this;
      /**
       * The identifier of the Share control.
       */
      _initializerDefineProperty(_this, "id", _descriptor, _this);
      /**
       * Whether the share control should be visible on the screen.
       * @public
       */
      _initializerDefineProperty(_this, "visible", _descriptor2, _this);
      /**
       * Supported Share options {@link sap.fe.macros.share.ShareOptions}.
       * @public
       */
      _initializerDefineProperty(_this, "shareOptions", _descriptor3, _this);
      /**
       * Supported Microsoft Teams options.
       */
      _initializerDefineProperty(_this, "msTeamsOptions", _descriptor4, _this);
      _initializerDefineProperty(_this, "menuButton", _descriptor5, _this);
      _initializerDefineProperty(_this, "cmdExecution", _descriptor6, _this);
      _initializerDefineProperty(_this, "menu", _descriptor7, _this);
      _initializerDefineProperty(_this, "saveAsTileMenuItem", _descriptor8, _this);
      _initializerDefineProperty(_this, "shareAsCollaborationManager", _descriptor9, _this);
      _initializerDefineProperty(_this, "shareViaJAMMenuItem", _descriptor10, _this);
      _initializerDefineProperty(_this, "sendEmailMenuItem", _descriptor11, _this);
      _initializerDefineProperty(_this, "shareAsCardMenuItem", _descriptor12, _this);
      _initializerDefineProperty(_this, "shareViaChatMenuItem", _descriptor13, _this);
      _initializerDefineProperty(_this, "shareAsTabMenuItem", _descriptor14, _this);
      _initializerDefineProperty(_this, "msTeamsGroupMenuItem", _descriptor15, _this);
      return _this;
    }
    _exports = ShareBlock;
    _inheritsLoose(ShareBlock, _RuntimeBuildingBlock);
    var _proto = ShareBlock.prototype;
    /**
     * Retrieves the share option from the shell configuration asynchronously and prepare the content of the menu button.
     * Options order are:
     * - Send as Email
     * - Share as Jam (if available)
     * - Teams options (if available)
     * - Save as tile.
     * @param view The view this building block is used in
     * @param appComponent The AppComponent instance
     */
    _proto._initializeMenuItems = async function _initializeMenuItems(view, appComponent) {
      let isTeamsModeActive = false;
      if (appComponent.getEnvironmentCapabilities().getCapabilities().Collaboration) {
        const {
          default: CollaborationHelper
        } = await __ui5_require_async("sap/suite/ui/commons/collaboration/CollaborationHelper");
        isTeamsModeActive = await CollaborationHelper.isTeamsModeActive();
      }
      if (isTeamsModeActive) {
        //need to clear the visible property bindings otherwise when the binding value changes then it will set back the visible to the resolved value
        this.menuButton.current?.unbindProperty("visible", true);
        this.menuButton.current?.setVisible(false);
        return;
      }
      const controller = view.getController();
      const shellServices = appComponent.getShellServices();
      const isPluginInfoStable = await shellServices.waitForPluginsLoad();
      if (!isPluginInfoStable) {
        // In case the plugin info is not yet available we need to do this computation again on the next button click
        const internalButton = this.menuButton.current?.getAggregation("_control");
        internalButton?.attachEventOnce("press", {}, () => this._initializeMenuItems, this);
      }
      this._blockInternalConfig = this._getShareBlockConfig(view);
      await this._addMenuItems(controller, shellServices);
      this.setShareOptionsVisibility();
    }

    /**
     * Add share options as menu items to the share button.
     * @param controller Page controller
     * @param shellServices Shell Services
     */;
    _proto._addMenuItems = async function _addMenuItems(controller, shellServices) {
      this._addSendEmailOption(controller);
      await this._addShellBasedMenuItems(controller, shellServices);
    }

    /**
     * Add send email option to menu button.
     * @param controller Page controller
     */;
    _proto._addSendEmailOption = function _addSendEmailOption(controller) {
      if (this.shareOptions?.showSendEmail ?? true) {
        this?.menu?.current?.addItem(_jsx(MenuItem, {
          ref: this.sendEmailMenuItem,
          text: this.getTranslatedText("T_SEMANTIC_CONTROL_SEND_EMAIL"),
          icon: "sap-icon://email",
          press: async () => controller.share._triggerEmail()
        }));
      }
    }

    /**
     * Add UShell based share options.
     * @param controller Page controller
     * @param shellServices Shell Services
     */;
    _proto._addShellBasedMenuItems = async function _addShellBasedMenuItems(controller, shellServices) {
      const hasUshell = shellServices.hasUShell();
      if (hasUshell) {
        // share via JAM
        this._addShareViaJAMOption(controller, shellServices);

        // Prepare teams menu items
        await this._addMSTeamsOptions(controller);

        // Prepare Collaboration Manager Options
        await this._addCollaborationManagerOption(controller);

        // Save as Tile
        await this._addSaveAsTileOption(controller);
      }
    }

    /**
     * Add CM option.
     * @param controller The controller instance
     * @returns MenuItems
     */;
    _proto._addCollaborationManagerOption = async function _addCollaborationManagerOption(controller) {
      try {
        const collaborativeToolsService = controller.getAppComponent().getCollaborativeToolsService();
        const collaborationOption = await collaborativeToolsService.getCollaborationManagerOption();
        if (collaborationOption && (this.shareOptions?.showCollaborationManager ?? false)) {
          const menuItem = _jsx(MenuItem, {
            ref: this.shareAsCollaborationManager,
            text: collaborationOption.text,
            icon: collaborationOption.icon,
            press: async event => this._collaborationManagerButtonPress(collaborationOption.press, event)
          });
          FESRHelper.setSemanticStepname(menuItem, "press", collaborationOption.fesrStepName);
          this?.menu?.current?.addItem(menuItem);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        Log.error(`FE : Adding Collaboration Manager Option : ${message}`);
      }
    };
    _proto._collaborationManagerButtonPress = async function _collaborationManagerButtonPress(collaborationCallBack, event) {
      const clickedMenuItem = event.getSource();
      const view = CommonUtils.getTargetView(clickedMenuItem);
      const controller = view.getController();
      await controller.share._adaptShareMetadata();
      const shareInfoModel = view.getModel("shareInfo");
      if (shareInfoModel) {
        const shareInfo = shareInfoModel.getData();
        const {
          collaborationInfo
        } = shareInfo;
        collaborationCallBack(collaborationInfo.appTitle, collaborationInfo.url);
      }
    }

    /**
     * Add share via JAM option.
     * @param controller Page controller
     * @param shellServices Shell Services
     */;
    _proto._addShareViaJAMOption = function _addShareViaJAMOption(controller, shellServices) {
      const hasJam = !!shellServices.isJamActive?.();
      if (hasJam) {
        this?.menu?.current?.addItem(_jsx(MenuItem, {
          ref: this.shareViaJAMMenuItem,
          text: this.getTranslatedText("T_COMMON_SAPFE_SHARE_JAM"),
          icon: "sap-icon://share-2",
          press: async () => controller.share._triggerShareToJam()
        }));
      }
    }

    /**
     * Add options to share via Microsoft Teams.
     * @param controller PageController
     */;
    _proto._addMSTeamsOptions = async function _addMSTeamsOptions(controller) {
      try {
        if (this._blockInternalConfig?.showMsTeamsOptions === false) {
          return;
        }
        const collaborativeToolsService = controller.getAppComponent().getCollaborativeToolsService();
        const shareCollaborationOptions = await collaborativeToolsService.getTeamsCollabOptionsViaShare({
          isShareAsCardEnabled: this._getIsShareAsCardEnabled()
        });
        if (!shareCollaborationOptions) {
          return;
        }
        for (const collaborationOption of shareCollaborationOptions) {
          const menuItemSettings = this._getMsTeamsMenuItemSettings(collaborationOption);
          const subOptions = menuItemSettings.items;
          // Multiple sub options are grouped into single teams group menu item.
          const menuItemKey = Array.isArray(subOptions) && subOptions.length ? enumShareOption.MS_TEAMS_GROUP : collaborationOption.key;
          this._addMsTeamsMenuItem(menuItemSettings, menuItemKey, collaborationOption.fesrStepName);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        Log.error(`FE : Buildingblock : Share : adding MS teams options : ${message}`);
      }
    }

    /**
     * Add save as tile option.
     * @param controller Page controller
     */;
    _proto._addSaveAsTileOption = async function _addSaveAsTileOption(controller) {
      try {
        // set save as tile
        // for now we need to create addBookmarkButton to use the save as tile feature.
        // In the future save as tile should be available as an API or a MenuItem so that it can be added to the Menu button.
        // This needs to be discussed with AddBookmarkButton team.
        // Included in a hasUshell branch
        const {
          default: AddBookmarkButton
        } = await __ui5_require_async("sap/ushell/ui/footerbar/AddBookmarkButton");
        const addBookmarkButton = new AddBookmarkButton();
        if (addBookmarkButton.getEnabled()) {
          this?.menu?.current?.addItem(_jsx(MenuItem, {
            ref: this.saveAsTileMenuItem,
            text: addBookmarkButton.getText(),
            icon: addBookmarkButton.getIcon(),
            press: async () => controller.share._saveAsTile(this.saveAsTileMenuItem.current),
            children: {
              dependents: [addBookmarkButton]
            }
          }));
        } else {
          addBookmarkButton.destroy();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        Log.error(`FE : Buildingblock : Share : adding Save as tile option : ${message}`);
      }
    }

    /**
     * Get isShareAsCardEnabled to fetch supported collaboration options.
     * @returns Boolean.
     */;
    _proto._getIsShareAsCardEnabled = function _getIsShareAsCardEnabled() {
      const showShareAsCard = this.msTeamsOptions?.enableCard ?? false;
      if (typeof showShareAsCard === "boolean") {
        return showShareAsCard;
      } else if (typeof showShareAsCard === "string") {
        // "true" or a binding expression
        try {
          return showShareAsCard === "true" || Boolean(BindingParser.complexParser(showShareAsCard));
        } catch (err) {
          Log.error(err);
        }
      }
      return true;
    }

    /**
     * Get Menu Item settings for main MS teams option.
     * @param collaborationOption Root Collaboration Option
     * @returns MenuItemSettings
     */;
    _proto._getMsTeamsMenuItemSettings = function _getMsTeamsMenuItemSettings(collaborationOption) {
      const items = this._getMsTeamsSubOptions(collaborationOption?.subOptions);
      const menuItemSettings = {
        text: collaborationOption.text,
        icon: collaborationOption.icon,
        items
      };
      if (items.length === 0) {
        // if there are no sub option then the main option should be clickable
        // so add a press handler.
        menuItemSettings.press = async event => this.collaborationMenuItemPress(event);
        menuItemSettings["customData"] = new CustomData({
          key: "collaborationData",
          value: collaborationOption
        });
      }
      return menuItemSettings;
    }

    /**
     * Add main MS Teams Menu Item to the Share building block menu.
     * @param menuItemSettings Menu Item settings
     * @param menuItemKey MS teams option key
     * @param fesrStepName Step name
     */;
    _proto._addMsTeamsMenuItem = function _addMsTeamsMenuItem(menuItemSettings, menuItemKey, fesrStepName) {
      const menuItem = _jsx(MenuItem, {
        ref: this._getMenuItemReference(menuItemKey),
        text: menuItemSettings.text,
        icon: menuItemSettings.icon,
        customData: menuItemSettings.customData,
        items: menuItemSettings.items
      });
      if (menuItemSettings.press) {
        //
        menuItem.attachPress(menuItemSettings.press);
        if (fesrStepName) {
          FESRHelper.setSemanticStepname(menuItem, "press", fesrStepName);
        }
      }
      this?.menu?.current?.addItem(menuItem);
    }

    /**
     * Get Menu Items corresponding to MS teams sub options.
     * @param subOptions Array of collaboration options
     * @returns MenuItems
     */;
    _proto._getMsTeamsSubOptions = function _getMsTeamsSubOptions(subOptions) {
      if (!Array.isArray(subOptions)) {
        return [];
      }
      return subOptions.reduce((menuItems, subOption) => {
        const subMenuItem = _jsx(MenuItem, {
          ref: this._getMenuItemReference(subOption.key),
          text: subOption.text,
          icon: subOption.icon,
          press: async event => this.collaborationMenuItemPress(event),
          customData: new CustomData({
            key: "collaborationData",
            value: subOption
          })
        });
        if (subOption.fesrStepName) {
          FESRHelper.setSemanticStepname(subMenuItem, "press", subOption.fesrStepName);
        }
        return [...menuItems, subMenuItem];
      }, []);
    }

    /**
     * Press handler for collaboration menu items.
     *`
     * @param event Event object
     */;
    _proto.collaborationMenuItemPress = async function collaborationMenuItemPress(event) {
      const clickedMenuItem = event.getSource();
      const view = CommonUtils.getTargetView(clickedMenuItem);
      const controller = view.getController();
      await controller.share._adaptShareMetadata();
      const shareInfoModel = view.getModel("shareInfo");
      if (shareInfoModel) {
        const shareInfo = shareInfoModel.getData();
        const {
          collaborationInfo
        } = shareInfo;
        const collaborationData = clickedMenuItem.data("collaborationData");
        const collaborativeToolsService = controller.getAppComponent().getCollaborativeToolsService();
        const teamsHelperService = (await collaborativeToolsService.getCollaborationServices()).oTeamsHelperService;
        if (collaborationData["key"] === enumMSTeamsOption.COLLABORATION_MSTEAMS_CARD) {
          const isShareAsCardEnabled = teamsHelperService.isFeatureFlagEnabled();
          const cardDefinition = isShareAsCardEnabled ? await controller.share.getCardDefinition() : undefined;
          let cardId;
          if (cardDefinition) {
            const shellServiceHelper = controller.getAppComponent().getShellServices();
            const {
              semanticObject,
              action
            } = shellServiceHelper.parseShellHash(document.location.hash);
            cardId = `${semanticObject}_${action}`;
          } else {
            const reason = !isShareAsCardEnabled ? "Feature flag disabled in collaboration teams helper" : "Card definition was not created";
            Log.info(`FE V4 : Share block : share as Card : ${reason}`);
          }
          collaborationInfo["cardManifest"] = cardDefinition;
          collaborationInfo["cardId"] = cardId;
        }
        teamsHelperService.share(collaborationData, collaborationInfo);
      }
    }

    /**
     * Set the visibility of individual UI elements of the Share building block. Like, MenuItems, MenuButton and Command execution.
     */;
    _proto.setShareOptionsVisibility = function setShareOptionsVisibility() {
      const optionKeys = Object.keys(enumShareOption);
      const visibleBindingExps = optionKeys.reduce((bindingToolkitExps, option) => {
        const exp = this._getShareOptionVisibilityExpression(option);
        this._setShareOptionVisibility(option, exp);
        return [...bindingToolkitExps, exp];
      }, []);
      const shareBlockVisibleExp = and(this.visible, or(...visibleBindingExps));
      if (this.menuButton.current && this.cmdExecution.current) {
        this._bindUIVisibility(this.menuButton.current, shareBlockVisibleExp);
        this._bindUIVisibility(this.cmdExecution.current, shareBlockVisibleExp);
      }
    }

    /**
     * Get Menu Item reference of the corresponding Share option.
     *`
     * @param option Share option key
     * @returns Reference to the Menu Item
     */;
    _proto._getMenuItemReference = function _getMenuItemReference(option) {
      let ref;
      switch (option) {
        case enumShareOption.COLLABORATION_MSTEAMS_CARD:
          ref = this.shareAsCardMenuItem;
          break;
        case enumShareOption.COLLABORATION_MSTEAMS_CHAT:
          ref = this.shareViaChatMenuItem;
          break;
        case enumShareOption.COLLABORATION_MSTEAMS_TAB:
          ref = this.shareAsTabMenuItem;
          break;
        case enumShareOption.SEND_EMAIL:
          ref = this.sendEmailMenuItem;
          break;
        case enumShareOption.SHARE_JAM:
          ref = this.shareViaJAMMenuItem;
          break;
        case enumShareOption.SAVE_AS_TILE:
          ref = this.saveAsTileMenuItem;
          break;
        case enumShareOption.MS_TEAMS_GROUP:
          ref = this.msTeamsGroupMenuItem;
          break;
        case enumShareOption.SHARE_COLLABORATION_MANAGER:
          ref = this.shareAsCollaborationManager;
          break;
        default:
          break;
      }
      return ref;
    }

    /**
     * Get the visibility expression of share option based on the building block configuration.
     * @param option Share option name of the visible expression that needs to be fetched.
     * @returns Binding toolkit expression.
     */;
    _proto._getShareOptionVisibilityExpression = function _getShareOptionVisibilityExpression(option) {
      const optionMenuItemRef = this._getMenuItemReference(option);
      if (!optionMenuItemRef?.current) {
        return constant(false);
      }
      let exp;
      switch (option) {
        case enumShareOption.COLLABORATION_MSTEAMS_CARD:
        case enumShareOption.COLLABORATION_MSTEAMS_CHAT:
        case enumShareOption.COLLABORATION_MSTEAMS_TAB:
          exp = this._getMSTeamsShareOptionVisibility(option);
          break;
        case enumShareOption.SHARE_COLLABORATION_MANAGER:
          exp = this._getCollaborationOptionExpression();
          break;
        case enumShareOption.SEND_EMAIL:
          {
            const showSendEmail = this.shareOptions?.showSendEmail ?? true;
            const optionExp = resolveBindingString(showSendEmail, "boolean");
            const internalOption = this._blockInternalConfig.showSendEmail ?? true;
            const internalOptionExp = resolveBindingString(internalOption, "boolean");
            exp = and(optionExp, internalOptionExp);
            break;
          }
        case enumShareOption.SHARE_JAM:
        case enumShareOption.SAVE_AS_TILE:
          {
            // No overrides for Share via Jam and Save as tile yet.
            exp = constant(true);
            break;
          }
        case enumShareOption.MS_TEAMS_GROUP:
          {
            const msTeamsConfigExp = this._getShowMsTeamsOptionsExpression();
            const msTeamsOptions = Object.keys(enumMSTeamsOption);
            const allMSTeamsOptionsExps = msTeamsOptions.reduce((bindingToolkitExp, msTeamsOption) => {
              const msTeamOptionExp = this._getMSTeamsShareOptionVisibility(msTeamsOption);
              return [...bindingToolkitExp, msTeamOptionExp];
            }, []);
            exp = and(msTeamsConfigExp, or(...allMSTeamsOptionsExps));
            break;
          }
        default:
          exp = constant(false);
      }
      return exp;
    };
    _proto._getCollaborationOptionExpression = function _getCollaborationOptionExpression() {
      const showCollaborationManager = this.shareOptions?.showCollaborationManager ?? false;
      const optionExp = resolveBindingString(showCollaborationManager, "boolean");
      const internalOption = this._blockInternalConfig.showCollaborationManager ?? true;
      const internalOptionExp = resolveBindingString(internalOption, "boolean");
      return and(optionExp, internalOptionExp);
    }

    /**
     * Get expression for showMsTeamsOptions share option based on the building block configuration.
     * @returns Binding toolkit expression.
     */;
    _proto._getShowMsTeamsOptionsExpression = function _getShowMsTeamsOptionsExpression() {
      const internalOption = this._blockInternalConfig.showMsTeamsOptions ?? true;
      return resolveBindingString(internalOption, "boolean");
    }

    /**
     * Get binding toolkit expression for share as card visibility.
     * @returns Binding toolkit expression.
     */;
    _proto._getShareAsCardVisibility = function _getShareAsCardVisibility() {
      let exp;
      const shareAsCardOptionRef = this._getMenuItemReference(enumShareOption.COLLABORATION_MSTEAMS_CARD);
      if (shareAsCardOptionRef?.current) {
        const expShowMSTeamsOptions = this._getShowMsTeamsOptionsExpression();
        const showShareAsCard = this.msTeamsOptions?.enableCard ?? true;
        const optionExp = resolveBindingString(showShareAsCard, "boolean");
        const internalOption = this._blockInternalConfig.enableCard ?? true;
        const internalOptionExp = resolveBindingString(internalOption, "boolean");
        const expShowShareAsCard = and(optionExp, internalOptionExp);
        exp = and(not(UI.IsEditable), expShowMSTeamsOptions, expShowShareAsCard);
      } else {
        exp = constant(false);
      }
      return exp;
    }

    /**
     * Get binding toolkit expression for share option's visibility.
     * @param option Share option key
     * @returns Binding toolkit expression.
     */;
    _proto._getMSTeamsShareOptionVisibility = function _getMSTeamsShareOptionVisibility(option) {
      if (option === enumShareOption.COLLABORATION_MSTEAMS_CARD) {
        return this._getShareAsCardVisibility();
      }
      // No overrides for Share as Tab and Chat yet.

      const msTeamsOptionRef = this._getMenuItemReference(option);
      return msTeamsOptionRef?.current ? this._getShowMsTeamsOptionsExpression() : constant(false);
    }

    /**
     * Set visiblity of individual share option's MenuItem.
     * @param option Share option key
     * @param expression Visibility binding toolkit expression
     */;
    _proto._setShareOptionVisibility = function _setShareOptionVisibility(option, expression) {
      const menuItemRef = this._getMenuItemReference(option);
      if (menuItemRef?.current) {
        this._bindUIVisibility(menuItemRef.current, expression);
      }
    }

    /**
     * Bind the UI element's visibility property.
     * @param item UI element
     * @param expression Expression to bind.
     */;
    _proto._bindUIVisibility = function _bindUIVisibility(item, expression) {
      // NOTE: We need convert the binding toolkit expression to the format that can be consumed by the UI element.
      // At runtime, we can't use binding toolkit expression or compiled expression directly to bind the visibility or set the visible property or the UI element.
      // We would need to convert the binding toolkit expression -> UI5 BindingInfo to bind the UI element.
      const compiledExp = compileExpression(expression);
      if (compiledExp && compiledExp.startsWith("{") && compiledExp?.endsWith("}")) {
        // Probable binding
        try {
          const parsedExp = BindingParser.complexParser(compiledExp);
          item.bindProperty("visible", parsedExp);
        } catch (err) {
          Log.error(err);
        }
      } else if (compiledExp === "false") {
        // Statically false
        item.unbindProperty("visible", true);
        item.setVisible(false);
      }
    };
    _proto._getShareBlockConfig = function _getShareBlockConfig(view) {
      const viewData = view.getViewData();
      const viewShareConfigs = viewData?.share;
      const controller = view.getController();
      const feAppShareConfigs = controller.getAppComponent().getManifestEntry("sap.fe")?.app?.share;
      const showSendEmail = this._getOptionBlockConfig(feAppShareConfigs?.showSendEmail, viewShareConfigs?.showSendEmail);
      const showCollaborationManager = this._getOptionBlockConfig(feAppShareConfigs?.showCollaborationManager, viewShareConfigs?.showCollaborationManager);
      const showMsTeamsOptions = this._getOptionBlockConfig(feAppShareConfigs?.teams?.showMsTeamsOptions, viewShareConfigs?.teams?.showMsTeamsOptions);
      const enableCard = this._getOptionBlockConfig(feAppShareConfigs?.teams?.asCard, viewShareConfigs?.teams?.asCard);
      return {
        showSendEmail,
        showMsTeamsOptions,
        enableCard,
        showCollaborationManager
      };
    };
    _proto._getOptionBlockConfig = function _getOptionBlockConfig(feAppSetting, viewLevelSetting) {
      const feAppExp = typeof feAppSetting === "string" ? resolveBindingString(feAppSetting) : constant(feAppSetting ?? true);
      const viewLevelExp = typeof viewLevelSetting === "string" ? resolveBindingString(viewLevelSetting) : constant(viewLevelSetting ?? true);
      return compileExpression(and(feAppExp, viewLevelExp));
    };
    _proto.getContent = function getContent(view, appComponent) {
      // Ctrl+Shift+S is needed for the time being but this needs to be removed after backlog from menu button
      const menuButton = _jsx(ShareAPI, {
        id: this.id,
        children: _jsx(OverflowToolbarMenuButton, {
          text: "{sap.fe.i18n>M_COMMON_SAPFE_ACTION_SHARE}",
          ref: this.menuButton,
          icon: "sap-icon://action",
          tooltip: "{sap.fe.i18n>M_COMMON_SAPFE_ACTION_SHARE} (Ctrl+Shift+S)",
          children: _jsx(Menu, {
            ref: this.menu
          })
        })
      });
      view.addDependent(_jsx(CommandExecution, {
        ref: this.cmdExecution,
        command: "Share",
        execute: () => {
          this.menuButton.current?.getMenu().openBy(this.menuButton.current, true);
        }
      }));
      // The initialization is asynchronous, so we just trigger it and hope for the best :D
      this.isInitialized = this._initializeMenuItems(view, appComponent).catch(error => {
        Log.error(error);
      });
      return menuButton;
    };
    return ShareBlock;
  }(RuntimeBuildingBlock), _descriptor = _applyDecoratedDescriptor(_class2.prototype, "id", [_dec2], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "visible", [_dec3], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: function () {
      return constant(true);
    }
  }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "shareOptions", [_dec4], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "msTeamsOptions", [_dec5], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "menuButton", [_dec6], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "cmdExecution", [_dec7], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "menu", [_dec8], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "saveAsTileMenuItem", [_dec9], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "shareAsCollaborationManager", [_dec10], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "shareViaJAMMenuItem", [_dec11], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "sendEmailMenuItem", [_dec12], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "shareAsCardMenuItem", [_dec13], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "shareViaChatMenuItem", [_dec14], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "shareAsTabMenuItem", [_dec15], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "msTeamsGroupMenuItem", [_dec16], {
    configurable: true,
    enumerable: true,
    writable: true,
    initializer: null
  }), _class2)) || _class);
  _exports = ShareBlock;
  return _exports;
}, false);
//# sourceMappingURL=Share.block-dbg.js.map
