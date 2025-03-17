/*global QUnit, sinon */
sap.ui.define([
    "sap/insights/base/InMemoryCachingHost",
    "sap/ui/integration/Host",
    "sap/insights/base/CacheData"
], function (InMemoryCachingHost, Host, CacheData) {
    "use strict";

    QUnit.module("Basic function Tests", {
        beforeEach: function () {
            this.oSandbox = sinon.sandbox.create();
            this.oHost = new InMemoryCachingHost();
            this.oCard = {
                getManifestEntry: function (entry) {
                    if (entry === "sap.app") {
                        return { id: "cardId" };
                    } else if (entry === "sap.card") {
                        return { type: "List", content: { item: { actionsStrip: [] } } };
                    }
                },
                setManifestChanges: function (changes) {
                    this.manifestChanges = changes;
                },
                getManifestChanges: function () {
                    return this.manifestChanges || [];
                }
            };
            this.sResource = "testResource";
            this.mOptions = {};
            this.mRequestSettings = { method: "GET" };
            this.oCacheData = CacheData.getInstance();
            this.oCacheData.clearCache();
        },
        afterEach: function () {
            this.oSandbox.restore();
            this.oHost.destroy();
        }
    });

    QUnit.test("fetch - Test when no cache data is available", function (assert) {
        var done = assert.async();
        var oResponse = new Response(JSON.stringify({ data: "testData" }), {
            headers: { "Content-Type": "application/json" }
        });
        var oSpy = sinon.spy(this.oHost, "_fetchData");

        sinon.stub(Host.prototype, "fetch").returns(Promise.resolve(oResponse));

        this.oHost.fetch(this.sResource, this.mOptions, this.mRequestSettings, this.oCard).then(function (data) {
            assert.deepEqual(data, oResponse, "Data response should be returned");
            //when data is not cached _fetchData should be invoked
            assert.ok(oSpy.called, "Fetchdata should be called");
            assert.ok(this.oCacheData.getCacheResponse("cardId")[this.sResource], "Response should be cached");
            Host.prototype.fetch.restore();
            oSpy.restore();
            done();
        }.bind(this));
    });

    QUnit.test("fetch - Test when data is cached", function (assert) {
        var done = assert.async();
        var oSpy = sinon.spy(this.oHost, "_fetchData");
        var oSetManifestSpy = sinon.spy(this.oCard, "setManifestChanges");
        var oCachedResponse = new Response(JSON.stringify({ data: "cachedData" }), {
            headers: { "Content-Type": "application/json" }
        });
        //already set cache data
        this.oCacheData.setCacheResponse("testCardId", this.sResource, oCachedResponse);
        sinon.stub(this.oCacheData, "getCacheResponse").returns({"testResource": oCachedResponse});

        //check if data is returned from cache
        this.oHost.fetch(this.sResource, this.mOptions, this.mRequestSettings, this.oCard).then(function (data) {
            assert.ok(oSpy.notCalled, "Fetchdata should not be called");
            data.json().then(function (jsonData) {
                assert.ok(JSON.stringify(jsonData).includes("cachedData"), "Response data should contain 'cachedData'");
                assert.ok(oSetManifestSpy.called, "setManifestChanges method should be called");
                assert.ok(this.oCard.manifestChanges.length, "Manifest changes should be set");
                assert.ok(this.oCard.manifestChanges[0]["/sap.card/content/item/actionsStrip"], "Manifest actionsStrip should be set");
                this.oCacheData.getCacheResponse.restore();
                oSpy.restore();
                oSetManifestSpy.restore();
                done();
            }.bind(this));
        }.bind(this));
    });

    QUnit.test("fetch - Test when data is cached and manifestChanges set as undefined", function (assert) {
        var done = assert.async();
        var oSpy = sinon.spy(this.oHost, "_fetchData");
        var oSetManifestSpy = sinon.spy(this.oCard, "setManifestChanges");
        var oCachedResponse = new Response(JSON.stringify({ data: "cachedData" }), {
            headers: { "Content-Type": "application/json" }
        });
        //already set cache data
        this.oCacheData.setCacheResponse("testCardId", this.sResource, oCachedResponse);
        sinon.stub(this.oCacheData, "getCacheResponse").returns({"testResource": oCachedResponse});
        this.oCard.getManifestChanges = function () {
            return ;
        };

        //check if data is returned from cache
        this.oHost.fetch(this.sResource, this.mOptions, this.mRequestSettings, this.oCard).then(function (data) {
            assert.ok(oSpy.notCalled, "Fetchdata should not be called");
            data.json().then(function (jsonData) {
                assert.ok(oSetManifestSpy.notCalled, "setManifestChanges method should not be called");
                assert.ok(JSON.stringify(jsonData).includes("cachedData"), "Response data should contain 'cachedData'");
                this.oCacheData.getCacheResponse.restore();
                oSpy.restore();
                oSetManifestSpy.restore();
                done();
            }.bind(this));
        }.bind(this));
    });
});