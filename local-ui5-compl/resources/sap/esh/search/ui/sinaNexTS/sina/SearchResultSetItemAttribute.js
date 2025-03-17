/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SearchResultSetItemAttributeBase"],function(t){"use strict";const e=t["SearchResultSetItemAttributeBase"];class i extends e{value;valueFormatted;valueHighlighted;isHighlighted;unitOfMeasure;description;defaultNavigationTarget;navigationTargets;iconUrl;tooltip;constructor(t){super(t);this.value=t.value;this.valueFormatted=t.valueFormatted;this.valueHighlighted=t.valueHighlighted;this.isHighlighted=t.isHighlighted;this.unitOfMeasure=t.unitOfMeasure;this.description=t.description;this.setDefaultNavigationTarget(t.defaultNavigationTarget);this.setNavigationTargets(t.navigationTargets||[]);this.metadata=t.metadata;this.iconUrl=t.iconUrl;this.tooltip=t.tooltip}setDefaultNavigationTarget(t){if(!t){this.defaultNavigationTarget=null;return}this.defaultNavigationTarget=t;t.parent=this}setNavigationTargets(t){this.navigationTargets=[];if(!t){return}for(const e of t){this.addNavigationTarget(e)}}addNavigationTarget(t){this.navigationTargets.push(t);t.parent=this}toString(){return this.label+":"+this.valueFormatted}getSubAttributes(){return[this]}}var a={__esModule:true};a.SearchResultSetItemAttribute=i;return a})})();
//# sourceMappingURL=SearchResultSetItemAttribute.js.map