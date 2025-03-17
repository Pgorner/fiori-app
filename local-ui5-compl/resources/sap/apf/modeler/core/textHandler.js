/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/utils/exportToGlobal","sap/ui/model/resource/ResourceModel"],function(e,r){"use strict";function t(){var e;this.getMessageText=function(e,r){return this.getText(e,r)};this.getText=function(r,t){return e.getResourceBundle().getText(r,t)};function t(){var t=sap.ui.require.toUrl("sap/apf/modeler/resources/i18n/texts.properties");e=new r({bundleUrl:t});var s=sap.ui.require.toUrl("sap/apf/resources/i18n/apfUi.properties");e.enhance({bundleUrl:s})}t()}e("sap.apf.modeler.core.TextHandler",t);return t});
//# sourceMappingURL=textHandler.js.map