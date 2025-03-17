// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @file QUnit tests for ClientSideTargetResolution's StagedLogger.
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ushell/services/ClientSideTargetResolution/StagedLogger"
], function (
    Log,
    _StagedLogger
) {
    "use strict";

    /* global sinon, QUnit */

    var _uuid = 0;

    function getBeginParams () {
        return {
            logId: ++_uuid,
            title: "Grow a tree",
            stages: [
                "STAGE1: Buy seeds",
                "STAGE2: Plant seeds",
                "STAGE3: Water",
                "STAGE4: Wait"
            ],
            moduleName: "the.module.name"
        };
    }

    QUnit.module("InboundIndex", {
        beforeEach: function () {
            // just sanity check container is always destroyed before a test starts...
            var oLogs = _StagedLogger._getLogs();
            if (Object.prototype.toString.apply(oLogs) === "[object Object]" && Object.keys(oLogs).length > 0) {
                throw new Error("Test does not destroy all logs created by the StagedLogger");
            }

            Log.setLevel(Log.Level.DEBUG);
            this.LogDebugSpy = sinon.spy(Log, "debug");
        },
        afterEach: function () {
            this.LogDebugSpy.restore();
        }
    });

    QUnit.test("begin: throws no exceptions", function (assert) {
        _StagedLogger.begin(getBeginParams); // updates _uuid

        assert.strictEqual(Object.prototype.toString.call(_StagedLogger._getLogs()),
            "[object Object]", "creates an internal object");

        // cleanup
        _StagedLogger.end(function () { return { logId: _uuid }; });
    });

    Object.keys(Log.Level)
        .filter(function (sLevel) { return ["DEBUG", "TRACE", "ALL"].indexOf(sLevel) === -1; })
        .forEach(function (sLevel) {
            QUnit.test("begin: ignores call when log level is " + sLevel, function (assert) {
                Log.setLevel(Log.Level[sLevel]);

                _StagedLogger.begin(getBeginParams); // updates _uuid

                assert.deepEqual(_StagedLogger._getLogs(), {}, "does not create any logs");

                // cleanup
                _StagedLogger.end(function () { return { logId: _uuid }; });
            });
        });

    Object.keys(Log.Level)
        .filter(function (sLevel) { return ["DEBUG", "TRACE", "ALL"].indexOf(sLevel) >= 0; })
        .forEach(function (sLevel) {
            QUnit.test("begin: constructs logger when log level is " + sLevel, function (assert) {
                Log.setLevel(Log.Level[sLevel]);

                _StagedLogger.begin(getBeginParams);

                assert.strictEqual(Object.keys(_StagedLogger._getLogs()).length, 1, "creates log entry");

                // cleanup
                _StagedLogger.end(function () { return { logId: _uuid }; });
            });
        });

    QUnit.test("end: destroys logger", function (assert) {
        _StagedLogger.begin(getBeginParams); // updates _uuid

        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(_StagedLogger._getLogs(), {}, "sets internal object to null");
    });

    QUnit.test("end: causes Log.debug to be called", function (assert) {
        _StagedLogger.begin(getBeginParams); // updates _uuid

        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.strictEqual(Log.debug.callCount, 1, "there was one call to Log.debug");

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + _uuid + "] Grow a tree",
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });

    QUnit.test("log: adds logging to the correct stage", function (assert) {
        _StagedLogger.begin(getBeginParams);
        _StagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 2,
                line: "Hello"
            };
        });
        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + _uuid + "] Grow a tree",
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "Hello",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });

    QUnit.test("log: adds logging with prefix to the correct stage", function (assert) {
        _StagedLogger.begin(getBeginParams);
        _StagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 3,
                line: "Hello",
                prefix: "-"
            };
        });
        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + _uuid + "] Grow a tree",
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "",
                "STAGE3: Water",
                "-------------",
                "- Hello",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });

    QUnit.test("log: adds logging of multiple lines to the correct stage", function (assert) {
        _StagedLogger.begin(getBeginParams);
        _StagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 4,
                lines: [
                    "Line 1",
                    "Line 2",
                    "Line 3",
                    "Line 4"
                ]
            };
        });
        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + _uuid + "] Grow a tree",
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------",
                "Line 1",
                "Line 2",
                "Line 3",
                "Line 4"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });

    QUnit.test("log: adds logging of multiple lines with prefix to the correct stage", function (assert) {
        _StagedLogger.begin(getBeginParams);
        _StagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 1,
                prefix: "-",
                lines: [
                    "Line 1",
                    "Line 2",
                    "Line 3",
                    "Line 4"
                ]
            };
        });
        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + _uuid + "] Grow a tree",
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "- Line 1",
                "- Line 2",
                "- Line 3",
                "- Line 4",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });

    QUnit.test("log: numbers up and combines lines with prefix", function (assert) {
        _StagedLogger.begin(getBeginParams);
        _StagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 1,
                prefix: ".",
                number: true,
                lines: [
                    "Line 1",
                    "Line 2",
                    "Line 3",
                    "Line 4"
                ]
            };
        });
        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + _uuid + "] Grow a tree",
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "1. Line 1",
                "2. Line 2",
                "3. Line 3",
                "4. Line 4",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });

    QUnit.test("log: adds logging correctly when 'line', 'lines' and 'prefix' are given", function (assert) {
        _StagedLogger.begin(getBeginParams);
        _StagedLogger.log(function () {
            return {
                logId: _uuid,
                stage: 1,
                prefix: "-",
                line: "Some log line",
                lines: [
                    "Line 1",
                    "Line 2",
                    "Line 3",
                    "Line 4"
                ]
            };
        });
        _StagedLogger.end(function () { return { logId: _uuid }; });

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + _uuid + "] Grow a tree",
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "Some log line",
                " - Line 1",
                " - Line 2",
                " - Line 3",
                " - Line 4",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });

    QUnit.test("log: multiple logs at the same time", function (assert) {
        var iLog1Id,
            iLog2Id;

        _StagedLogger.begin(getBeginParams);
        iLog1Id = _uuid;

        _StagedLogger.begin(getBeginParams);
        iLog2Id = _uuid;

        _StagedLogger.log(function () {
            return {
                logId: iLog1Id,
                stage: 1,
                prefix: "-",
                line: "First log",
                lines: [
                    "Line 1",
                    "Line 2"
                ]
            };
        });

        _StagedLogger.log(function () {
            return {
                logId: iLog2Id,
                stage: 2,
                prefix: "-",
                line: "Second log",
                lines: [
                    "Line 3",
                    "Line 4"
                ]
            };
        });
        _StagedLogger.end(function () { return { logId: iLog2Id }; }); // log 2 ends first
        _StagedLogger.end(function () { return { logId: iLog1Id }; });

        assert.deepEqual(Log.debug.getCall(0).args, [
            "[REPORT #" + iLog2Id + "] Grow a tree", // log 2 is logged first
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "Second log",
                " - Line 3",
                " - Line 4",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");

        assert.deepEqual(Log.debug.getCall(1).args, [
            "[REPORT #" + iLog1Id + "] Grow a tree", // log 2 is logged first
            "\n" + [
                "STAGE1: Buy seeds",
                "-----------------",
                "First log",
                " - Line 1",
                " - Line 2",
                "",
                "STAGE2: Plant seeds",
                "-------------------",
                "",
                "STAGE3: Water",
                "-------------",
                "",
                "STAGE4: Wait",
                "------------"
            ].join("\n") + "\n",
            "the.module.name"
        ], "logged the expected message");
    });
});
