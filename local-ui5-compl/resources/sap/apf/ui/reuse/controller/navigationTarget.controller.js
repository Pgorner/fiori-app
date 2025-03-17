/*!
 * SAP APF Analysis Path Framework
 * 
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/Device","sap/ui/core/mvc/Controller"],function(i,e){"use strict";return e.extend("sap.apf.ui.reuse.controller.navigationTarget",{onInit:function(){this.oNavigationHandler=this.getView().getViewData().oNavigationHandler;if(i.system.desktop){this.getView().addStyleClass("sapUiSizeCompact")}},handleNavigation:function(i){this.oNavigationHandler.navigateToApp(i)}})});
//# sourceMappingURL=navigationTarget.controller.js.map