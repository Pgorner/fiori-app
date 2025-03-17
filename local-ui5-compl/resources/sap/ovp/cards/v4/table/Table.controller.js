/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/cards/generic/base/table/BaseTable.controller","sap/ovp/cards/OVPCardAsAPIUtils","sap/ovp/cards/Filterhelper"],function(e,t,i){"use strict";return e.extend("sap.ovp.cards.v4.table.Table",{onInit:function(){e.prototype.onInit.apply(this,arguments)},onAfterRendering:function(){e.prototype.onAfterRendering.apply(this,arguments);if(!t.checkIfAPIIsUsed(this)){var r=this.getCardPropertiesModel();var n=this.getOwnerComponent().getModel("ui").getData().cards;this.selectionVaraintFilter=i.getSelectionVariantFilters(n,r,this.getEntityType())}}})});
//# sourceMappingURL=Table.controller.js.map