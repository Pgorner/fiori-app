/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2016 SAP SE. All rights reserved
	
 */
sap.ui.define(["sap/ui/thirdparty/jquery","sap/ui/Device","sap/ui/core/syncStyleClass","sap/ui/core/Lib"],function(jQuery,e,t,a){"use strict";var r={apiVersion:2};r.render=function(r,s){if(s.getParent()instanceof jQuery){t("sapUiSizeCozy",s.getParent(),this.oControl)}var i=a.getResourceBundleFor("sap.rules.ui.i18n");var n=i.getText("ctrlSpaceCue");if(e.os.name=="mac"){n=i.getText("optionSpaceCue")}if(n.length>50&&s.getParent().getId()==="popover"){n=n.substring(0,50)+" ..."}var p='contenteditable="true"';var o='data-placeholder="'+n+'"';var l='aria-placeholder="'+n+'"';r.openStart("div",s);r.class("sapAstExpressionInputWrapper");r.openEnd();r.openStart("pre");r.class("sapAstExpressionPreSpaceMargin");r.openEnd();r.openStart("div");r.accessibilityState(s,{role:"textbox",labelledBy:"",placeholder:n});r.attr("id",s.getId()+"-input");r.attr("data-placeholder",n);r.attr("contenteditable","true");r.attr("spellcheck","false");r.class("sapAstExpressionInput");r.openEnd();r.close("div");r.close("pre");r.close("div")};return r},true);
//# sourceMappingURL=AstExpressionBasicRenderer.js.map