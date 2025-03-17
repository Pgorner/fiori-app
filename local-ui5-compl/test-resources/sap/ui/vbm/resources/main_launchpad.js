sap.ui.define([

	"sap/ui/core/Core",

	"sap/ui/model/json/JSONModel",

	"sap/m/Text",

	"sap/m/Button",

	"sap/m/Label",

	"sap/m/Page",

	"sap/m/Bar",

	"sap/m/TileContainer",

	"sap/m/Title",

	"sap/m/StandardTile",

	"sap/ui/core/CustomData",

	"sap/ui/core/ComponentContainer",

	"sap/base/util/UriParameters",

	"sap/ui/thirdparty/jquery"

], function(

	Core,

	JSONModel,

	Text,

	Button,

	Label,

	Page,

	Bar,

	TileContainer,

	Title,

	StandardTile,

	CustomData,

	ComponentContainer,

	UriParameters,

	jQuery

) {

	"use strict";
 
	//localStorage.setItem('map', '');
 
	/* TODO: Consider replacing this

		* with a local var (let x=...) or 

		* with an AMD export/import (export.x=..., ...=X.x) */

	var controller = {

		configurable: "false",

		writable: "true",
 
		value: {
 
			currentTest: 0,
 
			tests: [],
 
			testDescription: new Text(),
 
			navigateLeftButton: new Button({

				icon: "sap-icon://navigation-left-arrow"

			}),
 
			navigateRightButton: new Button({

				icon: "sap-icon://navigation-right-arrow"

			}),
 
			testListButton: new Button({

				icon: "sap-icon://list",

				text: "All Tests",

				press: function () {

					controller.showTests();

					controller.testTitle.setText("");

					controller.testDescription.setText("");

				}

			}),
 
			rtlButton: new Button({

				icon: "sap-icon://text-align-right",

				text: "RTL Mode",

				press: function () {

					window.location.href = window.location.origin + window.location.pathname + "?component=" + controller.tests.tests[controller.currentTest].componentName + "&sap-ui-rtl=true"

				}

			}),
 
			ltrButton: new Button({

				icon: "sap-icon://text-align-left",

				text: "LTR Mode",

				press: function () {

					window.location.href = window.location.origin + window.location.pathname + "?component=" + controller.tests.tests[controller.currentTest].componentName + "&sap-ui-rtl=false"

				}

			}),
 
			reloadAppButton: new Button({

				icon: "sap-icon://refresh",

				text: "Reload Test App",

				press: function () {

					window.location.href = window.location.origin + window.location.pathname

				}

			}),
 
			testTitle: new Label()
 
 
		}

	};
 
	controller.page = new Page({

		subHeader: new Bar({

			contentMiddle: [

				controller.testDescription

			]

		}),

		customHeader: [

			new Bar({

				contentLeft: [

					controller.navigateLeftButton,

					controller.testListButton,

					controller.rtlButton

				],

				contentMiddle: [

					controller.testTitle

				],

				contentRight: [

					controller.ltrButton,

					controller.reloadAppButton,

					controller.navigateRightButton

				]

			})

		]

	});
 
	controller.getTestIndexFromComponentName = function (componentName) {

		var index = -1;

		for (var i = 0; i < controller.tests.tests.length; i++) {

			if (componentName === controller.tests.tests[i].componentName) {

				index = i;

				break;

			}

		}

		return index;

	}
 
	controller.getTestIndexFromTestNumber = function (testNumber) {

		var index = -1;

		for (var i = 0; i < controller.tests.tests.length; i++) {

			if (testNumber === controller.tests.tests[i].number) {

				index = i;

				break;

			}

		}

		return index;

	}
 
	controller.showTests = function (testIndex) {

		var that = this;

		this.page.destroyContent();

		for (var i = 0; i < that.tests.areas.length; i++) {

			const areaTests = that.tests.tests.filter(test => test.area == that.tests.areas[i]);

			var component = new TileContainer("tc" + i, {

				height: "35%"

			});
 
			var title = new Title({

				text: that.tests.areas[i]

			});
 
			for (var ia = 0; ia < areaTests.length; ia++) {

				var t = areaTests[ia];

				component.addTile(new StandardTile({

					icon: "sap-icon://activity-2",

					title: t.name,

					info: t.area,

					number: t.number,

					press: function (event) {

						var componentName = event.getSource().getCustomData()[0].getValue(),

							testIndex = controller.getTestIndexFromComponentName(componentName);

						controller.loadTest(testIndex);

					},

					customData: {

						Type: CustomData,

						key: "componentName",

						value: t.componentName

					}

				}))

			}

			this.page.addContent(title);

			this.page.addContent(component);

		}
 
	};
 
	controller.loadTest = function (testIndex) {
 
		if (testIndex < 0) {

			testIndex = this.tests.tests.length - 1;

		} else if (testIndex >= this.tests.tests.length) {

			testIndex = 0;

		}
 
		this.currentTest = testIndex;
 
		var testInfo = this.tests.tests[testIndex];
 
		var component = new ComponentContainer({

			name: testInfo.componentName,

			height: "100%",

			width: "100%"

		});
 
		this.page.destroyContent();

		this.page.addContent(component);

		this.testTitle.setText(testInfo.number + " - " + testInfo.name);

		this.testDescription.setText(testInfo.description);
 
	};
 
	controller.loadNextTest = function () {

		this.currentTest++;

		this.loadTest(this.currentTest);

	}
 
	controller.loadPreviousTest = function () {

		this.currentTest--;

		this.loadTest(this.currentTest);

	}
 
 
	controller.page.placeAt("content");
 
	/* TODO: Consider replacing this

		* with a local var (let x=...) or 

		* with an AMD export/import (export.x=..., ...=X.x) */

	var dat = {

		configurable: "false",

		writable: "true",
 
		value: jQuery.getJSON("./test_structure.json", function (tests) {

			controller.tests = tests;

			new JSONModel(tests);
 
			controller.navigateLeftButton.attachPress(controller.loadPreviousTest.bind(controller));

			controller.navigateRightButton.attachPress(controller.loadNextTest.bind(controller));
 
			if (UriParameters.fromQuery(window.location.search).get('component')) {

				var componentName = UriParameters.fromQuery(window.location.search).get('component');

				testIndex = controller.getTestIndexFromComponentName(componentName);

				controller.loadTest(testIndex);

			} else {

				Core.ready(function () {

					controller.showTests();

				});

			}

		})

	};

});