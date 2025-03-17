// Copyright (c) 2009-2023 SAP SE, All Rights Reserved

/**
 * @fileOverview
 *
 * Provides inbounds describing all the possible navigation targets.
 *
 * <p>Each inbound is represented as an object with a structure that looks
 * like:</p>
 *
 * <pre>
 * {
 *     semanticObject: {string},
 *     action: {string},
 *     signature: {
 *         parameters: {
 *             "parameter1" {
 *                 "defaultValue": {
 *                     value: "abc"
 *                 },
 *                 "filter": {
 *                     value: "(abc)|(def)",
 *                     format: "regexp"
 *                 },
 *                 "required": true
 *             },
 *             ... more parameters
 *         }
 *         additionalParameters: "notallowed", // "allowed", "ignored"
 *    }
 * }
 * </pre>
 *
 * <p>This is a dependency of ClientSideTargetResolution.  Interfaces exposed
 * by this module may change at any time without notice.</p>
 *
 * @version 1.132.1
 */
sap.ui.define([
    "sap/ushell/services/ClientSideTargetResolution/VirtualInbounds",
    "sap/ushell/services/ClientSideTargetResolution/InboundIndex",
    "sap/ushell/utils"
], function (
    VirtualInbounds,
    InboundIndex,
    ushellUtils
) {
    "use strict";

    /**
     * Creates an InboundProvider object.
     *
     * @class
     * @private
     */
    function InboundProvider () {
        this._init.apply(this, arguments);
    }

    InboundProvider.prototype._init = function (fnRetrieveInbounds) {
        this._fnRetrieveInbounds = fnRetrieveInbounds;
        this._oInboundsRetrievalPromise = null;
    };

    /**
     * Retrieves a list of inbounds.
     *
     * @param {object[]} [aSegments]
     *    When specified, allows to retrieve only a portion of all the
     *    inbounds. This is useful to optimize specific resolution flows (e.g.,
     *    direct start) that do not require the FLP to wait until all inbounds
     *    are returned.
     *
     *    <p>Example:</p>
     *<pre>
     * [
     *   {
     *     semanticObject : "So",
     *     action : "action"
     *   },
     *   ...
     * ]
     *</pre>
     *
     *    When not supplied, all available inbounds are returned.
     *
     * @returns {Promise}
     *    an ES6 promise that is resolved with an inbound index object.
     *
     * @private
     */
    InboundProvider.prototype.getInbounds = function (aSegments) {
        if (aSegments) {
            return this._getSomeInbounds(aSegments);
        }
        return this._getAllInbounds();
    };

    /**
     * Returns only some of the Inbounds. This method does not cache results.
     * In a typical FLP scenario, this method is likely to be called once.
     * Therefore there is no need to introduce caching at the moment.
     *
     * @param {object[]} aSegments
     *   A parameter indicating only a subset of all intents is required
     *   for execution.
     *
     *   <p>Example:</p>
     *
     * <pre>
     *  [
     *    {
     *      semanticObject : "So",
     *      action : "action"
     *    },
     *    ...
     *  ]
     * </pre>
     *
     * @returns {Promise}
     *    a promise that is resolved with an inbound index object.
     *
     * @private
     */
    InboundProvider.prototype._getSomeInbounds = async function (aSegments) {
        const aInbounds = await ushellUtils.promisify(this._fnRetrieveInbounds(aSegments));

        return InboundIndex.createIndex(aInbounds.concat(VirtualInbounds.getInbounds()));
    };

    /**
     * Returns the complete set of inbounds. This method caches the resulting
     * promise over multiple invocations.
     *
     * @returns {Promise}
     *    An ES6 promise that is resolved with an inbound index object,
     *    or rejected with <code>undefined</code>.
     *
     * @private
     */
    InboundProvider.prototype._getAllInbounds = function () {
        if (!this._oInboundsRetrievalPromise) {
            this._oInboundsRetrievalPromise = ushellUtils.promisify(this._fnRetrieveInbounds()).then((aInbounds) => {
                return InboundIndex.createIndex((aInbounds || []).concat(VirtualInbounds.getInbounds()));
            });
        }

        return this._oInboundsRetrievalPromise;

    };

    return InboundProvider;
});
