/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function t(){this.oContainer=null}t.extend=function(){var o=function(){};o.prototype=new t;o.prototype.constructor=o;return o};t.prototype.createShape=function(t,o){this.oContainer=document.createElementNS(t,o);this.oContainer.setAttribute("class",["shape",o].join(" "));return this};t.prototype.setPosition=function(t){};t.prototype.show=function(){this.oContainer.style.opacity="1"};t.prototype.hide=function(){this.oContainer.style.opacity="0"};return t});
//# sourceMappingURL=Shape.js.map