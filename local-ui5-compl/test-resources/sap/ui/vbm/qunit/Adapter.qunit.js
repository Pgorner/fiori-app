sap.ui.define([
	"sap/ui/thirdparty/jquery",
	"sap/ui/vbm/GeoMap",
	"sap/ui/vbm/Adapter",
	"sap/ui/vbm/Resource"
], function(
	jQuery,
	GeoMap,
	Adapter,
	Resource
) {
	"use strict";

	QUnit.module("Adapter Initialization", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true,
				resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("Valid Initialization", function(assert) {
		//Arrange
		var geoMapId = this.geoMap.getId();

		//Act
		this.adapter.setMap(geoMapId);

		//Assert
		assert.strictEqual(this.adapter.getMap(), geoMapId, 'Adapter initialized with GeoMap');
	});

	QUnit.test("No Association", function(assert) {
		//Arrange
		var geoMapId = 'something';

		//Act

		//Assert
		assert.equal(this.adapter.getMap(), null, 'Adapter initialized; not associated with a valid GeoMap Id');
	});

	QUnit.test("No Association", function(assert) {
		//Arrange
		var geoMapId = 'something';

		//Act

		//Assert
		assert.equal(this.adapter.getMap(), null, 'Adapter initialized; not associated with a valid GeoMap Id');
	});

	QUnit.module("Adapter - VBI JSON Processing - Improper VBI JSON", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true,
				resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("No Association", function(assert) {
		//Arrange
		var that = this;

		//Act
		this.adapter.load();

		//Assert
		assert.throws(function() { var sModel = that.geoMap.getModel().getJSON(); }.bind(this.geoMap), TypeError, "Cannot read property 'getModel' of undefined");
	});

	QUnit.test("Invalid GeoMap", function(assert) {
		//Arrange
		this.adapter.setMap('something');
		var that = this;

		//Act
		this.adapter.load();
		var map = this.adapter.getMap();

		//Assert
		assert.throws(function() { var sModel = this.getModel().getJSON(); }.bind(this.geoMap), TypeError, "Cannot read property 'getModel' of undefined");
	});

	QUnit.test("No Payload", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		this.adapter.load();

		//Assert
		assert.equal(this.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
	});

	QUnit.test("Empty Object", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		this.adapter.load({});

		//Assert
		assert.equal(this.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
	});

	QUnit.test("Empty String", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		this.adapter.load("");

		//Assert
		assert.equal(this.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
	});

	QUnit.test("Null", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		this.adapter.load(null);

		//Assert
		assert.equal(this.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
	});

	QUnit.test("Syntactically incorrect JSON", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		this.adapter.load("{\"SAPVB\":{\"ver}");

		//Assert
		var resources = this.geoMap.getResources();
		assert.strictEqual(resources.length, 1, 'No new Resources added to GeoMap');
	});

	QUnit.module("Adapter - VBI JSON Processing - Map Configuration", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("Map Stack Configuration without singleBMP", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		var promise = this.adapter.load('{"SAPVB":{"xmlns:VB":"VB","version":"2.0","MapProviders":{"Set":{"MapProvider":[{"name":"DUMMY1","Source":{"id":"1","url":"http://dummy"}},{"name":"DUMMY2","Source":{"id":"1","url":"http://dummy2"}}]}},"MapLayerStacks":{"Set":{"MapLayerStack":{"name":"NO_SINGLE_BMP","MapLayer":[{"colBkgnd":"RGB(255,255,255)","name":"DUMMY1","opacity":"1.0","refMapProvider":"DUMMY1"},{"colBkgnd":"RGB(255,255,255)","name":"DUMMY2","opacity":"0.75","refMapProvider":"DUMMY2"}]}}},"Menus":{},"Automation":{}}}');

		return promise.then(function() {
			//Assert
			assert.ok(this._mapConfiguration != undefined && this._mapConfiguration != null, "Map Configuration is not null or undefined");
			assert.ok(this._mapConfiguration.MapLayerStacks && this._mapConfiguration.MapLayerStacks.length > 0, "Map Layer Stacks exist in map configuration object");
			assert.strictEqual(this._mapConfiguration.MapLayerStacks[0].singleBMP, "false", "singleBMP evaluates to false for map layer stack");
		}.bind(this.adapter));
	});

	QUnit.test("Map Stack Configuration with singleBMP defined as true Map Layer Stack level and false on Map Layers", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		var promise  = this.adapter.load('{"SAPVB":{"xmlns:VB":"VB","version":"2.0","MapProviders":{"Set":{"MapProvider":[{"name":"DUMMY1","Source":{"id":"1","url":"http://dummy"}},{"name":"DUMMY2","Source":{"id":"1","url":"http://dummy2"}}]}},"MapLayerStacks":{"Set":{"MapLayerStack":{"name":"SINGLE_BMP_AT_MLS","singleBMP":"true","MapLayer":[{"colBkgnd":"RGB(255,255,255)","dependency":"all","name":"DUMMY1","opacity":"1.0","singleBMP":"false","refMapProvider":"DUMMY1"},{"colBkgnd":"RGB(255,255,255)","dependency":"flexible","name":"DUMMY2","opacity":"0.75","singleBMP":"false","refMapProvider":"DUMMY2"}]}}},"Menus":{},"Automation":{}}}');

		return promise.then(function() {
			//Assert
			assert.strictEqual(this._mapConfiguration.MapLayerStacks[0].singleBMP, "true", "singleBMP evaluates to true for map layer stack");
		}.bind(this.adapter));
	});

	QUnit.test("Map Stack Configuration with singleBMP defined as true on Map Layers but not on MLS", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		var promise = this.adapter.load('{"SAPVB":{"xmlns:VB":"VB","version":"2.0","MapProviders":{"Set":{"MapProvider":[{"name":"DUMMY1","Source":{"id":"1","url":"http://dummy"}},{"name":"DUMMY2","Source":{"id":"1","url":"http://dummy2"}}]}},"MapLayerStacks":{"Set":{"MapLayerStack":{"name":"SINGLE_BMP_AT_MLS","MapLayer":[{"colBkgnd":"RGB(255,255,255)","dependency":"all","name":"DUMMY1","opacity":"1.0","singleBMP":"true","refMapProvider":"DUMMY1"},{"colBkgnd":"RGB(255,255,255)","dependency":"flexible","name":"DUMMY2","opacity":"0.75","singleBMP":"true","refMapProvider":"DUMMY2"}]}}},"Menus":{},"Automation":{}}}');

		return promise.then(function() {
			//Assert
			assert.strictEqual(this._mapConfiguration.MapLayerStacks[0].singleBMP, "true", "singleBMP evaluates to true for map layer stack");
		}.bind(this.adapter));
	});

	QUnit.test("Map Stack Configuration with singleBMP defined as true on some Map Layers, not on MLS", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		var promise = this.adapter.load('{"SAPVB":{"xmlns:VB":"VB","version":"2.0","MapProviders":{"Set":{"MapProvider":[{"name":"DUMMY1","Source":{"id":"1","url":"http://dummy"}},{"name":"DUMMY2","Source":{"id":"1","url":"http://dummy2"}}]}},"MapLayerStacks":{"Set":{"MapLayerStack":{"name":"SINGLE_BMP_AT_MLS","MapLayer":[{"colBkgnd":"RGB(255,255,255)","dependency":"all","name":"DUMMY1","opacity":"1.0","singleBMP":"true","refMapProvider":"DUMMY1"},{"colBkgnd":"RGB(255,255,255)","dependency":"flexible","name":"DUMMY2","opacity":"0.75","refMapProvider":"DUMMY2"}]}}},"Menus":{},"Automation":{}}}');

		return promise.then(function() {
			//Assert
			assert.strictEqual(this._mapConfiguration.MapLayerStacks[0].singleBMP, "false", "singleBMP evaluates to false on map layer stack");
		}.bind(this.adapter));
	});

	QUnit.test("Map Stack Configuration with singleBMP defined as mixture of true & false on Map Layers, not on MLS", function(assert) {
		//Arrange
		this.adapter.setMap(this.geoMap.getId());

		//Act
		var promise = this.adapter.load('{"SAPVB":{"xmlns:VB":"VB","version":"2.0","MapProviders":{"Set":{"MapProvider":[{"name":"DUMMY1","Source":{"id":"1","url":"http://dummy"}},{"name":"DUMMY2","Source":{"id":"1","url":"http://dummy2"}}]}},"MapLayerStacks":{"Set":{"MapLayerStack":{"name":"SINGLE_BMP_AT_MLS","MapLayer":[{"colBkgnd":"RGB(255,255,255)","dependency":"all","name":"DUMMY1","opacity":"1.0","singleBMP":"true","refMapProvider":"DUMMY1"},{"colBkgnd":"RGB(255,255,255)","dependency":"flexible","name":"DUMMY2","opacity":"0.75","singleBMP":"false", "refMapProvider":"DUMMY2"}]}}},"Menus":{},"Automation":{}}}');

		return promise.then(function() {
			//Assert
			assert.strictEqual(this._mapConfiguration.MapLayerStacks[0].singleBMP, "false", "singleBMP evaluates to false on map layer stack");
		}.bind(this.adapter));
	});

	//MLS level / false ML"{"SAPVB":{"xmlns:VB":"VB","version":"2.0","MapProviders":{"Set":{"MapProvider":[{"name":"DUMMY1","Source":{"id":"1","url":"http://dummy"}},{"name":"DUMMY2","Source":{"id":"1","url":"http://dummy2"}}]}},"MapLayerStacks":{"Set":{"MapLayerStack":{"name":"SINGLE_BMP_AT_MLS","singleBMP":"true","MapLayer":[{"colBkgnd":"RGB(255,255,255)","dependency":"all","name":"DUMMY1","opacity":"1.0","singleBMP":"false","refMapProvider":"DUMMY1"},{"colBkgnd":"RGB(255,255,255)","dependency":"flexible","name":"DUMMY2","opacity":"0.75","singleBMP":"false","refMapProvider":"DUMMY2"}]}}},"Menus":{},"Automation":{}}}"

	QUnit.module("Adapter - VBI JSON Processing - Resources", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true,
				resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("Normal load - Resources added to GeoMap", function(assert) {
		//Arrange
		var done1 = assert.async();

		var that = this;
		this.adapter.setMap(this.geoMap.getId());

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/resources.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data));

			//Assert
			var resources = that.geoMap.getResources();
			assert.strictEqual(resources.length, 5, '5 Resources added successfully to GeoMap');
			assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

			//Alert
			assert.strictEqual(resources[0].getName(), 'Alert', 'Resource Alert added to GeoMap');
			assert.strictEqual(resources[1].getName(), 'SAP_Pin', 'Resource SAP_Pin added to GeoMap');
			assert.strictEqual(resources[2].getName(), 'SAP_PinHighlighted', 'Resource SAP_PinHighlighted added to GeoMap');
			assert.strictEqual(resources[3].getName(), 'SAP_PinMulti', 'Resource SAP_PinMulti to GeoMap');
			assert.strictEqual(resources[4].getName(), 'SAP_PinSelected', 'Resource SAP_PinSelected added to GeoMap');

			done1();
		});
	});

	QUnit.test("Resources overwritten - Initial resources upon update", function(assert) {
		//Assert - Before Loading VBI JSON
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var resources = that.geoMap.getResources();
		assert.strictEqual(resources.length, 1, '5 Resources added successfully to GeoMap');
		assert.strictEqual(resources[0].getName(), 'smiley', 'Resource Alert added to GeoMap');

		//Arrange
		var done2 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/resources.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data));

			//Assert - After Loading VBI JSON
			var resources = that.geoMap.getResources();
			assert.strictEqual(resources.length, 5, '5 Resources added successfully to GeoMap; existing 1 resource destroyed');
			assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

			//Alert
			assert.strictEqual(resources[0].getName(), 'Alert', 'Resource Alert added to GeoMap');
			assert.strictEqual(resources[1].getName(), 'SAP_Pin', 'Resource SAP_Pin added to GeoMap');
			assert.strictEqual(resources[2].getName(), 'SAP_PinHighlighted', 'Resource SAP_PinHighlighted added to GeoMap');
			assert.strictEqual(resources[3].getName(), 'SAP_PinMulti', 'Resource SAP_PinMulti to GeoMap');
			assert.strictEqual(resources[4].getName(), 'SAP_PinSelected', 'Resource SAP_PinSelected added to GeoMap');

			done2();
		});
	});

	QUnit.test("Resources overwritten - Two updates", function(assert) {
		//Assert - Before Loading VBI JSON
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var resources = that.geoMap.getResources();
		assert.strictEqual(resources.length, 1, 'GeoMap initialized with 1 Resource');
		assert.strictEqual(resources[0].getName(), 'smiley', 'Resource smiley added to GeoMap');

		//Arrange
		var done3 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/resources.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data));

			//Assert - After Loading VBI JSON
			var resources = that.geoMap.getResources();
			assert.strictEqual(resources.length, 5, '5 Resources added successfully to GeoMap; existing 1 resource from GeoMap instantiation destroyed');
			assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

			//Alert
			assert.strictEqual(resources[0].getName(), 'Alert', 'Resource Alert added to GeoMap');
			assert.strictEqual(resources[1].getName(), 'SAP_Pin', 'Resource SAP_Pin added to GeoMap');
			assert.strictEqual(resources[2].getName(), 'SAP_PinHighlighted', 'Resource SAP_PinHighlighted added to GeoMap');
			assert.strictEqual(resources[3].getName(), 'SAP_PinMulti', 'Resource SAP_PinMulti to GeoMap');
			assert.strictEqual(resources[4].getName(), 'SAP_PinSelected', 'Resource SAP_PinSelected added to GeoMap');

			jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/resources_update.json", function(data_update) {
				//Act
				that.adapter.load(JSON.stringify(data_update));

				//Assert - After Loading VBI JSON
				var resources = that.geoMap.getResources();
				assert.strictEqual(resources.length, 2, '2 Resources added successfully to GeoMap; existing 5 resource from GeoMap instantiation destroyed');
				assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

				//Alert
				assert.strictEqual(resources[0].getName(), 'EuropeanBody-NoSideRidges.vds', 'Resource EuropeanBody-NoSideRidges.vds added to GeoMap');
				assert.strictEqual(resources[1].getName(), 'axle.vds', 'Resource axle.vds added to GeoMap');

				done3();
			});
		});
	});

	QUnit.module("Adapter - VBI JSON Processing - Scenes - Data Types & VOs", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true,
				resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("VBI JSON Processed and corresponding aggregations created on GeoMap", function(assert) {
		//Assert - Before Loading VBI JSON
		var oExistingVos = this.geoMap.getVos();
		assert.strictEqual(oExistingVos.length, 0, 'GeoMap initialized with 0 Vo');

		//Arrange
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var done4 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data)).then(function() {
				//Assert - After Loading VBI JSON
				var oVos = that.geoMap.getVos();
				assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
				assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

				done4();
			});
		});
	});

	QUnit.test("No Delta support", function(assert) {
		//Assert - Before Loading VBI JSON
		var oExistingVos = this.geoMap.getVos();
		assert.strictEqual(oExistingVos.length, 0, 'GeoMap initialized - does not have any VOs');

		//Arrange
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var done5 = assert.async();;

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data)).then(function() {
				//Assert - After Loading VBI JSON
				var oVos = that.geoMap.getVos();
				assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
				assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

				jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/vos_update.json", function(data_update) {
					//Act
					that.adapter.load(JSON.stringify(data_update)).then(function() {
						//Assert - After Loading VBI JSON
						var oVos = that.geoMap.getVos();
						assert.strictEqual(oVos.length, 2, '2 Vo added successfully to GeoMap; existing 3 destroyed');
						assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

						done5();
					});
				});
			});
		});
	});

	QUnit.module("Adapter - VBI JSON Processing - Data Section", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true,
				resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("Delta Load - New Spots Creation", function(assert) {
		//Assert - Before Loading VBI JSON
		var oExistingVos = this.geoMap.getVos();
		assert.strictEqual(oExistingVos.length, 0, 'GeoMap initialized with 0 Vo');

		//Arrange
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var done6 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data)).then(function() {
				//Assert - After Loading VBI JSON
				var oVos = that.geoMap.getVos();
				assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
				assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
				oVos.forEach(function(oVo) { assert.strictEqual(oVo.getItems().length, 0, "Aggregation contains 0 items") });

				jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/create_spots.json", function(data_update) {
					//Act
					that.adapter.load(JSON.stringify(data_update)).then(function() {
						//Assert - After Loading VBI JSON
						var oVos = that.geoMap.getVos();

						assert.equal(oVos[2].getItems().length, 3, "3 new spots created");
						assert.equal(oVos[1].getItems().length, 0, "0 new links created");
						assert.equal(oVos[0].getItems().length, 0, "0 new areas created");

						done6();
					});
				});
			});
		});
	});

	QUnit.test("Delta Load - Existing Spots Creation & New Link Addition", function(assert) {
		//Assert - Before Loading VBI JSON
		var oExistingVos = this.geoMap.getVos();
		assert.strictEqual(oExistingVos.length, 0, 'GeoMap initialized with 0 Vo');

		//Arrange
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var done7 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data)).then(function() {
				//Assert - After Loading VBI JSON
				var oVos = that.geoMap.getVos();
				assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
				assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
				oVos.forEach(function(oVo) { assert.strictEqual(oVo.getItems().length, 0, "Aggregation contains 0 items") });

				jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/create_spots.json", function(data_update) {
					//Act
					that.adapter.load(JSON.stringify(data_update)).then(function() {
						//Assert - After Loading VBI JSON
						var oVos = that.geoMap.getVos();

						assert.equal(oVos[2].getItems().length, 3, "3 new spots created");
						assert.equal(oVos[1].getItems().length, 0, "0 new links created");
						assert.equal(oVos[0].getItems().length, 0, "0 new areas created");

						jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/modify_spots.json", function(data_second_update) {
							//Act
							that.adapter.load(JSON.stringify(data_second_update)).then(function() {
								//Assert - After Loading VBI JSON
								var oVos = that.geoMap.getVos();

								assert.equal(oVos[2].getItems().length, 4, "1 new spots created;1 existing updated");
								assert.equal(oVos[1].getItems().length, 1, "1 new links created");
								assert.equal(oVos[0].getItems().length, 0, "0 new links created");

								done7();
							});
						});
					});
				});
			});
		});
	});

	QUnit.test("Delta Load - Spot Deletion", function(assert) {
		//Assert - Before Loading VBI JSON
		var oExistingVos = this.geoMap.getVos();
		assert.strictEqual(oExistingVos.length, 0, 'GeoMap initialized with 0 Vo');

		//Arrange
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var done8 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data)).then(function() {
				//Assert - After Loading VBI JSON
				var oVos = that.geoMap.getVos();
				assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
				assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
				oVos.forEach(function(oVo) { assert.strictEqual(oVo.getItems().length, 0, "Aggregation contains 0 items") });

				jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/create_spots.json", function(data_update) {
					//Act
					that.adapter.load(JSON.stringify(data_update)).then(function() {
						//Assert - After Loading VBI JSON
						var oVos = that.geoMap.getVos();

						assert.equal(oVos[2].getItems().length, 3, "3 new spots created");
						assert.equal(oVos[1].getItems().length, 0, "0 new links created");
						assert.equal(oVos[0].getItems().length, 0, "0 new areas created");

						jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/modify_spots.json", function(data_second_update) {
							//Act
							that.adapter.load(JSON.stringify(data_second_update)).then(function() {
								//Assert - After Loading VBI JSON
								var oVos = that.geoMap.getVos();

								assert.equal(oVos[2].getItems().length, 4, "1 new spots created;1 existing updated");
								assert.equal(oVos[1].getItems().length, 1, "1 new links created");
								assert.equal(oVos[0].getItems().length, 0, "0 new areas created");

								jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/delete_spots.json", function(data_third_update) {
									//Act
									that.adapter.load(JSON.stringify(data_third_update)).then(function() {
										//Assert - After Loading VBI JSON
										var oVos = that.geoMap.getVos();

										assert.equal(oVos[2].getItems().length, 3, "1 existing spots deleted");

										done8();
									});
								});
							});
						});
					});
				});
			});
		});
	});

	QUnit.test("Full Update", function(assert) {
		//Assert - Before Loading VBI JSON
		var oExistingVos = this.geoMap.getVos();
		assert.strictEqual(oExistingVos.length, 0, 'GeoMap initialized with 0 Vo');

		//Arrange
		var that = this;
		this.adapter.setMap(this.geoMap.getId());
		var done9 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			//Act
			that.adapter.load(JSON.stringify(data)).then(function() {
				//Assert - After Loading VBI JSON
				var oVos = that.geoMap.getVos();
				assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
				assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');
				oVos.forEach(function(oVo) { assert.strictEqual(oVo.getItems().length, 0, "Aggregation contains 0 items") });

				jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/create_spots.json", function(data_update) {
					//Act
					that.adapter.load(JSON.stringify(data_update)).then(function() {
						//Assert - After Loading VBI JSON
						var oVos = that.geoMap.getVos();

						assert.equal(oVos[2].getItems().length, 3, "3 new spots created");
						assert.equal(oVos[1].getItems().length, 0, "0 new links created");
						assert.equal(oVos[0].getItems().length, 0, "0 new areas created");

						jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/modify_spots.json", function(data_second_update) {
							//Act
							that.adapter.load(JSON.stringify(data_second_update)).then(function() {
								//Assert - After Loading VBI JSON
								var oVos = that.geoMap.getVos();

								assert.equal(oVos[2].getItems().length, 4, "1 new spots created;1 existing updated");
								assert.equal(oVos[1].getItems().length, 1, "1 new links created");
								assert.equal(oVos[0].getItems().length, 0, "0 new links created");

								jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/delete_spots.json", function(data_third_update) {
									//Act
									that.adapter.load(JSON.stringify(data_third_update)).then(function() {
										//Assert - After Loading VBI JSON
										var oVos = that.geoMap.getVos();

										assert.equal(oVos[2].getItems().length, 3, "1 existing spots deleted");

										jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/full_update.json", function(full_update) {
											//Act
											that.adapter.load(JSON.stringify(full_update)).then(function() {
												//Assert - After Loading VBI JSON
												var oVos = that.geoMap.getVos();

												assert.equal(oVos.length, 3, "3 aggregations exist");
												assert.equal(oVos[2].getItems().length, 2, "Existing spots deleted, 2 new created");
												assert.equal(oVos[1].getItems().length, 2, "Existing links deleted, 2 new created");
												assert.equal(oVos[0].getItems().length, 0, "No existing area deleted, 0 new created");

												done9();
											});
										});
									});
								});
							});
						});
					});
				});
			});
		});
	});

	QUnit.module("Adapter - VBI JSON Processing - Automation & Menus Section", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true,
				resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("Push Context Menu", function(assert) {
		//Assert - Before Loading VBI JSON
		var oExistingVos = this.geoMap.getVos();
		assert.strictEqual(oExistingVos.length, 0, 'GeoMap initialized - does not have any VOs');

		//Arrange
		var that = this;
		this.adapter.setMap(this.geoMap.getId());

		var done10 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			that.adapter.load(JSON.stringify(data)).then(function() {
				jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/context_menu.json", function(data) {
					//Act
					that.adapter.load(JSON.stringify(data)).then(function() {
						//Assert - After Loading VBI JSON
						var oVos = that.geoMap.getVos();
						assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
						assert.strictEqual(that.geoMap.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

						done10();
					});
				});
			});
		});
	});

	QUnit.module("Adapter - Re-association", {
		beforeEach: function() {
			this.geoMap = new GeoMap('vbi', {
				width: "100%",
				height: "100%",
				scaleVisible: true,
				resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
			});
			this.adapter = new Adapter('adapter');
		},
		afterEach: function() {
			this.geoMap.destroy();
			this.adapter.destroy();
		}
	});

	QUnit.test("Delta Load - New Spots Creation", function(assert) {

		var that = this;
		this.adapter.setMap(this.geoMap.getId());

		var done11 = assert.async();

		jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
			that.adapter.load(JSON.stringify(data)).then(function() {
				//Assert - Before Loading VBI JSON
				var oExistingVos = that.geoMap.getVos();
				assert.strictEqual(oExistingVos.length, 3, 'GeoMap contains 3 Vo');

				//Act
				var geoMap2 = new GeoMap('vbi2', {
					width: "100%",
					height: "100%",
					scaleVisible: true,
					resources: [new Resource({ name: "smiley", src: "test-resources/sap/ui/vbm/demokit/media/images/smiley.png" })],
				});

				that.adapter.setMap(geoMap2.getId());

				//Assert - Before Loading VBI JSON
				assert.ok(geoMap2.getId() === that.adapter.getMap(), 'Adapter associated with new instance of Geomap');
				var oExistingVos = geoMap2.getVos();
				assert.strictEqual(oExistingVos.length, 0, 'New GeoMap does not contain any Vo Aggregations ');

				jQuery.getJSON("test-resources/sap/ui/vbm/media/adapter/initial_load.json", function(data) {
					//Act
					that.adapter.load(JSON.stringify(data)).then(function() {
						//Assert - After Loading VBI JSON
						var oVos = geoMap2.getVos();
						assert.strictEqual(oVos.length, 3, '3 Vos added successfully to GeoMap; none existing');
						assert.strictEqual(geoMap2.getModel().getJSON(), "{}", 'Adapter initialized; associated with a valid instance of GeoMap; Empty JSON Model');

						done11();
					});
				});
			});
		});
	});
});
