/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	[],
	function () {
		"use strict";

		/**
		 * Enum for supported dialog types.
		 * @name sap.fe.test.api.DialogType
		 * @enum {string}
		 * @public
		 */
		return {
			/**
			 * A simple dialog supporting base checks and actions such as 'Confirm' and 'Cancel'
			 * @name sap.fe.test.api.DialogType.Confirmation
			 * @constant
			 * @type {string}
			 * @public
			 */
			Confirmation: "Confirmation",
			/**
			 * A ValueHelp dialog that has a condition definition panel or a filterable selection table
			 * @name sap.fe.test.api.DialogType.ValueHelp
			 * @constant
			 * @type {string}
			 * @public
			 */
			ValueHelp: "ValueHelp",
			/**
			 * A message dialog for showing back-end messages
			 * @name sap.fe.test.api.DialogType.Message
			 * @constant
			 * @type {string}
			 * @public
			 */
			Message: "Message",
			/**
			 * A dialog used for showing an error message
			 * @name sap.fe.test.api.DialogType.Error
			 * @constant
			 * @type {string}
			 * @public
			 */
			Error: "Error",
			/**
			 * A default dialog for action parameters
			 * @name sap.fe.test.api.DialogType.Action
			 * @constant
			 * @type {string}
			 * @public
			 */
			Action: "Action",
			/**
			 * A dialog used for creating a new object
			 * @name sap.fe.test.api.DialogType.Create
			 * @constant
			 * @type {string}
			 * @public
			 */
			Create: "Create",
			/**
			 * A dialog used for mass edit
			 * @name sap.fe.test.api.DialogType.MassEdit
			 * @constant
			 * @type {string}
			 * @private
			 */
			MassEdit: "MassEdit"
		};
	},
	true
);
