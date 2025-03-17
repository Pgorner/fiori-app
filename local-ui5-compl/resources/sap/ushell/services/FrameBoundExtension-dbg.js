// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview FrameBoundExtension.
 * This files exposes an API to extend the launchpad with new elements.
 * It is exposed publicly and meant to be used by apps and plugins.
 *
 * This service can only be called from the outer shell and is not available
 * in the inner shell or via post message API.
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ui/core/Element",
    "sap/ushell/services/FrameBoundExtension/FloatingContainer",
    "sap/ushell/services/FrameBoundExtension/Footer",
    "sap/ushell/services/FrameBoundExtension/Item",
    "sap/ushell/services/FrameBoundExtension/SidePane",
    "sap/ushell/services/FrameBoundExtension/ToolArea",
    "sap/ushell/Container",
    "sap/ushell/utils"
], function (
    Element,
    FloatingContainerArea,
    FooterItem,
    ExtensionItem,
    SidePaneArea,
    ToolAreaArea,
    Container,
    ushellUtils
) {
    "use strict";

    /**
     * @alias sap.ushell.services.FrameBoundExtension
     * @class
     * @classdesc The Unified Shell's Extension service.
     * Allows adding extensions on the user's home page.
     *
     * <b>Note:</b> To retrieve a valid instance of this service, it is necessary to call
     * <code>sap.ushell.Container.getServiceAsync("FrameBoundExtension")</code>. For details, see
     * {@link sap.ushell.Container#getServiceAsync}.
     *
     * <p><b>Restriction:</b> This Service does not work when called from within a iframe.
     * The calling function has to be in the 'same frame' as the launchpad itself.</p>
     *
     * <br>
     * All extension items and extension areas are instantiated as invisible.
     * You have to call .show<...> to make them visible.
     *
     * @augments sap.ushell.services.Service
     * @hideconstructor
     *
     * @since 1.124.0
     * @public
     */
    function FrameBoundExtension () { }

    // ========================================== Helper ====================================================================

    /**
     * Creates a function which scopes a specific control to a single visibility handler.
     * The new function combines a show and hide function.
     * @param {string} controlId The id of the control.
     * @param {function} show The show function.
     * @param {function} hide The hide function.
     * @returns {function} The scoped visibility handler.
     *
     * @since 1.124.0
     * @private
     */
    FrameBoundExtension.prototype._createItemVisibilityHandler = function (controlId, show, hide) {
        return async function visibilityHandler (visible, currentState, state) {
            const states = state ? [state] : undefined;
            if (visible) {
                await ushellUtils.promisify(show(controlId, currentState, states));
                return;
            }
            await ushellUtils.promisify(hide(controlId, currentState, states));
        };
    };

    /**
     * Utility function to await a function call.
     * @param {function} create The create function.
     * @param {Array<*>} createArgs The list of arguments.
     * @returns {Promise<sap.ui.core.Control>} The created control.
     *
     * @since 1.124.0
     * @private
     */
    FrameBoundExtension.prototype._createControl = async function (create, createArgs) {
        return ushellUtils.promisify(create(...createArgs));
    };

    // ========================================== Header - Items ====================================================================

    /**
     * Creates a header item in the shell header.
     *
     * @example
     *
     *   FrameBoundExtension.createHeaderItem({
     *       id: "headerItem1",
     *       ariaLabel: "headerItem-ariaLabel",
     *       ariaHaspopup: "dialog",
     *       icon: "sap-icon://action-settings",
     *       tooltip: "headerItem-tooltip",
     *       text: "headerItem-text",
     *       press: () => {
     *           MessageToast.show("Press header item");
     *       }
     *   }, {
     *       position: "begin"
     *   })
     *
     * @param {sap.ushell.ui.shell.ShellHeadItem.Properties} controlProperties The properties that will be passed to the created control.
     * @param {object} [parameters] Additional parameters.
     * @param {string} [parameters.position=end] Possible values are <code>begin</code> and <code>end</code>.
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.Item>} The newly created header item.
     *
     * @since 1.124.0
     * @public
     */
    FrameBoundExtension.prototype.createHeaderItem = async function (controlProperties, parameters = {}) {
        const { position } = parameters;
        const aValidPositions = ["begin", "end", undefined];
        if (!aValidPositions.includes(position)) {
            throw new Error(`Unexpected Input: '${position}' is not a valid position!`);
        }

        if (position === "begin") {
            return this._createHeaderStartItem(controlProperties);
        }
        // "end" or undefined
        return this._createHeaderEndItem(controlProperties);
    };

    /**
     * Creates a header item in the shell header next to the company logo.
     * @param {object} controlProperties The properties that will be passed to the created control.
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.Item>} The newly created header item.
     *
     * @since 1.124.0
     * @private
     */
    FrameBoundExtension.prototype._createHeaderStartItem = async function (controlProperties) {
        const oRenderer = Container.getRendererInternal();
        const aCreateArgs = [
            controlProperties,
            false, // visible
            undefined, // currentState
            undefined // states
        ];
        const fnCreate = oRenderer.addHeaderItem.bind(oRenderer);
        const fnShow = oRenderer.showHeaderItem.bind(oRenderer);
        const fnHide = oRenderer.hideHeaderItem.bind(oRenderer);

        const bControlWasPreCreated = !!Element.getElementById(controlProperties.id);
        const oControl = await this._createControl(fnCreate, aCreateArgs);
        const fnVisibilityHandler = this._createItemVisibilityHandler(oControl.getId(), fnShow, fnHide);

        return new ExtensionItem(oControl, fnVisibilityHandler, bControlWasPreCreated);
    };

    /**
     * Creates a header item in the shell header next to the user action menu.
     * @param {object} controlProperties The properties that will be passed to the created control.
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.Item>} The newly created header item.
     *
     * @since 1.124.0
     * @private
     */
    FrameBoundExtension.prototype._createHeaderEndItem = async function (controlProperties) {
        const oRenderer = Container.getRendererInternal();

        const aCreateArgs = [
            controlProperties,
            false, // visible
            undefined, // currentState
            undefined // states
        ];
        const fnCreate = oRenderer.addHeaderEndItem.bind(oRenderer);
        const fnShow = oRenderer.showHeaderEndItem.bind(oRenderer);
        const fnHide = oRenderer.hideHeaderEndItem.bind(oRenderer);

        const bControlWasPreCreated = !!Element.getElementById(controlProperties.id);
        const oControl = await this._createControl(fnCreate, aCreateArgs);
        const fnVisibilityHandler = this._createItemVisibilityHandler(oControl.getId(), fnShow, fnHide);

        return new ExtensionItem(oControl, fnVisibilityHandler, bControlWasPreCreated);
    };

    // ========================================== SubHeader ====================================================================

    /**
     * Creates a new sub header which is positioned below the header.
     *
     * The <code>controlType</code> can be any control and is by default a {@link sap.m.Bar}.
     * The <code>controlProperties</code> are passed to the constructor of the control.
     *
     * <p><b>Note:</b> Only one sub header is displayed at once</p>
     * <p><b>Restriction:</b> NOT available for apps running in an iframe</p>
     *
     * @example
     *
     *   FrameBoundExtension.createSubHeader({
     *       id: "subheader1",
     *       contentLeft: [new Button({
     *           text: "SubHeader ContentLeftBtn",
     *           press: () => {
     *               MessageToast.show("Press subheader1 contentLeft");
     *           }
     *       })],
     *       contentMiddle: [new Button({
     *           text: "SubHeader contentMiddleBtn",
     *           press: () => {
     *               MessageToast.show("Press subheader1 contentMiddle");
     *           }
     *       })],
     *       contentRight: [new Button({
     *          text: "SubHeader contentRightBtn",
     *          press: () => {
     *              MessageToast.show("Press subheader1 contentRight");
     *          }
     *       })]
     *   }, {
     *       controlType: "sap.m.Bar"
     *   })
     *
     * @param {object} controlProperties The properties that will be passed to the created control.
     * @param {object} [parameters] Additional parameters.
     * @param {string} [parameters.controlType=sap.m.Bar] Defines the <code>controlType</code>.
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.Item>} The newly created sub header.
     *
     * @since 1.124.0
     * @public
     */
    FrameBoundExtension.prototype.createSubHeader = async function (controlProperties, parameters = {}) {
        const oRenderer = Container.getRendererInternal();

        const aCreateArgs = [{
            controlType: parameters.controlType || "sap.m.Bar",
            oControlProperties: controlProperties,
            bIsVisible: false,
            bCurrentState: undefined,
            aStates: undefined
        }];
        const fnCreate = oRenderer.addShellSubHeader.bind(oRenderer);
        const fnShow = oRenderer.showSubHeader.bind(oRenderer);
        const fnHide = oRenderer.hideSubHeader.bind(oRenderer);

        const bControlWasPreCreated = !!Element.getElementById(controlProperties.id);
        const oControl = await this._createControl(fnCreate, aCreateArgs);
        const fnVisibilityHandler = this._createItemVisibilityHandler(oControl.getId(), fnShow, fnHide);

        // hide
        // fnVisibilityHandler(false, true, []);

        return new ExtensionItem(oControl, fnVisibilityHandler, bControlWasPreCreated);
    };

    // ========================================== SidePane ====================================================================

    /**
     * Returns the API for the SidePane which is located next to the launchpad content.
     * <p><b>Restriction:</b> NOT available for apps running in an iframe</p>
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.SidePane>} The SidePane.
     *
     * @since 1.124.0
     * @public
     */
    FrameBoundExtension.prototype.getSidePane = async function () {
        return new SidePaneArea();
    };

    // ========================================== ToolArea ====================================================================

    /**
     * Returns the API for the ToolArea which is located next to the launchpad content.
     * <p><b>Restriction:</b> NOT available for apps running in an iframe</p>
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.ToolArea>} The ToolArea.
     *
     * @since 1.124.0
     * @public
     */
    FrameBoundExtension.prototype.getToolArea = async function () {
        return new ToolAreaArea();
    };

    // ========================================== UserAction ====================================================================

    /**
     * Creates a user action in the user action menu.
     *
     * The <code>controlType</code> can be any control and is by default a {@link sap.ushell.ui.launchpad.ActionItem}.
     * The <code>controlProperties</code> are passed to the constructor of the control.
     *
     * @example
     *
     *   FrameBoundExtension.createUserAction({
     *       id: "userAction1",
     *       text: "New UserAction",
     *       icon: "sap-icon://refresh",
     *       press: () => {
     *           MessageToast.show("Press UserAction");
     *       }
     *   }, {
     *       controlType: "sap.ushell.ui.launchpad.ActionItem"
     *   })
     *
     * @param {object} controlProperties The properties that will be passed to the created control.
     * @param {object} [parameters] Additional parameters.
     * @param {string} [parameters.controlType=sap.ushell.ui.launchpad.ActionItem] Defines the <code>controlType</code> of the item.
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.Item>} The newly created user action.
     *
     * @since 1.124.0
     * @public
     */
    FrameBoundExtension.prototype.createUserAction = async function (controlProperties, parameters = {}) {
        const oRenderer = Container.getRendererInternal();

        const aCreateArgs = [{
            controlType: parameters.controlType || "sap.m.Button",
            oControlProperties: controlProperties,
            bIsVisible: false,
            bCurrentState: undefined,
            aStates: undefined
        }];
        const fnCreate = oRenderer.addUserAction.bind(oRenderer);
        const fnShow = oRenderer.showActionButton.bind(oRenderer);
        const fnHide = oRenderer.hideActionButton.bind(oRenderer);

        const bControlWasPreCreated = !!Element.getElementById(controlProperties.id);
        const oControl = await this._createControl(fnCreate, aCreateArgs);
        const fnVisibilityHandler = this._createItemVisibilityHandler(oControl.getId(), fnShow, fnHide);

        return new ExtensionItem(oControl, fnVisibilityHandler, bControlWasPreCreated);
    };

    // ========================================== Footer ====================================================================

    /**
     * Creates a new footer which is positioned below the launchpad content.
     *
     * The <code>controlType</code> can be any control and is by default a {@link sap.m.Bar}.
     * The <code>controlProperties</code> are passed to the constructor of the control.
     *
     * <p><b>Note:</b> Only one footer is displayed at once. Any new footer will replace the previous one</p>
     * <p><b>Restriction:</b> NOT available for apps running in an iframe</p>
     *
     * @example
     *
     *   FrameBoundExtension.createFooter({
     *       id: "footer1",
     *       contentLeft: [new Button({
     *           text: "Footer ContentLeftBtn",
     *           press: () => {
     *               MessageToast.show("Press footer1 contentLeft");
     *           }
     *       })],
     *       contentMiddle: [new Button({
     *           text: "Footer contentMiddleBtn",
     *           press: () => {
     *               MessageToast.show("Press footer1 contentMiddle");
     *           }
     *       })],
     *       contentRight: [new Button({
     *          text: "Footer contentRightBtn",
     *          press: () => {
     *              MessageToast.show("Press footer1 contentRight");
     *          }
     *       })]
     *   }, {
     *       controlType: "sap.m.Bar"
     *   })
     *
     * @param {object} controlProperties The properties that will be passed to the created control.
     * @param {object} [parameters] Additional parameters.
     * @param {string} [parameters.controlType=sap.m.Bar] Defines the <code>controlType</code>.
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.Footer>} The newly created footer.
     *
     * @since 1.124.0
     * @public
     */
    FrameBoundExtension.prototype.createFooter = async function (controlProperties, parameters = {}) {
        const oRenderer = Container.getRendererInternal();

        const aCreateArgs = [{
            controlType: parameters.controlType || "sap.m.Bar",
            oControlProperties: controlProperties
        }];
        const fnCreate = oRenderer.setShellFooter.bind(oRenderer);

        const oControl = await this._createControl(fnCreate, aCreateArgs);

        return new FooterItem(oControl);
    };

    // ========================================== UserSettings ====================================================================

    /**
     * Adds an entry to the user settings dialog box including the UI control that appears when the user clicks the new entry,
     * and handling of user settings actions such as SAVE and CANCEL.
     * <p><b>Restriction:</b> NOT available for apps running in an iframe</p>
     * @param {object} properties The data of the new added user settings entry.
     * @param {string} [properties.entryHelpID] The ID of the object.
     * @param {string} properties.title The title of the entry to be presented in the list in the user settings dialog box. We recommend using a string from the translation bundle.
     * @param {string|function(): Promise<string>} properties.value A string to be presented as the sub title of the entry OR a function which resolves the sub title.
     * @param {function(): Promise<sap.ui.core.Control>} properties.content A function that resolves the content which has to be a {@link sap.ui.core.Control}.
     *      A SAPUI5 view instance can also be returned. The result will be displayed in the settings as content for this entry.
     * @param {function(): Promise} properties.onSave A callback which is called when the user clicks "save" in the user settings dialog. The function has to return a native promise.
     *      If an error occurs, pass the error message via rejected promise. Errors are displayed in the common log.
     * @param {function} properties.onCancel A callback which is called when the user closes the user settings dialog without saving any changes.
     * @param {boolean} [properties.provideEmptyWrapper=false] Set this value to <code>true</code> if you want that your content is displayed without the standard header.
     * @returns {Promise} Resolves once the settings entry was added.
     *
     * @since 1.124.0
     * @public
     */
    FrameBoundExtension.prototype.addUserSettingsEntry = async function (properties) {
        const oRenderer = Container.getRendererInternal();
        await ushellUtils.promisify(oRenderer.addUserPreferencesEntry(properties));
    };

    /**
     * Adds an entry to the user settings dialog box including the UI control that appears when the user clicks the new entry,
     * and handling of user settings actions such as SAVE and CANCEL.
     * <p><b>Restriction:</b> NOT available for apps running in an iframe</p>
     * @param {object} properties The data of the new added user settings entry.
     * @param {string} [properties.entryHelpID] The ID of the object.
     * @param {string} properties.title The title of the entry to be presented in the list in the user settings dialog box. We recommend using a string from the translation bundle.
     * @param {string|function(): Promise<string>} properties.value A string to be presented as the sub title of the entry OR a function which resolves the sub title.
     * @param {function(): Promise<sap.ui.core.Control>} properties.content A function that resolves the content which has to be a {@link sap.ui.core.Control}.
     *      A SAPUI5 view instance can also be returned. The result will be displayed in the settings as content for this entry.
     * @param {function} properties.onSave A callback which is called when the user clicks "save" in the user settings dialog. The function has to return a native promise.
     *      If an error occurs, pass the error message via rejected promise. Errors are displayed in the common log.
     * @param {function(): Promise} properties.onCancel A callback which is called when the user closes the user settings dialog without saving any changes.
     * @param {boolean} [properties.provideEmptyWrapper=false] Set this value to <code>true</code> if you want that your content is displayed without the standard header.
     * @param {string} [properties.groupingId] The ID of the group this entry should be included in.
     * @param {string} [properties.groupingTabTitle] The tab title of the entry, when this entry is grouped.
     * @param {string} [properties.groupingTabHelpId] The help ID for the grouped tab, when this entry is grouped.
     * @returns {Promise} Resolves once the settings entry was added.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted sap.fe, sap.esh.search.ui
     */
    FrameBoundExtension.prototype.addGroupedUserSettingsEntry = async function (properties) {
        const oRenderer = Container.getRendererInternal();
        await ushellUtils.promisify(oRenderer.addUserPreferencesGroupedEntry(properties));
    };

    // ========================================== FloatingContainer ====================================================================

    /**
     * Returns the API for the FloatingContainer.
     * <p><b>Restriction:</b> NOT available for apps running in an iframe</p>
     * @returns {Promise<sap.ushell.services.FrameBoundExtension.FloatingContainer>} The FloatingContainer.
     *
     * @since 1.124.0
     * @private
     * @ui5-restricted
     */
    FrameBoundExtension.prototype.getFloatingContainer = async function () {
        return new FloatingContainerArea();
    };

    // ========================================== second Title ====================================================================

    /**
     * Sets the second title in the shell header next to the application title.
     * It is displayed indefinitely until a different second title was set.
     * @param {string} sTitle The title.
     * @returns {Promise} A promise that resolves when the title was set.
     *
     * @since 1.125.0
     * @private
     * @experimental since 1.125.0
     */
    FrameBoundExtension.prototype.setSecondTitle = async function (sTitle) {
        const oRenderer = Container.getRendererInternal();
        oRenderer.setHeaderTitle(sTitle);
    };

    FrameBoundExtension.hasNoAdapter = true;
    return FrameBoundExtension;
});
