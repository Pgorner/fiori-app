// Copyright (c) 2009-2023 SAP SE, All Rights Reserved
/**
 * @fileOverview Class for statistical record
 *               It should contain data like step, duration after a navigation in the shell, can have status open.
 *               The closing of a record is logged in debug mode
 * @version 1.132.1
 */
sap.ui.define([
    "sap/base/Log",
    "sap/ui/performance/trace/Interaction"
], function (Log, Interaction) {
    "use strict";

    const sModuleName = "StatisticalRecord";
    const sLogPrefix = "[FesrFlp]";

    const STATUS = {
        OPEN: "OPEN",
        CLOSED: "CLOSED",
        ERROR: "ERROR"
    };

    class StatisticalRecord {
        // ==================== For debugging ====================
        /**
         * The duration in milliseconds. Difference of the two timestamps above
         * @type {DOMHighResTimeStamp}
         */
        #duration = null;
        /**
         * The navigation mode, can be INPLACE or EXPLACE
         * @type {string}
         */
        #navigationMode = null;
        /**
         * True when homepage was loaded the first time
         * @type {boolean}
         */
        #homepageLoading = false;

        // =========================================

        /**
         * The status, can be open or closed or error
         * @type {string}
         */
        #status = STATUS.OPEN;
        /**
         * The navigation step, e.g. "FLP@LOAD"
         * @type {string}
         */
        #step = null;
        /**
         * The target hash of the navigation
         * @type {string}
         */
        #targetHash = null;

        /**
         * The start time or to be more precise timestamps returned by performance.now()
         * @type {DOMHighResTimeStamp}
         */
        #timeStart = null;
        /**
         * The end time or to be more precise timestamps returned by performance.now()
         * @type {DOMHighResTimeStamp}
         */
        #timeEnd = null;

        /**
         * The source application
         * @type {string}
         */
        #sourceApplication = null;
        /**
         * Whether the source is a homeApp
         * @type {boolean}
         */
        #sourceIsHomeApp = null;


        /**
         * The target application
         * @type {string}
         */
        #targetApplication = null;
        /**
         * Whether the target is a homeApp
         * @type {boolean}
         */
        #targetIsHomeApp = null;
        /**
         * The type of the target application. For example UI5, TR, etc.
         * @type {string}
         */
        #targetApplicationType = null;
        /**
         * Additional data describing the targetApplication
         * @type {object}
         */
        #targetApplicationData = {};

        /**
         *  Callback for closing ui5 interactions
         * @type {function|null}
         */
        #resolveInteraction = null;

        constructor () {
            Log.debug(`${sLogPrefix} ======================================`, "‾‾‾ OPEN ‾‾‾", sModuleName);
            Log.debug(`${sLogPrefix} Opening Record`, null, sModuleName);
            this.#startInteraction();
        }

        /**
         * For debugging:
         * Setter for navigation mode
         * @param {string} navigationMode INPLACE or EXPLACE
         * @private
         */
        setNavigationMode (navigationMode) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#navigationMode = navigationMode;
        }

        /**
         * For debugging:
         * Set if the homepage was loaded the first time
         * @param {boolean} homepageLoading flag if homepage was loaded the first time
         * @private
         */
        setHomepageLoading (homepageLoading) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#homepageLoading = homepageLoading;
        }

        /**
         * For debugging:
         * Getter for source application
         * @returns {string} Fiori id of the source application
         * @private
         */
        getSourceApplication () {
            return this.#sourceApplication;
        }

        #startInteraction () {
            if (!this.#resolveInteraction) {
                Log.debug(`${sLogPrefix} Interaction Start`, null, sModuleName);
                this.#resolveInteraction = Interaction.notifyAsyncStep();
            }
        }

        #stopInteraction () {
            if (this.#resolveInteraction) {
                Log.debug(`${sLogPrefix} Interaction End`, null, sModuleName);
                this.#resolveInteraction();
                this.#resolveInteraction = null;
            }
        }

        /**
         * calculates step out of source and target application
         *
         * @returns {string} sStep The navigation step
         */
        #calculateStep () {
            const bIsTargetHome = this.#targetIsHomeApp || this.#isFLPHome(this.#targetApplication);
            const bIsSourceHome = this.#sourceIsHomeApp || this.#isFLPHome(this.#sourceApplication);

            //In case when targetApplication and sourceApplication not defined, can not resolve the step
            if (!this.#targetApplication && !this.#sourceApplication) {
                return "";
            }

            //load home page
            if (!this.#sourceApplication && bIsTargetHome) {
                // entire phase of loading gets this Step name internally,
                // will be replaced later by original step or FLP@LOAD for external use
                return "FLP@DURING_LOAD";
            }

            if (!this.#sourceApplication && !bIsTargetHome) {
                return "FLP@DEEP_LINK";
            }

            // if source and target application are not the homepage it is an app to app navigation.
            // if homepage is started the source application is undefined
            if (!bIsTargetHome && !bIsSourceHome) {
                return "A2A@" + this.#sourceApplication;
            }

            // back to the homepage from some app
            if (this.#sourceApplication && bIsTargetHome && !bIsSourceHome) {
                return "FLP_BACK@" + this.#sourceApplication;
            }

            // if navigation within home
            if (bIsSourceHome && bIsTargetHome) {
                if (["FLP_FINDER", "FLP_HOME"].includes(this.#targetApplication)) {
                    return this.#targetApplication + "@H2H";
                }
                // back to custom home
                if (this.#targetIsHomeApp) {
                    return this.#targetApplication + "@H2H";
                }
                // to a page
                return this.#targetApplicationData.pageId + "@H2H";
            }

            // start app from flp home
            if (this.#isFLPHome(this.#sourceApplication)) {
                return "FLP@HOMEPAGE_TILE";
            }

            // start app from custom home
            if (this.#sourceIsHomeApp) {
                return "APPSTART@CUSTOMHOME";
            }
            return "";
        }

        /**
         * Compares two statistical records
         * @param {object} otherRecord The other record
         * @returns {boolean} Is true if other record has the same start time as the current record
         */
        isEqual (otherRecord) {
            return this.#timeStart === otherRecord.getTimeStart();
        }

        /**
         * Closes the record, computes the duration, step and stores it
         */
        closeRecord () {
            this.#step = this.#calculateStep();
            this.#status = STATUS.CLOSED;
            this.#timeEnd = performance.now();
            if (this.#timeStart) {
                this.#duration = this.#timeEnd - this.#timeStart;
            }
            this.#stopInteraction();

            Log.debug(`${sLogPrefix} Closing Record`, `${this.#step} - ${this.getTargetAppNameShort() || this.#targetApplication}`, sModuleName);
            Log.debug(`${sLogPrefix} ======================================`, "___ CLOSE ___", sModuleName);
        }

        /**
         * Closes the Record with status error
         */
        closeRecordWithError () {
            this.#status = STATUS.ERROR;
            this.#timeEnd = performance.now();
            this.#duration = this.#timeEnd - this.#timeStart;
            this.#stopInteraction();

            Log.debug(`${sLogPrefix} Closing Record with Error`, `${this.getTargetAppNameShort() || this.#targetApplication}`, sModuleName);
            Log.debug(`${sLogPrefix} ======================================`, "___ CLOSE ___", sModuleName);
        }

        /**
         * checks if record is closed
         * @returns {boolean} isTrue Is true if record is closed
         *
         */
        isClosed () {
            return this.#status === STATUS.CLOSED;
        }

        /**
         * checks if record is closed with errors
         * @returns {boolean} isTrue Is true if record is closed with errors
         *
         */
        isClosedWithError () {
            return this.#status === STATUS.ERROR;
        }

        /**
         * Getter for step
         * @returns {boolean} return the step of the record. For example, FLP@LOAD
         */
        getStep () {
            if (!this.isClosed() && !this.isClosedWithError()) {
                throw new Error("Statistical record is still open no step can be determined!");
            }
            return this.#step;
        }

        /**
         * Getter for start time
         * @returns {DOMHighResTimeStamp} timestamp when record was created
         */
        getTimeStart () {
            return this.#timeStart;
        }

        /**
         * Setter for start time
         * @param {DOMHighResTimeStamp} timeStart timestamp when record was created
         */
        setTimeStart (timeStart) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#timeStart = timeStart;
        }

        /**
         * @returns {DOMHighResTimeStamp} The end time or to be more precise timestamps returned by performance.now()
         */
        getTimeEnd () {
            return this.#timeEnd;
        }

        /**
         * @param {string} sSourceApplicationId Fiori id of the source application
         */
        setSourceApplication (sSourceApplicationId) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            Log.debug(`${sLogPrefix} Record setSource: ${sSourceApplicationId}`, null, sModuleName);
            this.#sourceApplication = sSourceApplicationId;
        }

        /**
         * Getter for target application
         * @returns {string} Fiori id of the target application
         */
        getTargetApplication () {
            return this.#targetApplication;
        }

        /**
         * Setter for target application
         * @param {string} sTargetApplicationId Fiori id of the target application
         */
        setTargetApplication (sTargetApplicationId) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            Log.debug(`${sLogPrefix} Record setTarget: ${sTargetApplicationId}`, null, sModuleName);
            this.#targetApplication = sTargetApplicationId;
        }

        /**
         * Getter for the enhanced short application name.
         *
         * @returns {string|null} FLP_PAGE if target is a page else null
         */
        getTargetAppNameShort () {
            if (this.#targetApplication === "FLP_PAGE") {
                const { pageId } = this.#targetApplicationData;
                if (pageId) {
                    return "FLP_PAGE";
                }
            }
            return null;
        }

        /**
         * Sets the target application type
         * @returns {string} target application type, for example UI5, TR, etc.
         */
        getTargetApplicationType () {
            return this.#targetApplicationType;
        }

        /**
         * Sets the target application type
         * @param {string} targetApplicationType target application type, for example UI5, TR, etc.
         * @since 1.117.0
         */
        setTargetApplicationType (targetApplicationType) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#targetApplicationType = targetApplicationType;
        }

        /**
         * Set the property isTargetHomeApp
         * @param {boolean} bHomeApp true or false
         * @private
         * @since 1.117.0
         */
        setTargetIsHomeApp (bHomeApp) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#targetIsHomeApp = !!bHomeApp;
        }

        /**
         * Getter for isTargetHomeApp
         * @returns {boolean} true, if target is a home app.
         * @since 1.117.0
         */
        getTargetIsHomeApp () {
            return !!this.#targetIsHomeApp;
        }

        /**
         * Setter for target hash
         * @param {string} sTargetHash Hash of the target application
         * @private
         */
        setTargetHash (sTargetHash) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#targetHash = sTargetHash;
        }

        /**
         * Getter for target hash
         * @returns {string} sTargetHash Hash of the target application
         * @private
         */
        getTargetHash () {
            return this.#targetHash;
        }

        /**
         * Set the property for isSourceHomeApp
         * @param {boolean} bHomeApp true or false
         * @private
         * @since 1.117.0
         */
        setSourceIsHomeApp (bHomeApp) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#sourceIsHomeApp = !!bHomeApp;
        }

        /**
         * Getter for isSourceHomeApp
         * @returns {boolean} true, if source is a home app.
         * @since 1.117.0
         */
        getSourceIsHomeApp () {
            return !!this.#sourceIsHomeApp;
        }

        /**
         * is application FLP Home
         * @param {string} sApplicationId the id of the application
         * @returns {boolean} true, if application is FLP Home.
         * @since 1.117.0
         */
        #isFLPHome (sApplicationId) {
            return sApplicationId && ["FLP_HOME", "FLP_PAGE", "FLP_FINDER"].includes(sApplicationId);
        }

        /**
         * Saves data related to the target application of this StatisticalRecord.
         * @param {object} oData The related data
         */
        enhanceTargetApplicationData (oData) {
            if (this.isClosed() || this.isClosedWithError()) {
                throw new Error("Statistical record is already closed!");
            }
            this.#targetApplicationData = {
                ...this.#targetApplicationData,
                ...oData
            };
        }
    }

    return StatisticalRecord;

}, /* bExport= */ false);
