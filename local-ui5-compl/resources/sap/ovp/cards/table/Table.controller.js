/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/cards/generic/base/table/BaseTable.controller","sap/ovp/filter/FilterUtils","sap/ui/core/EventBus"],function(e,t,n){"use strict";return e.extend("sap.ovp.cards.table.Table",{onInit:function(){e.prototype.onInit.apply(this,arguments);var i=this;this.eventhandler=function(e,n,a){t.applyFiltersToV2Card(a,i)};this.GloabalEventBus=n.getInstance();if(this.oMainComponent&&this.oMainComponent.isMacroFilterBar){this.GloabalEventBus.subscribe("OVPGlobalfilter","OVPGlobalFilterSeacrhfired",i.eventhandler)}},onAfterRendering:function(){e.prototype.onAfterRendering.apply(this,arguments)}})});
//# sourceMappingURL=Table.controller.js.map