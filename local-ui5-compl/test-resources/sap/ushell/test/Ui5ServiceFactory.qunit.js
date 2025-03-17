// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview QUnit tests for sap.ushell.services.UI5ServiceFactory
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/core/service/ServiceFactory",
    "sap/ui/core/service/ServiceFactoryRegistry",
    "sap/ui/core/UIComponent",
    "sap/ushell/Ui5ServiceFactory",
    "sap/ushell/Container"
], function (
    Log,
    ServiceFactory,
    ServiceFactoryRegistry,
    UIComponent,
    oUshellServiceFactory,
    Container
) {
    "use strict";

    /* global sinon QUnit */

    var sandbox = sinon.createSandbox({});

    QUnit.module("sap.ushell.Ui5ServiceFactory", {
        before: function () {
            return Container.init("local");
        },
        beforeEach: function () {
            sandbox.stub(Container, "getServiceAsync");
            sandbox.stub(ServiceFactoryRegistry, "register");
            sandbox.stub(Log, "error");
            sandbox.stub(Log, "warning");
        },
        afterEach: function () {
            sandbox.restore();
        }
    });

    QUnit.test("#createServiceFactory: creates a registerable service factory", function (assert) {
        // Act
        var oServiceFactory = oUshellServiceFactory.createServiceFactory("MY_SERVICE");

        // Assert
        assert.ok(oServiceFactory instanceof ServiceFactory,
            "the returned service factory is an instance of sap.ui.core.service.ServiceFactory");
    });

    [{
        testDescription: "correct propagation of public methods to public interface (undefined scope)",
        oFakeUshellService: {
            publicMethod: function () { return this; } // NOTE: context returned
        },
        testResolve: function (assert, oServiceInstance) {
            // Assert
            assert.ok(oServiceInstance.hasOwnProperty("publicMethod"),
                "public service is initialized with the expected public method as owned property");

            assert.strictEqual(
                oServiceInstance.publicMethod.call(null),
                this.oFakeUshellService,
                "public method is bound to the ushell service instance");
        },
        expectResolve: true
    }, {
        testDescription: "correct propagation of public methods to public interface (valid component scope)",
        oFakeUshellService: {
            publicMethod: function () { return this; } // NOTE: context returned
        },
        oScope: {
            scopeObject: new UIComponent(),
            scopeType: "component"
        },
        testResolve: function (assert, oServiceInstance) {
            // Assert
            assert.ok(oServiceInstance.hasOwnProperty("publicMethod"),
                "public service is initialized with the expected public method as owned property");

            assert.strictEqual(
                oServiceInstance.publicMethod.call(null),
                this.oFakeUshellService,
                "public method is bound to the ushell service instance");
        },
        expectResolve: true
    }, {
        testDescription: "calls sap.ushell.Container.getService to obtain the Unified Shell service",
        oFakeUshellService: {},
        expectResolve: true,
        oScope: undefined,
        testResolve: function (assert) {
            // Assert
            assert.strictEqual(Container.getServiceAsync.callCount, 1,
                "sap.ushell.Container.getServiceAsync was called 1 time");

            assert.deepEqual(Container.getServiceAsync.getCall(0).args, [
                "MY_SERVICE"
            ], "sap.ushell.Container.getServiceAsync was called with the expected arguments");
        }
    }, {
        testDescription: "call made with invalid (string) scope",
        oFakeUshellService: {},
        oScope: "INVALID SCOPE OBJECT",

        expectResolve: false,
        expectErrorLogged: true,
        expectErrorRejectWith: "Invalid Context for MY_SERVICE service",
        expectErrorLogWith: [
            "Invalid context for MY_SERVICE service interface",
            "The context must be empty or an object like { scopeType: ..., scopeObject: ... }",
            "sap.ushell.Ui5ServiceFactory"
        ]
    }, {
        testDescription: "call made with invalid ({}) scope",
        oFakeUshellService: {},
        oScope: {},

        expectResolve: false,
        expectErrorLogged: true,
        expectErrorRejectWith: "Invalid Context for MY_SERVICE service",
        expectErrorLogWith: [
            "Invalid context for MY_SERVICE service interface",
            "The context must be empty or an object like { scopeType: ..., scopeObject: ... }",
            "sap.ushell.Ui5ServiceFactory"
        ]
    }, {
        testDescription: "public members shallow propagation to public service",
        oFakeUshellService: {
            publicMember: { some: "content" }
        },
        testResolve: function (assert, oServiceInstance) {
            assert.strictEqual(
                oServiceInstance.publicMember,
                this.oFakeUshellService.publicMember,
                "public member is shallowly propagated"
            );
        },
        expectResolve: true
    }, {
        testDescription: "private members or methods non-propagation to public service",
        oFakeUshellService: {
            _privateMember: { some: "content" },
            _privateFunction: function () { }
        },
        expectResolve: true,
        testResolve: function (assert, oServiceInstance) {
            assert.strictEqual(
                oServiceInstance._privateMember,
                undefined, // not propagated
                "_privateMember was not propagated"
            );

            assert.strictEqual(
                oServiceInstance._privateFunction,
                undefined, // not propagated
                "_privateFunction was not propagated"
            );
        }
    }].forEach(function (oFixture) {
        QUnit.test("#createInstance: " + oFixture.testDescription, function (assert) {
            var oServiceFactory;

            var fnDone = assert.async();

            // Arrange
            Container.getServiceAsync.withArgs("MY_SERVICE").returns(Promise.resolve(oFixture.oFakeUshellService));

            oServiceFactory = oUshellServiceFactory.createServiceFactory("MY_SERVICE");

            // Act
            oServiceFactory.createInstance(oFixture.oScope).then(function (oService) {
                assert.ok(oFixture.expectResolve, oFixture.expectResolve ? "promise was resolved" : "promise was rejected");

                if (oFixture.testResolve) {
                    oFixture.testResolve(assert, oService.getInterface());
                }
            }, function (oError) {
                assert.ok(!oFixture.expectResolve,
                    !oFixture.expectResolve
                        ? "promise was rejected"
                        : "promise was resolved"
                );

                if (oFixture.hasOwnProperty("expectErrorLogged")) {
                    assert.deepEqual(Log.error.callCount, 1,
                        "Log.error was called 1 time");

                    assert.deepEqual(
                        Log.error.getCall(0).args,
                        oFixture.expectErrorLogWith,
                        "error was logged as expected"
                    );
                } else {
                    assert.deepEqual(Log.error.callCount, 0,
                        "Log.error was called 0 times");
                }

                if (oFixture.hasOwnProperty("expectErrorRejectWith")) {
                    assert.deepEqual(oError, oFixture.expectErrorRejectWith,
                        "promise was rejected with the expected error message");
                }
            }).then(fnDone);
        });
    });
});
