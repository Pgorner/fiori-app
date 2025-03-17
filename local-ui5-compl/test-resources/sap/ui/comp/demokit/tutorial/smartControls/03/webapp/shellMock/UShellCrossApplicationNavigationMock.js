sap.ui.define([
	'sap/ui/base/Object', 'sap/ui/comp/navpopover/Factory', 'sap/ui/thirdparty/jquery'
], function(BaseObject, Factory, jQuery) {
	"use strict";

	var UShellCrossApplicationNavigationMock = BaseObject.extend("sap.ui.demo.smartControls.shellMock.UShellCrossApplicationNavigationMock", /** @lends sap.ui.demo.smartControls.shellMock.UShellCrossApplicationNavigationMock.prototype */
	{});

	function getURLParsing(oSetting) {
		return {
			parseShellHash: function(sIntent) {
				var sAction;
				var fnHandler = function(oLink) {
					if (oLink.intent === sIntent) {
						sAction = oLink.action;
						return true;
					}
				};
				for ( var sSemanticObject in oSetting) {
					oSetting[sSemanticObject].links.some(fnHandler);
					if (sAction) {
						return {
							semanticObject: sSemanticObject,
							action: sAction
						};
					}
				}
				return {
					semanticObject: null,
					action: null
				};
			}
		};
	}

	function getNavigationService(oSetting) {
		return {
			getHref: function(oTarget) {
				if (!oTarget || !oTarget.target || !oTarget.target.shellHash) {
					return Promise.resolve(null);
				}
				return Promise.resolve(oTarget.target.shellHash);
			},
			getSemanticObjects: function() {
				var aSemanticObjects = [];
				for (var sSemanticObject in oSetting) {
					aSemanticObjects.push(sSemanticObject);
				}
				return Promise.resolve(aSemanticObjects);
			},
			getLinks: function(aParams) {
				var aLinks = [];
				if (!Array.isArray(aParams)) {
					aLinks = oSetting[aParams.semanticObject] ? oSetting[aParams.semanticObject].links : [];
				} else {
					aParams.forEach(function(oParam) {
						aLinks.push(oSetting[oParam.semanticObject] ? oSetting[oParam.semanticObject].links : []);
					});
				}
				return Promise.resolve(aLinks);
			},
			getPrimaryIntent: function(sSemanticObject, oLinkFilter) {
				let oLink = null;
				const aSemanticObjectLinks = oSetting[sSemanticObject]?.links;
				if (aSemanticObjectLinks === undefined) {
					return Promise.resolve(oLink);
				}

				let aLinks = aSemanticObjectLinks.filter((oSemanticObjectLink) => {
					return oSemanticObjectLink.tags?.includes("primaryAction");
				});

				if (aLinks.length === 0) {
					aLinks = aSemanticObjectLinks.filter((oSemanticObjectLink) => {
						return oSemanticObjectLink.action === "displayFactSheet";
					});
				}

				if (aLinks.length === 0) {
					return Promise.resolve(oLink);
				}

				oLink = aLinks.sort((oLink, oOtherLink) => {
					if (oLink.intent === oOtherLink.intent) {
						return 0;
					}

					return oLink.intent < oOtherLink.intent ? -1 : 1;
				})[0];

				return Promise.resolve(oLink);
			}
		};
	}

	UShellCrossApplicationNavigationMock.getServiceReal = Factory.getService;

	UShellCrossApplicationNavigationMock.mockUShellServices = function(oSetting) {
		Factory.getService = function(sServiceName) {
			switch (sServiceName) {
				case "URLParsing":
					return Promise.resolve(getURLParsing(oSetting));
				case "Navigation":
						return Promise.resolve(getNavigationService());
				default:
					return UShellCrossApplicationNavigationMock.getServiceReal(sServiceName);
			}
		};
	};

	UShellCrossApplicationNavigationMock.unMockUShellServices = function() {
		Factory.getService = UShellCrossApplicationNavigationMock.getServiceReal;
	};

	return UShellCrossApplicationNavigationMock;
}, /* bExport= */true);
