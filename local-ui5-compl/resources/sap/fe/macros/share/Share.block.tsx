import Log from "sap/base/Log";
import type { BindingToolkitExpression, CompiledBindingToolkitExpression } from "sap/fe/base/BindingToolkit";
import { and, compileExpression, constant, not, or, resolveBindingString } from "sap/fe/base/BindingToolkit";
import { defineReference } from "sap/fe/base/ClassSupport";
import type { Ref } from "sap/fe/base/jsx-runtime/jsx";
import type AppComponent from "sap/fe/core/AppComponent";
import CommonUtils from "sap/fe/core/CommonUtils";
import type PageController from "sap/fe/core/PageController";
import { blockAttribute, defineBuildingBlock } from "sap/fe/core/buildingBlocks/templating/BuildingBlockSupport";
import RuntimeBuildingBlock from "sap/fe/core/buildingBlocks/templating/RuntimeBuildingBlock";
import CommandExecution from "sap/fe/core/controls/CommandExecution";
import { UI } from "sap/fe/core/helpers/BindingHelper";
import type { IShellServices } from "sap/fe/core/services/ShellServicesFactory";
import Menu from "sap/m/Menu";
import type MenuButton from "sap/m/MenuButton";
import type { $MenuItemSettings } from "sap/m/MenuItem";
import MenuItem from "sap/m/MenuItem";
import type { CollaborationOptionKey, CollaborationOptions } from "sap/suite/ui/commons/collaboration/TeamsHelperService";
import type UI5Event from "sap/ui/base/Event";
import type ManagedObject from "sap/ui/base/ManagedObject";
import CustomData from "sap/ui/core/CustomData";
import type View from "sap/ui/core/mvc/View";
import type JSONModel from "sap/ui/model/json/JSONModel";
import FESRHelper from "sap/ui/performance/trace/FESRHelper";

import type { ViewData } from "sap/fe/core/services/TemplatedViewServiceFactory";
import OverflowToolbarMenuButton from "sap/m/OverflowToolbarMenuButton";
import BindingParser from "sap/ui/base/BindingParser";
import ShareAPI from "./ShareAPI";

/**
 * Microsoft Teams options to provide as part of Share.
 * @alias sap.fe.macros.share.MsTeamsOptions
 */
export type MsTeamsOptions = {
	enableCard?: boolean | CompiledBindingToolkitExpression;
};

/**
 * Share Options.
 * @alias sap.fe.macros.share.ShareOptions
 * @public
 */
export type ShareOptions = {
	showSendEmail?: boolean | CompiledBindingToolkitExpression;
	showCollaborationManager?: boolean | CompiledBindingToolkitExpression;
};

// MS Teams options are not public via Share building block.
// So, 'showMsTeamsOptions' is internal and shall be only picked from template manifest.
type InternalShareOptions = ShareOptions & {
	showMsTeamsOptions?: boolean | CompiledBindingToolkitExpression;
};

type ShareOptionKey =
	| CollaborationOptionKey
	| "SEND_EMAIL"
	| "SHARE_JAM"
	| "SAVE_AS_TILE"
	| "MS_TEAMS_GROUP"
	| "SHARE_COLLABORATION_MANAGER";

const enumMSTeamsOption: {
	[key in CollaborationOptionKey]: CollaborationOptionKey;
} = {
	COLLABORATION_MSTEAMS_CARD: "COLLABORATION_MSTEAMS_CARD",
	COLLABORATION_MSTEAMS_TAB: "COLLABORATION_MSTEAMS_TAB",
	COLLABORATION_MSTEAMS_CHAT: "COLLABORATION_MSTEAMS_CHAT"
};

const enumShareOption: {
	[key in ShareOptionKey]: ShareOptionKey;
} = {
	...enumMSTeamsOption,
	...{
		SEND_EMAIL: "SEND_EMAIL",
		SHARE_JAM: "SHARE_JAM",
		SAVE_AS_TILE: "SAVE_AS_TILE",
		MS_TEAMS_GROUP: "MS_TEAMS_GROUP",
		SHARE_COLLABORATION_MANAGER: "SHARE_COLLABORATION_MANAGER"
	}
};

