/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./SinaObject"],function(t){"use strict";const e=t["SinaObject"];class i extends e{type;attributeLabel;valueLabel;userDefined;operator;constructor(t){super({sina:t.sina});this.attributeLabel=t.attributeLabel;this.valueLabel=t.valueLabel;this.userDefined=t.userDefined}getAttributes(){const t={};this._collectAttributes(t);return Object.keys(t)}getConditionsByAttribute(t){const e=[];this._collectFilterConditions(t,e);return e}}var s={__esModule:true};s.Condition=i;return s})})();
//# sourceMappingURL=Condition.js.map