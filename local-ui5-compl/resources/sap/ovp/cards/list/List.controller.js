/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/cards/generic/base/list/BaseList.controller","sap/ovp/filter/FilterUtils","sap/ui/core/EventBus"],function(t,e,i){"use strict";return t.extend("sap.ovp.cards.list.List",{onInit:function(){t.prototype.onInit.apply(this,arguments);var n=this;this.eventhandler=function(t,i,s){e.applyFiltersToV2Card(s,n)};this.GloabalEventBus=i.getInstance();if(this.oMainComponent&&this.oMainComponent.isMacroFilterBar){this.GloabalEventBus.subscribe("OVPGlobalfilter","OVPGlobalFilterSeacrhfired",n.eventhandler)}},onAfterRendering:function(){t.prototype.onAfterRendering.apply(this,arguments)}})});
//# sourceMappingURL=List.controller.js.map