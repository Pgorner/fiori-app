/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */

sap.ui.define([
	"sap/apf/modeler/ui/utils/nullObjectChecker",
	"sap/apf/utils/exportToGlobal"
], function(nullObjectChecker, exportToGlobal){
	'use strict';
	/**
	 * Helps checking for valid state of mandatory controls on a particular view.
	 * 
	 * @class
	 * @alias sap.apf.modeler.ui.utils.ViewValidator
	 * @param {sap.ui.core.mvc.View} view Accepts a view
	 */
	var viewValidator = function(view) {
		this.aFieldIds = [];
		this.oView = view;
	};
	/**
	 * @private
	 * @name sap.apf.modeler.ui.utils.viewValidator~stringTypeChecker
	 * @param {any} sFieldId
	 * @returns {boolean} if a control id is of string type or not
	 */
	function stringTypeChecker(sFieldId) {
		var isString = true;
		if ((typeof sFieldId) !== 'string') {
			isString = false;
		}
		return isString;
	}
	/**
	 * @private
	 * @name sap.apf.modeler.ui.utils.viewValidator~checkIfControlIsPresentInView
	 * @returns {boolean} if a control id is part of view or not
	 */
	function checkIfControlIsPresentInView(oContext, sFieldId) {
		var isControlOfView = true;
		if (!oContext.oView.byId(sFieldId)) {
			isControlOfView = false;
		}
		return isControlOfView;
	}
	/**
	 * Adds multiple controls IDs for validation.
	 *
	 * @param {sap.ui.core.ID[]} aFields Accepts an array of control IDs
	 * @private
	 */
	viewValidator.prototype.addFields = function(aFields) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aFields)) {
			return;
		}
		var counter, length = aFields.length;
		for(counter = 0; counter < length; counter++) {
			if (stringTypeChecker(aFields[counter]) && checkIfControlIsPresentInView(this, aFields[counter]) && this.aFieldIds.indexOf(aFields[counter]) === -1) {
				this.aFieldIds.push(aFields[counter]);
			}
		}
	};
	/**
	 * Adds one control ID for validation.
	 *
	 * @param {sap.ui.core.ID} sFieldId Accepts a control ID
	 * @private
	 */
	viewValidator.prototype.addField = function(sFieldId) {
		if (!nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFieldId)) {
			return;
		}
		if (stringTypeChecker(sFieldId) && checkIfControlIsPresentInView(this, sFieldId) && this.aFieldIds.indexOf(sFieldId) === -1) {
			this.aFieldIds.push(sFieldId);
		}
	};
	/**
	 * Removes multiple control IDs from validation.
	 *
	 * @param {sap.ui.core.ID[]} aFields accepts an array of control IDs
	 * @private
	 */
	viewValidator.prototype.removeFields = function(aFields) {
		var index = -1;
		var counter, length = aFields.length;
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(aFields) === false) {
			return;
		}
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(this.aFieldIds) === false) {
			return;
		}
		for(counter = 0; counter < length; counter++) {
			index = this.aFieldIds.indexOf(aFields[counter]);
			if (stringTypeChecker(aFields[counter]) && checkIfControlIsPresentInView(this, aFields[counter]) && index !== -1) {
				this.aFieldIds.splice(index, 1);
			}
		}
	};
	/**
	 * Removes one control ID from validation.
	 *
	 * @param {sap.ui.core.ID} sFieldId accepts a control ID
	 * @private
	 */
	viewValidator.prototype.removeField = function(sFieldId) {
		var index = -1;
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(sFieldId) === false) {
			return;
		}
		if (nullObjectChecker.checkIsNotNullOrUndefinedOrBlank(this.aFieldIds) === false) {
			return;
		}
		index = this.aFieldIds.indexOf(sFieldId);
		if (stringTypeChecker(sFieldId) && checkIfControlIsPresentInView(this, sFieldId) && index !== -1) {
			this.aFieldIds.splice(index, 1);
		}
	};
	/**
	 * @returns {sap.ui.core.ID[]} All control IDs for validation
	 * @private
	 */
	viewValidator.prototype.getFields = function() {
		return this.aFieldIds;
	};
	/**
	 * @returns {sap.ui.core.mvc.View} View being validated
	 * @private
	 */
	viewValidator.prototype.getView = function() {
		return this.oView;
	};
	/**
	 * Removes all control ids from validation.
	 *
	 * @private
	 */
	viewValidator.prototype.clearFields = function() {
		var length = this.aFieldIds.length;
		this.aFieldIds.splice(0, length);
	};
	/**
	 * @returns {boolean} Validation state of the view
	 * @private
	 */
	viewValidator.prototype.getValidationState = function() {
		var bValidState = true, i;
		for(i = 0; i < this.aFieldIds.length; i++) {
			var oControl = this.oView.byId(this.aFieldIds[i]);
			if (oControl) {
				if (oControl.isA("sap.m.MultiComboBox")) {
					bValidState = (oControl.getSelectedKeys().length >= 1) ? true : false;
				} else if (oControl.isA("sap.m.Input")) {
					if (oControl.isA("sap.m.MultiInput")) {
						bValidState = (oControl.getTokens().length >= 1) ? true : false;
					} else {
						bValidState = (oControl.getValue().trim() !== "") ? true : false;
					}
				} else if (oControl.isA("sap.m.ComboBox")) {
					bValidState = (oControl.getValue().trim() !== "") ? true : false;
				} else if (oControl.isA("sap.m.Select")) {
					bValidState = (oControl.getSelectedKey().length >= 1) ? true : false;
				}
			}
			if (bValidState === false) {
				break;
			}
		}
		return bValidState;
	};

	// compatiblity export as the global name and the module name differ
	exportToGlobal("sap.apf.modeler.ui.utils.ViewValidator", viewValidator);

	return viewValidator;
}, true /* GLOBAL_EXPORT*/ );
