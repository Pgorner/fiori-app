declare module "sap/cux/home/utils/BatchHelper" {
    /*!
     * SAP UI development toolkit for HTML5 (SAPUI5)
     *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
     */
    import BaseObject from "sap/ui/base/Object";
    enum methods {
        GET = "GET",
        POST = "POST",
        PUT = "PUT",
        PATCH = "PATCH",
        DELETE = "DELETE",
        HEAD = "HEAD"
    }
    interface Options {
        headers: Record<string, string>;
        method: methods;
        body?: string;
    }
    /**
     * Represents a multipart request.
     */
    class MultiPartRequest {
        private url;
        private batchRequests;
        private boundary;
        options: Options;
        /**
         * Creates a MultiPartRequest object.
         *
         * @param {string} url - The URL for the multipart request.
         * @constructor
         */
        constructor(url: string, csrfToken: string);
        /**
         * Constructs the body for the multipart request.
         *
         * @returns {string} - The constructed body.
         * @private
         */
        _constructBody(): string;
        /**
         * Adds a request to the MultiPartRequest batch.
         *
         * @public
         * @param {Object} request - The request to add to the batch.
         */
        addRequest(request: MultiPartRequest): void;
    }
    /**
     * Parses multipart body response and returns an array of values called in the batch request.
     *
     * @param {string} value - Multipart body response.
     * @returns {Object[]} - Array of values in the multipart request.
     * @returns {Object[]} - An array of values in the multipart request.
     */
    const getDataFromRawValue: (value: string) => (string | object)[];
    /**
     * Fetches the CSRF token from the specified base URL.
     *
     * @async
     * @param {string} baseURL - The base URL to fetch the CSRF token from.
     * @returns {Promise<string>} A Promise that resolves when all batch requests are completed. A promise that resolves to the CSRF token.
     * @throws {Error} An error if the CSRF token cannot be fetched.
     */
    const fetchCSRFToken: (baseURL: string) => Promise<string>;
    /**
     *
     * Helper class for managing batch requests.
     *
     * @extends BaseObject
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121
     *
     * @internal
     * @experimental Since 1.121
     * @private
     *
     * @alias sap.cux.home.utils.BatchHelper
     */
    export default class BatchHelper extends BaseObject {
        private url;
        static Instance: BatchHelper;
        /**
         * Fetches data from a multipart request.
         *
         * @private
         * @param {MultiPartRequest} multiPartRequest - The multipart request object.
         * @returns {Promise<Array<string | object>>} - A promise that resolves to the data from the request.
         */
        private fetchData;
        /**
         * Creates a multipart batch request with multiple URLs.
         *
         * @public
         * @param {string} baseURL - The base URL for creating the batch request.
         * @param {string[]} urls - An array of URLs for individual requests.
         * @returns {Promise<Array<string | object>>} - A promise that resolves to the data from the batch request.
         */
        static createMultipartRequest(baseURL: string, urls: string[]): Promise<Array<string | object>>;
        /**
         * Builds a multipart request from an array of URLs.
         *
         * @private
         * @param {string[]} urls - An array of URLs for individual requests.
         * @returns {MultiPartRequest} - The multipart request object.
         */
        private buildMultipartRequest;
    }
}
//# sourceMappingURL=BatchHelper.d.ts.map