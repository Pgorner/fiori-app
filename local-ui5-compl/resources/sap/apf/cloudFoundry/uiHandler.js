/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2018 SAP SE. All rights reserved
 */
sap.ui.define(["sap/apf/cloudFoundry/ui/sharedialog/showShareDialog","sap/apf/cloudFoundry/ui/valuehelp/showValueHelp","sap/apf/cloudFoundry/ui/bookmarkconfirmation/showBookmarkConfirmation","sap/apf/cloudFoundry/ui/utils/LaunchPageUtils"],function(a,o,i,r){"use strict";function u(a){var o=a.getApi();var u=o.getStartParameterFacade();var e=u.getAnalyticalConfigurationId().configurationId;var t=u.getParameter(r.BOOKMARK_LINK_PARAMETERS.BOOKMARK);if(e&&t=="true"){i.show(o,u)}}return{showShareDialog:a.show,showValueHelp:o.show,initRuntime:u}},true);
//# sourceMappingURL=uiHandler.js.map