/* FE specific implementation of a Link that preserves whitespaces */
sap.ui.define([
	"sap/m/Link", 
	"sap/m/LinkRenderer", 
	"sap/base/strings/whitespaceReplacer", 
	"sap/suite/ui/generic/template/lib/SideEffectUtil"
], function (Link, LinkRenderer, whitespaceReplacer, SideEffectUtil){
	"use strict";

	var FELink = Link.extend("sap.suite.ui.generic.template.genericUtilities.Link", {
		init: function(){
			var setText = this.setText.bind(this);
			this.setText = function(sText){
				setText(whitespaceReplacer(sText));	
			};
		},
		renderer: function(oRM, oControl){
			LinkRenderer.render(oRM, oControl);
		},
		onAfterRendering : function() {
			SideEffectUtil.assignFieldGroupIdsToLinkField(this);
		}
	});
	
	return FELink;
});