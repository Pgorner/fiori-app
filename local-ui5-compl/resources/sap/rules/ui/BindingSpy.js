/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["./library","sap/ui/base/ManagedObject"],function(e,r){"use strict";var t=r.extend("sap.rules.ui.BindingSpy",{metadata:{properties:{propertyToSpy:{type:"any",group:"Misc",bindable:"bindable"}},library:"sap.rules.ui",events:{change:{}}}});t.prototype.setPropertyToSpy=function(e){this.setProperty("propertyToSpy",e);if(e!==null){this.fireChange({value:e})}};return t},true);
//# sourceMappingURL=BindingSpy.js.map