/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import Element from "sap/ui/core/Element";
import Lib from "sap/ui/core/Lib";
import BaseContainer from "./BaseContainer";
import { $BasePanelSettings } from "./BasePanel";
import { DeviceType, calculateDeviceType } from "./utils/Device";

/**
 *
 * Abstract base panel class for My Home layout control panel.
 *
 * @extends sap.ui.core.Element
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @abstract
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.BasePanel
 */
export default abstract class BasePanel extends Element {
	protected _i18nBundle!: ResourceBundle;
	private _content!: Control[];

	constructor(id?: string | $BasePanelSettings);
	constructor(id?: string, settings?: $BasePanelSettings);
	constructor(id?: string, settings?: $BasePanelSettings) {
		super(id, settings);
	}

	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home",
		properties: {
			/**
			 * Title for the panel.
			 */
			title: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Key for the panel.
			 */
			key: { type: "string", group: "Misc", defaultValue: "" },
			/**
			 * Tooltip for the panel.
			 */
			tooltip: { type: "string", group: "Misc", defaultValue: "", visibility: "hidden" },
			/**
			 * Specifies whether settings should be enabled for the panel.
			 */
			enableSettings: { type: "boolean", group: "Misc", visibility: "hidden" },
			/**
			 * Specifies whether key user settings should be enabled for the panel.
			 */
			enableKeyUserSettings: { type: "boolean", group: "Misc", visibility: "hidden", defaultValue: true },
			/**
			 * Indicates whether full screen is enabled for this control.
			 */
			enableFullScreen: { type: "boolean", group: "Misc", visibility: "hidden" },
			/**
			 * The name of the URL parameter used to expand the container into full-screen mode.
			 * This property specifies the parameter key expected in the URL query string
			 * to identify the container to be expanded.
			 */
			fullScreenName: { type: "string", group: "Misc", visibility: "hidden" }
		},
		defaultAggregation: "content",
		aggregations: {
			/**
			 * Specifies the content aggregation of the panel.
			 */
			content: { multiple: true, singularName: "content", visibility: "hidden" },
			/**
			 * Specifies the actions to be shown within the panel.
			 */
			actionButtons: { type: "sap.m.Button", multiple: true, singularName: "actionButton" },
			/**
			 * Specifies the items that are shown within the dropdown menu of the panel.
			 */
			menuItems: { type: "sap.cux.home.MenuItem", multiple: true, singularName: "menuItem" }
		},
		events: {
			/**
			 * Event is fired before the container is expanded.
			 */
			onExpand: {}
		},
		associations: {
			fullScreenButton: { type: "sap.m.Button", multiple: false, singularName: "fullScreenButton", visibility: "hidden" }
		}
	};

	/**
	 * Init lifecycle method
	 *
	 * @private
	 * @override
	 */
	public init(): void {
		this._content = [];
		this._i18nBundle = Lib.getResourceBundleFor("sap.cux.home.i18n") as ResourceBundle;
	}

	/**
	 * Cache and return panel content since the content would
	 * have a different inner control as parent after rendering
	 *
	 * @private
	 * @returns {Control[]} - array of panel content
	 */
	public _getContent(): Control[] {
		this._content = this._content || this.getAggregation("content");
		return this._content;
	}

	/**
	 * Overridden method for adding content to a panel so that
	 * it's added to the corresponding layout-specific inner
	 * control as well
	 *
	 * @private
	 * @param {Control} control - control to be added to the content
	 */
	public _addContent(control: Control): void {
		this._content = this._content || this.getAggregation("content");
		this._content.push(control);
		this.insertAggregation("content", control, 0);

		//Insert into parent's layout control
		(this.getParent() as BaseContainer)?._addToPanel(this, control);
	}

	/**
	 * Updates the count information of IconTabFilter of IconTabBar inner control
	 * in case of SideBySide layout
	 *
	 * @private
	 * @param {string} count - updated count information
	 */
	public _setCount(count?: string): void {
		(this.getParent() as BaseContainer)?._setPanelCount(this, count);
	}

	/**
	 * Retrieves the device type for the current panel.
	 *
	 * @private
	 * @returns {DeviceType} - The device type of the parent container if it exists,
	 * otherwise calculates and returns the device type based on the current device width.
	 */
	protected getDeviceType(): DeviceType {
		const container = this.getParent() as BaseContainer;
		return container ? container.getDeviceType() : calculateDeviceType();
	}
}
