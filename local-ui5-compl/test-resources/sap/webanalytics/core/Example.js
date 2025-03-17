/*global sap */
sap.ui.define([
	"sap/ui/core/Component"
], function(Component) {
	"use strict";

	function mockUshellEnvironment() {
		sap.ushell = sap.ushell || {};
		sap.ushell.Container = sap.ushell.Container || {};

		// mock a logon system if ushell is not present
		sap.ushell.Container.getLogonSystem = sap.ushell.Container.getLogonSystem || function () {
			return {
				getClient: function() {
					return "TESTCLNT100";
				},
				getName: function() {
					return "TEST";
				}
			};
		};

		// mock user information if ushell is not present
		sap.ushell.Container.getUser = sap.ushell.Container.getUser || function () {
			return {
				getEmail: function() {
					return "user@example.com"
				}
			};
		};

		// mock the AppConfiguration service if not available
		sap.ushell.services = sap.ushell.services || {};
		sap.ushell.services.AppConfiguration = sap.ushell.services.AppConfiguration || {
			getCurrentApplication: function() {
				return {
					inboundPermanentKey: "key",
					ui5ComponentName: "sap.app.test"
				};
			}
		};
	}

	mockUshellEnvironment();

	// create an instance of the plugin component
	var oComponent = Component.create({
		id: "",
		name: "sap.webanalytics.core.SAPWebAnalyticsFLPPlugin",
		componentData: {
			config: {
				SWA_PUB_TOKEN: "12af3d48-b292-4387-8809-88bb2c183eca",
				SWA_BASE_URL: "https://swadevv-tracker.cfapps.sap.hana.ondemand.com/tracker/",
				SWA_USER: true
			}
		}
	});

});
