/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/core/syncStyleClass"],function(jQuery,e){"use strict";var t={apiVersion:2};t.render=function(t,r){if(r.getParent()instanceof jQuery){e("sapUiSizeCozy",r.getParent(),this.oControl)}t.openStart("div",r);t.class("sapRULTextRule");t.openEnd();t.renderControl(r.getAggregation("_toolbar"));t.renderControl(r.getAggregation("_verticalLayout"));t.close("div")};return t},true);
//# sourceMappingURL=TextRuleRenderer.js.map