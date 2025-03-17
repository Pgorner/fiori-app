/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/ui/documentation/sdk/controller/BaseController","sap/ui/thirdparty/jquery"],function(t,jQuery){"use strict";return t.extend("sap.ui.documentation.sdk.controller.TermsOfUse",{onInit:function(){this.oRouter=this.getRouter();this.oRouter.getRoute("termsOfUse").attachPatternMatched(this._onTopicMatched,this)},_onTopicMatched:function(t){jQuery.ajax({url:"./TermsOfUse.txt",dataType:"text"}).done(function(t){this.getView().byId("termsOfUseText").setText(t)}.bind(this)).fail(function(){this.onRouteNotFound()}.bind(this))}})});
//# sourceMappingURL=TermsOfUse.controller.js.map