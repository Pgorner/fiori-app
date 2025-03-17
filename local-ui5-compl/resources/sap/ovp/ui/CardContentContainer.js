/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/m/FlexBox"],function(e){"use strict";var n=e.extend("sap.ovp.ui.CardContentContainer",{metadata:{library:"sap.ovp"},renderer:{render:function(e,n){e.openStart("div",n);e.class("sapOvpCardContentContainer").class("sapMTBStandard");e.openEnd();var r=n.getItems();for(var a=0;a<r.length;a++){e.renderControl(r[a])}e.close("div")}}});return n});
//# sourceMappingURL=CardContentContainer.js.map