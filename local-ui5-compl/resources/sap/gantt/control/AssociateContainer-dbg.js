/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
	"sap/ui/core/Control", "sap/ui/core/Element", "./AssociateContainerRenderer"
], function (Control, Element) {
	"use strict";

	var AssociateContainer = Control.extend("sap.gantt.control.AssociateContainer", {
		metadata: {
			library: "sap.gantt",
			properties: {
				/**
				 * for block DOM element only
				 */
				enableRootDiv: {type: "boolean", defaultValue: false}
			},
			associations: {
				/**
				 * for block DOM element
				 */
				content: {type: "sap.ui.core.Control", multiple: false}
			}
		}
	});

	AssociateContainer.prototype.setContent = function (vContent) {
		this.setAssociation("content", vContent);
		if (vContent) {
			var oContent = typeof (vContent) === "string" ? Element.getElementById(vContent) : vContent;
			oContent._oAC = this;
		}
		return this;
	};

	return AssociateContainer;
}, true);
