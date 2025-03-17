/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 */
sap.ui.define(["sap/ovp/cards/CommonUtils","sap/ovp/cards/MetadataAnalyser","sap/ovp/helpers/V4/MetadataAnalyzer"],function(t,e,r){"use strict";function a(a,n){if(!t.isODataV4(a)){return e.getParametersByEntitySet(a,n.name,true)}else{return r.getParametersByEntitySet(a,n,true)}}function n(a,n,s){if(!t.isODataV4(s)){return e.getPropertyFromEntityType(a,n)}else{return r.getPropertyFromEntityType(a,n)}}return{getParametersByEntitySet:a,getPropertyFromEntityType:n}});
//# sourceMappingURL=ODataDelegator.js.map