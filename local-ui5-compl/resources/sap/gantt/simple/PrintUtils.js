/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([],function(){"use strict";var t={_getPaperConfiguarations:function(){return{A5:{width:this._mmToPx(148),height:this._mmToPx(210)},A4:{width:this._mmToPx(210),height:this._mmToPx(297)},A3:{width:this._mmToPx(297),height:this._mmToPx(420)},A2:{width:this._mmToPx(420),height:this._mmToPx(594)},A1:{width:this._mmToPx(594),height:this._mmToPx(841)},A0:{width:this._mmToPx(841),height:this._mmToPx(1189)},Letter:{width:this._inToPx(8.5),height:this._inToPx(11)},Legal:{width:this._inToPx(8.5),height:this._inToPx(14)},Tabloid:{width:this._inToPx(11),height:this._inToPx(17)},Custom:{width:undefined,height:undefined}}},_mmToPx:function(t){return t*3.78},_inToPx:function(t){return t/.01042},_pxToMm:function(t){return t/3.78},_pxToIn:function(t){return t*.01042},_convertUnitToPx:function(t,i){switch(i){case"mm":return t*3.78;case"cm":return t*3.78*10;case"in":return t/.01042;default:return undefined}},_convertPxToUnit:function(t,i){switch(i){case"mm":return this._pxToMm(t);case"cm":return this._pxToMm(t)/10;case"in":return this._pxToIn(t);default:return undefined}}};return t},true);
//# sourceMappingURL=PrintUtils.js.map