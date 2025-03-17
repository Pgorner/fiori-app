/*
 * SAPUI5

(c) Copyright 2009-2020 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/Messaging"],function(t){"use strict";var e=function(t){this._oModel=t};e.prototype.getContextFromResponse=function(t){var e="/"+this._oModel.getKey(t);return this._oModel.getContext(e)};e.getEntitySetFromContext=function(t){var n=e.getEntitySetObjectFromContext(t);return n?n.name:null};e.getEntitySetObjectFromContext=function(t){var e,n;if(!t){throw new Error("No context")}if(t&&t.getPath){e=t.getPath().split("(")[0];n=e.substring(1)}if(n){return t.getModel().getMetaModel().getODataEntitySet(n)}return undefined};e.getEntityTypeFromContext=function(t){var n=e.getEntitySetObjectFromContext(t);return n?t.getModel().getMetaModel().getODataEntityType(n.entityType):undefined};e.prototype.hasClientMessages=function(){var e=0;var n=t.getMessageModel().getData();if(n){e=n.length}for(var o=0;o<e;o++){var r=n[o];if(r.processor.getMetadata()._sClassName==="sap.ui.core.message.ControlMessageProcessor"){return true}}return false};e.prototype.destroy=function(){this._oModel=null};return e},true);
//# sourceMappingURL=ModelUtil.js.map