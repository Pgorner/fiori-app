// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

// This module runs before bootstrap. Therefore we cannot require any dependencies.
sap.ui.define(function () {
    "use strict";

    function createTestDomRef (sDomRefId, sParentDomRef) {
        sDomRefId = sDomRefId || "qunit-canvas";
        sParentDomRef = sParentDomRef || "qunit-fixture";
        if (!document.getElementById(sDomRefId)) {
            var oRendererDomRef = document.createElement("div");
            oRendererDomRef.setAttribute("id", sDomRefId);
            var oRendererParentDomRef = document.getElementById(sParentDomRef);
            oRendererParentDomRef.appendChild(oRendererDomRef);
        }
    }
    function deleteTestDomRef (sParentDomRef) {
        sParentDomRef = sParentDomRef || "qunit-fixture";

        var oRendereDomRef = document.getElementById(sParentDomRef);

        if (oRendereDomRef) {
            if (oRendereDomRef.hasChildNodes()) {
                while (oRendereDomRef.firstChild) {
                    oRendereDomRef.removeChild(oRendereDomRef.firstChild);
                }
            }
        }
    }

    Object.assign(window.QUnit, {
        sap: {
            ushell: {
                createTestDomRef: createTestDomRef,
                deleteTestDomRef: deleteTestDomRef
            }
        }
    });
});
