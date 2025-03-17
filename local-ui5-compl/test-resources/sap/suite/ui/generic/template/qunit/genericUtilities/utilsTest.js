sap.ui.define([
	"sap/suite/ui/generic/template/genericUtilities/utils"
],function(Utils) {
	"use strict";
	QUnit.module("genericUtilities.utils.isASubsetOfB");

  [
    {a: null, b: null, result: true},
    {a: null, b: [], result: false},
    {a: [], b: null, result: false},
    {a: [], b: [], result: true},
    {a: [], b: ["aaa"], result: true},
    {a: ["aaa"], b: [], result: false},
    {a: ["bbb"], b: ["aaa"], result: false},
    {a: ["aaa"], b: ["aaa"], result: true},
    {a: ["aaa", "bbb"], b: ["aaa"], result: false},
    {a: ["bbb", "aaa"], b: ["aaa", "bbb"], result: true},
    {a: ["bbb", "aaa"], b: ["aaa", "ccc"], result: false},
    {a: ["bbb"], b: ["aaa", "bbb"], result: true},
    {a: ["bbb", "ccc"], b: ["aaa", "bbb", "ccc"], result: true},
  ].forEach(function(test) {
    QUnit.test(JSON.stringify(test.a) + " contains " + JSON.stringify(test.b) + " is " + test.result, function (assert) {
      assert.ok(Utils.isASubsetOfB(test.a, test.b) === test.result, "expected result received")
    });
  })
});