/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ui/core/Control"],function(e){"use strict";return e.extend("sap.ovp.ui.OVPWrapper",{metadata:{library:"sap.ovp",designTime:true,aggregations:{DynamicPage:{type:"sap.ui.core.Control",multiple:false}},defaultAggregation:"DynamicPage"},init:function(){},renderer:function(e,a){e.openStart("div",a);e.class("ovpWrapper");e.openEnd();e.renderControl(a.getAggregation("DynamicPage"));e.close("div")}})});
//# sourceMappingURL=OVPWrapper.js.map