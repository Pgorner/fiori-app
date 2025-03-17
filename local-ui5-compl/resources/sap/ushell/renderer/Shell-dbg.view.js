// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/Log",
    "sap/m/Avatar",
    "sap/m/library",
    "sap/ui/core/Component",
    "sap/ui/core/Element",
    "sap/ushell/renderer/shellHeader/ShellHeader.controller",
    "sap/ushell/ui/launchpad/AccessibilityCustomData",
    "sap/ushell/EventHub",
    "sap/ushell/resources",
    "sap/ushell/utils",
    "sap/ui/core/mvc/View",
    "sap/ui/core/mvc/XMLView",
    "sap/ui/core/Fragment",
    "sap/ushell/api/NewExperience",
    "sap/ushell/renderer/ShellLayout",
    "sap/ushell/renderer/Shell.controller", // controller must be preloaded to avoid naming clashes
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/Container",
    "sap/ushell/state/BindingHelper"
], function (
    Log,
    Avatar,
    mobileLibrary,
    Component,
    Element,
    ShellHeaderController,
    AccessibilityCustomData,
    EventHub,
    ushellResources,
    utils,
    View,
    XMLView,
    Fragment,
    NewExperience,
    ShellLayout,
    ShellController,
    ShellModel,
    StateManager,
    Container,
    BindingHelper
) {
    "use strict";

    // shortcut for sap.m.AvatarSize
    const AvatarSize = mobileLibrary.AvatarSize;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    // shortcut for sap.ushell.state.StateManager.ShellMode
    const ShellMode = StateManager.ShellMode;

    // shortcut for sap.ushell.renderer.ShellLayout.ShellArea
    const ShellArea = ShellLayout.ShellArea;

    const BINDING_TYPE = {
        Property: "Property",
        List: "List"
    };

    return View.extend("sap.ushell.renderer.Shell", {
        getControllerName: function () {
            return "sap.ushell.renderer.Shell";
        },

        waitForShellLayout: function () {
            if (!this._oShellLayoutPromise) {
                this._oShellLayoutPromise = new Promise(function (resolve) {
                    this.getController().addDoable(EventHub.once("ShellLayoutApplied").do(resolve));
                }.bind(this));
            }
            return this._oShellLayoutPromise;
        },

        getViewDataConfig: function () {
            var oViewData = this.getViewData() || {};
            var oConfig = oViewData.config || {};
            return oConfig;
        },

        createContent: function () {
            this._createUserActionsMenuButton(ShellModel.getConfigModel());

            // Change config if more then three buttons moved to the header
            this._allowUpToThreeActionInShellHeader();
            StateManager.init(this.getViewDataConfig());

            // BackgroundImage
            this.initBackgroundImage();

            // ShellHeader + HeaderControlManager.init
            var oShellHeaderPromise = this.createShellHeader();

            // NavigationBar
            this.setNavigationBarMinHeight();

            // RendererRootView / viewPortContainer
            var oRendererRootViewPromise = this.createRendererRootView();

            this.setDisplayBlock(true);

            utils.setPerformanceMark("FLP - Shell.view rendering started!");

            return Promise.all([
                oRendererRootViewPromise,
                oShellHeaderPromise // we have to wait as well otherwise the HeaderControlManager is initialized late
            ]).then(function (aResults) {
                var oRendererRootView = aResults[0];

                this.initCanvasShapesManager();

                return oRendererRootView;
            }.bind(this));
        },

        initBackgroundImage: function () {
            this.waitForShellLayout().then(function () {
                var oDomRef = document.getElementById(ShellArea.BackgroundImage);
                var sBackgroundHtml = [
                    // "Shell Canvas" category in ThemeDesigner
                    "<div class='sapUiShellBackgroundImage sapUiGlobalBackgroundImageForce sapUshellShellBG sapContrastPlus'></div>",
                    // "Application Background" category in ThemeDesigner
                    "<div class='sapMShellBG sapUiGlobalBackgroundImage'></div>"
                ].join("\n");
                oDomRef.insertAdjacentHTML("afterbegin", sBackgroundHtml);
            });
        },

        createRendererRootView: function () {
            var oController = this.getController();
            return Fragment.load({
                name: "sap.ushell.renderer.RendererRootView",
                controller: oController
            }).then(function (oRendererRootView) {
                BindingHelper.overrideUpdateAggregation(oRendererRootView);

                return oRendererRootView;
            });
        },

        createShellHeader: function () {
            var oHeaderController = new ShellHeaderController();

            return Fragment.load({
                name: "sap.ushell.renderer.shellHeader.ShellHeader",
                controller: oHeaderController
            }).then(function (oShellHeader) {
                BindingHelper.overrideUpdateAggregation(oShellHeader);

                if (StateManager.getShellMode() === ShellMode.Embedded) {
                    oShellHeader.setNoLogo();
                }

                // Assign models to the Shell Header
                oShellHeader.setModel(ushellResources.i18nModel, "i18n");
                oShellHeader.setModel(NewExperience.getModel(), "newExperience");
                oShellHeader.setModel(ShellModel.getModel(), "shellModel");
                this.addDanglingControl(oShellHeader);
                // save for later use
                this._oShellHeader = oShellHeader;

                this.waitForShellLayout().then(function () {
                    oShellHeader.placeAt(ShellArea.ShellHeader, "only");
                    oHeaderController.onInit();
                });
            }.bind(this));
        },

        setNavigationBarMinHeight: function () {
            return Container.getServiceAsync("Menu")
                .then(function (oMenuService) {
                    return oMenuService.isMenuEnabled();
                })
                .then(function (bMenuEnabled) {
                    if (!bMenuEnabled) {
                        return;
                    }

                    this.waitForShellLayout().then(function () {
                        var navigationBar = document.getElementById(ShellArea.NavigationBar);
                        navigationBar.classList.add("sapUshellMenuBarHeight");
                    });
                }.bind(this))
                .catch(function (vError) {
                    Log.info("Could not apply min-height of the navigationBar", vError);
                });
        },

        createRightFloatingContainer: function () {
            this.addPendingInitialization(new Promise(function (resolve) {
                sap.ui.require(["sap/ushell/ui/shell/RightFloatingContainer"], function (RightFloatingContainer) {
                    var oRightFloatingContainer = new RightFloatingContainer({
                        id: "right-floating-container",
                        top: "2",
                        hideItemsAfterPresentation: true,
                        visible: "{shellModel>/rightFloatingContainer/visible}",
                        floatingContainerItems: {
                            path: "shellModel>/rightFloatingContainer/items",
                            factory: BindingHelper.factory
                        }
                    });
                    BindingHelper.overrideUpdateAggregation(oRightFloatingContainer);

                    oRightFloatingContainer.setModel(ShellModel.getModel(), "shellModel");
                    this.addDanglingControl(oRightFloatingContainer);
                    // save for later use
                    this._oRightFloatingContainer = oRightFloatingContainer;
                    resolve();

                    this.waitForShellLayout().then(function () {
                        oRightFloatingContainer.placeAt(ShellArea.RightFloatingContainer, "only");
                    });
                }.bind(this));
            }.bind(this)));
        },

        initCanvasShapesManager: function () {
            this.bindFactory({
                model: ShellModel.getConfigModel(),
                factory: this.createCanvasShapesManager.bind(this),
                bindingPath: "/enableBackGroundShapes",
                bindingType: BINDING_TYPE.Property,
                valueCheck: function (bValue) {
                    return !!bValue;
                }
            });
        },

        createCanvasShapesManager: function () {
            // The initial drawing of the canvas shapes is triggered within the manager
            sap.ui.require(["sap/ushell/CanvasShapesManager"]);
        },

        createSubHeader: function () {
            sap.ui.require(["sap/ushell/ui/shell/SubHeader"], function (SubHeader) {
                var oSubHeader = new SubHeader({
                    id: "subhdr",
                    content: {
                        path: "shellModel>/subHeader/items",
                        factory: BindingHelper.factory
                    }
                });
                BindingHelper.overrideUpdateAggregation(oSubHeader);

                oSubHeader.setModel(ShellModel.getModel(), "shellModel");
                this.addDanglingControl(oSubHeader);

                this.waitForShellLayout().then(function () {
                    oSubHeader.placeAt(ShellArea.SubHeader, "only");
                });
            }.bind(this));
        },

        createFloatingContainer: async function () {
            const oComponent = await Component.create({
                name: "sap.ushell.components.shell.FloatingContainer"
            });
            this.addDanglingControl(oComponent);
            return oComponent;
        },

        createSidePane: function () {
            sap.ui.require(["sap/ushell/ui/shell/SidePane"], function (SidePane) {
                var oSidePane = new SidePane({
                    id: "shell-sidePane",
                    visible: "{shellModel>/sidePane/visible}",
                    content: {
                        path: "shellModel>/sidePane/items",
                        factory: BindingHelper.factory
                    }
                });
                BindingHelper.overrideUpdateAggregation(oSidePane);

                oSidePane.setModel(ShellModel.getModel(), "shellModel");
                this.addDanglingControl(oSidePane);

                this.waitForShellLayout().then(function () {
                    oSidePane.placeAt(ShellArea.SidePane, "only");
                });
            }.bind(this));
        },

        createToolArea: function () {
            sap.ui.require(["sap/ushell/ui/shell/ToolArea"], function (ToolArea) {
                var oShellToolArea = new ToolArea({
                    id: "shell-toolArea",
                    visible: "{shellModel>/toolArea/visible}",
                    toolAreaItems: {
                        path: "shellModel>/toolArea/items",
                        factory: BindingHelper.factory
                    }
                });
                BindingHelper.overrideUpdateAggregation(oShellToolArea);

                oShellToolArea.setModel(ShellModel.getModel(), "shellModel");
                this.addDanglingControl(oShellToolArea);

                this.waitForShellLayout().then(function () {
                    oShellToolArea.placeAt(ShellArea.ToolArea, "only");
                });
            }.bind(this));
        },

        /**
         * @deprecated since 1.120.0
         */
        createFloatingActions: function () {
            sap.ui.require(["sap/ushell/ui/shell/ShellFloatingActions"], function (ShellFloatingActions) {
                var oShellFloatingActions = new ShellFloatingActions({
                    id: "shell-floatingActions",
                    floatingActions: {
                        path: "shellModel>/floatingActions/items",
                        factory: BindingHelper.factory
                    }
                });
                BindingHelper.overrideUpdateAggregation(oShellFloatingActions);

                oShellFloatingActions.setModel(ShellModel.getModel(), "shellModel");
                this.addDanglingControl(oShellFloatingActions);

                this.waitForShellLayout().then(function () {
                    oShellFloatingActions.placeAt(ShellArea.FloatingActions, "only");
                });
            }.bind(this));
        },

        initAllMyAppsView: function () {
            return Container.getServiceAsync("AllMyApps").then(function (oAllMyApps) {
                if (oAllMyApps.isEnabled()) {
                    return this.createAllMyAppsView();
                }
            }.bind(this));
        },

        createAllMyAppsView: function () {
            return XMLView.create({
                id: "allMyAppsView",
                viewName: "sap.ushell.renderer.allMyApps.AllMyApps"
            }).then(function (allMyAppsView) {
                allMyAppsView.setModel(ShellModel.getConfigModel(), "configModel");
                allMyAppsView.setModel(ushellResources.i18nModel, "i18n");
                allMyAppsView.addCustomData(new AccessibilityCustomData({
                    key: "aria-label",
                    value: ushellResources.i18n.getText("allMyApps_headerTitle"),
                    writeToDom: true
                }));
                this.addDanglingControl(allMyAppsView);
                this.getShellHeader().getAppTitle().setAllMyApps(allMyAppsView);
            }.bind(this));
        },

        /**
         * Begin factory functions for lazy instantiation of Shell Layout controls
         */
        createPostCoreExtControls: function () {
            var oShellModel = ShellModel.getModel();

            // apply the highest z-index used by the shell
            sap.ui.require(["sap/ui/core/Popup"], function (Popup) {
                Popup.setInitialZIndex(11);
            });

            // FloatingContainer
            this.bindFactory({
                model: oShellModel,
                factory: this.createFloatingContainer.bind(this),
                // CollaborationManager (sap.h2hchat.ui) requires the content to be already invisibly rendered
                bindingPath: "/floatingContainer/items",
                bindingType: BINDING_TYPE.List,
                valueCheck: function (aValues) {
                    return !!aValues.length;
                }
            });

            // RightFloatingContainer
            this.bindFactory({
                model: oShellModel,
                factory: this.createRightFloatingContainer.bind(this),
                bindingPath: "/rightFloatingContainer/visible",
                bindingType: BINDING_TYPE.Property,
                valueCheck: function (bValue) {
                    return !!bValue;
                }
            });

            // SubHeader
            this.bindFactory({
                model: oShellModel,
                factory: this.createSubHeader.bind(this),
                bindingPath: "/subHeader/items",
                bindingType: BINDING_TYPE.List,
                valueCheck: function (aValues) {
                    return !!aValues.length;
                }
            });

            // ToolArea
            this.bindFactory({
                model: oShellModel,
                factory: this.createToolArea.bind(this),
                bindingPath: "/toolArea/visible",
                bindingType: BINDING_TYPE.Property,
                valueCheck: function (bValue) {
                    return !!bValue;
                }
            });

            // (Left)SidePane
            this.bindFactory({
                model: oShellModel,
                factory: this.createSidePane.bind(this),
                bindingPath: "/sidePane/visible",
                bindingType: BINDING_TYPE.Property,
                valueCheck: function (bValue) {
                    return !!bValue;
                }
            });

            /**
             * code shall be automatically removed by tooling
             * @deprecated since 1.120.0
             */
            this.bindFactory({ // FloatingActions (deprecated)
                model: oShellModel,
                factory: this.createFloatingActions.bind(this),
                bindingPath: "/floatingActions/items",
                bindingType: BINDING_TYPE.List,
                valueCheck: function (aValues) {
                    return !!aValues.length;
                }
            });

            this.addPendingInitialization(this.initAllMyAppsView());
        },

        /**
         * allow up to 3 actions in shell header
         */
        _allowUpToThreeActionInShellHeader: function () {
            const aParameter = [
                "moveAppFinderActionToShellHeader",
                "moveUserSettingsActionToShellHeader",
                "moveContactSupportActionToShellHeader",
                "moveEditHomePageActionToShellHeader"
            ];
            const oConfig = this.getViewDataConfig();

            // only allow the first three actions to be moved to the shell header
            aParameter.reduce((iCount, sParam) => {
                if (iCount >= 3) {
                    oConfig[sParam] = false;
                    return iCount;
                }
                if (oConfig[sParam]) {
                    iCount++;
                }
                return iCount;
            }, 0);
        },

        _createUserActionsMenuButton: function (oConfigModel) {
            const oUser = Container.getUser();
            const sTooltip = ushellResources.i18n.getText("UserActionsMenuToggleButtonAria", [oUser.getFullName() || oUser.getId()]);

            const oUserActionsMenuAvatar = new Avatar({
                id: "userActionsMenuHeaderButton",
                src: "{configModel>/userImage/personPlaceHolder}",
                initials: oUser.getInitials(),
                ariaHasPopup: "Menu",
                displaySize: AvatarSize.XS,
                tooltip: sTooltip,
                press: function () {
                    EventHub.emit("showUserActionsMenu", Date.now());
                }
            });
            oUserActionsMenuAvatar.setModel(oConfigModel, "configModel");
            this.addDanglingControl(oUserActionsMenuAvatar);

            StateManager.updateAllBaseStates("header.headEndItems", Operation.Add, "userActionsMenuHeaderButton");
        },


        /**
         * @returns {sap.ui.core.Control} The ShellHeader
         *
         * @private
         * @ui5-restricted sap.ui.rta
         * @since 1.114.0
         */
        getShellHeader: function () {
            return this._oShellHeader;
        },

        getRightFloatingContainer: function () {
            return this._oRightFloatingContainer;
        },

        /**
         * Executes the factory instantly in case the <code>model already fulfills the valueCheck.
         * Otherwise binds the factory against the model path.
         * Once the binding fulfills the valueCheck the binding gets destroyed.
         *
         * @param {object} oSettings The settings
         * @param {sap.ui.model.Model} oSettings.model The model
         * @param {function} oSettings.factory The handler which gets executed
         * @param {string} oSettings.bindingPath The binding path
         * @param {string} oSettings.bindingType The type of binding. Either "Property" or "List".
         * @param {function} oSettings.valueCheck The check function.
         *  it receives the bound property as argument. It should return true once the value fulfills the requirements.
         *
         * @private
         * @since 1.115.0
         */
        bindFactory: function (oSettings) {
            var oModel = oSettings.model;
            var fnFactory = oSettings.factory;
            var sPath = oSettings.bindingPath;
            var sBindingType = oSettings.bindingType;
            var fnValueCheck = oSettings.valueCheck;

            var vValue = oModel.getProperty(sPath);
            if (fnValueCheck(vValue)) { // model already fulfills the requirements
                fnFactory();
            } else {
                var oBinding;
                switch (sBindingType) {
                    case BINDING_TYPE.List:
                        oBinding = oModel.bindList(sPath);
                        break;
                    default: // BINDING_TYPE.Property
                        oBinding = oModel.bindProperty(sPath);
                }
                this.addDanglingBinding(oBinding);
                oBinding.attachChange(function () {
                    vValue = oBinding.getModel().getProperty(oBinding.getPath());
                    if (fnValueCheck(vValue)) {
                        this.removeDanglingBinding(oBinding);
                        oBinding.destroy();

                        fnFactory();
                    }
                }, this);
            }
        },

        /**
         * Adds a binding which is destroyed on Renderer destroy
         * @param {sap.ui.model.Binding} oBinding The Binding
         * @see sap.ushell.renderer.Shell.controller#onExit
         *
         * @private
         * @since 1.114.0
         */
        addDanglingBinding: function (oBinding) {
            this.getController().addDanglingBinding(oBinding);
        },

        /**
         * @param {sap.ui.model.Binding} oBinding The Binding
         * @see sap.ushell.renderer.Shell.controller#onExit
         *
         * @private
         * @since 1.114.0
         */
        removeDanglingBinding: function (oBinding) {
            this.getController().removeDanglingBinding(oBinding);
        },

        /**
         * @param {sap.ui.core.Control} oControl The Control
         * @see sap.ushell.renderer.Shell.controller#onExit
         *
         * @private
         * @since 1.114.0
         */
        addDanglingControl: function (oControl) {
            this.getController().addDanglingControl(oControl);
        },

        /**
         * Adds a promise to the list of initializations
         * Only used in test environments!
         * @param {Promise} oPromise A Promise
         * @returns {Promise} Returns the provided promise to allow chaining
         *
         * @private
         * @since 1.114.0
         */
        addPendingInitialization: function (oPromise) {
            return this.getController().addPendingInitialization(oPromise);
        }
    });
});
