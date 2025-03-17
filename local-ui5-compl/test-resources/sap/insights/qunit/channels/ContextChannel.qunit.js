/*global QUnit, sinon */
sap.ui.define([
    'sap/insights/channels/ContextChannel'
], function (ContextChannel) {
    "use strict";

    function TestProvider(id) {
        this.getId = function () { return id;};
        this.getContext = function () {
            return Promise.resolve(
                {"app_title":"Product Home","ux.eng.s4producthomes1":{'id': id}});
        };

    }

    var oContextChannel;

    QUnit.module("ContextChannel test cases", {

        beforeEach: async function () {
            this.oSandbox = sinon.sandbox.create();
            this.oStubContainer = sinon.stub(sap.ui, "require");
            this.oStubContainer.returns({
                getServiceAsync: function () {
                    return Promise.resolve({
                        connect: function() {
                            return undefined;
                        },
                        disconnect: function() {
                            return undefined;
                        }
                    });
                }
            });
            oContextChannel = await ContextChannel.getInstance();
        },
        afterEach: function (assert) {
            var done = assert.async();
            this.oSandbox.restore();
            this.oStubContainer.restore();
            oContextChannel.providers.length = 0;
            done();
        }
    });

    QUnit.test("init ", function (assert) {
        var done = assert.async();
        assert.ok(oContextChannel.providers, "ContextChannel is initialised");
        assert.strictEqual(oContextChannel.providers.length, 0, "Providers initialised with length 0");
        done();
    });
    QUnit.test("registerProvider", function (assert) {
        var done = assert.async();
        var oTestProvider = new TestProvider();
        oContextChannel.registerProvider(oTestProvider);
        assert.strictEqual(oContextChannel.providers.length, 1, "Providers length got updated");
        done();
    });

    QUnit.test("unregisterProvider", function (assert) {
        var done = assert.async();
        var oTestProvider1 = new TestProvider("1");
        var oTestProvider2 = new TestProvider("2");

        oContextChannel.registerProvider(oTestProvider1);
        oContextChannel.registerProvider(oTestProvider2);
        //after registering provider check if length increased
        assert.equal(oContextChannel.providers.length, 2, "Providers length is 2");

        oContextChannel.unregisterProvider(oTestProvider1);
        //after unregistering check if length reduced
        assert.equal(oContextChannel.providers.length, 1, "Providers length got updated to 1");
        assert.equal(oContextChannel.providers[0].getId(), "2", "Provider with id 2 is still present");
        done();
    });



    QUnit.test("getContext ", function (assert) {
        var done = assert.async();
        var oTestProvider1 = new TestProvider("1");
        var oTestProvider2 = new TestProvider("2");
        var oContextSpy1 = sinon.spy(oTestProvider1, "getContext");
        var oContextSpy2 = sinon.spy(oTestProvider2, "getContext");
        oContextChannel.registerProvider(oTestProvider1);
        oContextChannel.registerProvider(oTestProvider2);
        //after registering provider check if length increased
        assert.ok(oContextChannel.providers.length, 2, "Providers length is 2");

        oContextChannel.getContext().then(function(oContext){
            assert.ok(oContextSpy2.called, "'getContext' method of last registered provider Provider2 is called");
            assert.ok(oContextSpy1.notCalled, "'getContext' method of  Provider1 is not called");
            assert.deepEqual(oContext,  {"app_title":"Product Home","ux.eng.s4producthomes1":{'id': '2'}}, "Context should be retrieved from the provider 2");
        });

        done();
    });



    QUnit.test("Single Instance Check", function (assert) {
        var done = assert.async();

        var oInstance1, oInstance2;
        ContextChannel.getInstance().then(function (instance) {
            oInstance1 = instance;
            assert.ok(oInstance1, "First instance created");

            ContextChannel.getInstance().then(function (instance2) {
                oInstance2 = instance2;
                assert.strictEqual(oInstance1, oInstance2, "Both instances should be the same");

            });
        }).finally(function(){
            done();
        });
    });

});