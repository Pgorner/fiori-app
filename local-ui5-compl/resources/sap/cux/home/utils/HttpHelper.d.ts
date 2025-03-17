declare module "sap/cux/home/utils/HttpHelper" {
    import BaseObject from "sap/ui/base/Object";
    /**
     *
     * @class Provides the HttpHelper Class used for Get and Post Calls.
     *
     * @extends sap.ui.BaseObject
     *
     * @author SAP SE
     * @version 0.0.1
     * @since 1.121.0
     *
     * @private
     * @experimental Since 1.121
     * @hidden
     *
     * @alias sap.cux.home.util.HttpHelper
     */
    export default class AppManager extends BaseObject {
        private constructor();
        /**
         * Fetches the CSRF Token
         * @returns {Promise<string | void>} Promise that resolves with the CSRF Token
         */
        private static fetchCSRFToken;
        /**
         * Post Method
         * @param {string} url - The URL to post to
         * @param {object} payload - The payload to post
         * @returns {Promise<unknown>} Promise that resolves with the response
         */
        static Post(url: string, payload: object): Promise<unknown>;
        /**
         * Get Method for JSON Data
         * @param {string} url - The URL to get from
         * @returns {Promise<unknown>} Promise that resolves with the JSON data response
         */
        static GetJSON(url: string): Promise<unknown>;
    }
}
//# sourceMappingURL=HttpHelper.d.ts.map