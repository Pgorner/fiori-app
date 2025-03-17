/* globals QUnit */
sap.ui.define([
	"sap/ui/comp/smartfield/TextArrangementRead",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/thirdparty/URI"
], function(
	TextArrangementRead,
	Filter,
	FilterOperator,
	URI
) {
	"use strict";

	function getFilters () {
		return new Filter({
			filters: [
				new Filter({
					path: "Path0",
					operator: FilterOperator.EQ,
					value1: "0"
				}),
				new Filter({
					filters: [
						new Filter({
							path: "Path1",
							operator: FilterOperator.EQ,
							value1: "1"
						}),
						new Filter({
							path: 'Path2',
							operator: FilterOperator.EQ,
							value1: "2"
						})
					]
				})
			]
		});
	}

	QUnit.module("default");

	QUnit.test("Default configuration", function (assert) {
		// Act
		var oTAR = new TextArrangementRead(),
			oTAR2 = new TextArrangementRead();

		// Assert
		assert.ok(!!oTAR, "Instance created");
		assert.ok(oTAR.mRequests instanceof Map, "Cache map created");
		assert.notStrictEqual(oTAR.read, oTAR._createReadPromise, "Cache is not disabled");
		assert.strictEqual(oTAR, oTAR2, "The same instance is returned -> singleton");
	});

	QUnit.module("read", {
		beforeEach: function () {
			this.oTAR = new TextArrangementRead();
		},
		afterEach: function () {
			this.oTAR.clearCache();
			this.oTAR = null;
		},
		oReadSettingsMock: {
			filters: [getFilters()]
		},
		oModelMock: {
			getId: function () {
				return "MyModelID";
			},
			read: function (sKey, oSettings) {
				if (typeof oSettings.success === "function") {
					oSettings.success({
						results: [{}]
					});
				}
			},
			sServiceUrl: "/MyServiceUrl"
		},
		oModelMock2: {
			getId: function () {
				return "MyModelID2"; // Only the ID is different
			},
			read: function (sKey, oSettings) {
				if (typeof oSettings.success === "function") {
					oSettings.success();
				}
			},
			getKey: function () {
				return "sMockKey";
			},
			getProperty: function () {
				return this._bPropertyAvailable;
			},
			_bPropertyAvailable: false, // Mock property is available in local model
			sServiceUrl: "/MyServiceUrl"
		},
		oModelMock3: {
			getId: function () {
				return "MyModelID";
			},
			read: function (sKey, oSettings) {
				if (typeof oSettings.success === "function") {
					oSettings.success({
						results: []
					});
				}
			},
			sServiceUrl: "/MyServiceUrl"
		}
	});

	QUnit.test("read: default operation", function (assert) {
		// Arrange
		var oReadPromise1,
			oReadPromise2,
			oReadPromise3,
			fnDone = assert.async();

		// Act
		oReadPromise1 = this.oTAR.read(this.oModelMock, "/MyPath", this.oReadSettingsMock);
		oReadPromise2 = this.oTAR.read(this.oModelMock, "/MyPath", this.oReadSettingsMock);
		oReadPromise3 = this.oTAR.read(this.oModelMock, "/MyPathDifferent", this.oReadSettingsMock);

		// Assert
		assert.strictEqual(oReadPromise1, oReadPromise2, "Same promise instance returned for identical calls");
		assert.notStrictEqual(oReadPromise1, oReadPromise3, "Different promise instance for non-identical requests");
		Promise.all([oReadPromise1, oReadPromise2, oReadPromise3]).then(function(){
			assert.strictEqual(this.oTAR.mRequests.size, 2, "2 promises stored in internal cache");
			fnDone();
		}.bind(this));
	});

	QUnit.test("read: fail gracefully", function (assert) {
		// Arrange
		var oReadPromise1,
			oReadPromise2,
			fnDone = assert.async();

		// We intentionally create a falsy service URL so _calculateCacheKey will throw an error and we still
		// would like to fail gracefully and just opt-out of caching
		this.oModelMock.sServiceUrl = undefined;

		// Act
		oReadPromise1 = this.oTAR.read(this.oModelMock, "/MyPathFG", this.oReadSettingsMock);
		oReadPromise2 = this.oTAR.read(this.oModelMock, "/MyPathFG", this.oReadSettingsMock);

		// Restore service URL
		this.oModelMock.sServiceUrl = "/MyServiceUrl";

		// Assert
		assert.ok(oReadPromise1 instanceof Promise, "A new promise is created");
		assert.notStrictEqual(oReadPromise1, oReadPromise2, "Both created promises are different instances");
		Promise.all([oReadPromise1, oReadPromise2]).then(function(){
			assert.strictEqual(this.oTAR.mRequests.size, 0, "We did not create any internal cache for these requests");
			fnDone();
		}.bind(this));
	});

	QUnit.test("read: different oData model", function (assert) {
		// Arrange
		var oReadPromise1,
			oReadPromise2,
			oSpy = this.spy(this.oTAR, "_probeLocalModelForLoadedData"),
			oReadSpy = this.spy(this.oModelMock2, "read"),
			fnDone = assert.async();

		// Act
		oReadPromise1 = this.oTAR.read(this.oModelMock, "/MyPath", this.oReadSettingsMock);
		oReadPromise2 = this.oTAR.read(this.oModelMock2, "/MyPath", this.oReadSettingsMock);

		// Assert
		assert.notStrictEqual(oReadPromise1, oReadPromise2, "Both created promises are different instances");

		oReadPromise2.then(function () {
			assert.strictEqual(oSpy.callCount, 1, "We probed the new model for loaded data");
			assert.strictEqual(oReadSpy.callCount, 1, "Read is called on the second model");

			// Cleanup
			oSpy.restore();
			oReadSpy.restore();
			fnDone();
		});
	});

	QUnit.test("read: different oData model - data loaded in both models", function (assert) {
		// Arrange
		var oReadPromise,
			oReadSpy = this.spy(this.oModelMock2, "read"),
			fnDone = assert.async();

		this.oModelMock2._bPropertyAvailable = true;

		// Act
		this.oTAR.read(this.oModelMock, "/MyPath", this.oReadSettingsMock);
		oReadSpy.reset(); // Reset spy

		oReadPromise = this.oTAR.read(this.oModelMock2, "/MyPath", this.oReadSettingsMock);

		// Assert
		oReadPromise.then(function () {
			assert.strictEqual(oReadSpy.callCount, 0, "Read is not called as data is already loaded in local model");

			// Cleanup
			this.oModelMock2._bPropertyAvailable = false;
			oReadSpy.restore();
			fnDone();
		}.bind(this));
	});

	QUnit.test("read: should not cache responses with no records", function (assert) {
		// Arrange
		var oReadPromise1,
			fnDone = assert.async();

		// Act
		oReadPromise1 = this.oTAR.read(this.oModelMock3, "/MyPath", this.oReadSettingsMock);

		// Assert
		oReadPromise1.then(function(){
			assert.strictEqual(this.oTAR.mRequests.size, 0, "0 promises stored in internal cache");
			fnDone();
		}.bind(this));
	});

	QUnit.module("others");

	QUnit.test("exit", function (assert) {
		// Arrange
		var oTAR = new TextArrangementRead(),
			oResetSpy = this.spy(oTAR.mRequests, "clear");

		// Act
		oTAR.exit();

		// Assert
		assert.strictEqual(oResetSpy.callCount, 1, "Cache cleared on exit");
	});

	QUnit.test("clearCache", function (assert) {
		// Arrange
		var oTAR = new TextArrangementRead(),
			oResetSpy = this.spy(oTAR.mRequests, "clear");

		// Act
		oTAR.clearCache();

		// Assert
		assert.strictEqual(oResetSpy.callCount, 1, "Cache cleareds");
	});

	QUnit.test("_createReadPromise", function (assert) {
		// Arrange
		var oTAR = new TextArrangementRead(),
			oModelMock = {
				read: function (sPath, oDataReadSettings) {
					// Assert
					assert.strictEqual(sPath, "/ReadPath", "ODataModelRead called with the expected path");
					assert.strictEqual(typeof oDataReadSettings.success, "function", "success is a function");
					assert.strictEqual(typeof oDataReadSettings.error, "function", "error is a function");
				}
			},
			oPromise;

		assert.expect(4);

		// Act
		oPromise = oTAR._createReadPromise({
			model: oModelMock,
			path: "/ReadPath",
			settings: {}
		});

		// Assert
		assert.ok(oPromise instanceof Promise, "Promise is returned");
	});

	QUnit.test("_flattenFilters", function (assert) {
		// Arrange
		var oTAR = new TextArrangementRead(),
			oFilters = getFilters(),
			aFilters;

		// Act
		aFilters = oTAR._flattenFilters([oFilters]);

		// Assert
		assert.strictEqual(
			JSON.stringify(aFilters),
			'[{"p":"Path0","v":"0"},{"p":"Path1","v":"1"},{"p":"Path2","v":"2"}]',
			"Successfully flattened filters"
		);
	});

	QUnit.test("_calculateCacheKey", function (assert) {
		// Arrange
		var oTAR = new TextArrangementRead(),
			oModelMock = {
				getId: function () {
					return "MyModelID";
				},
				sServiceUrl: "/MyServiceUrl",
				aUrlParams: ["language=en", "test=true"]
			},
			oFilters = getFilters(),
			oReadSettingsMock = {
				filters: [oFilters]
			},
			sKey;

		// Act
		sKey = oTAR._calculateCacheKey({
			model: oModelMock,
			path: "/MyTestPath",
			settings: oReadSettingsMock
		});

		// Assert
		assert.strictEqual(
			sKey,
			'{"path":"/MyTestPath","service":"/MyServiceUrl","filters":[{"p":"Path0","v":"0"},{"p":"Path1","v":"1"},{"p":"Path2","v":"2"}],"urlParams":["language=en","test=true"]}',
			"Complex key created successfully"
		);

		// Arrange -> intentionally create a circular dependency
		oReadSettingsMock.filters[0]._circularDependency = this.oReadSettingsMock;

		// Act
		assert.throws(oTAR._calculateCacheKey({
			model: oModelMock,
			path: "/MyTestPath",
			settings: oReadSettingsMock
		}), "We expect TypeError");
	});

	QUnit.test("_calculateCacheKey service URL", function (assert) {
		// Arrange
		var oTAR = new TextArrangementRead(),
			oModelMock = {
				getId: function () {
					return "MyModelID";
				},
				sServiceUrl: "MyServiceUrl",
				aUrlParams: ["language=en", "test=true"]
			},
			oFilters = getFilters(),
			oReadSettingsMock = {
				filters: [oFilters]
			},
			sExpectedURI = new URI("MyServiceUrl").absoluteTo(document.baseURI).pathname().toString(),
			sKey;

		// Act
		sKey = oTAR._calculateCacheKey({
			model: oModelMock,
			path: "/MyTestPath",
			settings: oReadSettingsMock
		});

		// Assert
		assert.strictEqual(
			JSON.parse(sKey).service,
			sExpectedURI,
			"URL is properly formatted to base URI"
		);
	});
});
