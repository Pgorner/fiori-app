/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["./Shape"],function(t){"use strict";var e=t.extend();e.prototype.setPosition=function(t){var e=t.split(","),i={cx:e[0],cy:e[1],r:e[2]};this.oContainer.setAttribute("cx",i.cx);this.oContainer.setAttribute("cy",i.cy);this.oContainer.setAttribute("r",i.r)};return e});
//# sourceMappingURL=Circle.js.map