type ConfigOptions = InternalShareOptions & MsTeamsOptions;

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
@defineBuildingBlock({
	name: "Share",
	namespace: "sap.fe.macros.internal",
	publicNamespace: "sap.fe.macros",
	returnTypes: ["sap.fe.macros.share.ShareAPI"]
})
export default class ShareBlock extends RuntimeBuildingBlock {
	/**
	 * The identifier of the Share control.
	 */
	@blockAttribute({
		type: "string",
		required: true,
		isPublic: true
	})
	public id!: string;

	/**
	 * Whether the share control should be visible on the screen.
	 * @public
	 */
	@blockAttribute({
		type: "boolean",
		isPublic: true,
		bindable: true
	})
	public visible: BindingToolkitExpression<boolean> = constant(true);

	/**
	 * Supported Share options {@link sap.fe.macros.share.ShareOptions}.
	 * @public
	 */
	@blockAttribute({
		type: "object",
		isPublic: true
	})
	public shareOptions?: ShareOptions;

	/**
	 * Supported Microsoft Teams options.
	 */
	@blockAttribute({
		type: "object",
		isPublic: false
	})
	public msTeamsOptions?: MsTeamsOptions;

	@defineReference()
	menuButton!: Ref<MenuButton>;

	@defineReference()
	cmdExecution!: Ref<CommandExecution>;

	@defineReference()
	menu!: Ref<Menu>;

	@defineReference()
	saveAsTileMenuItem!: Ref<MenuItem>;

	@defineReference()
	shareAsCollaborationManager!: Ref<MenuItem>;

	@defineReference()
	shareViaJAMMenuItem!: Ref<MenuItem>;

	@defineReference()
	sendEmailMenuItem!: Ref<MenuItem>;

	@defineReference()
	shareAsCardMenuItem!: Ref<MenuItem>;

	@defineReference()
	shareViaChatMenuItem!: Ref<MenuItem>;

	@defineReference()
	shareAsTabMenuItem!: Ref<MenuItem>;

	@defineReference()
	msTeamsGroupMenuItem!: Ref<MenuItem>;

	public isInitialized?: Promise<void>;

