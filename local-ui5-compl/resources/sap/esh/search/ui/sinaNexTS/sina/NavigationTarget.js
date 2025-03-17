/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject"],function(t){"use strict";const i=t["SinaObject"];class n extends i{targetUrl;targetFunction;targetFunctionCustomData;customWindowOpenFunction;text;icon;tooltip;target;parent;constructor(t){super(t);this.targetUrl=t.targetUrl??this.targetUrl;this.targetFunction=t.targetFunction??this.targetFunction;this.targetFunctionCustomData=t.targetFunctionCustomData??this.targetFunctionCustomData;this.customWindowOpenFunction=t.customWindowOpenFunction;this.text=t.text??this.text;this.icon=t.icon??this.icon;this.tooltip=t.tooltip??this.tooltip;this.target=t.target??this.target??"_self"}trackNavigation(){const t=this.sina?.configuration?.navigationTrackers;if(!t){return}for(const i of t){i(this)}}performNavigation(t){t=t||{};const i=t.trackingOnly||false;this.trackNavigation();if(i){return}if(this.targetFunction){this.targetFunction(t?.event)}else{if(this.customWindowOpenFunction){this.customWindowOpenFunction();return}if(this.target){window.open(this.targetUrl,this.target,"noopener,noreferrer")}else{window.open(this.targetUrl,"_blank","noopener,noreferrer")}}}isEqualTo(t){if(!t){return false}return this.targetUrl==t.targetUrl&&this.targetFunction===t.targetFunction}toJson(){return{targetUrl:this.targetUrl,text:this.text,icon:this.icon,tooltip:this.tooltip,target:this.target}}}var e={__esModule:true};e.NavigationTarget=n;return e})})();
//# sourceMappingURL=NavigationTarget.js.map