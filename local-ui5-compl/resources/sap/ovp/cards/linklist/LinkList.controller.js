/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/cards/generic/base/linklist/BaseLinklist.controller","sap/ovp/filter/FilterUtils","sap/ui/core/EventBus"],function(t,i,e){"use strict";return t.extend("sap.ovp.cards.linklist.LinkList",{onInit:function(){t.prototype.onInit.apply(this,arguments);var n=this;this.eventhandler=function(t,e,s){i.applyFiltersToV2Card(s,n)};this.GloabalEventBus=e.getInstance();if(this.oMainComponent&&this.oMainComponent.isMacroFilterBar){this.GloabalEventBus.subscribe("OVPGlobalfilter","OVPGlobalFilterSeacrhfired",n.eventhandler)}}})});
//# sourceMappingURL=LinkList.controller.js.map