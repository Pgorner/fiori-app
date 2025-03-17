/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","sap/ui/documentation/library"],function(t,e){"use strict";return t.extend("sap.ui.documentation.sdk.controller.License",{onInit:function(){this.getRouter().getRoute("license").attachPatternMatched(this._onTopicMatched,this)},_onTopicMatched:function(t){
// Get the LICENSE.txt file and display it. In case of error redirect to NotFound view.
e._getLicense().done(function(t){if(t!==""){this.getView().byId("licenseText").setText(t)}else{this.onRouteNotFound()}}.bind(this)).fail(function(){this.onRouteNotFound()}.bind(this))}})});
//# sourceMappingURL=License.controller.js.map