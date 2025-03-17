// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * Works similar to sap/ui/test/matchers/Descendant. This matcher checks the DOM tree
 * instead of the control tree.
*/
sap.ui.define([
    "sap/ui/test/matchers/Matcher"
], function (Matcher) {
    "use strict";

     return Matcher.extend("sap.ushell.opa.matchers.DOMDescendant", {
        metadata: {
            publicMethods: [ "isMatching" ],
            properties: {
                descendant: {
                    type: "sap.ui.core.Control"
                }
            }
        },
        isMatching: function (oParent) {
            var oParentDomRef = oParent.getDomRef();
            var oChildDomRef = this.getDescendant().getDomRef();
            return oParentDomRef.contains(oChildDomRef);
        }
     });
}, /* bExport= */ true);
