/*!
 * Copyright (c) 2009-2014 SAP SE, All Rights Reserved
 * Fiori Element logger which prefix Fiori Elements for the log along with component
 */
sap.ui.define(["sap/ui/base/Object","sap/base/Log"],function(e,t){"use strict";var s="FioriElements: ";return e.extend("sap.ui.base.Log",{constructor:function(e){return t.getLogger(s+e)}})});
//# sourceMappingURL=OVPLogger.js.map