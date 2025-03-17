/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/ui/core/format/NumberFormat"],function(t){"use strict";var e=function(){this.aSupportedSemantics=["currency-code",undefined];this.oSemanticsFormatterMap=r()};e.prototype.constructor=e;function r(){var t=new Map;t.set("currency-code",n);t.set(undefined,a);return t}function n(e,r){var n=t.getCurrencyInstance();return n.format(r)}function a(e,r,n){var a=t.getFloatInstance({style:"standard",minFractionDigits:n});return a.format(r)}e.prototype.getFormattedValue=function(t,e,r){var n;if(this.aSupportedSemantics.indexOf(t["semantics"])!==-1){n=t["semantics"]}return this.oSemanticsFormatterMap.get(n).call(self,t,e,r)};return e},true);
//# sourceMappingURL=decimalFormatter.js.map