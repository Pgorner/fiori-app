// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/base/Log",
    "sap/base/util/restricted/_debounce",
    "sap/base/util/restricted/_throttle",
    "sap/ui/core/Component",
    "sap/ui/core/EventBus",
    "sap/ui/core/Fragment",
    "sap/ui/Device",
    "sap/ui/model/json/JSONModel",
    "sap/ui/util/Storage",
    "sap/ushell/renderer/ShellLayout",
    "sap/ushell/state/BindingHelper",
    "sap/ushell/state/ShellModel",
    "sap/ushell/state/StateManager",
    "sap/ushell/UIActions"
], (
    Localization,
    Log,
    debounce,
    throttle,
    Component,
    EventBus,
    Fragment,
    Device,
    JSONModel,
    Storage,
    ShellLayout,
    BindingHelper,
    ShellModel,
    StateManager,
    UIActions
) => {
    "use strict";

    // shortcut for sap.ushell.renderer.ShellLayout.ShellArea
    const ShellArea = ShellLayout.ShellArea;

    // shortcut for sap.ushell.state.StateManager.Operation
    const Operation = StateManager.Operation;

    /**
     * @typedef {object} UIActionEvent
     * @property {Event} evt The event object.
     * @property {Element} clone The clone element.
     * @property {boolean} isScrolling Whether the user is scrolling.
     * @property {number} moveX The x position of the move.
     * @property {number} moveY The y position of the move.
     * @private
     */

    /**
     * @typedef {object} UIActionDropEvent
     * @property {Element} clone The clone element.
     * @property {number} deltaX The x position of the move.
     * @property {number} deltaY The y position of the move.
     * @private
     */

    /**
     * @alias DockPosition
     * @enum {string}
     * @private
     */
    const DockPosition = {
        start: "start",
        end: "end"
    };

    /**
     * @alias State
     * The state of the floating container. Only used for storing the state.
     * @enum {string}
     * @private
     */
    const State = {
        floating: "floating",
        dockedRight: "docked:right",
        dockedLeft: "docked:left"
    };

    return Component.extend("sap.ushell.components.shell.FloatingContainer.Component", {
        metadata: {
            manifest: "json",
            library: "sap.ushell"
        },

        init: function () {
            this._bFirstTimeControlRender = true;

            this._oStorage = new Storage(Storage.Type.local, "com.sap.ushell.adapters.local.FloatingContainer");
            this._oWrapperDomRef = document.getElementById(ShellArea.FloatingContainer);

            this._fnDebouncedHandleUIActionActivation = debounce(this._handleUIActionActivation.bind(this), 300);
            this._fnThrottledHandleDockingPreview = throttle(this._handleDockingPreview.bind(this), 250);

            this.oModel = new JSONModel({
                docked: false,
                dockPosition: DockPosition.start,
                floatingContainer: {
                    visible: false
                },
                containerStyles: {
                    initialized: false,
                    top: 0,
                    left: 0,
                    fullHeight: false,
                    position: "absolute",
                    display: "block"
                },
                dockingPreview: {
                    open: false,
                    dockPosition: DockPosition.start
                }
            });

            Device.resize.attachHandler(this._handleResize, this);

            this.oDragSelectorBinding = ShellModel.getModel().bindProperty("/floatingContainer/dragSelector");
            this.oDragSelectorBinding.attachChange(this._handleDragSelectorUpdate, this);

            this.oVisibleBinding = ShellModel.getModel().bindProperty("/floatingContainer/visible");
            this.oVisibleBinding.attachChange(this._handleVisibilityUpdate, this);

            // ==== Store State on every change ==== //
            this.oDockedBinding = this.oModel.bindProperty("/docked");
            this.oDockedBinding.attachChange(this._storeState, this);

            this.oDockPositionBinding = this.oModel.bindProperty("/dockPosition");
            this.oDockPositionBinding.attachChange(this._storeState, this);

            this._restoreState();
            const oControlPromise = this._createControl();
            this._initWrapper();

            this.oInitPromise = Promise.all([
                oControlPromise
            ]);
        },

        /**
         * Creates the floating container control and places it in the shell layout.
         * @returns {Promise} A promise that resolves once the control is created.
         *
         * @since 1.129.0
         * @private
         */
        _createControl: async function () {
            this.oFloatingContainer = await Fragment.load({
                name: "sap.ushell.components.shell.FloatingContainer.FloatingContainer",
                controller: this
            });

            BindingHelper.overrideUpdateAggregation(this.oFloatingContainer);

            this.oFloatingContainer.addEventDelegate({
                onAfterRendering: this._handleOnAfterRendering
            }, this);
            this.oFloatingContainer.attachRerenderingPrevented(this._handleOnAfterRendering, this);

            this.oFloatingContainer.setModel(ShellModel.getModel(), "shellModel");
            this.oFloatingContainer.setModel(this.oModel);

            this.oFloatingContainer.placeAt(ShellArea.FloatingContainer, "only");

            // visibility was already set to true
            // we need to retrigger the visibility handler to adjust the initial position
            if (this._getVisibility()) {
                return new Promise((resolve) => {
                    setTimeout(() => {
                        this._handleVisibilityUpdate();
                        resolve();
                    }, 0);
                });
            }
        },

        /**
         * Initializes the wrapper element of the floating container.
         * Restores the last known position of the floating container if it was not docked.
         * If nothing could be restored, the position is initialized.
         *
         * @since 1.129.0
         * @private
         */
        _initWrapper: function () {
            const oWrapperDomRef = this._getWrapperDomRef();

            const bRestored = this._restoreWrapperStyles();

            if (!bRestored) {
                if (!this._isDocked()) {
                    const iWindowHeight = Device.resize.height;
                    // wrapper should be positioned below shell header
                    const iShellHeaderHeight = document.getElementById(ShellArea.ShellHeader).offsetHeight;
                    const iTopPos = iShellHeaderHeight / iWindowHeight * 100;
                    const iLeftPos = 60;

                    this.oModel.setProperty("/containerStyles/left", iLeftPos);
                    this.oModel.setProperty("/containerStyles/top", iTopPos);
                } else { // initialize dock position to the top corner

                    if (this.oModel.getProperty("/dockPosition") === DockPosition.end) {
                        this.oModel.setProperty("/containerStyles/left", 100);
                    } else {
                        this.oModel.setProperty("/containerStyles/left", 0);
                    }
                    this.oModel.setProperty("/containerStyles/top", 0);
                }
            }
            oWrapperDomRef.classList.add("sapUshellFloatingContainerWrapper");

            this._renderWrapperStyles();
        },

        /**
         * Applies the current styles to the floating container wrapper.
         *
         * @since 1.129.0
         * @private
         */
        _renderWrapperStyles: function () {
            const oWrapperDomRef = this._getWrapperDomRef();
            const oContainerStyles = this.oModel.getProperty("/containerStyles");

            oWrapperDomRef.style.left = `${oContainerStyles.left}%`;
            oWrapperDomRef.style.top = `${oContainerStyles.top}%`;

            if (oContainerStyles.fullHeight) {
                oWrapperDomRef.style.height = "100%";
            } else {
                oWrapperDomRef.style.height = "";
            }

            oWrapperDomRef.style.position = oContainerStyles.position;
            oWrapperDomRef.style.display = oContainerStyles.display;

            if (this.oModel.getProperty("/docked")) {
                oWrapperDomRef.classList.add("sapUshellContainerDocked");

                if (this.oModel.getProperty("/dockPosition") === DockPosition.start) {
                    oWrapperDomRef.classList.add("sapUshellContainerDockedStart");
                    oWrapperDomRef.classList.remove("sapUshellContainerDockedEnd");

                } else { // end
                    oWrapperDomRef.classList.add("sapUshellContainerDockedEnd");
                    oWrapperDomRef.classList.remove("sapUshellContainerDockedStart");
                }
            } else {
                oWrapperDomRef.classList.remove("sapUshellContainerDocked");
                oWrapperDomRef.classList.remove("sapUshellContainerDockedStart");
                oWrapperDomRef.classList.remove("sapUshellContainerDockedEnd");
            }

            this._storeWrapperStyles();
        },

        /**
         * Returns the floating container control.
         * @returns {sap.ui.core.Control} The floating container control.
         *
         * @since 1.129.0
         * @private
         */
        _getControl: function () {
            return this.oFloatingContainer;
        },

        /**
         * Returns the cloned element of the floating container.
         * The clone is created during drag.
         * @returns {Node|null} The cloned element.
         *
         * @since 1.129.0
         * @private
         */
        _getCloneDomRef: function () {
            return document.querySelector(".sapUshellFloatingContainer-clone");
        },

        /**
         * Returns the wrapper element of the floating container.
         * @returns {Node} The wrapper DOM node.
         *
         * @since 1.129.0
         * @private
         */
        _getWrapperDomRef: function () {
            return this._oWrapperDomRef;
        },

        /**
         * Returns the current visibility of the floating container.
         * @returns {boolean} True if the floating container is visible. Otherwise false.
         *
         * @since 1.129.0
         * @private
         */
        _getVisibility: function () {
            return ShellModel.getModel().getProperty("/floatingContainer/visible");
        },


        /**
         * Restores the last known styles of the floating container wrapper.
         * The styles are stored in the model.
         * @returns {boolean} True if styles could be restored. Otherwise false.
         *
         * @since 1.129.0
         * @private
         */
        _restoreWrapperStyles: function () {
            // omit styles if docked, they will be calculated on drag
            if (this._isDocked()) {
                return false;
            }

            const sCssText = this._oStorage.get("floatingContainerStyle");

            if (!sCssText) {
                return false;
            }

            const aProperties = sCssText.split(";");

            aProperties.forEach((sProperty) => {
                if (!sProperty.includes(":")) {
                    Log.warning(`Cannot restore and parse property: '${sProperty}'`);
                    return;
                }

                const [sKey, sValue] = sProperty.split(":").map((sString) => sString.trim());

                switch (sKey) {
                    case "left":
                    case "top":
                        const iValue = parseFloat(sValue.replace("%", ""));
                        this.oModel.setProperty(`/containerStyles/${sKey}`, iValue);
                        break;
                    case "position":
                        this.oModel.setProperty(`/containerStyles/${sKey}`, sValue);
                        break;
                    case "display":
                        // display should not be restored
                        break;
                    default:
                        Log.warning(`Cannot restore unknown property: '${sKey}'`);
                }
            });
            return true;
        },

        /**
         * Stores the current styles of the floating container wrapper in local storage.
         *
         * @since 1.129.0
         * @private
         */
        _storeWrapperStyles: function () {
            const oWrapperDomRef = this._getWrapperDomRef();
            this._oStorage.put("floatingContainerStyle", oWrapperDomRef.style.cssText);
        },

        /**
         * Stores the current state of the floating container in the local storage.
         *
         * @since 1.129.0
         * @private
         */
        _storeState: function () {
            const sState = this._getState();
            this._oStorage.put("lastState", sState);
            // store in state management as well to have it easily accessible in Renderer and FrameBoundExtension
            StateManager.updateAllBaseStates("floatingContainer.state", Operation.Set, sState);
        },

        /**
         * Returns the current state of the floating container.
         * This state should only be used for storing the state.
         * @returns {State} The current state of the floating container.
         *
         * @since 1.129.0
         * @private
         */
        _getState: function () {
            const bDocked = this._isDocked();
            if (!bDocked) {
                return State.floating;
            }

            const bIsRTL = Localization.getRTL();
            const sDockPosition = this.oModel.getProperty("/dockPosition");

            let sDockDirection;
            if (bIsRTL) {
                sDockDirection = sDockPosition === DockPosition.start ? "right" : "left";
            } else { // end
                sDockDirection = sDockPosition === DockPosition.end ? "right" : "left";
            }

            if (sDockDirection === "left") {
                return State.dockedLeft;
            }
            return State.dockedRight;
        },

        /**
         * Restores the last known state of the floating container.
         *
         * @since 1.129.0
         * @private
         */
        _restoreState: function () {
            const sStoredState = this._oStorage.get("lastState");
            if (sStoredState) {
                const bDocked = sStoredState.includes("docked");
                const bDockSupported = this._isDockSupported();

                this.oModel.setProperty("/docked", bDocked && bDockSupported);

                if (bDocked && bDockSupported) {
                    const bIsRTL = Localization.getRTL();
                    const sDockDirection = sStoredState.includes("left") ? "left" : "right";
                    let sDockPosition;
                    if (bIsRTL) {
                        sDockPosition = sDockDirection === "right" ? DockPosition.start : DockPosition.end;
                    } else {
                        sDockPosition = sDockDirection === "left" ? DockPosition.start : DockPosition.end;
                    }
                    this.oModel.setProperty("/dockPosition", sDockPosition);
                }
            }
        },

        /**
         * Wrapper function for testing purposes.
         * @param {Node} oElement The element to get the bounding client rect from.
         * @returns {object} The bounding client rect of the given element.
         *
         * @since 1.129.0
         * @private
         */
        _getBoundingClientRect (oElement) {
            return oElement.getBoundingClientRect();
        },

        /**
         * Stores the current position of the floating container in the model.
         *
         * @since 1.129.0
         * @private
         */
        _storeCurrentWrapperPosition: function () {
            const bIsRTL = Localization.getRTL();
            const oWrapperDomRef = this._getWrapperDomRef();
            const oWrapperRect = this._getBoundingClientRect(oWrapperDomRef);

            const iWindowWidth = Device.resize.width;
            const iContainerLeft = oWrapperRect.left;
            let iUpdatedLeft;
            if (bIsRTL) {
                const iContainerWidth = oWrapperDomRef.offsetWidth;
                iUpdatedLeft = (iContainerLeft + iContainerWidth) / iWindowWidth * 100;
            } else {
                iUpdatedLeft = iContainerLeft / iWindowWidth * 100;
            }

            const iWindowHeight = Device.resize.height;
            const iContainerTop = oWrapperRect.top;
            const iUpdatedTop = iContainerTop / iWindowHeight * 100;

            this.oModel.setProperty("/containerStyles/left", iUpdatedLeft);
            this.oModel.setProperty("/containerStyles/top", iUpdatedTop);
        },

        /**
         * Returns the docking state of the floating container.
         * @returns {boolean} True if floating container is docked, otherwise false.
         *
         * @since 1.129.0
         * @private
         */
        _isDocked: function () {
            return this.oModel.getProperty("/docked");
        },

        /**
         * Returns whether the screen width is less than or equal to 417px (S).
         * If we are in the S screen size, then there is a css class applied to  the container
         * @returns {boolean} True if the screen width is <= 417px.
         *
         * @since 1.129.0
         * @private
         */
        _isFullScreen: function () {
            return window.matchMedia ? window.matchMedia("(max-width: 417px)").matches : false;
        },

        /**
         * This function return whether the docking area open or not
         * @returns {boolean} if the docker area is opened
         *
         * @since 1.129.0
         * @private
         */
        _isDockingAreaOpen: function () {
            return !!this._getDockingPreview();
        },

        /**
         * Checks if docking is allowed for the current screen size.
         * @returns {boolean} Whether the docking is allowed.
         *
         * @since 1.129.0
         * @private
         */
        _isDockSupported: function () {
            // open dock option only if config is enable and screen size is L (desktop + tablet landscape)
            const oDevice = Device.media.getCurrentRange(Device.media.RANGESETS.SAP_STANDARD);
            return oDevice.name === "Desktop";
        },

        /**
         * Adjusts the position of the floating container to fit the screen.
         * In case it exceeds the screen height the container top is always shown.
         *
         * @since 1.129.0
         * @private
         */
        _adjustPosition: function () {
            const oDomRef = this._getControl().getDomRef();
            const oWrapperDomRef = this._getWrapperDomRef();
            const bIsFullScreen = this._isFullScreen();

            if (!oDomRef || !oWrapperDomRef || bIsFullScreen) {
                return;
            }

            const iWindowWidth = Device.resize.width;
            const iWindowHeight = Device.resize.height;
            const iContainerWidth = oDomRef.offsetWidth;
            const iContainerHeight = oDomRef.offsetHeight;
            const isRTL = Localization.getRTL();

            const iCurrentLeftPos = this.oModel.getProperty("/containerStyles/left");
            let iLeftPos = iWindowWidth * iCurrentLeftPos / 100;

            const iCurrentTopPos = this.oModel.getProperty("/containerStyles/top");
            let iTopPos = iWindowHeight * iCurrentTopPos / 100;

            if (isNaN(iLeftPos) || isNaN(iTopPos)) {
                return;
            }

            if (isRTL) {
                const bContainerPosExceedWindowWidth = (iLeftPos < iContainerWidth) || (iLeftPos > iWindowWidth);
                if (bContainerPosExceedWindowWidth) {
                    iLeftPos = iLeftPos < iContainerWidth ? iContainerWidth : iWindowWidth;
                }
            } else {
                const bContainerPosExceedWindowWidth = (iLeftPos < 0) || (iWindowWidth < (iLeftPos + iContainerWidth));
                if (bContainerPosExceedWindowWidth) {
                    iLeftPos = iLeftPos < 0 ? 0 : (iWindowWidth - iContainerWidth);
                }
            }

            if (iWindowHeight < (iTopPos + iContainerHeight)) {
                iTopPos = iWindowHeight - iContainerHeight;
            }

            // always show the top of the wrapper
            if (iTopPos < 0) {
                iTopPos = 0;
            }

            this.oModel.setProperty("/containerStyles/left", iLeftPos / iWindowWidth * 100);
            this.oModel.setProperty("/containerStyles/top", iTopPos / iWindowHeight * 100);
            this.oModel.setProperty("/containerStyles/position", "absolute");

            this._renderWrapperStyles();
        },

        /**
         * Handles rerendering of the floating container control.
         * Adjusts once the position. Updates the drag selector.
         *
         * @since 1.129.0
         * @private
         */
        _handleOnAfterRendering: function () {
            this._adjustPosition();

            this._handleDragSelectorUpdate();
        },

        /**
         * Handles the resize of the screen.
         * Adjusts position and moves the floating container out of the dock if necessary.
         *
         * @since 1.129.0
         * @private
         */
        _handleResize: function () {
            this._fnDebouncedHandleUIActionActivation();

            const oWrapperDomRef = this._getWrapperDomRef();
            const bHasWrapper = !!oWrapperDomRef;
            const bIsDocked = this._isDocked();

            if (bHasWrapper && !bIsDocked) {
                this._adjustPosition();

            }

            if (bIsDocked) {
                this._emitResizeWhileDockedEvent();
                this._emitAppFinderResizeEvent();
            }

            // undock if screen is too small
            if (!this._isDockSupported() && bIsDocked) {
                this._removeFromDock();

                this._adjustPosition();

                this._emitUndockedOnResizeEvent();
            }
        },

        /**
         * Handles update of the visibility of the floating container.
         * Starts the dock animation.
         *
         * @since 1.129.0
         * @private
         */
        _handleVisibilityUpdate: async function () {
            const bVisible = this._getVisibility();

            if (!this._isDocked()) {
                // no initial handling required
                this.oModel.setProperty("/floatingContainer/visible", bVisible);
                return;
            }

            if (bVisible) {
                if (this._isDockSupported()) {
                    const sDockPos = this.oModel.getProperty("/dockPosition");
                    this._moveIntoDock(sDockPos);

                } else {
                    this.oModel.setProperty("/docked", false);
                }
            } else {
                // case : undock from button
                await this._startAnimation(false);
            }

            this.oModel.setProperty("/floatingContainer/visible", bVisible);
            this._emitAppFinderResizeEvent();
        },

        /**
         * Enables and disables the UI actions based on the screen size.
         *
         * @since 1.129.0
         * @private
         */
        _handleUIActionActivation: function () {
            if (!this.oUIActions) {
                return;
            }
            if (this._isFullScreen()) {
                this.oUIActions.disable();
            } else {
                this.oUIActions.enable();
            }
        },

        /**
         * Handles the update of the drag selector.
         * Creates the UI actions if necessary or updates the existing instance.
         *
         * @since 1.129.0
         * @private
         */
        _handleDragSelectorUpdate: function () {
            const sDragSelector = ShellModel.getModel().getProperty("/floatingContainer/dragSelector");
            if (!sDragSelector) {
                if (this.oUIActions) {
                    this.oUIActions.disable();
                }
                return;
            }

            const oFloatingContainerDomRef = this._getControl().getDomRef();
            const aDragSelectorDomRefs = oFloatingContainerDomRef.querySelectorAll(sDragSelector);
            if (aDragSelectorDomRefs.length) {
                // mark the drag selector elements for easier debugging.
                aDragSelectorDomRefs.forEach((oDragSelectorDomRef) => oDragSelectorDomRef.classList.add("sapUshellFloatingContainerSelector"));
            } else {
                Log.error("_handleDragSelectorUpdate could not find the element", "sap.ushell.renderer.Shell.controller");
                if (this.oUIActions) {
                    this.oUIActions.disable();
                }
                return;
            }

            if (!this.oUIActions) {
                this.oUIActions = new UIActions({
                    containerSelector: ".sapUiBody",
                    wrapperSelector: ".sapUshellFloatingContainerWrapper",
                    draggableSelector: ".sapUshellFloatingContainerWrapper", // the element that we drag
                    rootSelector: ".sapUiBody",
                    cloneClass: "sapUshellFloatingContainer-clone",
                    dragCallback: this._handleDrag.bind(this), // for hide the original item while dragging
                    endCallback: this._handleDrop.bind(this),
                    moveTolerance: 3,
                    onDragStartUIHandler: this._onDragStart.bind(this),
                    dragAndScrollCallback: this._onDrag.bind(this),
                    switchModeDelay: 1000,
                    isLayoutEngine: false,
                    isTouch: false,
                    elementToCapture: sDragSelector,
                    defaultMouseMoveHandler: function () { },
                    debug: Log.getLevel() >= Log.Level.DEBUG
                });
            } else {
                this.oUIActions.setElementsToCapture(aDragSelectorDomRefs);
            }

            this._handleUIActionActivation();
        },

        /**
         * Handles the drag of the floating container.
         * Updates the preview of the docking area.
         * @param {UIActionEvent} oUIActionEvent configuration parameters
         *
         * @since 1.129.0
         * @private
         */
        _onDrag: function (oUIActionEvent) {
            if (!this._isDockSupported()) {
                return;
            }

            const iWindowWidth = Device.resize.width;
            const bIsRTL = Localization.getRTL();

            /*
             * oUIActionEvent.moveX get FloatingContainer courser x position.
             * handle for opening the docking area for right and left
             * in case that docking area open - close it
             * in case canvas moved (because the docking ) close it
             */
            if (oUIActionEvent.moveX >= iWindowWidth - 64) {
                const sDockPosition = bIsRTL ? DockPosition.start : DockPosition.end;

                this.oModel.setProperty("/dockingPreview/open", true);
                this.oModel.setProperty("/dockingPreview/dockPosition", sDockPosition);
            } else if (oUIActionEvent.moveX < 64) {
                const sDockPosition = bIsRTL ? DockPosition.end : DockPosition.start;

                this.oModel.setProperty("/dockingPreview/open", true);
                this.oModel.setProperty("/dockingPreview/dockPosition", sDockPosition);
            } else {
                this.oModel.setProperty("/dockingPreview/open", false);
            }

            // use throttled handler to prevent flickering
            this._fnThrottledHandleDockingPreview();
        },

        /**
         * Expands the floating container to the dock.
         *
         * @since 1.129.0
         * @private
         */
        _expandToDock: function () {
            this.oModel.setProperty("/containerStyles/fullHeight", true);
            this._renderWrapperStyles();
        },

        /**
         * Shrinks the floating container to the drag UI.
         *
         * @since 1.129.0
         * @private
         */
        _shrinkToDragUI: function () {
            this.oModel.setProperty("/docked", false);
            this.oModel.setProperty("/containerStyles/fullHeight", false);
            this._renderWrapperStyles();
        },

        /**
         * Removes the floating container from the dock and emits the relevant events.
         *
         * @since 1.129.0
         * @private
         */
        _removeFromDock: function () {
            if (!this._isDocked()) {
                return;
            }

            const oWrapperDomRef = this._getWrapperDomRef();
            const oRootDomRef = document.getElementById(ShellArea.RootDomRef);
            oRootDomRef.appendChild(oWrapperDomRef);

            this.oModel.setProperty("/docked", false);
            this._renderWrapperStyles();

            this._emitUndockedEvent();

            this._shrinkToDragUI();

            this._emitAppFinderResizeEvent();
        },

        /**
         * Handles the drag start of the floating container.
         * Stores the current position of the wrapper and undocks the container.
         *
         * @since 1.129.0
         * @private
         */
        _onDragStart: function () {
            // store current wrapper position to get the clone in the right spot.
            // the previous positions might be outdated due to resize.
            this._storeCurrentWrapperPosition();

            // move floatingContainer wrapper according to the handle position
            this._removeFromDock();
        },

        /**
         * Handles the dock/undock animations.
         * @param {boolean} bExpand Wether to play the expand or shrink animation
         * @returns {Promise} Resolves once the animation is done
         *
         * @since 1.129.0
         * @private
         */
        _startAnimation: function (bExpand) {
            this._clearAnimation();

            const oWrapperDomRef = this._getWrapperDomRef();

            return new Promise((resolve) => {
                if (bExpand) {
                    oWrapperDomRef.classList.add("sapUshellContainerDockedExtendCoPilot");
                } else {
                    oWrapperDomRef.classList.add("sapUshellContainerDockedMinimizeCoPilot");
                }

                this._attachAnimationEnd(oWrapperDomRef, () => {
                    this._clearAnimation();
                    resolve();
                });
            });
        },

        /**
         * Attaches to the animation end event of the given element.
         * Handles browser specific event names.
         * @param {Node} oElement The element to attach the event to.
         * @param {function} fnCallback The callback function to execute once the animation is done.
         *
         * @since 1.129.0
         * @private
         */
        _attachAnimationEnd: function (oElement, fnCallback) {
            [
                "webkitAnimationEnd",
                "onanimationend",
                "msAnimationEnd",
                "animationend"
            ].forEach((sEvent) => {
                oElement.addEventListener(sEvent, fnCallback, { once: true });
            });
        },

        /**
         * Clears the dock/undock animations.
         *
         * @since 1.129.0
         * @private
         */
        _clearAnimation: function () {
            const oWrapperDomRef = this._getWrapperDomRef();

            oWrapperDomRef.classList.remove("sapUshellContainerDockedExtendCoPilot");
            oWrapperDomRef.classList.remove("sapUshellContainerDockedMinimizeCoPilot");
        },

        /**
         * Returns the docking preview element.
         * @returns {Node} The docking preview element.
         *
         * @since 1.129.0
         * @private
         */
        _getDockingPreview: function () {
            return document.getElementById("DockingAreaDiv");
        },

        /**
         * Creates a new docking preview element.
         * @returns {Node} The docking preview element.
         *
         * @since 1.129.0
         * @private
         */
        _createDockingPreview: function () {
            const oDockingArea = document.createElement("div");
            oDockingArea.id = "DockingAreaDiv";
            return oDockingArea;
        },

        /**
         * Handles the docking preview.
         *
         * @since 1.129.0
         * @private
         */
        _handleDockingPreview: function () {
            const oCloneDomRef = this._getCloneDomRef();
            const bDockingPreviewIsOpen = this.oModel.getProperty("/dockingPreview/open");
            const sPreviewDockPosition = this.oModel.getProperty("/dockingPreview/dockPosition");

            // check if need to open docking area and it doesn't exist already
            if (bDockingPreviewIsOpen && oCloneDomRef && !this._getDockingPreview()) {
                const oDockingArea = this._createDockingPreview();
                if (sPreviewDockPosition === DockPosition.start) {
                    oDockingArea.classList.add("sapUshellShellDisplayDockingAreaLeft");
                } else { // end
                    oDockingArea.classList.add("sapUshellShellDisplayDockingAreaRight");
                }
                oCloneDomRef.parentElement.appendChild(oDockingArea);

                // After drop the copilot - docking area should disappear
            } else if (!bDockingPreviewIsOpen) {
                window.setTimeout(() => {
                    const oDockingArea = this._getDockingPreview();
                    oDockingArea?.remove?.();
                }, 150);
            }
        },

        /**
         * Moves the floating container into the dock.
         * Handles the position of the container and emits the relevant events.
         * @param {DockPosition} sDockPosition The dock position.
         *
         * @since 1.129.0
         * @private
         */
        _moveIntoDock: function (sDockPosition) {
            const oWrapperDomRef = this._getWrapperDomRef();

            let oPlaceholder;
            if (sDockPosition === DockPosition.start) {
                oPlaceholder = document.getElementById(ShellArea.FloatingContainerDockStart);
            } else { // end
                oPlaceholder = document.getElementById(ShellArea.FloatingContainerDockEnd);
            }

            oPlaceholder.appendChild(oWrapperDomRef);

            this.oModel.setProperty("/docked", true);
            this.oModel.setProperty("/dockPosition", sDockPosition);
            this._renderWrapperStyles();

            this._emitDockedEvent();

            this._expandToDock();
            this._startAnimation(true);

            this._emitAppFinderResizeEvent();
        },

        /**
         * Handles the drop of the floating container.
         * Updates the position of the container and moves it into the dock if necessary.
         * @param {Event} oEvent The event object.
         * @param {Element} oWrapperDomRef The wrapper DOM reference.
         * @param {UIActionDropEvent} oUIActionDropEvent The drop event object.
         *
         * @since 1.129.0
         * @private
         */
        _handleDrop: function (oEvent, oWrapperDomRef, oUIActionDropEvent) {
            const iWindowWidth = Device.resize.width;
            const iWindowHeight = Device.resize.height;
            let iPosLeft = oUIActionDropEvent.deltaX / iWindowWidth;
            let iPosTop = -oUIActionDropEvent.deltaY / iWindowHeight;
            const iContainerLeft = this.oModel.getProperty("/containerStyles/left");
            const iContainerTop = this.oModel.getProperty("/containerStyles/top");

            if (typeof (iContainerLeft) === "number") {
                iPosLeft = iContainerLeft + 100 * oUIActionDropEvent.deltaX / iWindowWidth;
            }

            if (typeof (iContainerTop) === "number") {
                iPosTop = iContainerTop + 100 * oUIActionDropEvent.deltaY / iWindowHeight;
            }

            // when docking area is open - means the copilot should be on top of the screen
            if (this._isDockingAreaOpen()) {
                iPosTop = 0;
            }

            this.oModel.setProperty("/containerStyles/left", iPosLeft);
            this.oModel.setProperty("/containerStyles/top", iPosTop);
            this.oModel.setProperty("/containerStyles/position", "absolute");
            this.oModel.setProperty("/containerStyles/display", "block");

            this._renderWrapperStyles();

            this._adjustPosition();

            if (this._isDockingAreaOpen()) {
                this.oModel.setProperty("/dockingPreview/open", false);
                this._handleDockingPreview();

                const sDockPos = this.oModel.getProperty("/dockingPreview/dockPosition");
                this._moveIntoDock(sDockPos);
            }
        },

        /**
         * Handles the drag of the floating container.
         * This callback is called after dragStart and after the clone was created.
         * Hides the original item while dragging.
         *
         * @since 1.129.0
         * @private
         */
        _handleDrag: function () {
            this.oModel.setProperty("/containerStyles/display", "none");
            this._renderWrapperStyles();

            if (window.getSelection) {
                const selection = window.getSelection();
                // for IE
                try {
                    selection.removeAllRanges();
                } catch (e) {
                    // continue regardless of error
                }
            }

            const oClonedWrapperDomRef = this._getCloneDomRef();
            const oClonedControlDomRef = oClonedWrapperDomRef?.querySelector?.(".sapUshellFloatingContainer");
            if (oClonedControlDomRef) {
                oClonedControlDomRef.classList.remove("sapUshellShellFloatingContainerFullHeight");

                /*
                 * Restore height of the content on drag clone.
                 * The drag clone is created BEFORE the undocked event is fired
                 */
                const oContent = this._getControl().getContent()[0];
                if (oContent && oContent.getHeight) {
                    oClonedControlDomRef.children[0].style.height = oContent.getHeight();
                }
            }
        },

        /**
         * Emits the appFinder resize event.
         *
         * @since 1.129.0
         * @private
         */
        _emitAppFinderResizeEvent: function () {
            // handle appFinder size changed
            // timeout waiting for resize event is finish
            window.setTimeout(() => {
                EventBus.getInstance().publish("launchpad", "appFinderWithDocking");
            }, 300);
        },

        // ============================= Public Events ======================================

        /**
         * Emits the resize while docked event.
         *
         * @since 1.129.0
         * @private
         */
        _emitResizeWhileDockedEvent: function () {
            EventBus.getInstance().publish("launchpad", "shellFloatingContainerDockedIsResize");
        },

        /**
         * Emits the docked event.
         *
         * @since 1.129.0
         * @private
         */
        _emitDockedEvent: function () {
            const oData = { visible: this._getVisibility() };

            EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsDocked", oData);
        },

        /**
         * Emits the undocked event.
         *
         * @since 1.129.0
         * @private
         */
        _emitUndockedEvent: function () {
            const oData = { visible: this._getVisibility() };

            EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDocked", oData);
        },

        /**
         * Emits the undocked on resize event.
         *
         * @since 1.129.0
         * @private
         */
        _emitUndockedOnResizeEvent: function () {
            const oData = { visible: this._getVisibility() };

            EventBus.getInstance().publish("launchpad", "shellFloatingContainerIsUnDockedOnResize", oData);
        },

        // =================================================================================

        /**
         * Lifecycle method to be called when the component is destroyed.
         *
         * @since 1.129.0
         * @private
         */
        exit: function () {
            this._getControl().destroy();
            this.oModel.destroy();

            Device.resize.detachHandler(this._handleResize, this);

            this.oDragSelectorBinding.destroy();
            this.oVisibleBinding.destroy();
            this.oDockedBinding.destroy();
            this.oDockPositionBinding.destroy();

            if (this.oUIActions) {
                this.oUIActions.disable();
            }
        }
    });
});
