// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileoverview QUnit tests for sap.ushell.adapters.cep.UITracer
 */

sap.ui.define([
    "sap/ushell/EventHub",
    "sap/ushell/Config",
    "sap/ui/Device"
], function (
    EventHub,
    Config,
    Device
) {
    "use strict";
    /* global QUnit, sinon */

    const sandbox = sinon.sandbox.create();
    let sSiteName;
    const fnOriginalRequire = sap.ui.require;

    // sinon.stub by intention: This stub needs to survive the whole test, no restore allowed!
    sinon.stub(sap.ui, "require").callsFake((vModules, fnCallback) => {
        if (vModules === "sap/ushell/Container") {
            return {
                getFLPPlatform: function () {
                    return Promise.resolve(sSiteName === "sap-start" ? "MYHOME" : "");
                },
                getServiceAsync: function () {
                    return Promise.resolve({
                        getApplications: function () {
                            if (sSiteName === "wz-advancedhr") {
                                return Promise.resolve({
                                    SFHost: sSiteName === "wz-advancedhr",
                                    WorkzoneHome: sSiteName === "wz-advancedhr"
                                });
                            }
                            return Promise.resolve({
                                WorkzoneHome: sSiteName === "wz-advanced"
                            });
                        }
                    });
                }
            };
        }
        return fnOriginalRequire(vModules, fnCallback);
    });


    sap.ui.require([
        "sap/ushell/services/UITracer"
    ], function (
        UITracer
    ) {
        QUnit.module("init", {
            beforeEach: function (assert) {
                EventHub._reset();
                this.spy = {};
                for (var n in UITracer.prototype) {
                    if (n.indexOf("_") === 0) {
                        this.spy[n] = sandbox.spy(UITracer.prototype, n);
                    }
                }
            },
            afterEach: function (assert) {
                sandbox.restore();
            }
        });

        QUnit.test("constructor, no config", function (assert) {
            // Arrange
            this.oService = new UITracer({}, {}, {});
            // Act
            assert.ok(this.spy._resetTrace.calledOnce, "_resetTrace called once");
            assert.ok(this.spy._attachBrowserEvents.calledOnce, "_attachBrowserEvents called once");
            assert.ok(this.spy._attachEventHubEvents.calledOnce, "_attachEventHubEvents called once");
            assert.equal(this.oService._sServiceUrl, "/bff/ui-trace/v1/trace", "_sServiceUrl is /bff/ui-trace/v1/trace");
            assert.equal(this.oService._aTrace.length, 0, "current trace is empty");
        });

        QUnit.test("constructor, config - serviceUrl", function (assert) {
            // Arrange
            this.oService = new UITracer({}, {}, { serviceUrl: "/my_url" });
            // Act
            assert.ok(this.spy._resetTrace.calledOnce, "_resetTrace called once");
            assert.ok(this.spy._attachBrowserEvents.calledOnce, "_attachBrowserEvents called once");
            assert.ok(this.spy._attachEventHubEvents.calledOnce, "_attachEventHubEvents called once");
            assert.equal(this.oService._sServiceUrl, "/my_url", "_sServiceUrl is /my_url");
            assert.equal(this.oService._aTrace.length, 0, "current trace is empty");
        });

        QUnit.module("trace", {
            beforeEach: function (assert) {
                EventHub._reset();
                this.spy = {};
                for (var n in UITracer.prototype) {
                    if (n.indexOf("_") === 0) {
                        this.spy[n] = sandbox.spy(UITracer.prototype, n);
                    }
                }
                this.oService = new UITracer({}, {}, {});
                this.oService._getToken = function () {
                    this._sToken = "12345678912aabbcc";
                };
            },
            afterEach: function (assert) {
                sandbox.restore();
            }
        });

        QUnit.test("no trace if not an object", function (assert) {
            var done = assert.async();
            // Arrange
            this.oService.trace(["test"]);
            this.oService.trace("test");
            this.oService.trace(123);
            this.oService.trace(new Date());
            this.oService.trace(this);
            this.oService.trace({});
            // Act
            assert.equal(this.oService._aTrace.length, 0, "No trace entries");
            assert.equal(this.oService._iSize, 2, "Size is still initial");
            done();
        });

        QUnit.test("trace simple js object", function (assert) {
            var done = assert.async();
            // Arrange
            var iSize = this.oService._iSize;
            var oEntry = { x: 1 };
            this.oService.trace(oEntry);
            var oAdapterEntry = this.oService._aTrace[0];

            // Act
            assert.equal(iSize, 2, "Initially the size is 2");
            assert.notEqual(oEntry, oAdapterEntry, "Entry within the trace is a clone");
            assert.ok(
                new Date(oAdapterEntry._ts) instanceof Date,
                "First trace entry has timestamp");
            assert.equal(oAdapterEntry.x, 1, "Entry within the trace contains object");
            assert.ok(oEntry._ts === undefined, "Original entry has no timestamp");
            assert.ok(this.spy._addEntry.calledOnce, "_addTrace called once");
            assert.ok(this.spy._getBlob.calledOnce, "_getBlob called once");
            assert.equal(this.oService._iSize, 129, "After the size is 129, timestamp is content");
            assert.ok(this.oService._iSize >= this.oService._getBlob(this.oService._aTrace).size, "Trace size is bigger or equal the blob size off the trace array");
            done();
        });

        QUnit.test("trace simple js object twice", function (assert) {
            var done = assert.async();
            // Arrange
            var iSize = this.oService._iSize;
            var oEntry1 = { x: 1 };
            var oEntry2 = { x: 2 };
            this.oService.trace(oEntry1);
            this.oService.trace(oEntry2);
            // Act
            assert.equal(iSize, 2, "Initially the size is 2");
            assert.ok(this.spy._addEntry.calledTwice, "_addTrace called twice");
            assert.ok(this.spy._getBlob.calledTwice, "_getBlob called twice");
            assert.equal(this.oService._iSize, 256, "After the size is 256");
            assert.ok(this.oService._iSize >= this.oService._getBlob(this.oService._aTrace).size, "Trace size is bigger or equal the blob size off the trace array");
            done();
        });


        QUnit.test("trace to size limit and check send", function (assert) {
            var done = assert.async();
            // Arrange
            var oEntry = { x: 1000 };
            for (var i = 0; i < 400; i++) {
                this.oService.trace(oEntry);
            }
            // Act
            assert.ok(this.spy._sendTrace.calledOnce, "_sendTrace called once");
            assert.equal(this.oService._iSize, 19242, "After the size is 19242");
            assert.equal(this.oService._aTrace.length, 148, "Only 148 trace entries");
            setTimeout(function () {
                // test of requests via performance API is fragile in maven
                try {
                    var oBeaconRequest = performance.getEntriesByType("resource").filter(function (o) {
                        return o && o.name && o.name.indexOf(this.oService._sServiceUrl) > 0;
                    }.bind(this)).pop();
                    var oUrl = new URL(oBeaconRequest.name);
                    assert.ok(oBeaconRequest.initiatorType === "beacon" || oBeaconRequest.initiatorType === "other", "Beacon request was sent");
                    assert.equal(oUrl.pathname, this.oService._sServiceUrl, "Path to service correct");
                    done();
                } catch (ex) {
                    done();
                }
            }.bind(this), 100);
        });

        QUnit.test("trace empty, no beacon sent", function (assert) {
            var done = assert.async();
            // Arrange
            this.oService._sendTrace();
            this.oService._sServiceUrl = "/testNotSent";
            // Act
            assert.ok(this.spy._sendTrace.calledOnce, "_sendTrace called once");
            setTimeout(function () {
                // test of requests via performance API is fragile in maven
                try {
                    var aBeaconRequest = performance.getEntriesByType("resource").filter(function (o) {
                        return o && o.name && o.name.endsWith("/testNotSent");
                    });
                    assert.equal(aBeaconRequest.length, 0, "No beacon request for empty trace");
                    done();
                } catch (ex) {
                    done();
                }
            }, 100);
        });

        QUnit.module("onvisibilitychange simulation", {
            beforeEach: function (assert) {
                EventHub._reset();
                this.spy = {};
                for (var n in UITracer.prototype) {
                    if (n.indexOf("_") === 0) {
                        this.spy[n] = sandbox.spy(UITracer.prototype, n);
                    }
                }

                this.oService = new UITracer({}, {}, {});
                this.oService._getToken = function () {
                    this._sToken = "12345678912aabbcc";
                };
            },
            afterEach: function (assert) {
                sandbox.restore();
            }
        });

        QUnit.test("trace and send with visibilitychange", function (assert) {
            var done = assert.async();
            // Arrange
            var oEntry = { x: 1 };
            this.oService.trace(oEntry);
            var fnBeacon = sandbox.spy(navigator, "sendBeacon");
            sandbox.stub(document, "visibilityState").value("hidden");
            var oEvent = new Event("visibilitychange");
            document.dispatchEvent(oEvent);
            // Act
            setTimeout(function () {
                // currently the visibility change is fired more than once in the example due to override of visibilitystate property.
                assert.ok(this.spy._sendTrace.called, "_sendTrace called");
                assert.ok(fnBeacon.called, "Beacon was send");
                done();
            }.bind(this), 100);
        });

        // QUnit.module("onbeforeunload simulation", {
        //     beforeEach: function (assert) {
        //         EventHub._reset();
        //         this.spy = {};
        //         for (var n in UITracer.prototype) {
        //             if (n.indexOf("_") === 0) {
        //                 this.spy[n] = sandbox.spy(UITracer.prototype, n);
        //             }
        //         }
        //         sandbox.stub(document, "visibilityState").value("");
        //         this.oService = new UITracer({}, {}, {});
        //     },
        //     afterEach: function (assert) {
        //         sandbox.restore();
        //     }
        // });

        // QUnit.test("trace and send with onbeforeunload", function (assert) {
        //     var done = assert.async();
        //     // Arrange
        //     var oEntry = {x: 1};
        //     for (var i = 0; i < 10; i++) {
        //         this.oService.trace(oEntry);
        //     }
        //     var oEvent = new Event("beforeunload");
        //     window.dispatchEvent(oEvent);
        //     // Act
        //     setTimeout(function () {
        //         assert.ok(this.spy._sendTrace.calledOnce, "_sendTrace called");
        //         done();
        //     }.bind(this), 100);
        // });

        QUnit.module("eventHub UITracerService.trace", {
            beforeEach: function (assert) {
                EventHub._reset();
                this.spy = {};
                for (var n in UITracer.prototype) {
                    if (n.indexOf("_") === 0) {
                        this.spy[n] = sandbox.spy(UITracer.prototype, n);
                    }
                }
                this.oService = new UITracer({}, {}, {});
                this.oService._getToken = function () {
                    this._sToken = "12345678912aabbcc";
                };
            },
            afterEach: function (assert) {
                sandbox.restore();
            }
        });

        QUnit.test("trace via EventHub", function (assert) {
            var done = assert.async();
            // Arrange
            EventHub.emit("UITracer.trace", { x: 1 });
            setTimeout(function () {
                EventHub.emit("UITracer.trace", { x: 2 });
            }, 10);
            setTimeout(function () {
                EventHub.emit("UITracer.trace", { x: 3 });
            }, 20);
            // Act
            setTimeout(function () {
                assert.ok(this.spy._sendTrace.notCalled, "_sendTrace called");
                assert.ok(this.spy._addEntry.callCount === 3, "_addEntry called 3 times");
                done();
            }.bind(this), 50);
        });

        QUnit.test("trace via EventHub and send", function (assert) {
            var done = assert.async();
            // Arrange
            this.oService._sServiceUrl = "/eventHubSent";
            for (var i = 0; i < 400; i++) {
                setTimeout(function () {
                    EventHub.emit("UITracer.trace", { x: (Math.random() + 1).toString(36).substring(1) });
                }, i);
            }
            // Act
            setTimeout(function () {
                assert.ok(this.spy._sendTrace.calledOnce, "_sendTrace called");
                assert.ok(this.spy._addEntry.callCount === 400, "_addEntry called 400 times");
                assert.ok(this.oService._aTrace.length < 180, "Current trace contains more than 180 entries");
                var aBeaconRequest = performance.getEntriesByType("resource").filter(function (o) {
                    return o.name.endsWith("/eventHubSent");
                });
                assert.equal(aBeaconRequest.length, 1, "Two requests for /eventHubSent beacon");
                done();
            }.bind(this), 1100);
        });

        QUnit.module("additional Site and Device settings", {
            beforeEach: function (assert) {
                EventHub._reset();
                this.createServiceWith = function (bSpaces, sSiteId, sDevice, sSite) {
                    sSiteName = sSite;
                    Config.last = function (sPath) {
                        if (sPath === "/core/spaces/enabled") {
                            return bSpaces;
                        } else if (sPath === "/core/site/siteId") {
                            return sSiteId;
                        }
                    };
                    Device.system = {};
                    Device.system[sDevice] = true;
                    this.oService = new UITracer({}, {}, {});
                    this.oService._getToken = function () {
                        this._sToken = "12345678912aabbcc";
                    };
                };
            },
            afterEach: function (assert) {
                sap.ushell.Container = null;
                sandbox.restore();
            }
        });

        QUnit.test("device system desktop", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(true, "site123", "desktop", "sap-start");
            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].data.deviceType, "browser-desktop", "Device type is browser-desktop");
                done();
            }.bind(this), 1);
        });

        QUnit.test("device system tablet", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(true, "site123", "tablet", "sap-start");
            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].data.deviceType, "browser-tablet", "Device type is browser-tablet");
                done();
            }.bind(this), 1);
        });

        QUnit.test("device system phone", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(true, "site123", "phone", "sap-start");
            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].data.deviceType, "browser-phone", "Device type is browser-phone");
                done();
            }.bind(this), 1);
        });

        QUnit.test("sap-start site type, spaces", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(true, "site123", "desktop", "sap-start");
            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.siteType, "sap-start-spaces", "Site type is sap-start-spaces");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is site123");
                done();
            }.bind(this), 1);
        });

        QUnit.test("sap-start site type, groups", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(false, "site123", "desktop", "sap-start");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1,
                        targetUrl: "#something"
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.targetUrl, "#something", "data targetUrl #something");
                assert.equal(aTrace[0].data.siteType, "sap-start-groups", "Site type is sap-start-groups");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is site123");

                this.oService._sendTrace();

                //not sent as last entry is still LaunchApp
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.targetUrl, "#something", "data targetUrl #something");
                assert.equal(aTrace[0].data.siteType, "sap-start-groups", "Site type is sap-start-groups");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is site123");

                oEntry = {
                    source: "Intent",
                    reason: "NavigateApp",
                    data: {
                        x: 1,
                        targetUrl: "#something"
                    }
                };
                this.oService.trace(oEntry);
                //not sent as last entry is LaunchApp
                assert.equal(aTrace[1].source, "Intent", "source Intent");
                assert.equal(aTrace[1].reason, "NavigateApp", "reason NavigateApp");

                this.oService._sendTrace();

                assert.equal(this.oService._aTrace.length, 0, "all sent");

                done();
            }.bind(this), 1);
        });

        QUnit.test("wz-standard site type, spaces", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(true, "site123", "desktop", "wz-standard");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.siteType, "wz-standard-spaces", "Site type is wz-standard-spaces");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is site123");
                done();
            }.bind(this), 1);
        });

        QUnit.test("wz-standard site type, groups", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(false, "site123", "desktop", "wz-standard");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.siteType, "wz-standard-groups", "Site type is wz-standard-groups");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is site123");
                done();
            }.bind(this), 1);
        });

        QUnit.test("wz-advanced site type, spaces", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(true, "site123", "desktop", "wz-advanced");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.siteType, "wz-advanced-spaces", "Site type is wz-advanced-spaces");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is ste123");
                done();
            }.bind(this), 1);
        });

        QUnit.test("wz-advanced site type, groups", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(false, "site123", "desktop", "wz-advanced");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.siteType, "wz-advanced-groups", "Site type is wz-advanced-groups");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is site123");
                done();
            }.bind(this), 1);
        });

        QUnit.test("wz-advancedhr site type, spaces", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(true, "site123", "desktop", "wz-advancedhr");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.siteType, "wz-advancedhr-spaces", "Site type is wz-advancedhr-spaces");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is ste123");
                done();
            }.bind(this), 1);
        });

        QUnit.test("wz-advancedhr site type, groups", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(false, "site123", "desktop", "wz-advancedhr");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        x: 1
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.x, 1, "data x 1");
                assert.equal(aTrace[0].data.siteType, "wz-advancedhr-groups", "Site type is wz-advancedhr-groups");
                assert.equal(aTrace[0].data.siteId, "site123", "Site id is site123");
                done();
            }.bind(this), 1);
        });

        QUnit.module("send checks with LaunchApp", {
            beforeEach: function (assert) {
                this.createServiceWith = function (bSpaces, sSiteId, sDevice, sSite) {
                    sSiteName = sSite;
                    Config.last = function (sPath) {
                        if (sPath === "/core/spaces/enabled") {
                            return bSpaces;
                        } else if (sPath === "/core/site/siteId") {
                            return sSiteId;
                        }
                    };
                    Device.system = {};
                    Device.system[sDevice] = true;

                    this.oService = new UITracer({}, {}, {});
                    this.oService._getToken = function () {
                        this._sToken = "12345678912aabbcc";
                    };

                };
            },
            afterEach: function (assert) {
                sap.ushell.Container = null;
                sandbox.restore();
            }
        });

        QUnit.test("avoid send of AppLaunch entry data.targetUrl===#", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(false, "site123", "desktop", "sap-start");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        targetUrl: "#something"
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.targetUrl, "#something", "data targetUrl #something");

                this.oService._sendTrace();

                //not sent as last entry is LaunchApp
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.targetUrl, "#something", "data targetUrl #something");

                oEntry = {
                    source: "Intent",
                    reason: "NavigateApp",
                    data: {
                        targetUrl: "https://something"
                    }
                };
                this.oService.trace(oEntry);
                //not sent as last entry is LaunchApp
                assert.equal(aTrace[1].source, "Intent", "source Intent");
                assert.equal(aTrace[1].reason, "NavigateApp", "reason NavigateApp");
                assert.equal(aTrace[1].data.targetUrl, "https://something", "data targetUrl https://something");

                this.oService._sendTrace();

                assert.equal(this.oService._aTrace.length, 0, "all sent");

                done();
            }.bind(this), 1);
        });

        QUnit.test("send of AppLaunch entry for data.targetUrl!=#", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(false, "site123", "desktop", "sap-start");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        targetUrl: "https://something"
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.targetUrl, "https://something", "data targetUrlhttps://something");

                this.oService._sendTrace();

                assert.equal(this.oService._aTrace.length, 0, "all sent");

                done();
            }.bind(this), 1);
        });


        QUnit.module("no valid token", {
            beforeEach: function (assert) {
                this.createServiceWith = function (bSpaces, sSiteId, sDevice, sSite) {
                    sSiteName = sSite;
                    Config.last = function (sPath) {
                        if (sPath === "/core/spaces/enabled") {
                            return bSpaces;
                        } else if (sPath === "/core/site/siteId") {
                            return sSiteId;
                        }
                    };
                    Device.system = {};
                    Device.system[sDevice] = true;
                    this.oService = new UITracer({}, {}, {});

                };
            },
            afterEach: function (assert) {
                sandbox.restore();
            }
        });

        QUnit.test("send of AppLaunch entry for data.targetUrl!=# no initial valid token", function (assert) {
            var done = assert.async();
            // Arrange
            this.createServiceWith(false, "site123", "desktop", "sap-start");

            setTimeout(function () {
                var oEntry = {
                    source: "Tile",
                    reason: "LaunchApp",
                    data: {
                        targetUrl: "https://something"
                    }
                };
                this.oService.trace(oEntry);
                // Act
                var aTrace = this.oService._aTrace;
                assert.equal(aTrace.length, 1, "One entry in trace");
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.targetUrl, "https://something", "data targetUrl https://something");

                this.oService._sendTrace();

                oEntry = {
                    source: "Intent",
                    reason: "NavigateApp",
                    data: {
                        x: 1,
                        targetUrl: "#something"
                    }
                };
                this.oService.trace(oEntry);

                //not sent as last entry is LaunchApp
                assert.equal(aTrace[0].source, "Tile", "source Tile");
                assert.equal(aTrace[0].reason, "LaunchApp", "reason LaunchApp");
                assert.equal(aTrace[0].data.targetUrl, "https://something", "data targetUrl https://something");
                assert.equal(aTrace[1].source, "Intent", "source Intent");
                assert.equal(aTrace[1].reason, "NavigateApp", "reason NavigateApp");

                this.oService._sendTrace();

                this.oService._sToken = "12345678912aabbcc";

                this.oService._sendTrace();

                assert.equal(this.oService._aTrace.length, 0, "all sent");

                done();
            }.bind(this), 1);
        });
    });

});
