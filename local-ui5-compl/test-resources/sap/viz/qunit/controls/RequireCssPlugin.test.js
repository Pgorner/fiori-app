/*global QUnit */
sap.ui.define([
	"sap/ui/qunit/utils/createAndAppendDiv"
], function(createAndAppendDiv) {

  createAndAppendDiv("content");

  QUnit.module("css load test");

  QUnit.test('Check load css correctly', function(assert) {
    var done = assert.async();
    require(["css!test-resources/sap/viz/qunit/styles/style.css"],function(){
      assert.ok(window.define, "windows.define should be exist");
      var properties = window.getComputedStyle(document.getElementById("content"), null);
      assert.equal(properties.getPropertyValue("background-color"), "rgb(255, 0, 0)");
      done();
    });

  });

});
