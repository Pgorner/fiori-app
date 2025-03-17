/*!
 * SAPUI5
 * (c) Copyright 2009-2024 SAP SE. All rights reserved.
 */

// Provides control sap.uiext.inbox.composite.InboxAddAttachmentTile.
jQuery.sap.declare("sap.uiext.inbox.composite.InboxAddAttachmentTile");
jQuery.sap.require("sap.uiext.inbox.library");
jQuery.sap.require("sap.ui.core.Control");


/**
 * Constructor for a new composite/InboxAddAttachmentTile.
 *
 * @param {string} [sId] id for the new control, generated automatically if no id is given
 * @param {object} [mSettings] initial settings for the new control
 *
 * @class
 * InboxAddAttachmentTile
 * @extends sap.ui.core.Control
 *
 * @constructor
 * @public
 * @deprecated As of version 1.120, the concept has been discarded.
 * @name sap.uiext.inbox.composite.InboxAddAttachmentTile
 */
sap.ui.core.Control.extend("sap.uiext.inbox.composite.InboxAddAttachmentTile", /** @lends sap.uiext.inbox.composite.InboxAddAttachmentTile.prototype */ { metadata : {

	library : "sap.uiext.inbox"
}});

sap.uiext.inbox.composite.InboxAddAttachmentTile.prototype.init = function() {
	this._oBundle = sap.ui.getCore().getLibraryResourceBundle("sap.uiext.inbox");
};
