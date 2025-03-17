/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";function e(e,r){var n=new RegExp("^([a-zA-Z]*)(.*)"),t=n.exec(e),u=n.exec(r),i=t[1],a=u[1];if(i>a){return 1}if(i<a){return-1}return parseInt(t[2])-parseInt(u[2])}return{sortAlphaNumeric:e}});
//# sourceMappingURL=DataTableUtil.js.map