/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(["sap/m/Popover","sap/m/Text","sap/m/library"],function(e,t,o){"use strict";var n=o.PlacementType,r=(new t).addStyleClass("sapUiSmallMargin"),a=new e({showHeader:false,placement:n.VerticalPreferredTop,horizontalScrolling:false,contentWidth:"200px",content:r}).addStyleClass("imagemap-overlay-popover");function p(){}p.prototype.setText=function(e){r.setText(e)};p.prototype.show=function(e){a.openBy(e)};p.prototype.hide=function(){a.close()};p.prototype.getPopoverDomRef=function(){return a.getDomRef()};return p});
//# sourceMappingURL=Tooltip.js.map