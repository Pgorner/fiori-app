// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
sap.ui.define([
    "sap/m/MessageToast"
], function (MessageToast) {
    "use strict";

    return function () {
        setTimeout(function () {
            var token = (Math.random() * 1000).toString(36);
            MessageToast.show(
                `Token generated ${token}`,
                {
                    duration: 5000
                }
            );
        }, 1000);
    };
});
