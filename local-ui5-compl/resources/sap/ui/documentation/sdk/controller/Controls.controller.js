/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","sap/ui/Device"],function(e,n){"use strict";return e.extend("sap.ui.documentation.sdk.controller.Controls",{onInit:function(){e.prototype.onInit.call(this);this._onOrientationChange({landscape:n.orientation.landscape})},onBeforeRendering:function(){this._deregisterOrientationChange()},onAfterRendering:function(){this._registerOrientationChange()},onExit:function(){this._deregisterOrientationChange()},onPress:function(e){var n=e.oSource.getFilter(),t=this.getOwnerComponent().byId("controlsMaster").byId("searchField");t.setValue(n).fireLiveChange({newValue:n});setTimeout(function(){this.getSplitApp().showMaster()}.bind(this),0)}})});
//# sourceMappingURL=Controls.controller.js.map