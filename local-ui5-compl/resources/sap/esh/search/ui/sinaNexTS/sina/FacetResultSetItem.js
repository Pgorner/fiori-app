/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */
(function(){
/*!
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(["./ResultSetItem"],function(e){"use strict";const t=e["ResultSetItem"];class a extends t{dimensionValueFormatted;measureValue;measureValueFormatted;constructor(e){super(e);this.dimensionValueFormatted=e.dimensionValueFormatted??this.dimensionValueFormatted;this.measureValue=e.measureValue??this.measureValue;this.measureValueFormatted=e.measureValueFormatted??this.measureValueFormatted}toString(){return this.dimensionValueFormatted+":"+this.measureValueFormatted}}var u={__esModule:true};u.FacetResultSetItem=a;return u})})();
//# sourceMappingURL=FacetResultSetItem.js.map