/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./shapes/ShapeFactory"],function(t){"use strict";var e="http://www.w3.org/2000/svg";function i(t){var i=document.createElementNS(e,"svg"),n=t.getBoundingClientRect(),o=n.width,r=n.height;i.setAttribute("viewBox","0 0 "+o+" "+r);i.setAttribute("class","overlay");t.appendChild(i);return i}function n(t){this.oContainer=i(t);this.oShapes={};this.sCurrentShapeType=""}n.prototype.setSize=function(t,e){this.oContainer.setAttribute("viewBox","0 0 "+t+" "+e)};n.prototype.setShape=function(e,i){var n=this.oShapes[e];if(!n){n=t.create(e,i);n.setPosition(i);this.oShapes[e]=n;this.oContainer.appendChild(n.oContainer)}else{n.setPosition(i)}this.sCurrentShapeType=e};n.prototype.getCurrentShape=function(){return this.oShapes[this.sCurrentShapeType]};n.prototype.show=function(){var t=this.getCurrentShape();if(t){t.show()}};n.prototype.hide=function(){var t=this.getCurrentShape();if(t){t.hide()}};return n});
//# sourceMappingURL=Overlay.js.map