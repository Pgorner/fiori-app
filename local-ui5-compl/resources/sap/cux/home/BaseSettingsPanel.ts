/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ResourceBundle from "sap/base/i18n/ResourceBundle";
import type { MetadataOptions } from "sap/ui/core/Element";
import Element from "sap/ui/core/Element";
import Lib from "sap/ui/core/Lib";
import BaseContainer from "./BaseContainer";
import BaseLayout from "./BaseLayout";
import BasePanel from "./BasePanel";
import { $BaseSettingsPanelSettings } from "./BaseSettingsPanel";
import { IKeyUserChange } from "./interface/KeyUserInterface";

/**
 *
 * Abstract base class for panels inside My Home Settings Dialog.
 *
 * @extends sap.ui.core.Element
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @abstract
 * @private
 *
 * @alias sap.cux.home.BaseSettingsPanel
 */
export default abstract class BaseSettingsPanel extends Element {
	protected _i18nBundle!: ResourceBundle;
	private _keyuserChanges: Array<IKeyUserChange> = [];

	constructor(id?: string | $BaseSettingsPanelSettings);
	constructor(id?: string, settings?: $BaseSettingsPanelSettings);
	constructor(id?: string, settings?: $BaseSettingsPanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Key of the settings panel.
			 */
			key: { type: "string", group: "Misc", defaultValue: "", visibility: "hidden" },
			/**
			 * Title of the settings panel.
			 */
			title: { type: "string", group: "Misc", defaultValue: "", visibility: "hidden" },
			/**
			 * Icon of the settings panel.
			 */
			icon: { type: "sap.ui.core.URI", group: "Misc", defaultValue: "", visibility: "hidden" },
			/**
			 * Specifies if header should be shown for the settings panel page.
			 */
			showHeader: { type: "boolean", group: "Misc", defaultValue: true, visibility: "hidden" }
		},
		defaultAggregation: "content",
		aggregations: {
			/**
			 * Content aggregation of the settings panel.
			 */
			content: { type: "sap.ui.core.Control", singularName: "content", multiple: true, visibility: "hidden" },
			/**
			 * Holds the actions to be shown within the settings panel.
			 */
			actionButtons: { type: "sap.m.Button", multiple: true, singularName: "actionButton", visibility: "hidden" }
		},
		associations: {
			/**
			 * Associations of the settings panel.
			 * Id of the panel associated with the settings panel to be provided.
			 * In case of multiple panels with same Id, the first panel will be associated.
			 * If no panel is found with the provided id, the settings panel will not be associated with any panel.
			 */
			panel: { type: "string" }
		},
		events: {
			/**
			 * Fired whenever the panel has been navigated to.
			 */
			panelNavigated: {
				parameters: {
					context: { type: "object" }
				}
			}
		}
	};

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n") as ResourceBundle;
	}

	/**
	 * Retrieves the BasePanel or BaseLayout associated with the BaseSettingsPanel.
	 *
	 * @returns {BasePanel | BaseLayout} The panel or layout associated with the BaseSettingsPanel
	 * @private
	 */
	protected _getPanel(): BasePanel | BaseLayout {
		return Element.getElementById(this.getAssociation("panel", null) as string) as BasePanel | BaseLayout;
	}

	/**
	 * Persists the dialog state by setting a property on the parent layout
	 * indicating that the settings dialog should be persisted.
	 *
	 * @private
	 */
	protected _persistDialog(): void {
		const panel = this._getPanel();
		const container = panel?.getParent() as BaseContainer;
		const layout = container?.getParent() as BaseLayout;

		layout?.setProperty("settingsDialogPersisted", true, true);
	}

	/**
	 * Returns the KeyUser Changes made by user.
	 *
	 * @public
	 */
	public getKeyUserChanges(): Array<IKeyUserChange> {
		return this._keyuserChanges;
	}

	/**
	 * Add Changes made by user in case of KeyUser Settings Panel.
	 *
	 * @public
	 */
	public addKeyUserChanges(change: IKeyUserChange): void {
		this._keyuserChanges.push(change);
	}

	/**
	 * Clear all KeyUser Changes made by user.
	 *
	 * @public
	 */
	public clearKeyUserChanges(): void {
		this._keyuserChanges = [];
	}
}
