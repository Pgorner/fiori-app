/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/Device","sap/ui/documentation/sdk/controller/BaseController"],function(n,e){"use strict";return e.extend("sap.ui.documentation.sdk.controller.ApiDetailInitial",{onInit:function(){e.prototype.onInit.call(this);this._onOrientationChange({landscape:n.orientation.landscape})},onBeforeRendering:function(){this._deregisterOrientationChange()},onAfterRendering:function(){this._registerOrientationChange()},onExit:function(){this._deregisterOrientationChange()}})});
//# sourceMappingURL=ApiDetailInitial.controller.js.map