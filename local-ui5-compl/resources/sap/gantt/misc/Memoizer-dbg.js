/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)

		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([

], function () {
    'use strict';

    /**
	 * Caching the values of control and returning them when the same inputs are used again.
	 *
	 * @author SAP SE
	 * @version 1.132.0
	 *
	 * @private
     * @alias sap.gantt.misc.Memoizer
	 */

    //same value zero comparison
    function isEqual(source, comparer) {
        /* eslint-disable no-self-compare */
        return source === comparer || (source !== source && comparer !== comparer);
        /* eslint-enable no-self-compare */
    }

    function LRUCache(size) {
        this.keyStore = [];
        this.values = [];
        this.cacheSize = size ? size : 100;
    }

    //Get the first index from cache and if input keys match with the first then return zero else return -1
    LRUCache.prototype.getFirstIndex = function (inputKey) {
        var keyStore = this.keyStore;

        if (!keyStore.length) {
            return -1;
        }

        var keys = keyStore[0];
        var len = keys.length;

        if (inputKey.length !== len) {
            return -1;
        }

        if (len > 1) {
            for (var index = 0; index < len; index++) {
                if (!isEqual(keys[index], inputKey[index])) {
                    return -1;
                }
            }

            return 0;
        }

        return isEqual(keys[0], inputKey[0]) ? 0 : -1;
    };


    //Get the index of passed input key from cache and if input keys matches then return current index else return -1
    LRUCache.prototype.getIndex = function (inputKeys) {
        var keyStore = this.keyStore;
        var storeLength = keyStore.length;

        if (!storeLength) {
            return -1;
        }

        if (storeLength === 1) {
            return this.getFirstIndex(inputKeys);
        }

        var inputKeyLength = inputKeys.length;

        var keys;
        var argIndex;

        if (inputKeyLength > 1) {
            for (var storeIndex = 0; storeIndex < storeLength; storeIndex++) {
                keys = keyStore[storeIndex];

                if (keys.length === inputKeyLength) {
                    argIndex = 0;

                    for (; argIndex < inputKeyLength; argIndex++) {
                        if (!isEqual(keys[argIndex], inputKeys[argIndex])) {
                            break;
                        }
                    }

                    if (argIndex === inputKeyLength) {
                        return storeIndex;
                    }
                }
            }
        } else {
            for (var storedIndex = 0; storedIndex < storeLength; storedIndex++) {
                keys = keyStore[storedIndex];

                if (
                    keys.length === inputKeyLength &&
                    isEqual(keys[0], inputKeys[0])
                ) {
                    return storedIndex;
                }
            }
        }

        return -1;
    };

    //Get the value of passed input key from cache and if input keys matches then moves the value to the first index and returns it.
    LRUCache.prototype.getValue = function () {
        var keyStore = this.keyStore;
        var values = this.values;
        var keyIndex = arguments.length ? this.getIndex(arguments) : -1;

        if (keyIndex !== -1) {
            if (keyIndex) {
                this._add(keyStore[keyIndex], values[keyIndex], keyIndex);
            }
            return values[0];
        }
    };

    //shifts the given value to the top of cache, and removes last element if cache is full
    LRUCache.prototype._add = function (key, value, startIndex) {
        var keyStore = this.keyStore;
        var values = this.values;


        var storeLength = keyStore.length;
        var index = startIndex;

        while (index--) {
            keyStore[index + 1] = keyStore[index];
            values[index + 1] = values[index];
        }

        keyStore[0] = key;
        values[0] = value;

        var cacheSize = this.cacheSize;

        if (storeLength === cacheSize && startIndex === storeLength) {
            keyStore.pop();
            values.pop();
        } else if (startIndex >= cacheSize) {
            keyStore.length = values.length = cacheSize;
        }
    };

    //Adds the given value to the cache
    LRUCache.prototype.add = function (inputKeys, value) {
        var keyStore = this.keyStore;
        var values = this.values;
        var keyIndex = inputKeys.length ? this.getIndex(inputKeys) : -1;

        if (keyIndex !== -1) {
            if (keyIndex) {
                this._add(keyStore[keyIndex], values[keyIndex], keyIndex);
            }
        } else {
            this._add(inputKeys, value, keyStore.length);
        }
    };

    //clears cache
    LRUCache.prototype.clearCache = function(){
        this.keyStore = [];
        this.values = [];
    };

    //Creates the cache
    function createCache(size) {
        return new LRUCache(size);
    }

    return {
        createCache: createCache
    };
});


