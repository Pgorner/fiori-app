sap.ui.define(function () {
	"use strict";
	return {
		// Just for a nice title on the pages
		name: "QUnit TestSuite for sap.insight",
		defaults: {
			ui5: {
				language: "en-US",
				// Libraries to load upfront in addition to the library which is tested (sap.ui.export), if null no libs are loaded
				libs: "sap.ui.core,sap.m,sap.suite.ui.commons,sap.insights",
				theme: "sap_belize",
				noConflict: true,
				preload: "auto",
				resourceroots: {"test": "../test-resources"},
				"xx-waitForTheme": "init"
			}, // Whether QUnit should be loaded and if so, what version
			qunit: {
				version: 2
			},
			// Whether Sinon should be loaded and if so, what version
			sinon: {
				version: 1,
				qunitBridge: true,
				useFakeTimers: false
			},
			coverage: {
				// Which files to show in the coverage report, if null, no files are excluded from coverage
				only: "//sap\/insights\/.*/"
			},
			module: "./{name}.qunit"
		},
		tests: {
			MetadataAnalyser: {
				group: "MetadataAnalyser",
				coverage: {
					only: "//sap\/insights\/utils\/MetadataAnalyser.*/"
				},
				module: [
					"./utils/MetadataAnalyser.qunit"
				]
			},
			oDataModelProvider: {
				group: "oDataModelProvider",
				coverage: {
					only: "//sap\/insights\/utils\/oDataModelProvider.*/"
				},
				module: [
					"./utils/oDataModelProvider.qunit"
				]
			},
			SelectionVariantHelper: {
				group: "SelectionVariantHelper",
				coverage: {
					only: "//sap\/insights\/utils\/SelectionVariantHelper.*/"
				},
				module: [
					"./utils/SelectionVariantHelper.qunit"
				]
			},
			CardExtension: {
				group: "CardExtension",
				coverage: {
					only: "//sap\/insights\/CardExtension.*/"
				},
				module: [
					"./CardExtension.qunit"
				]
			},
			CardsChannel: {
				group: "CardsChannel",
				coverage: {
					only: "//sap\/insights\/CardsChannel.*/"
				},
				module: [
					"./CardsChannel.qunit"
				]
			},
			ContextChannel: {
				group: "ContextChannel",
				coverage: {
					only: "//sap\/insights\/channels\/ContextChannel.*/"
				},
				module: [
					"./channels/ContextChannel.qunit"
				]
			},
			HandleNonS4Environment: {
				group: "HandleNonS4Environment",
				coverage: {
					only: "//sap\/insights\/HandleNonS4Environment.*/"
				},
				module: [
					"./HandleNonS4Environment.qunit"
				]
			},
			CardHelper: {
				group: "CardHelper",
				coverage: {
					only: "//sap\/insights\/CardHelper.*/"
				},
				module: [
					"./CardHelper.qunit"
				]
			},
			UrlGenerateHelper: {
				group: "UrlGenerateHelper",
				coverage: {
					only: "//sap\/insights\/utils\/UrlGenerateHelper.*/"
				},
				module: [
					"./utils/UrlGenerateHelper.qunit"
				]
			},
			Transformations: {
				group: "Transformations",
				coverage: {
					only: "//sap\/insights\/utils\/Transformations.*/"
				},
				module: [
					"./utils/Transformations.qunit"
				]
			},
			ColumnListPreview: {
                group: "ColumnListPreview",
                coverage: {
                    only: "//sap\/insights\/manageCardPreview\/ColumnListPreview.*/"
                },
                module: [
                    "./manageCardPreview/ColumnListPreview.qunit"
                ]
            },
			Preview: {
				group: "Preview",
				coverage: {
					only: "//sap\/insights\/manageCardPreview\/Preview.*/"
				},
				module: [
					"./manageCardPreview/Preview.qunit"
				]
			},
			ManagePreview: {
				group: "ManagePreview",
				coverage: {
					only: "//sap\/insights\/ManagePreview.*/"
				},
				module: [
					"./ManagePreview.qunit"
				]
			},
			HouseOfCards: {
				group: "HouseOfCards",
				coverage: {
					only: "//sap\/insights\/manageCardPreview\/HouseOfCards.*/"
				},
				module: [
					"./manageCardPreview/HouseOfCards.qunit"
				]
			},
			InMemoryCachingHost: {
				group: "InMemoryCachingHost",
				coverage: {
					only: "//sap\/insights\/base\/InMemoryCachingHost.*/"
				},
				module: [
					"./base/InMemoryCachingHost.qunit"
				]
			},
			ManageAddCardWithSearch: {
				group: "ManageAddCardWithSearch",
				coverage: {
					only: "//sap\/insights\/ManageAddCardWithSearch.*/"
				},
				module: [
					"./ManageAddCardWithSearch.qunit"
				]
			}
		}
	};
});