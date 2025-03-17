/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Shape"],function(t){"use strict";var i=t.extend();i.prototype.setPosition=function(t){var i=t.split(","),e={x:i[0],y:i[1],width:i[2]-i[0],height:i[3]-i[1]};this.oContainer.setAttribute("x",e.x);this.oContainer.setAttribute("y",e.y);this.oContainer.setAttribute("width",e.width);this.oContainer.setAttribute("height",e.height)};return i});
//# sourceMappingURL=Rect.js.map