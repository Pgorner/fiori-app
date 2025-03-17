/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Rect","./Polygon","./Circle"],function(e,r,t){"use strict";var c="http://www.w3.org/2000/svg";function n(n){switch(n){case"rect":return(new e).createShape(c,n);case"poly":return(new r).createShape(c,"polygon");case"circle":return(new t).createShape(c,n);default:}}return{create:n}});
//# sourceMappingURL=ShapeFactory.js.map