sap.ui.define([
	"sap/base/Log",
	"sap/ui/generic/app/AppComponent",
	"sap/ui/demoapps/rta/fe/localService/mockserver",
	"sap/ui/fl/apply/_internal/flexObjects/FlexObjectFactory",
	"sap/ui/fl/write/_internal/Storage",
	"sap/ui/fl/write/api/PersistenceWriteAPI",
	"sap/ui/fl/write/api/VersionsAPI"
], function(
	Log,
	UIComponent,
	mockserver,
	FlexObjectFactory,
	Storage,
	PersistenceWriteAPI,
	VersionsAPI
) {
	"use strict";

	async function setupTestEnvironment(oAppComponent) {
		var oUrl = new URL(window.location.href);
		if (oUrl.searchParams.get("fl--testSetup")) {
			const sLayer = "CUSTOMER";

			// reset needs to have a reload afterwards
			await PersistenceWriteAPI.reset({
				selector: oAppComponent,
				layer: sLayer
			});

			const oVersionsModel = await VersionsAPI.initialize({
				control: oAppComponent,
				layer: sLayer
			});

			const oResponse = await fetch(`${sap.ui.require.toUrl("sap/ui/demoapps/rta/fe")}/userTestSetup.json`);
			const oJson = await oResponse.json();

			// first Version should be two months old, second 1 month and third 1 week
			for (let i = 0; i < oJson.versions.length; i++) {
				const oVersion = oJson.versions[i];
				const oDate = new Date();
				if (i === 0) {
					// 2628288000 = 1 month in milliseconds
					oDate.setTime(oDate.getTime() - 2628288000 * 2);
					oVersion.changes.forEach((oChange) => {
						oChange.creation = oDate.toISOString();
						oDate.setTime(oDate.getTime() + 1);
					});
				} else if (i === 1) {
					oDate.setTime(oDate.getTime() - 2628288000);
					oVersion.changes.forEach((oChange) => {
						oChange.creation = oDate.toISOString();
						oDate.setTime(oDate.getTime() + 1);
					});
				} else if (i === 2) {
					// 604800000 = 1 week in milliseconds
					oDate.setTime(oDate.getTime() - 604800000);
					oVersion.changes.forEach((oChange) => {
						oChange.creation = oDate.toISOString();
						oDate.setTime(oDate.getTime() + 1);
					});
				}

				await PersistenceWriteAPI.add({
					selector: oAppComponent,
					layer: sLayer,
					flexObjects: oVersion.changes.map((c) => FlexObjectFactory.createFromFileContent(c))
				});

				await PersistenceWriteAPI.save({
					selector: oAppComponent,
					layer: sLayer,
					draft: true,
					version: "0"
				});

				await VersionsAPI.activate({
					displayedVersion: "0",
					title: oVersion.title,
					control: oAppComponent,
					layer: sLayer
				});

				// adjust the activation date of the versions to match the changes
				// the private Storage class is used here to avoid creating a new API
				try {
					const oNewVersion = oVersionsModel.getData().versions[0];
					oNewVersion.activatedAt = oDate.toISOString();
					oNewVersion.activatedBy = "Default User";
					// the ObjectStorageConnector uses the fileName to create the key for new objects
					oNewVersion.fileName = oNewVersion.id;
					await Storage.update({
						flexObject: oVersionsModel.getData().versions[0],
						layer: sLayer
					});
				} catch (oError) {
					Log.error("error updating version with activation date", oError);
				}
			}

			oUrl.searchParams.delete("fl--testSetup");
			window.history.replaceState(window.history.state, '', oUrl.href);
			window.location.reload();
		}
	}

	return UIComponent.extend("sap.ui.demoapps.rta.fe.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * Initialize MockServer & FakeLrep in constructor before model is loaded from the manifest.json
		 * @public
		 * @override
		 */
		constructor: function () {
			this._startMockServer();

			UIComponent.prototype.constructor.apply(this, arguments);

			setupTestEnvironment(this);
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function() {
			// call the base component's init function and start the application
			UIComponent.prototype.init.apply(this, arguments);
		},

		/**
		 * Start the MockServer
		 * @private
		 */
		_startMockServer: function () {
			mockserver.init();
		}
	});
});