	private _blockInternalConfig!: ConfigOptions;

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
	async _initializeMenuItems(view: View, appComponent: AppComponent): Promise<void> {
		let isTeamsModeActive = false;
		if (appComponent.getEnvironmentCapabilities().getCapabilities().Collaboration) {
			const { default: CollaborationHelper } = await import("sap/suite/ui/commons/collaboration/CollaborationHelper");
			isTeamsModeActive = await CollaborationHelper.isTeamsModeActive();
		}

		if (isTeamsModeActive) {
			//need to clear the visible property bindings otherwise when the binding value changes then it will set back the visible to the resolved value
			this.menuButton.current?.unbindProperty("visible", true);
			this.menuButton.current?.setVisible(false);
			return;
		}
		const controller = view.getController() as PageController;
		const shellServices = appComponent.getShellServices();
		const isPluginInfoStable = await shellServices.waitForPluginsLoad();
		if (!isPluginInfoStable) {
			// In case the plugin info is not yet available we need to do this computation again on the next button click
			const internalButton = this.menuButton.current?.getAggregation("_control") as ManagedObject;
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
	 */
	async _addMenuItems(controller: PageController, shellServices: IShellServices): Promise<void> {
		this._addSendEmailOption(controller);
		await this._addShellBasedMenuItems(controller, shellServices);
	}

	/**
	 * Add send email option to menu button.
	 * @param controller Page controller
	 */
	_addSendEmailOption(controller: PageController): void {
		if (this.shareOptions?.showSendEmail ?? true) {
			this?.menu?.current?.addItem(
				<MenuItem
					ref={this.sendEmailMenuItem}
					text={this.getTranslatedText("T_SEMANTIC_CONTROL_SEND_EMAIL")}
					icon={"sap-icon://email"}
					press={async (): Promise<void> => controller.share._triggerEmail()}
				/>
			);
		}
	}

	/**
	 * Add UShell based share options.
	 * @param controller Page controller
	 * @param shellServices Shell Services
	 */
	async _addShellBasedMenuItems(controller: PageController, shellServices: IShellServices): Promise<void> {
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
	 */
	async _addCollaborationManagerOption(controller: PageController): Promise<void> {
		try {
			const collaborativeToolsService = controller.getAppComponent().getCollaborativeToolsService();
			const collaborationOption = await collaborativeToolsService.getCollaborationManagerOption();
			if (collaborationOption && (this.shareOptions?.showCollaborationManager ?? false)) {
				const menuItem = (
					<MenuItem
						ref={this.shareAsCollaborationManager}
						text={collaborationOption.text}
						icon={collaborationOption.icon}
						press={async (event: UI5Event<{}, MenuItem>): Promise<void> =>
							this._collaborationManagerButtonPress(collaborationOption.press, event)
						}
					></MenuItem>
				);
				FESRHelper.setSemanticStepname(menuItem, "press", collaborationOption.fesrStepName);
				this?.menu?.current?.addItem(menuItem);
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			Log.error(`FE : Adding Collaboration Manager Option : ${message}`);
		}
	}

	async _collaborationManagerButtonPress(collaborationCallBack: Function, event: UI5Event<{}, MenuItem>): Promise<void> {
		const clickedMenuItem = event.getSource();

		const view: View = CommonUtils.getTargetView(clickedMenuItem);
		const controller: PageController = view.getController() as PageController;
		await controller.share._adaptShareMetadata();
		const shareInfoModel = view.getModel("shareInfo") as JSONModel | undefined;

		if (shareInfoModel) {
			const shareInfo = shareInfoModel.getData();
			const { collaborationInfo } = shareInfo;
			collaborationCallBack(collaborationInfo.appTitle, collaborationInfo.url);
		}
	}

	/**
	 * Add share via JAM option.
	 * @param controller Page controller
	 * @param shellServices Shell Services
	 */
	_addShareViaJAMOption(controller: PageController, shellServices: IShellServices): void {
		const hasJam = !!shellServices.isJamActive?.();
		if (hasJam) {
			this?.menu?.current?.addItem(
				<MenuItem
					ref={this.shareViaJAMMenuItem}
					text={this.getTranslatedText("T_COMMON_SAPFE_SHARE_JAM")}
					icon={"sap-icon://share-2"}
					press={async (): Promise<void> => controller.share._triggerShareToJam()}
				/>
			);
		}
	}

	/**
	 * Add options to share via Microsoft Teams.
	 * @param controller PageController
	 */
	async _addMSTeamsOptions(controller: PageController): Promise<void> {
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
				const menuItemSettings: $MenuItemSettings = this._getMsTeamsMenuItemSettings(collaborationOption);
				const subOptions = menuItemSettings.items;
				// Multiple sub options are grouped into single teams group menu item.
				const menuItemKey =
					Array.isArray(subOptions) && subOptions.length ? enumShareOption.MS_TEAMS_GROUP : collaborationOption.key;

				this._addMsTeamsMenuItem(menuItemSettings, menuItemKey, collaborationOption.fesrStepName);
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			Log.error(`FE : Buildingblock : Share : adding MS teams options : ${message}`);
		}
	}

	/**
	 * Add save as tile option.
	 * @param controller Page controller
	 */
	async _addSaveAsTileOption(controller: PageController): Promise<void> {
		try {
			// set save as tile
			// for now we need to create addBookmarkButton to use the save as tile feature.
			// In the future save as tile should be available as an API or a MenuItem so that it can be added to the Menu button.
			// This needs to be discussed with AddBookmarkButton team.
			// Included in a hasUshell branch
			const { default: AddBookmarkButton } = await import("sap/ushell/ui/footerbar/AddBookmarkButton");
			const addBookmarkButton = new AddBookmarkButton();
			if (addBookmarkButton.getEnabled()) {
				this?.menu?.current?.addItem(
					<MenuItem
						ref={this.saveAsTileMenuItem}
						text={addBookmarkButton.getText()}
						icon={addBookmarkButton.getIcon()}
						press={async (): Promise<void> => controller.share._saveAsTile(this.saveAsTileMenuItem.current!)}
					>
						{{ dependents: [addBookmarkButton] }}
					</MenuItem>
				);
			} else {
				addBookmarkButton.destroy();
			}
		} catch (err: unknown) {
			const message = err instanceof Error ? err.message : String(err);
			Log.error(`FE : Buildingblock : Share : adding Save as tile option : ${message}`);
		}
	}

	/**
	 * Get isShareAsCardEnabled to fetch supported collaboration options.
	 * @returns Boolean.
	 */
	_getIsShareAsCardEnabled(): boolean {
		const showShareAsCard = this.msTeamsOptions?.enableCard ?? false;

		if (typeof showShareAsCard === "boolean") {
			return showShareAsCard;
		} else if (typeof showShareAsCard === "string") {
			// "true" or a binding expression
			try {
				return showShareAsCard === "true" || Boolean(BindingParser.complexParser(showShareAsCard));
			} catch (err) {
				Log.error(err as string);
			}
		}
		return true;
	}

	/**
	 * Get Menu Item settings for main MS teams option.
	 * @param collaborationOption Root Collaboration Option
	 * @returns MenuItemSettings
	 */
	_getMsTeamsMenuItemSettings(collaborationOption: CollaborationOptions): $MenuItemSettings {
		const items = this._getMsTeamsSubOptions(collaborationOption?.subOptions);
		const menuItemSettings: $MenuItemSettings = {
			text: collaborationOption.text,
			icon: collaborationOption.icon,
			items
		};

		if (items.length === 0) {
			// if there are no sub option then the main option should be clickable
			// so add a press handler.
			menuItemSettings.press = async (event: UI5Event<{}, MenuItem>): Promise<void> => this.collaborationMenuItemPress(event);
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
	 */
	_addMsTeamsMenuItem(menuItemSettings: $MenuItemSettings, menuItemKey?: ShareOptionKey, fesrStepName?: string): void {
		const menuItem: MenuItem = (
			<MenuItem
				ref={this._getMenuItemReference(menuItemKey)}
				text={menuItemSettings.text}
				icon={menuItemSettings.icon}
				customData={menuItemSettings.customData}
				items={menuItemSettings.items}
			></MenuItem>
		);
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
	 */
	_getMsTeamsSubOptions(subOptions?: CollaborationOptions[]): MenuItem[] {
		if (!Array.isArray(subOptions)) {
			return [];
		}

		return subOptions.reduce((menuItems: MenuItem[], subOption: CollaborationOptions) => {
			const subMenuItem = (
				<MenuItem
					ref={this._getMenuItemReference(subOption.key)}
					text={subOption.text}
					icon={subOption.icon}
					press={async (event: UI5Event<{}, MenuItem>): Promise<void> => this.collaborationMenuItemPress(event)}
					customData={
						new CustomData({
							key: "collaborationData",
							value: subOption
						})
					}
				></MenuItem>
			);
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
	 */
	async collaborationMenuItemPress(event: UI5Event<{}, MenuItem>): Promise<void> {
		const clickedMenuItem = event.getSource();

		const view: View = CommonUtils.getTargetView(clickedMenuItem);
		const controller: PageController = view.getController() as PageController;
		await controller.share._adaptShareMetadata();
		const shareInfoModel = view.getModel("shareInfo") as JSONModel | undefined;

		if (shareInfoModel) {
			const shareInfo = shareInfoModel.getData();
			const { collaborationInfo } = shareInfo;

			const collaborationData = clickedMenuItem.data("collaborationData");
			const collaborativeToolsService = controller.getAppComponent().getCollaborativeToolsService();
			const teamsHelperService = (await collaborativeToolsService.getCollaborationServices()).oTeamsHelperService;
			if (collaborationData["key"] === enumMSTeamsOption.COLLABORATION_MSTEAMS_CARD) {
				const isShareAsCardEnabled = teamsHelperService.isFeatureFlagEnabled();
				const cardDefinition = isShareAsCardEnabled ? await controller.share.getCardDefinition() : undefined;
				let cardId: string | undefined;
				if (cardDefinition) {
					const shellServiceHelper = controller.getAppComponent().getShellServices();
					const { semanticObject, action } = shellServiceHelper.parseShellHash(document.location.hash);
					cardId = `${semanticObject}_${action}`;
				} else {
					const reason = !isShareAsCardEnabled
						? "Feature flag disabled in collaboration teams helper"
						: "Card definition was not created";
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
	 */
	setShareOptionsVisibility(): void {
		const optionKeys = Object.keys(enumShareOption) as ShareOptionKey[];
		const visibleBindingExps = optionKeys.reduce((bindingToolkitExps: BindingToolkitExpression<boolean>[], option: ShareOptionKey) => {
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
	 */
	_getMenuItemReference(option?: ShareOptionKey): Ref<MenuItem> | undefined {
		let ref: Ref<MenuItem> | undefined;
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
	 */
	_getShareOptionVisibilityExpression(option?: ShareOptionKey): BindingToolkitExpression<boolean> {
		const optionMenuItemRef = this._getMenuItemReference(option);
		if (!optionMenuItemRef?.current) {
			return constant(false);
		}

		let exp: BindingToolkitExpression<boolean>;
		switch (option) {
			case enumShareOption.COLLABORATION_MSTEAMS_CARD:
			case enumShareOption.COLLABORATION_MSTEAMS_CHAT:
			case enumShareOption.COLLABORATION_MSTEAMS_TAB:
				exp = this._getMSTeamsShareOptionVisibility(option);
				break;
			case enumShareOption.SHARE_COLLABORATION_MANAGER:
				exp = this._getCollaborationOptionExpression();
				break;
			case enumShareOption.SEND_EMAIL: {
				const showSendEmail = this.shareOptions?.showSendEmail ?? true;
				const optionExp = resolveBindingString<boolean>(showSendEmail, "boolean");
				const internalOption = this._blockInternalConfig.showSendEmail ?? true;
				const internalOptionExp = resolveBindingString<boolean>(internalOption, "boolean");
				exp = and(optionExp, internalOptionExp);
				break;
			}
			case enumShareOption.SHARE_JAM:
			case enumShareOption.SAVE_AS_TILE: {
				// No overrides for Share via Jam and Save as tile yet.
				exp = constant(true);
				break;
			}
			case enumShareOption.MS_TEAMS_GROUP: {
				const msTeamsConfigExp = this._getShowMsTeamsOptionsExpression();
				const msTeamsOptions = Object.keys(enumMSTeamsOption) as ShareOptionKey[];
				const allMSTeamsOptionsExps = msTeamsOptions.reduce(
					(bindingToolkitExp: BindingToolkitExpression<boolean>[], msTeamsOption: ShareOptionKey) => {
						const msTeamOptionExp = this._getMSTeamsShareOptionVisibility(msTeamsOption);
						return [...bindingToolkitExp, msTeamOptionExp];
					},
					[] as BindingToolkitExpression<boolean>[]
				);
				exp = and(msTeamsConfigExp, or(...allMSTeamsOptionsExps));
				break;
			}
			default:
				exp = constant(false);
		}

		return exp;
	}

	_getCollaborationOptionExpression(): BindingToolkitExpression<boolean> {
		const showCollaborationManager = this.shareOptions?.showCollaborationManager ?? false;
		const optionExp = resolveBindingString<boolean>(showCollaborationManager, "boolean");
		const internalOption = this._blockInternalConfig.showCollaborationManager ?? true;
		const internalOptionExp = resolveBindingString<boolean>(internalOption, "boolean");
		return and(optionExp, internalOptionExp);
	}

	/**
	 * Get expression for showMsTeamsOptions share option based on the building block configuration.
	 * @returns Binding toolkit expression.
	 */
	_getShowMsTeamsOptionsExpression(): BindingToolkitExpression<boolean> {
		const internalOption = this._blockInternalConfig.showMsTeamsOptions ?? true;
		return resolveBindingString<boolean>(internalOption, "boolean");
	}

	/**
	 * Get binding toolkit expression for share as card visibility.
	 * @returns Binding toolkit expression.
	 */
	_getShareAsCardVisibility(): BindingToolkitExpression<boolean> {
		let exp: BindingToolkitExpression<boolean>;
		const shareAsCardOptionRef = this._getMenuItemReference(enumShareOption.COLLABORATION_MSTEAMS_CARD);
		if (shareAsCardOptionRef?.current) {
			const expShowMSTeamsOptions = this._getShowMsTeamsOptionsExpression();
			const showShareAsCard = this.msTeamsOptions?.enableCard ?? true;
			const optionExp = resolveBindingString<boolean>(showShareAsCard, "boolean");
			const internalOption = this._blockInternalConfig.enableCard ?? true;
			const internalOptionExp = resolveBindingString<boolean>(internalOption, "boolean");
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
	 */
	_getMSTeamsShareOptionVisibility(option: ShareOptionKey): BindingToolkitExpression<boolean> {
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
	 */
	_setShareOptionVisibility(option: ShareOptionKey, expression: BindingToolkitExpression<boolean>): void {
		const menuItemRef = this._getMenuItemReference(option);
		if (menuItemRef?.current) {
			this._bindUIVisibility(menuItemRef.current, expression);
		}
	}

	/**
	 * Bind the UI element's visibility property.
	 * @param item UI element
	 * @param expression Expression to bind.
	 */
	_bindUIVisibility(item: MenuButton | MenuItem | CommandExecution, expression: BindingToolkitExpression<boolean>): void {
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
				Log.error(err as string);
			}
		} else if (compiledExp === "false") {
			// Statically false
			item.unbindProperty("visible", true);
			item.setVisible(false);
		}
	}

	_getShareBlockConfig(view: View): ConfigOptions {
		const viewData = view.getViewData() as ViewData;
		const viewShareConfigs = viewData?.share;
		const controller = view.getController() as PageController;
		const feAppShareConfigs = controller.getAppComponent().getManifestEntry("sap.fe")?.app?.share;

		const showSendEmail = this._getOptionBlockConfig(feAppShareConfigs?.showSendEmail, viewShareConfigs?.showSendEmail);
		const showCollaborationManager = this._getOptionBlockConfig(
			feAppShareConfigs?.showCollaborationManager,
			viewShareConfigs?.showCollaborationManager
		);

		const showMsTeamsOptions = this._getOptionBlockConfig(
			feAppShareConfigs?.teams?.showMsTeamsOptions,
			viewShareConfigs?.teams?.showMsTeamsOptions
		);
		const enableCard = this._getOptionBlockConfig(feAppShareConfigs?.teams?.asCard, viewShareConfigs?.teams?.asCard);

		return { showSendEmail, showMsTeamsOptions, enableCard, showCollaborationManager };
	}

	_getOptionBlockConfig(feAppSetting?: boolean | string, viewLevelSetting?: boolean | string): CompiledBindingToolkitExpression {
		const feAppExp = typeof feAppSetting === "string" ? resolveBindingString<boolean>(feAppSetting) : constant(feAppSetting ?? true);
		const viewLevelExp =
			typeof viewLevelSetting === "string" ? resolveBindingString<boolean>(viewLevelSetting) : constant(viewLevelSetting ?? true);
		return compileExpression(and(feAppExp, viewLevelExp));
	}

	getContent(view: View, appComponent: AppComponent): ShareAPI {
		// Ctrl+Shift+S is needed for the time being but this needs to be removed after backlog from menu button
		const menuButton = (
			<ShareAPI id={this.id}>
				<OverflowToolbarMenuButton
					text={"{sap.fe.i18n>M_COMMON_SAPFE_ACTION_SHARE}"}
					ref={this.menuButton}
					icon={"sap-icon://action"}
					tooltip={"{sap.fe.i18n>M_COMMON_SAPFE_ACTION_SHARE} (Ctrl+Shift+S)"}
				>
					<Menu ref={this.menu}></Menu>
				</OverflowToolbarMenuButton>
			</ShareAPI>
		) as ShareAPI;
		view.addDependent(
			<CommandExecution
				ref={this.cmdExecution}
				command="Share"
				execute={(): void => {
					this.menuButton.current?.getMenu().openBy(this.menuButton.current, true);
				}}
			/>
		);
		// The initialization is asynchronous, so we just trigger it and hope for the best :D
		this.isInitialized = this._initializeMenuItems(view, appComponent).catch((error) => {
			Log.error(error as string);
		});
		return menuButton;
	}
}
