/*!
 * OpenUI5
 * (c) Copyright 2009-2025 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define([],function(){"use strict";var e={apiVersion:2};e.render=function(e,r){var n=r.getAggregation("from"),t=r.getAggregation("to");e.openStart("div",r);e.openEnd();if(n){e.renderControl(n)}if(t){e.renderControl(t)}e.close("div")};return e},true);
//# sourceMappingURL=DataTableFilterRangeRenderer.js.map