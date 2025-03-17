/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/base/Object","sap/m/MessageBox"],function(e,t){"use strict";return e.extend("sap.ui.documentation.sdk.controller.ErrorHandler",{constructor:function(e){this._oComponent=e;this._oModel=e.getModel();this._bMessageOpen=false;this._sErrorText="Sorry, a technical error occurred! Please try again later."},_showMetadataError:function(e){t.error(this._sErrorText,{id:"metadataErrorMessageBox",details:e,styleClass:this._oComponent.getContentDensityClass(),actions:[t.Action.RETRY,t.Action.CLOSE],onClose:function(e){if(e===t.Action.RETRY){this._oModel.refreshMetadata()}}.bind(this)})},_showServiceError:function(e){if(this._bMessageOpen){return}this._bMessageOpen=true;t.error(this._sErrorText,{id:"serviceErrorMessageBox",details:e,styleClass:this._oComponent.getContentDensityClass(),actions:[t.Action.CLOSE],onClose:function(){this._bMessageOpen=false}.bind(this)})}})});
//# sourceMappingURL=ErrorHandler.js.map