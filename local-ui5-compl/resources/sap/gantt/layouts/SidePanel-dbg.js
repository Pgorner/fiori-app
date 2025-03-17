
/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Control"
], function (Control) {
	"use strict";
	/**
	 * Creates and initializes a new class for side panel.
	 *
	 * @param {string} [sId] ID of the new control. The ID is generated automatically if it is not provided.
	 * @param {object} [mSetting] Initial settings for the new control
	 *
	 * @class
	 * Enables applications to place a custom control within the Gantt Chart Container.
	 * The Side Panel control manages the rendering of the control placed in the  <code>content</code> aggregation. The child control also receives <code>onActivated</code> and <code>onDeactivated</code> pseudo-events when activated or deactivated.
	 * <code>
	 * const sidePanel = this.getParent();
	 *
	 * sidePanel.addEventDelegate({
	 * 	 onActivated: (evt) => {}, //on activate handler
	 *   onDeactivated: (evt) => {} //on deactivate handler
	 * })
	 * </code>
	 *
	 * @extends sap.ui.core.Control
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 * @since 1.126
	 *
	 * @constructor
	 * @public
	 * @alias sap.gantt.layouts.SidePanel
	 */
	var SidePanel = Control.extend("sap.gantt.layouts.SidePanel", {
		metadata: {
			library: "sap.gantt",
			defaultAggregation: "content",
			properties: {
				/**
				 * If this property is set to true, the content is shown in the side panel.
				 * @since 1.126
				 */
				visible: { type: "boolean", defaultValue: false }
			},
			aggregations: {
				/**
				 * Control to be placed in the side panel.
				 * @since 1.126
				 */
				content: { type: "sap.ui.core.Control", multiple: false }
			}
		}
	});

	/**
	 * Control init handler
	 * @private
	 * @override
	 */
	SidePanel.prototype.init = function () {
		this._oLocalAggregation = {
			content: null
		};
	};

	/**
	 * Method to hide or show the side panel
	 * @param {boolean} bEnabled flag to hide or show the side panel
	 * @override
	 * @public
	 * @since 1.126
	 * @returns {this} returns the control for chaining
	 */
	SidePanel.prototype.setVisible = function (bEnabled) {
		this._setPanelVisibility(bEnabled);

		return this;
	};

	/**
	 * Aggregation to set the content of the side panel
	 * @param {sap.ui.core.Control} oControl control to be placed
	 * @param {boolean} bSuppressInvalidate flag to suppress the invalidation
	 * @public
	 * @since 1.126
	 * @returns {sap.gantt.layouts.SidePanel} returns the control for chaining
	 */
	SidePanel.prototype.setContent = function (oControl, bSuppressInvalidate) {
		if (this._bActive) {
			this.setAggregation("content", oControl, true);

			if (!bSuppressInvalidate) {
				this._createInvalidation();
			}
		} else {
			this._oLocalAggregation["content"] = oControl;
		}

		return this;
	};

	/**
	 * Method to enable or disable the side panel visibility
	 * @param {boolean} bEnabled flag to enable or disable the side panel
	 * @param {boolean} bSuppressInvalidate flag to suppress the invalidation
	 * @private
	 * @returns {sap.gantt.layouts.SidePanel} returns the control for chaining
	 */
	SidePanel.prototype._setPanelVisibility = function (bEnabled, bSuppressInvalidate) {
		var bIsEnabled = this.getVisible();
		this.setProperty("visible", bEnabled, true);

		if (bEnabled != bIsEnabled) {
			if (bIsEnabled) {
				this._deactivate();
			} else {
				this._activate();
			}

			if (!bSuppressInvalidate) {
				this._createInvalidation();
			}
		}

		return this;
	};

	/**
	 * Internal side panel activation handler
	 * @private
	 * @return {void}
	 */
	SidePanel.prototype._activate = function () {
		if (this._bActive) {
			return;
		}

		this.setAggregation("content", this._oLocalAggregation["content"], true);

		this._bActive = true;
		this._handleEvent(new jQuery.Event("Activated"));
	};

	/**
	 * Internal side panel deactivation handler
	 * @private
	 * @return {void}
	 */
	SidePanel.prototype._deactivate = function () {
		if (!this._bActive) {
			return;
		}

		this._oLocalAggregation["content"] = this.getAggregation("content");
		this.setAggregation("content", null, true);

		this._bActive = false;
		this._handleEvent(new jQuery.Event("Deactivated"));
	};

	/**
	 * Notify parent on the attach of the side panel with the instance.
	 * @param {object} oParent new parent control
	 * @private
	 * @override
	 */
	SidePanel.prototype.setParent = function (oParent) {
		Control.prototype.setParent.apply(this, arguments);

		if (oParent && oParent.onSidePanelAttach) {
			oParent.onSidePanelAttach(this);
		}

		return this;
	};

	/**
	 * Create side panel invalidation for the parent control.
	 * @private
	 * @returns {sap.gantt.layouts.SidePanel} returns the control for chaining
	 */
	SidePanel.prototype._createInvalidation = function () {
		const oParent = this.getParent();
		if (oParent) {
			oParent.invalidate(this);
		}
		return this;
	};

	return SidePanel;
});
