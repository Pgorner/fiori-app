/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/cards/generic/base/list/BaseList.controller","sap/ovp/cards/OVPCardAsAPIUtils","sap/ovp/cards/Filterhelper"],function(t,e,i){"use strict";return t.extend("sap.ovp.cards.v4.list.List",{onInit:function(){t.prototype.onInit.apply(this,arguments)},onAfterRendering:function(){t.prototype.onAfterRendering.apply(this,arguments);if(!e.checkIfAPIIsUsed(this)){var n=this.getCardPropertiesModel();var s=this.getOwnerComponent().getModel("ui").getData().cards;this.selectionVaraintFilter=i.getSelectionVariantFilters(s,n,this.getEntityType())}},onExit:function(){t.prototype.onExit.apply(this,arguments)}})});
//# sourceMappingURL=List.controller.js.map