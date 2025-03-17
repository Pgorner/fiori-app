/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ui/core/Control"],function(e){"use strict";return e.extend("sap.ovp.ui.Card",{metadata:{library:"sap.ovp",designTime:false,aggregations:{innerCard:{type:"sap.ui.core.Control",multiple:false}},defaultAggregation:"innerCard"},init:function(){},renderer:function(e,r){e.openStart("div",r);e.class("sapOvpBaseCardWrapper");e.openEnd();e.renderControl(r.getAggregation("innerCard"));e.close("div")}})});
//# sourceMappingURL=Card.js.map