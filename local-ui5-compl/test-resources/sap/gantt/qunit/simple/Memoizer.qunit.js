/*global QUnit */
sap.ui.define([ "sap/gantt/misc/Memoizer"
], function (Memoizer) {
    "use strict";

	QUnit.module("Memoizing Object", {
		before: function () {
            this.cacheMap = Memoizer.createCache(100);
		},
		after: function () {
            this.cacheMap = null;
		}
	});

    QUnit.test("Cache functions", function(assert) {
        var aInput = [2,100];
        this.cacheMap.add(aInput,20);
        assert.equal(this.cacheMap.values.length,1,"values is added in cache");
        assert.equal(this.cacheMap.keyStore[0][0],2,"aInput key is set correctly");
        assert.equal(this.cacheMap.keyStore[0][1],100,"aInput key is set correctly");
        assert.equal(this.cacheMap.values[0],20,"aInput value is set correctly");

        var aInput1 = [2,200];
        this.cacheMap.add(aInput1,30);
        var aInput2 = [2,300];
        this.cacheMap.add(aInput1,30);
        this.cacheMap.add(aInput2,40);
        var values = this.cacheMap.getValue(2,200);
        assert.equal(values,30,"correct value retrieved");
        assert.equal(this.cacheMap.values[0],30,"last retrieved value should move to top of cache");
        assert.equal(this.cacheMap.getIndex(aInput),2,"index retrieved correctly");
        this.cacheMap.clearCache();
        assert.equal(this.cacheMap.keyStore.length,0,"keystore cleared");
        assert.equal(this.cacheMap.values.length,0,"values cleared");

	});

});
