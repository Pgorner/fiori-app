/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/core/utils/filter","sap/apf/core/constants"],function(e,n){"use strict";var t=function(t,a,r,s,f){a.sendGetInBatch(t,i);function i(t){var a;if(t&&t.type&&t.type==="messageObject"){f.putMessage(t);s(undefined,t)}else{a=new e(f);t.data.forEach(function(t){var s=new e(f);r.forEach(function(a){s.addAnd(new e(f,a,n.FilterOperators.EQ,t[a]))});a.addOr(s)});s(a,undefined,t.data)}}};return t},true);
//# sourceMappingURL=executeFilterMapping.js.map