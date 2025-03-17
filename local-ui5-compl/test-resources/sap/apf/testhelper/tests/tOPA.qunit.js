/*!
 * SAP APF Analysis Path Framework
 *
 * (c) Copyright 2012-2014 SAP AG. All rights reserved
 */
sap.ui.define([
	"sap/ui/test/Opa",
	"sap/ui/test/opaQunit",
	"sap/ui/thirdparty/jquery"
],function(
	Opa,
	opaTest,
	jQuery
) {
	"use strict";


	/**
 	* Note: in Karma include
 	*          { pattern: 'test/uilib/libs/QUnitUtils.js', watched: false, included: true, served: true },
 	*     This file only resides temporarily in the local libs folder.
 	*     in HTML include
 	*          <script type="text/javascript"             src="../../../resources/sap/ui/qunit/QUnitUtils.js"></script>
 	*     This file is part of the (locally) deployed UI5 version. Assumed to work on Build Server, too.
 	*/

	Opa.extendConfig({
		timeout : 3,  // min 2 seconds when rendering UI controls
		pollingInterval: 400, // default (milliseconds)
		arrangements : new Opa({
			iGiven : function () {
				return this;
			},
			iGivenExample : function () {
				var iNumberOfButtons = 1;
				function addButtonAfterSomeTime() {
					window.setTimeout(function () {
						var $button = jQuery('<button id="button' + iNumberOfButtons + '">' + iNumberOfButtons + '</button>').on("click", addButtonAfterSomeTime);
						jQuery("body").append($button);
						iNumberOfButtons++;
					}, 500);
				}
				//add the first button
				addButtonAfterSomeTime();
				return this;
			}

		}),//GIVEN
		actions : new Opa({
			iWhen : function () {
				this.waitFor({
					check : function () {
						return true;            // precondition that guards the exec of the success function
					},
					success : function () {
					}
				});
				return this;
			},
			iWhenExample : function (sButtonId) {
				this.waitFor({
					check : function () {
						return jQuery("#" + sButtonId).length;
					},
					success : function () {
						jQuery("#" + sButtonId).trigger("click");
					},
					error: function() {
						// called when timeout reached
					}
				});
				return this;
			}
		}),//WHEN actions
		assertions : new Opa({
			iThen : function () {
				this.waitFor({
					check : function () {
						return true;                      // precondition that guards the exec of the success function
					},
					success : function () {
						Opa.assert.strictEqual(true, true, "how to assert");  // Evaluation of QUnit assertion functions
						Opa.assert.ok(1);
					}
				});
				return this;
			},
			iThenExample : function (sButtonId, sText) {
				this.waitFor({
					check : function () {
						return jQuery("#" + sButtonId).length;
					},
					success : function () {
						Opa.assert.strictEqual(jQuery("#" + sButtonId).text(), sText, "Found the button with the id " + sButtonId);
					}
				});
				return this;
			}
		})//THEN assertions
	});

	opaTest("Template", function (Given, When, Then) {
		Given.iGiven();
		When.iWhen();
		Then.iThen();
	});

	opaTest("Should create two buttons", function (Given, When, Then) {
		// Arrangements
		Given.iGivenExample();

		//Actions
		When.iWhenExample("button1");

		// Assertions
		Then.iThenExample("button2", "2");
	});

});