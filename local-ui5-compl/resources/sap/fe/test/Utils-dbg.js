/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
        (c) Copyright 2009-2021 SAP SE. All rights reserved
	
 */
sap.ui.define(
	["sap/base/util/LoaderExtensions", "sap/base/util/merge", "sap/base/strings/formatMessage", "sap/base/strings/capitalize"],
	function (LoaderExtensions, mergeObjects, formatMessageRaw, capitalize) {
		"use strict";

		var Utils = {};

		Utils.getManifest = function (sComponentName) {
			const ushellContainer = sap.ui.require("sap/ushell/Container");
			if (!ushellContainer) {
				var appPath = Utils.getNoFLPAppPath();
				sComponentName = "local" + appPath;
			}
			var oUriParams = new URLSearchParams(window.location.search),
				sDeltaManifest = oUriParams.get("manifest"),
				oTargetManifest = LoaderExtensions.loadResource(sComponentName + "/manifest.json");

			if (sDeltaManifest) {
				sDeltaManifest.split(",").forEach(function (sSingleDeltaManifest) {
					if (sSingleDeltaManifest.indexOf("/") !== 0) {
						sSingleDeltaManifest = sComponentName + "/" + sSingleDeltaManifest;
					}
					try {
						oTargetManifest = mergeObjects({}, oTargetManifest, LoaderExtensions.loadResource(sSingleDeltaManifest));
					} catch (ignore) {
						// not always an error, e.g. when navigating to a different app that does not have the delta manifest
					}
				});
			}
			var uri = new URL(oTargetManifest["sap.app"].dataSources.mainService.uri, document.location);
			var sUser = oUriParams.get("user");
			if (sUser) {
				uri.searchParams.set("user", sUser);
			}

			oTargetManifest["sap.app"].dataSources.mainService.uri = uri.toString().replace(document.location, "");

			return oTargetManifest;
		};

		Utils.getNoFLPAppPath = function () {
			/*demokit.html scenario - parameter app = appName expected*/
			var oUriParameters = new URLSearchParams(window.location.search);
			var sApp = oUriParameters.get("app") || "SalesOrder";
			return Utils.getAppInfo(sApp).appPath;
		};

		Utils.getAppInfo = function (sApp) {
			var oApps = {
				"SalesOrder-manage": {
					appName: "SalesOrder",
					appPath: "/apps/salesorder/webapp"
				},
				"SalesOrder-manageInline": {
					appName: "SalesOrder",
					appPath: "/apps/salesorder/webapp"
				},
				"SalesOrder-manageFCL": {
					appName: "SalesOrderFCL",
					appPath: "/apps/salesorder-FCL/webapp"
				},
				"SalesOrder-aggregate": {
					appName: "SalesOrder",
					appPath: "/apps/salesorder-aggregate/webapp"
				},
				"SalesOrder-manageInlineTest": {
					appName: "SalesOrder",
					appPath: "/apps/salesorder/webapp"
				},
				"Customer-manage": {
					appName: "Customer",
					appPath: "/apps/customer/webapp"
				},
				"Customer-displayFactSheet": {
					appName: "Customer",
					appPath: "/apps/customer-displayFactSheet/webapp"
				},
				"SalesOrder-sticky": {
					appName: "SalesOrder",
					appPath: "/apps/salesorder/webapp"
				},
				"SalesOrder-stickyRecommendations": {
					appName: "SalesOrder",
					appPath: "/apps/salesorder/webapp"
				},
				"SalesOrder-stickyFCL": {
					appName: "SalesOrderFCL",
					appPath: "/apps/salesorder-FCL/webapp"
				},
				"Products-manage": {
					appName: "catalog-admin-ui",
					appPath: "/apps/office-supplies/admin/webapp"
				},
				"Products-custom": {
					appName: "catalog-admin-ui",
					appPath: "/apps/office-supplies/custompage/webapp"
				},
				"Chevron-Navigation": {
					appName: "SalesOrder",
					appPath: "/apps/salesorder/webapp"
				},
				"Manage-items": {
					appName: "ManageItems",
					appPath: "/apps/manage-items/webapp"
				},
				"Manage-dpp-items": {
					appName: "ManageDPPItems",
					appPath: "/apps/manage-dpp-items/webapp"
				},
				"Drafts-manage": {
					appName: "ManageDrafts",
					appPath: "/apps/manage-drafts/webapp"
				},
				"Drafts-manageFCL": {
					appName: "ManageDraftsFCL",
					appPath: "/apps/manage-drafts-FCL/webapp"
				},
				"Manage-itemsSem": {
					appName: "ManageItemsSem",
					appPath: "/apps/manage-drafts/webapp"
				},
				"CustomNavigation-sample": {
					appName: "customNavigation.sample",
					appPath: "/apps/customNav"
				},
				"SalesOrder-Create": {
					appName: "SalesOrderCreate",
					appPath: "/apps/salesorder-Create/webapp"
				},
				"SalesOrder-CreateFCL": {
					appName: "SalesOrderCreateFCL",
					appPath: "/apps/salesorder-CreateFCL/webapp"
				},
				SalesOrder: {
					appName: "SalesOrder",
					appPath: "/apps/salesorder/webapp"
				},
				"Cinema-manage": {
					appName: "CollaborationDraft",
					appPath: "/apps/collaborationDraft/webapp"
				}
			};
			return oApps[sApp];
		};

		Utils.isOfType = function (vToTest, vValidTypes, bNullAndUndefinedAreValid) {
			var aValidTypes = Array.isArray(vValidTypes) ? vValidTypes : [vValidTypes];

			return aValidTypes.reduce(function (bIsOfType, vTypeToCheck) {
				if (bIsOfType) {
					return true;
				}

				if (vTypeToCheck === null || vTypeToCheck === undefined) {
					return vToTest === vTypeToCheck;
				}

				if (vToTest === null || vToTest === undefined) {
					return !!bNullAndUndefinedAreValid;
				}

				if (typeof vTypeToCheck === "function") {
					if (vTypeToCheck === Boolean) {
						return typeof vToTest === "boolean";
					}
					if (vTypeToCheck === Array) {
						return Array.isArray(vToTest);
					}
					if (vTypeToCheck === String) {
						return typeof vToTest === "string" || vToTest instanceof String;
					}
					if (vTypeToCheck === Object) {
						return typeof vToTest === "object" && vToTest.constructor === Object;
					}
					if (vTypeToCheck === Number) {
						return typeof vToTest === "number";
					}
					return vToTest instanceof vTypeToCheck;
				}

				return typeof vToTest === vTypeToCheck;
			}, false);
		};

		Utils.isArguments = function (vValue) {
			return Object.prototype.toString.call(vValue) === "[object Arguments]";
		};

		Utils.parseArguments = function (aExpectedTypes) {
			var aArguments = Array.prototype.slice.call(arguments, 1);

			if (aArguments.length === 1 && Utils.isArguments(aArguments[0])) {
				aArguments = Array.prototype.slice.call(aArguments[0], 0);
			}

			return aExpectedTypes.reduce(function (aActualArguments, vExpectedType) {
				if (Utils.isOfType(aArguments[0], vExpectedType, true)) {
					aActualArguments.push(aArguments.shift());
				} else {
					aActualArguments.push(undefined);
				}
				return aActualArguments;
			}, []);
		};

		Utils.formatObject = function (mObject) {
			if (Utils.isOfType(mObject, [null, undefined])) {
				return "";
			}
			if (Utils.isOfType(mObject, Array)) {
				return (
					"[" +
					mObject
						.map(function (oElement) {
							return Utils.formatObject(oElement);
						})
						.join(", ") +
					"]"
				);
			}
			if (Utils.isOfType(mObject, Object)) {
				return (
					"{" +
					Object.keys(mObject)
						.map(function (sKey) {
							return sKey + ": " + Utils.formatObject(mObject[sKey]);
						})
						.join(", ") +
					"}"
				);
			}
			return mObject.toString();
		};

		Utils.formatMessage = function (sMessage) {
			var aParameters = Array.prototype.slice.call(arguments, 1).map(function (vParameter) {
				return Utils.formatObject(vParameter);
			});
			return formatMessageRaw(sMessage && sMessage.replace(/'/g, "''"), aParameters);
		};

		Utils.mergeObjects = function () {
			return mergeObjects.apply(this, [{}].concat(Array.prototype.slice.call(arguments)));
		};

		Utils.getAggregation = function (oManagedObject, sAggregationName) {
			if (!oManagedObject) {
				return null;
			}
			var fnAggregation = oManagedObject["get" + capitalize(sAggregationName, 0)];
			if (!fnAggregation) {
				throw new Error("Object '" + oManagedObject + "' does not have an aggregation called '" + sAggregationName + "'");
			}
			return fnAggregation.call(oManagedObject);
		};

		Utils.pushToArray = function (vElement, vTarget, bAtTheBeginning) {
			if (vTarget === undefined) {
				vTarget = [];
			} else if (!Array.isArray(vTarget)) {
				vTarget = [vTarget];
			} else {
				vTarget = vTarget.slice(0);
			}

			if (Array.isArray(vElement)) {
				vTarget = bAtTheBeginning ? vElement.slice(0).concat(vTarget) : vTarget.concat(vElement);
			} else if (vElement !== undefined) {
				if (bAtTheBeginning) {
					vTarget.unshift(vElement);
				} else {
					vTarget.push(vElement);
				}
			}
			return vTarget;
		};

		return Utils;
	}
);
