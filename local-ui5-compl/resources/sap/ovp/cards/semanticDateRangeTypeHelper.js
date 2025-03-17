/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 * Any function that needs to be exported(used outside this file) via namespace should be defined as
 * a function and then added to the return statement at the end of this file
 */
sap.ui.define([],function(){"use strict";function e(e,t,i,n){if(e.filterSettings&&e.filterSettings.dateSettings&&e.filterSettings.dateSettings.fields){var a=e.filterSettings.dateSettings.fields;Object.entries(a).forEach(function(e){var a=-1;if(i&&i.Dates){a=i.Dates.findIndex(function(t){return t.PropertyName===e[0]})}if((a===-1||Object.keys(n).indexOf(e[0])===-1)&&e[1].defaultValue){t.getConditionTypeByKey(e[0])&&t.getConditionTypeByKey(e[0]).setOperation(e[1].defaultValue.operation)}})}}return{setSemanticDateRangeDefaultValue:e}},true);
//# sourceMappingURL=semanticDateRangeTypeHelper.js.map