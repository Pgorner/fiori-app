// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview The Unified Shell's personalization adapter for the ABAP
 *               platform.
 *               The internal data structure of the AdapterContainer corresponds to the
 *               ABAP EDM.
 *               Container header properties transported via pseudo-items are mapped to the
 *               respective header properties in setItem/getItem/delItem
 *
 * @version 1.132.1
 */
sap.ui.define([
    "./PersonalizationAdapter"
], function (
    PersonalizationAdapter
) {
    "use strict";

    return PersonalizationAdapter;
});
