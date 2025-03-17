// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

sap.ui.define([
    "sap/base/i18n/Localization",
    "sap/ui/model/resource/ResourceModel"
], function (
    Localization,
    ResourceModel
) {
    "use strict";
    return {
        i18n: new ResourceModel({
            bundleLocale: Localization.getLanguage()
        }).getResourceBundle()
    };
}, /* bExport= */ true);
