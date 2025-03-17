/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

        (c) Copyright 2009-2015 SAP SE. All rights reserved
    
 */

/**
 * Provides utility methods to analyze sinon spies.
 * Typical usage would be to set up sinon spies for constructor and dispose  methods of threejs geometries and materials
 * before the start of relavant parts of your test, and then analyze the calls after destruction of relavant objects/controls
 * of your test.
 * Analysis can be strict, in which case more detailed information about each object created is output. For eg a material may
 * be disposed more than once.
 * In non-strict mode we simply check that every object created was disposed at least once
 */
sap.ui.define([], function() {
    "use strict";

    var ThreeJSUtils = {};

    /**
     * Because there are quite a few instances of objects created in threejs and never disposed,
     * this function checks if an object was created in threejs by analyzing the call stack
     * of the create call.
     * @param {string} objType name of the object's class
     * @param {Array} callStack sinon's call stack for the create object call
     * @returns {boolean} true if object was created by threejs
     */
    ThreeJSUtils._checkIfCreatedInThree = function(objType, callStack) {
        if (!callStack) {
            return false;
        }

        var stackTrace = callStack.split("\n");
        var pattern = objType + ".*?three\.js";
        var regExp = RegExp(pattern);
        var stackLength = stackTrace.length;
        for (var x = 0; x < stackLength; x++) {
            if (regExp.test(stackTrace[x])) {
                // Because all threejs classes are function prototypes the new typeXX() will
                // always occur in three.js
                // We check the next line to see where the object was actually constructed
                if (x + 1 < stackLength) {
                    if (stackTrace[x + 1].indexOf("three.js") !== -1) {
                        return true;
                    }
                }
            }
        }
        return false;
    };

    /**
     *
     * @param {sinon.spy} createSpy the sinon spy for constructor of a class
     * @param {sinon.spy} disposeSpy the sinon spy for the dispose method of a class
     * @returns {Map} A map containing the object as key and array of create and dispose call stacks as value
     */
    ThreeJSUtils.createCallInfo = function(createSpy, disposeSpy) {
        var objectMap = new Map();

        for (var x = 0; x < createSpy.callCount; x++) {
            if (objectMap.has(createSpy.getCall(x).args[0])) {
                objectMap.get(createSpy.getCall(x).args[0]).created.push(
                    {
                        stack: createSpy.getCall(x).errorWithCallStack.stack
                    }
                );
            } else {
                objectMap.set(createSpy.getCall(x).args[0], {
                    created: [
                        {
                            stack: createSpy.getCall(x).errorWithCallStack.stack
                        }
                    ],
                    disposed: []
                });
            }
        }

        for (var y = 0; y < disposeSpy.callCount; y++) {
            if (objectMap.has(disposeSpy.getCall(y).thisValue)) {
                var theObject = objectMap.get(disposeSpy.getCall(y).thisValue);
                theObject.disposed.push({
                    stack: disposeSpy.getCall(y).errorWithCallStack.stack
                });
            } else {
                objectMap.set(disposeSpy.getCall(y).thisValue, {
                    created: [],
                    disposed: [
                        {
                            stack: disposeSpy.getCall(y).errorWithCallStack.stack
                        }
                    ]
                });
            }
        }

        return objectMap;
    };

    /**
     *
     * @param {string} baseName the object being tracked e.g. Material/BufferGeometry
     * @param {Map} callInfo the object map created by the createCallInfo method
     * @param {QUnit.assert} assert used to write out QUnit report
     * @param {boolean} isStrict if true analyzes call in more detail
     */
    ThreeJSUtils.analyzeCallInfo = function(baseName, callInfo, assert, isStrict) {
        if (!isStrict) {
            // remove all entries that have at least one dispose
            callInfo.forEach(function(value, key) {
                if (value.disposed.length > 0) {
                    callInfo.delete(key);
                }
            });

            if (callInfo.size === 0) {
                assert.ok(true, "All " + baseName + " that were created are disposed.");
                return;
            }
        }

        callInfo.forEach(function(value, key) {
            var disposeStacks = "Dispose Stacks:\n";
            if (value.created.length === 0) {
                // Unfortunately sinon cannot spy on constructors, but we can spy on classes that inherit
                // from BufferGeometry (which for the large part are what our code uses).
                // So ignore BufferGeometry
                if (key.type !== "BufferGeometry") {
                    value.disposed.forEach(function(dc) {
                        disposeStacks += "\t" + dc.stack + "\n";
                    });
                    assert.ok(false, key.type + " with UUID " + key.uuid + " was disposed " + value.disposed.length +
                        " times but constructor was never called.\n" + "Disposed: " + disposeStacks);
                }
            } else {
                var disposedCount = value.disposed.length;
                if (disposedCount === 0 && !ThreeJSUtils._checkIfCreatedInThree(key.constructor.name, value.created[0].stack)) {
                    assert.ok(false, key.type + " with UUID " + key.uuid + " was constructed but never disposed. Created by:\n" + value.created[0].stack);
                } else if (disposedCount > 1) {
                    value.disposed.forEach(function(dc) {
                        disposeStacks += "\t" + dc.stack + "\n";
                    });
                    assert.ok(false, key.type + " with UUID " + key.uuid + " was constructed but disposed " + value.disposed.length + " times.\n"
                        + "Created by:\n" + value.created[0].stack + "\n"
                        + "Disposed: " + disposeStacks);
                } else if (disposedCount === 1) {
                    assert.ok(true, key.type + " with UUID " + key.uuid + " was disposed correctly.");
                }
            }
        });
    };

    return ThreeJSUtils;
});
