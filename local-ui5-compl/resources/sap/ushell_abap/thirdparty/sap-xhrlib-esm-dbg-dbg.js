/*
 * SAP XHR Library v3.1.0
 * (c) Copyright 2013-2023 SAP SE or an SAP affiliate company.
*/
const global = self;
let mod = {}, src = {};
function r(i) {
    let m, e;
    if (!i.endsWith('.js')) {
        i += '.js';
    }
    m = mod[i];
    if (!m) {
        if (!src[i]) {
            e = new Error("Cannot find module '" + i + "'");
            e.code = 'MODULE_NOT_FOUND'
            throw e;
        }
        m = {exports: {}};
        mod[i] = m;
        src[i](m.exports, r, m);
    }
    return m.exports;
}
  src = {
"./Channel.js": function (exports, require, module) {
"use strict";

/**
 * Request pipeline enhancement
 * @properties {XMLHttpRequest} xhr Parent XHR request
 * @properties {string} url Request URL
 * @properties {string} method Request method
 * @properties {ChannelFilter[]} filters Channel request filters
 * @extends PendingRequest
 * @public
 */
class Channel {
    /**
     * Constructs a new instance of Channel
     * @param {XMLHttpRequest} xhr Parent request
     * @param {string} method HTTP method
     * @param {string} url Request URL
     * @param {boolean} async Asynchronous flag
     * @param {string} username
     * @param {string} password
     * @internal
     */
    constructor(xhr, method, url, async, username, password) {
        this.filters = [];
        this.xhr = xhr;
        this.method = method;
        this.url = new URL(url, global.location.href);
        this.url = this.url.href;
        this.async = !!async;
        if (username !== undefined) {
            this.username = username;
        }
        if (password !== undefined) {
            this.password = password;
        }
    }

    _process(method) {
        for (const filter of this.filters) {
            if (typeof filter[method] === "function") {
                filter[method](this);
            }
        }
    }

    aborting() {
        this._process("aborting");
    }

    aborted() {
        this._process("aborted");
    }

    opening() {
        this._process("opening");
    }

    opened() {
        this._process("opened");
    }

    sending() {
        this._process("sending");
    }

    sent() {
        this._process("sent");
    }

    reopening() {
        this._process("reopening");
    }

    catch(error) {
        for (const filter of this.filters) {
            if (typeof filter.catch === "function") {
                try {
                    filter.catch(error, this);
                    error = null;
                    break;
                } catch (err) {
                    error = err;
                }
            }
        }
        if (error) {
            throw error;
        }
    }

    repeat() {
        this.xhr.repeat();
    }

    resume() {
        this.xhr.resumeEvents(true);
    }
}

module.exports = Channel;
},
"./ChannelFactory.js": function (exports, require, module) {
"use strict";
const Channel = require("./Channel.js");
const IgnoreList = require("./IgnoreList.js");

function isFactory(x) {
    const t = typeof x;
    return (t === "function") || ((t === "object") && (x !== null) && (typeof x.addFilter === "function"));
}

function invokeFactory(x, channel) {
    if (typeof x === "function") {
        x(channel);
    } else {
        x.addFilter(channel);
    }
}

/**
 * ChannelFactory creates the channel enhancing an XMLHttpRequest
 * @public
 */
class ChannelFactory {
    constructor() {
        this.reset();
    }

    reset() {
        this._filterFactories = [];
        this.ignore = new IgnoreList();
    }

    /**
     * Adds a filter factory
     * @param factory
     */
    addFilterFactory(factory) {
        if (!isFactory(factory)) {
            throw new TypeError("addFilterFactory expects a FilterFactory or a function parameter");
        }
        const factories = this._filterFactories;
        if (factories.indexOf(factory) === -1) {
            factories.push(factory);
        }
    }

    removeFilterFactory(factory) {
        const factories = this._filterFactories;
        const i = factories.indexOf(factory);
        if (i !== -1) {
            factories.splice(i, 1);
        }
    }

    getFilterFactories() {
        return this._filterFactories.slice();
    }

    /**
     * Creates the channel for a given HTTP request
     * @param xhr
     * @param method
     * @param url
     * @param async
     * @param username
     * @param password
     * @returns {Channel}
     */
    create(xhr, method, url, async, username, password) {
        const channel = new Channel(xhr, method, url, async, username, password);
        if (!this.ignore.ignored(url)) {
            const factories = this._filterFactories;
            for (const factory of factories) {
                invokeFactory(factory, channel);
            }
        }
        return channel;
    }
}

module.exports = ChannelFactory;
},
"./ConsoleLogger.js": function (exports, require, module) {
"use strict";

const util = require("./util.js");
const Level = {
    none: 0,
    error: 10,
    warn: 20,
    info: 30,
    debug: 40
};

class Output {
    constructor(output) {
        if (output && typeof output.log === "function") {
            this.error = typeof output.error === "function" ? output.error : output.log;
            this.warn = typeof output.warn === "function" ? output.warn : output.log;
            this.info = output.log;
            this.debug = output.log;
        } else {
            this.error = util.nop;
            this.warn = util.nop;
            this.info = util.nop;
            this.debug = util.nop;
        }
    }
}

class ConsoleLogger {
    constructor(output, name, level) {
        this.output = new Output(output);
        this.name = name || "xhrlib";
        this.setLevel(level);
    }

    format(msg, severity) {
        return util.time() + " " + this.name + " [" + severity.toUpperCase() + "] " + msg;
    }

    setLevel(level) {
        level = (typeof level === "number") ? level : Level[level];
        this.level = (level === undefined) ? Level.warn : level;
    }

    log(level, msg) {
        if (this.level >= Level[level]) {
            this.output[level](this.format(msg, level));
        }
    }

    error(msg) {
        this.log("error", msg);
    }

    warn(msg) {
        this.log("warn", msg);
    }

    info(msg) {
        this.log("info", msg);
    }

    debug(msg) {
        this.log("debug", msg);
    }
}

ConsoleLogger.Level = Level;
ConsoleLogger.prototype.warning = ConsoleLogger.prototype.warn;

module.exports = ConsoleLogger;
},
"./constants.js": function (exports, require, module) {
"use strict";

module.exports = {
    X_REQUESTED_WITH: "x-requested-with",
    X_XHR_LOGON: "x-xhr-logon"
}
},
"./DefaultLogonFrameProvider.js": function (exports, require, module) {
"use strict";

/**
 * Default implementation for creating, showing, and destroying a logon iframe.
 * @implements LogonFrameProvider
 */
class DefaultLogonFrameProvider {
    constructor() {
        this.prefix = "xhrlibFrame" + Date.now().toString(36);
        this.frame = null;
    }

    create() {
        this.destroy();
        DefaultLogonFrameProvider.frameCounter += 1;
        const frameId = this.prefix + DefaultLogonFrameProvider.frameCounter;
        this.frame = document.createElement("iframe");
        this.frame.id = frameId;
        this.setDisplayNone(this.frame);
        document.body.appendChild(this.frame);
        return this.frame;
    }

    destroy() {
        if (this.frame) {
            document.body.removeChild(this.frame);
            this.frame = null;
        }
    }

    show() {
        if (this.frame) {
            this.setDisplayVisible(this.frame);
        }
    }

    /**
     * Sets frame display mode to none (default implementation relies on inline style)
     */
    setDisplayNone(frame) {
        frame.style.display = "none";
    }

    setDisplayVisible(frame) {
        frame.style.display = "block";
        frame.style.position = "absolute";
        frame.style.top = "0";
        frame.style.left = "0";
        frame.style.width = "100%";
        frame.style.height = "100%";
        frame.style.zIndex = "99999";
        frame.style.border = "0";
        frame.style.background = "white"; // Note: else it is transparent!
        setTimeout(function () {
            try {
                frame.contentWindow.focus();
            } catch (err) {
                void err;
            }
        }, 100);
    }
}

module.exports = DefaultLogonFrameProvider;

DefaultLogonFrameProvider.frameCounter = 0;
},
"./EventEmitter.js": function (exports, require, module) {
"use strict";

function isHandler(x) {
    return x && (typeof x === "function" || typeof x.handleEvent === "function");
}

function fireEvent(x, e) {
    if (typeof x === "function") {
        // DOM4: if listener's callback is a Function object, its callback "this" value is the event's currentTarget attribute value.
        return x.call(e.currentTarget, e);
    } else {
        return x.handleEvent(e);
    }
}

class EventEmitter {
    constructor(events) {
        const n = events.length;
        for (let i = 0; i < n; ++i) {
            this["_" + events[i]] = [];
        }
        this.subscriptions = {};
        this.bufferedEvents = [];
        this.suspended = false;
    }

    add(type, handler) {
        if (!isHandler(handler)) {
            throw new TypeError("Invalid event handler");
        }
        const h = this["_" + type];
        if (!h) {
            throw new Error(`Unknown event '${type}'`);
        }
        if (h.indexOf(handler) === -1) {
            h.push(handler);
        }
    }

    remove(type, handler) {
        const h = this["_" + type];
        if (h) {
            const i = h.indexOf(handler);
            if (i !== -1) {
                h.splice(i, 1);
            }
        }
    }

    removeAll(type) {
        const key = "_" + type;
        if (this[key]) {
            this[key] = [];
        }
    }

    dispatch(event) {
        const type = event.type;
        let handlers = this["_" + type];
        if (!handlers || !handlers.length) {
            return;
        }
        if (this.suspended) {
            this.bufferedEvents.push(event);
        } else {
            handlers = handlers.slice(); // Copy handlers in case an event handler would mess with the subscriptions
            for (const handler of handlers) {
                fireEvent(handler, event);
            }
        }
    }

    clearEvents() {
        this.bufferedEvents = [];
    }

    releaseEvents() {
        const events = this.bufferedEvents;
        this.clearEvents();
        for (const event of events) {
            this.dispatch(event);
        }
    }

    hasSubscribers(type) {
        const h = this["_" + type];
        return (h && h.length > 0);
    }

    subscribed(type) {
        return Boolean(this.subscriptions["_" + type]);
    }

    subscribe(type) {
        this.subscriptions["_" + type] = true;
    }

    unsubscribe(type) {
        delete this.subscriptions["_" + type];
    }

}

module.exports = EventEmitter;


/**
 * Checks whether the passed argument is a valid handler, i.e. a function or an object exposing a "handleEvent" function
 * @function
 * @param {*} handler
 */
EventEmitter.isHandler = isHandler;

/**
 * Invokes an event handler
 * @function
 * @param {object|function} handler Event handler
 * @param {Event} event Event
 */
EventEmitter.fireEvent = fireEvent;

},
"./FetchContext.js": function (exports, require, module) {
"use strict";

const FetchContextKey = "sap.xhrlib.FetchContext";

/**
 * Provides access to the fetch request context
 * @public
 */
class FetchContext {

    /**
     * Returns the fetch context attached to an object. Context is created if needed.
     * @param {object} obj Target object
     * @returns {object} Fetch context
     * @public
     */
    static get(obj) {
        return obj[FetchContextKey] || FetchContext.set(obj, {});
    }

    /**
     * Sets the fetch context of an object.
     * @param {context} obj Target object
     * @param {object} context Fetch context
     * @public
     */
    static set(obj, context) {
        obj[FetchContextKey] = context;
        return context;
    }

    static get key() {
        return "sap.xhrlib.FetchContext";
    }
}

module.exports = FetchContext;
},
"./FetchRequest.js": function (exports, require, module) {
"use strict";

const nativeFetch = global.fetch;
const FetchContext = require("./FetchContext.js");
const FetchTransformManager = require("./FetchTransformManager.js");
const {toBlob} = require("./util.js");

// Note: priority is not supported by all browsers
const RequestOptions = ["method", "mode", "credentials", "cache", "redirect", "referrer", "integrity", "priority"];

const FetchOptions = ["referrerPolicy", "keepalive", "signal"];

/**
 * Extended fetch API request
 * @public
 * @property {int} id Request id
 * @property {int} execution Request execution count
 * @property {string} url Initial request URL
 */
class FetchRequest {
    /**
     * Constructs a new instance of FetchRequest
     * @param {string|URL|Request} resource This defines the resource to be fetched.
     * @param {object} [init] An object containing any custom settings to apply to the request.
     */
    constructor(resource, init) {
        this.id = ++FetchRequest.lastRequestId;
        this.executions = 0;
        this.context = {fetchRequest: this};
        this.fetchOptions = FetchRequest.getFetchOptions(init);
        this.requestOptions = FetchRequest.getRequestOptions(init);
        if (resource instanceof Request) {
            // Fetch init options may override request ones
            this.requestOptions = Object.assign(FetchRequest.getRequestOptions(resource), this.requestOptions);
            this.headers = new Headers(resource.headers);
            if (init && init.headers) {
                const initHeaders = new Headers(init.headers);
                for (const [name, value] of initHeaders) {
                    this.headers.set(name, value);
                }
            }
            if (init && init.body !== undefined && init.body !== null) {
                this.body = init.body;
            } else {
                this.sourceRequest = resource;
            }
            this.url = new URL(resource.url);
        } else {
            this.url = new URL(resource, global.location.href);
            if (init) {
                this.headers = new Headers(init.headers);
                this.body = init.body;
            }
        }
        this.url = this.url.href;
        this.requestOptions.headers = this.headers;
    }

    /**
     * Extract options corresponding to the given reference
     * @param {object} init Input
     * @param {object} reference Reference options
     * @returns {object} Options from init
     * @internal
     */
    static getOptions(init, reference) {
        const options = {};
        if (init) {
            for (const key of reference) {
                if (init[key]) {
                    options[key] = init[key];
                }
            }
        }
        return options;
    }

    /**
     * Native fetch function
     * @returns {function}
     * @public
     */
    static get nativeFetch() {
        return nativeFetch;
    }

    /**
     * Enhanced Fetch API
     * @param {string|Request} input
     * @param {object} [init]
     * @returns Promise<Response>
     * @public
     */
    static async fetch(input, init) {
        const fetchRequest = new FetchRequest(input, init);
        return fetchRequest.execute();
    }

    static hookFetch() {
        global.fetch = FetchRequest.fetch;
    }

    static unhookFetch() {
        global.fetch = FetchRequest.nativeFetch;
    }

    static getRequestOptions(options) {
        return FetchRequest.getOptions(options, RequestOptions);
    }

    static getFetchOptions(options) {
        return FetchRequest.getOptions(options, FetchOptions);
    }

    async _createRequest() {
        const method = this.requestOptions.method;
        if (method !== "GET" && method !== "HEAD") {
            if (this.sourceRequest) {
                this.body = await this.sourceRequest.blob();
                delete this.sourceRequest;
            }

            if (this.body instanceof ReadableStream) {
                this.body = await toBlob(this.body);
            }

            this.requestOptions.body = this.body;
        }
        return new Request(this.url, this.requestOptions);
    }

    /**
     * Executes the fetch request
     * @returns {Promise<Response>}
     * @public
     */
    async execute() {
        ++this.executions;
        const context = this.context, signal = this.fetchOptions.signal;
        const transformManager = FetchTransformManager.getInstance();
        let request = await this._createRequest();
        FetchContext.set(request, context);
        request = await transformManager.transform("request", request, signal);
        context.request = request;
        let response = await nativeFetch(request, this.fetchOptions);
        FetchContext.set(response, context);
        response = await transformManager.transform("response", response, signal)
        return response;
    }
}

module.exports = FetchRequest;

FetchRequest.lastRequestId = 0;
FetchRequest.hookFetch();
},
"./FetchTransformManager.js": function (exports, require, module) {
"use strict";

const FetchContext = require("./FetchContext.js");
const {abortError} = require("./httpUtil.js");

let fetchTransformManager = null;


/**
 * FetchTransformManager allows defining a processing pipeline for fetch Requests/Responses
 * @public
 */
class FetchTransformManager {
    constructor() {
        this._requestTransforms = [];
        this._responseTransforms = [];
    }

    /**
     * Returns the FetchTransformManager singleton and creates it if needed
     * @returns {FetchTransformManager}
     * @public
     */
    static getInstance() {
        if (!fetchTransformManager) {
            fetchTransformManager = new FetchTransformManager();
        }
        return fetchTransformManager;
    }

    _getPipeline(type) {
        let pipeline;
        switch (type) {
            case "request":
                pipeline = this._requestTransforms;
                break;
            case "response":
                pipeline = this._responseTransforms;
                break;
            default:
                throw new Error(`Invalid pipeline '${type}'`);
        }
        return pipeline;
    }

    /**
     * Adds the `transform` function at the end of a given transform pipeline
     * @param {string} type Transform type: "request" or "response"
     * @param {FetchRequestTransform|FetchResponseTransform} transform Transform function
     * @public
     */
    addTransform(type, transform) {
        if (typeof transform !== "function") {
            throw new TypeError("Invalid transform");
        }
        const pipeline = this._getPipeline(type);
        if (pipeline.indexOf(transform) === -1) {
            pipeline.push(transform);
        }
    }

    /**
     * Adds the `transform` function at the beginning of a given transform pipeline
     * @param {string} type Transform type: "request" or "response"
     * @param {FetchRequestTransform|FetchResponseTransform} transform Transform function
     * @public
     */
    prependTransform(type, transform) {
        if (typeof transform !== "function") {
            throw new TypeError("Invalid transform");
        }
        const pipeline = this._getPipeline(type);
        if (pipeline.indexOf(transform) === -1) {
            pipeline.unshift(transform);
        }
    }

    /**
     * Remove the `transform` function from a given transform pipeline
     * @param {string} type Transform type: "request" or "response"
     * @param {FetchRequestTransform|FetchResponseTransform} transform Transform function
     * @public
     */
    removeTransform(type, transform) {
        if (typeof transform !== "function") {
            throw new TypeError("Invalid transform");
        }
        const pipeline = this._getPipeline(type);
        const pos = pipeline.indexOf(transform);
        if (pos !== -1) {
            pipeline.splice(pos, 1);
        }
    }

    /**
     * Clear a given transform pipeline
     * @param {string} type Transform type: "request" or "response"
     * @public
     */
    clearTransforms(type) {
        const pipeline = this._getPipeline(type);
        pipeline.splice(0);
    }

    /**
     * Returns the list of transform for a given transform pipeline
     * @param {string} type Transform type: "request" or "response"
     * @public
     */
    getTransforms(type) {
        const pipeline = this._getPipeline(type);
        return pipeline.slice();
    }

    /**
     * Apply a given transform pipeline to a request/response
     * @param {string} type Transform type: "request" or "response"
     * @param {Request|Response} reqOrRes Initial request/response
     * @param {AbortSignal} signal Abort signal
     * @async
     * @returns {Request|Response} Transformed request/response
     * @public
     */
    async transform(type, reqOrRes, signal) {
        const pipeline = this._getPipeline(type);
        const context = FetchContext.get(reqOrRes);
        return new Promise(async function (resolve, reject) {
            try {
                let completed = false, aborted = false;
                if (signal) {
                    signal.addEventListener("abort", function () {
                        if (!completed) {
                            aborted = true;
                            reject(abortError());
                        }
                    });
                }
                for (const transform of pipeline) {
                    const modified = await transform(reqOrRes, signal);
                    reqOrRes = modified || reqOrRes;
                    FetchContext.set(reqOrRes, context);
                    if (aborted) {
                        break;
                    }
                }
                completed = true;
                if (!aborted) {
                    resolve(reqOrRes);
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}

module.exports = FetchTransformManager;
},
"./FrameLogonManager.js": function (exports, require, module) {
"use strict";

const EventEmitter = require("./EventEmitter.js");
const DefaultLogonFrameProvider = require("./DefaultLogonFrameProvider.js");
const LogonManager = require("./LogonManager.js");
const XHRLogonManager = require("./XHRLogonManager.js");
const UrlTimeout = require("./UrlTimeout.js");

const xhrLogger = require("./Log.js").logger;

const AUTH_REQUIRED = "authenticationrequired";
let frameLogonManager = null;

/**
 * FrameLogonManager handles iframe XHR Logon scheme
 * @property {LogonFrameProvider} logonFrameProvider Registered frame provider
 * @public
 */
class FrameLogonManager {
    constructor() {
        xhrLogger.debug("Creating FrameLogonManager");
        this.handlers = new EventEmitter([AUTH_REQUIRED]);
        this._lfp = new DefaultLogonFrameProvider();
        this._timeout = new UrlTimeout(FrameLogonManager.defaultTimeout);
    }

    /**
     * Returns the FrameLogonManager singleton and creates it if needed
     * @param {boolean} [noCreate] Does not create the FrameLogonManager instance if it does not exist
     * @returns {FrameLogonManager}
     * @public
     */
    static getInstance(noCreate) {
        if (!frameLogonManager && !noCreate) {
            frameLogonManager = new FrameLogonManager();
        }
        return frameLogonManager;
    }

    /**
     * Starts FrameLogonManager singleton
     * @public
     */
    static start() {
        FrameLogonManager.getInstance().start();
    }

    /**
     * Shuts FrameLogonManager singleton down
     * @public
     */
    static shutdown() {
        if (frameLogonManager) {
            frameLogonManager.shutdown();
            frameLogonManager = null;
        }
    }

    get logonFrameProvider() {
        return this._lfp;
    }

    set logonFrameProvider(lfp) {
        if (lfp) {
            this._lfp = lfp;
        } else {
            // Setting null or undefined will reset to the default LogonFrameProvider
            this._lfp = new DefaultLogonFrameProvider();
        }
    }

    /**
     * Registers an event listener
     * @param {string} type Event type ("authenticationrequired")
     * @param {function} callback Event handler
     * @public
     */
    addEventListener(type, callback) {
        this.handlers.add(type, callback);
    }

    /**
     * Unregisters an event listener
     * @param {string} type Event type ("authenticationrequired")
     * @param {function} callback Event handler
     * @public
     */
    removeEventListener(type, callback) {
        this.handlers.remove(type, callback);
    }

    dispatchAuthenticationRequired(request) {
        const self = this, event = new Event(AUTH_REQUIRED);
        event.request = request;
        setTimeout(function () {
            self.handlers.dispatch(event);
        }, 0);
    }


    /**
     * Startup
     */
    start() {
        const logonManager = LogonManager.getInstance();
        logonManager.addEventListener(LogonManager.LogonEvent.LOGON_COMPLETE, this);
        logonManager.addEventListener(LogonManager.LogonEvent.LOGON_FAILED, this);
        logonManager.addEventListener(LogonManager.LogonEvent.LOGON_ABORTED, this);
        logonManager.registerAuthHandler(XHRLogonManager.logonScheme(XHRLogonManager.Scheme.IFRAME), this);
    }

    /**
     * Shutdown
     */
    shutdown() {
        const logonManager = LogonManager.getInstance();
        this.abortLogon();
        logonManager.removeEventListener(LogonManager.LogonEvent.LOGON_COMPLETE, this);
        logonManager.removeEventListener(LogonManager.LogonEvent.LOGON_FAILED, this);
        logonManager.unregisterAuthHandler(XHRLogonManager.logonScheme(XHRLogonManager.Scheme.IFRAME), this);
    }

    /**
     * Returns the timeout applying for a given URL
     * @param {string} url
     * @returns {int}
     * @public
     */
    getTimeout(url) {
        return this._timeout.getTimeout(url);
    }

    /**
     * Defines a custom timeout for a given URL prefix
     * @param {string} url
     * @param {int} [value] Timeout in milliseconds.
     * @public
     */
    setTimeout(url, value) {
        this._timeout.setTimeout(url, value);
    }

    /**
     * Resets the timeout for a given URL prefix
     * @param {string} url
     * @public
     */
    resetTimeout(url) {
        this._timeout.resetTimeout(url);
    }

    static getFrameLoadHandler(provider, timeout) {
        let cancelId;
        const loadHandler = function () {
            if (cancelId) {
                // Frame has loaded a new page, reset previous timer
                clearTimeout(cancelId);
            }
            cancelId = setTimeout(function () {
                provider.show();
            }, timeout);
        };
        return loadHandler;
    }

    onLogon(request) {
        if (this.pending) {
            this.onLogonEnd(this.pending.realm);
        }
        xhrLogger.debug("Processing iframe logon for realm " + request.realm);

        // don't create frame if simple reload mode is used
        if (this.handlers.hasSubscribers(AUTH_REQUIRED)) {
            this.dispatchAuthenticationRequired(request);
            return true;
        }

        const timeout = this.getTimeout(request.httpRequest.url);
        const url = new URL(request.httpRequest.url, window.location);
        url.searchParams.set("xhr-logon", "iframe");
        const provider = this.logonFrameProvider;
        const frame = provider.create();
        if (!frame) {
            return false;
        }
        if (!frame.onload) {
            frame.onload = FrameLogonManager.getFrameLoadHandler(provider, timeout);
        }
        frame.xhrTimeout = timeout;
        frame.src = url.href;
        this.pending = {provider: provider, realm: request.realm, request};
        return true;
    }

    onLogonEnd(realm) {
        if (this.pending && (realm === this.pending.realm)) {
            this.pending.provider.destroy();
            this.pending = undefined;
        }
    }

    /**
     * Abort current login
     * @public
     */
    abortLogon() {
        if (this.pending) {
            xhrLogger.debug("Cancelling pending logon for realm " + this.pending.request);
            LogonManager.getInstance().abortLogon(this.pending.realm);
        }
    }

    handleEvent(event) {
        let handled = false;
        switch (event.type) {
            case LogonManager.LogonEvent.LOGON:
                handled = this.onLogon(event.request);
                break;
            case LogonManager.LogonEvent.LOGON_COMPLETE:
            case LogonManager.LogonEvent.LOGON_FAILED:
                this.onLogonEnd(event.response.realm);
                break;
            case LogonManager.LogonEvent.LOGON_ABORTED:
                if (this.pending && this.pending.request === event.request) {
                    this.onLogonEnd(event.request.realm);
                }
                break;
        }
        return handled;
    }
}

module.exports = FrameLogonManager;

/**
 * FrameLogonManager events
 * @public
 * @type {{AUTH_REQUIRED: string}}
 */
FrameLogonManager.Event = {
    AUTH_REQUIRED
};

/**
 * Default frame timeout to allow for silent re-authentication (e.g. browser still has a valid Identity Provider session)
 * @type {int}
 * @public
 */
FrameLogonManager.defaultTimeout = 600;

},
"./httpUtil.js": function (exports, require, module) {
"use strict";

const headerParser = /(?:,|^)\s*(?:,\s*)*(\w+)\s*=\s*(?:"((?:[^"\\]|\\.)*)"|(\w*))/g;

/**
 * Parses a comma separated list of token=token|quoted_string productions (cf. HTTP #rule https://www.w3.org/Protocols/rfc2616/rfc2616-sec2.html#sec2.1)
 * @param {string} header
 * @returns {object}
 */
function parseHeader(header) {
    const parsed = {};
    if (header === undefined) {
        return parsed;
    }
    if (typeof header !== "string") {
        throw new TypeError("Invalid header value");
    }
    let result = headerParser.exec(header);
    while (result !== null) {
        const token = result[1];
        const val = result[2] === undefined ? result[3] : result[2];
        parsed[token] = val ? val.replace(/\\(.)/g, "$1") : "";
        result = headerParser.exec(header);
    }
    return parsed;
}

/**
 * Parses an XHR Logon response header
 * @param {string} header XHR Logon response header
 * @returns {object} Parsed header
 */
function parseXHRLogonHeader(header) {
    const parsed = parseHeader(header);
    if (parsed.accept) {
        parsed.accept = parsed.accept.split(",").map(a => a.trim());
    } else {
        parsed.accept = [];
    }
    return parsed;
}

function abortError() {
    return new DOMException("The operation was aborted.", "AbortError");
}

module.exports = {
    abortError,
    parseHeader,
    parseXHRLogonHeader
};
},
"./IgnoreList.js": function (exports, require, module) {
"use strict";

/**
 * IgnoreList maintains a list of ignore rules as prefixes, regular expressions or matching functions.
 */
class IgnoreList {
    constructor() {
        this.clear();
    }

    /**
     * Adds an ignore rule
     * @param {string|RegExp|function} rule Ignore rule
     * @throws {TypeError} Throws a TypeError for an unsupported rule type
     */
    add(rule) {
        switch (typeof rule) {
            case "string":
                this.p.push(rule);
                break;
            case "object":
                if (rule instanceof RegExp) {
                    this.r.push(rule);
                } else {
                    throw new TypeError("Unsupported ignore rule type");
                }
                break;
            case "function":
                this.f.push(rule);
                break;
            default:
                throw new TypeError("Unsupported ignore rule type");
        }
        this.empty = false;
    }

    /**
     * Tests whether an item should be ignored
     * @param {string} item Item to test
     * @returns {boolean}
     */
    ignored(item) {
        let ignore = false;
        if (!this.empty) {
            item = item || "";
            ignore = this._prefix(item) || this._regexp(item) || this._function(item);
        }
        return ignore;
    }

    /**
     * Clears all rules
     */
    clear() {
        this.empty = true;
        this.p = [];
        this.r = [];
        this.f = [];
    }

    /**
     * Tests against registered prefixes
     * @param {string} item
     * @returns {boolean}
     * @private
     */
    _prefix(item) {
        for (const filter of this.p) {
            if (item.startsWith(filter)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests against registered regular expressions
     * @param item
     * @returns {boolean}
     * @private
     */
    _regexp(item) {
        for (const filter of this.r) {
            if (filter.test(item)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Tests against registered matchers
     * @param item
     * @returns {boolean}
     * @private
     */
    // eslint-disable no-empty
    _function(item) {
        for (const filter of this.f) {
            if (filter(item)) {
                return true;
            }
        }
        return false;
    }
}

module.exports = IgnoreList;
},
"./index.js": function (exports, require, module) {
"use strict";
require("./xhr.js");

const FetchRequest = require("./FetchRequest.js");
const FetchTransformManager = require("./FetchTransformManager.js");
const LogonManager = require("./LogonManager.js");
const FrameLogonManager = require("./FrameLogonManager.js");
const WindowLogonManager = require("./WindowLogonManager.js");
const XHRLogonManager = require("./XHRLogonManager.js");

/**
 * Starts the XHR library
 * @param {object} options
 * @param {boolean} [iframeAsWindow=false] Handle iframe scheme as window scheme
 * @public
 * @memberof xhrlib
 */
function start(options) {
    options = options || {};
    LogonManager.getInstance();
    XHRLogonManager.start();
    FrameLogonManager.start();
    WindowLogonManager.start();
    if (options.iframeAsWindow) {
        WindowLogonManager.getInstance().handleLegacyIFrame();
    }
}

/**
 * Stops the XHR library and aborts all pending authentications
 * @public
 * @memberof xhrlib
 */
function shutdown() {
    XHRLogonManager.shutdown();
    FrameLogonManager.shutdown();
    WindowLogonManager.shutdown();
    LogonManager.shutdown();
}

/**
 * XHR Library export
 * @public
 * @property {FetchTransformManager} fetchTransformManager FetchTransformManager singleton
 * @property {FrameLogonManager} frameLogonManager FrameLogonManager singleton
 * @property {LogonManager} logonManager LogonManager singleton
 * @property {WindowLogonManager} windowLogonManager WindowLogonManager singleton
 * @property {XHRLogonManager} xhrLogonManager XHRLogonManager singleton
 */
let xhrlib = {
    start,
    shutdown,
    FetchContext: require("./FetchContext.js"),
    FetchRequest,
    FetchTransformManager,
    FrameLogonManager,
    Log: require("./Log.js"),
    LogonManager,
    WindowLogonManager,
    XHRLogonManager,
    _getInternalModule: (name => require(name))
};

Object.defineProperties(xhrlib, {
    fetchTransformManager: {get: () => FetchTransformManager.getInstance()},
    frameLogonManager: {get: () => FrameLogonManager.getInstance()},
    logonManager: {get: () => LogonManager.getInstance()},
    windowLogonManager: {get: () => WindowLogonManager.getInstance()},
    xhrLogonManager: {get: () => XHRLogonManager.getInstance()},
});

module.exports = xhrlib;},
"./Log.js": function (exports, require, module) {
"use strict";

const ConsoleLogger = require("./ConsoleLogger.js");
const logMethods = ["error", "warning", "info", "debug"];

let xhrLogger, defaultLogger = new ConsoleLogger(global.console, "sap.xhrlib");

function hasMethods(x, methods) {
    for (const method of methods) {
        if (typeof x[method] !== "function") {
            return false;
        }
    }
    return true;
}

/**
 * Logging facade wrapping an underlying Logger object
 * @extends Logger
 * @public
 */
class Log {
    constructor(logger) {
        this._logger = logger;
    }

    /**
     * Gets the main XMLHttpRequest logger
     * @returns {Log}
     * @public
     */
    static get logger() {
        return xhrLogger;
    }

    static isLogger(x) {
        return Boolean(x && (typeof x === "object") && hasMethods(x, logMethods));
    }

    /**
     * Sets the main XMLHttpRequest logger
     * @param {Logger} x Underlying logging object
     * @public
     */
    static set(x) {
        if (x) {
            if (Log.isLogger(x)) {
                xhrLogger._logger = x;
            } else {
                throw new TypeError("Invalid logger.");
            }
        } else {
            xhrLogger._logger = defaultLogger;
        }
    }

    /**
     * Sets the log level for the main XMLHttpRequest logger
     * @param {int} level Log level
     * @public
     */
    static setLevel(level) {
        if (typeof xhrLogger._logger.setLevel === "function") {
            xhrLogger._logger.setLevel(level);
        }
    }
}

module.exports = Log;
xhrLogger = new Log(defaultLogger);

logMethods.forEach(function (method) {
    Log.prototype[method] = function (msg) {
        return this._logger[method](msg);
    };
});
},
"./LogonManager.js": function (exports, require, module) {
"use strict";
require("./xhr.js");

const EventEmitter = require("./EventEmitter.js");
const LogonRequest = require("./LogonRequest.js");

const xhrLogger = require("./Log.js").logger;

const LogonEvent = {
    LOGON: "logon",
    LOGON_COMPLETE: "logoncomplete",
    LOGON_FAILED: "logonfailed",
    LOGON_ABORTED: "logonaborted"
};

let logonManager;

/**
 * LogonManager handles unauthenticated HTTP requests
 * @property {string[]} schemes List of authentication schemes with registered handlers
 * @public
 */
class LogonManager {
    constructor() {
        xhrLogger.info("Creating Logon Manager");
        this.pending = null;
        this.queue = [];
        this.realms = {};
        this.authHandlers = {};
        this._schemes = [];
        this.handlers = new EventEmitter(Object.values(LogonEvent));
    }

    /**
     * Returns the LogonManager singleton and creates it if needed
     * @param {boolean} [noCreate=false] Does not create the LogonManager instance if it does not exist
     * @returns {LogonManager}
     * @public
     */
    static getInstance(noCreate) {
        if (!logonManager && !noCreate) {
            logonManager = new LogonManager();
        }
        return logonManager;
    }

    /**
     * Stops and destroys the LogonManager singleton
     * @public
     */
    static shutdown() {
        if (logonManager) {
            logonManager.shutdown();
            logonManager = undefined;
        }
    }

    get schemes() {
        return this._schemes.slice();
    }

    _collectSchemes() {
        this._schemes = Object.keys(this.authHandlers).sort();
    }

    /**
     * Registers an event handler
     * @param {LogonEvent} type Event type
     * @param {object|function} handler EventHandler: either a function or an object exposing an handleEvent function
     * @public
     */
    addEventListener(type, handler) {
        this.handlers.add(type, handler);
    }

    /**
     * Unregisters an event handler
     * @param {LogonEvent} type Event type
     * @param {object|function} handler EventHandler: either a function or an object exposing an handleEvent function
     * @public
     */
    removeEventListener(type, handler) {
        this.handlers.remove(type, handler);
    }

    /**
     * Registers an authentication handler for a given authentication scheme
     * @param {string} scheme
     * @param {object|function} handler
     * @public
     */
    registerAuthHandler(scheme, handler) {
        if (!EventEmitter.isHandler(handler)) {
            throw new TypeError("Invalid authentication handler");
        }
        let handlers = this.authHandlers[scheme];
        if (handlers) {
            if (handlers.indexOf(handler) === -1) {
                handlers.push(handler);
            }
        } else {
            handlers = [handler];
            this.authHandlers[scheme] = handlers;
            this._collectSchemes();
        }
    }

    /**
     * Unregisters an authentication handler for a given authentication scheme
     * @param {string} scheme
     * @param {object|function} handler
     * @public
     */
    unregisterAuthHandler(scheme, handler) {
        const handlers = this.authHandlers[scheme];
        if (handlers) {
            const i = handlers.indexOf(handler);
            if (i >= 0) {
                if (handlers.length === 1) {
                    delete this.authHandlers[scheme];
                    this._collectSchemes();
                } else {
                    handlers.splice(i, 1);
                }
            }
        }
    }

    /**
     * Unregisters all handlers for a given scheme or for all schemes
     * @param {string} [scheme]
     * @public
     */
    unregisterAllHandlers(scheme) {
        if (scheme) {
            delete this.authHandlers[scheme];
        } else {
            this.authHandlers = {};
        }
        this._collectSchemes();
    }

    /**
     * Returns the list of registered authentication handlers for a given scheme
     * @param {string} scheme
     * @returns {EventHandler[]}
     * @public
     */
    getAuthHandlers(scheme) {
        const handlers = this.authHandlers[scheme];
        const allHandlers = this.authHandlers["*"];
        if (handlers) {
            return allHandlers ? handlers.concat(allHandlers) : handlers.slice();
        }
        return allHandlers || [];
    }


    /**
     * Checks whether some handler has been registered for an authentication scheme
     * @param scheme
     * @returns {boolean}
     * @public
     */
    isSchemeHandled(scheme) {
        return this.getAuthHandlers(scheme).length > 0;
    }

    /**
     * Dispatches a Logon event
     * @param {Event} event
     * @private
     */
    dispatchEvent(event) {
        this.handlers.dispatch(event);
    }

    dispatchLogonEvent(request) {
        const event = new Event(LogonEvent.LOGON);
        event.request = request;
        this.dispatchEvent(event);
    }

    dispatchLogonCompletedEvent(response) {
        const event = new Event(LogonEvent.LOGON_COMPLETE);
        event.response = response;
        this.dispatchEvent(event);
    }

    dispatchLogonFailedEvent(response) {
        const event = new Event(LogonEvent.LOGON_FAILED);
        event.response = response;
        this.dispatchEvent(event);
    }

    dispatchLogonAbortedEvent(request) {
        const event = new Event(LogonEvent.LOGON_ABORTED);
        event.request = request;
        this.dispatchEvent(event);
    }

    /**
     * @param request
     * @returns {boolean}
     * @private
     */
    dispatchLogonRequest(request) {
        const event = new Event(LogonEvent.LOGON);
        event.request = request;
        const handlers = this.getAuthHandlers(request.scheme);
        let handled = false;
        for (const handler of handlers) {
            handled = EventEmitter.fireEvent(handler, event);
            if (handled) {
                break;
            }
        }
        return handled;
    }

    /**
     * Returns the queued LogonRequest for a given pending request
     * @param {PendingRequest} request
     * @returns {LogonRequest}
     * @public
     */
    getLogonRequest(request) {
        if (this.pending && this.pending.httpRequest === request) {
            return this.pending;
        }
        return this.queue.find(req => (req.httpRequest === request));
    }

    /**
     * Triggers a logon process
     * @param {object} request
     * @param {PendingRequest} request.httpRequest
     * @param {string} request.scheme
     * @param {string} [request.realm]
     * @returns {?LogonRequest} Queued logon request if authentication scheme is handled or null otherwise
     * @public
     */
    requestLogon(request) {
        const logonRequest = LogonRequest.cast(request);
        const {httpRequest, scheme} = logonRequest;
        const existingRequest = this.getLogonRequest(httpRequest);
        if (existingRequest) {
            xhrLogger.debug("Ignoring authentication request for already queued request " + httpRequest.url);
            return existingRequest;
        }
        xhrLogger.info("Authentication requested for " + httpRequest.url + " with scheme " + scheme);
        this.dispatchLogonEvent(logonRequest);
        let handled = false;
        if (this.isSchemeHandled(scheme)) {
            // Initiate Logon sequence only if someone handles it :-)
            if (this.pending) {
                xhrLogger.debug("Pending authentication process, queueing request");
                this.queue.push(logonRequest);
                handled = true;
            } else {
                xhrLogger.debug("Dispatching authentication request");
                this.pending = logonRequest;
                handled = this.dispatchLogonRequest(logonRequest);
            }
        } else {
            xhrLogger.info("No authentication handler registered for scheme " + scheme);
        }
        if (!handled) {
            xhrLogger.warning("Unsupported authentication request for scheme " + scheme);
            if (this.pending === logonRequest) {
                this.pending = null;
            }
            this._abort([logonRequest]);
            // Process awaiting requests
            this._processNext();
            return null;
        }
        return logonRequest;
    }

    _processQueue(realm) {
        const processQueue = [], waitingQueue = [];
        if (this.pending && (realm === this.pending.realm)) {
            processQueue.push(this.pending);
            this.pending = null;
        }
        for (const req of this.queue) {
            if (req.realm === realm) {
                processQueue.push(req);
            } else {
                waitingQueue.push(req);
            }
        }
        this.queue = waitingQueue;
        return processQueue;
    }

    _processNext() {
        if (!this.pending && this.queue.length > 0) {
            this.requestLogon(this.queue.shift());
        }
    }

    /**
     * Signals completion of a pending authentication
     * @param {object} response
     * @param {string} response.realm
     * @param {boolean} response.success
     * @param {string} response.realm Identity realm for which completion is reported
     * @param {boolean} response.success Authentication success
     * @public
     */
    logonCompleted(response) {
        const {realm, success} = response;
        const processQueue = this._processQueue(realm);
        if (processQueue.length > 0) {
            if (success) {
                xhrLogger.info("Authentication succeeded for realm " + realm + ", repeating requests.");
                this._retry(processQueue);
            } else {
                xhrLogger.warning("Authentication failed for realm " + realm);
                this._abort(processQueue);
            }
        }

        // Fire events to complete current logon process before initiating a new one
        if (success) {
            this.dispatchLogonCompletedEvent(response);
        } else {
            this.dispatchLogonFailedEvent(response);
        }

        // Process awaiting requests
        this._processNext();
    }

    /**
     * Abort Logon process for a given identity realm.
     * @param {string} [realm] Identity realm to abort (default to the pending authentication one)
     * @public
     */
    abortLogon(realm) {
        if (!realm && this.pending) {
            realm = this.pending.realm;
        }
        if (realm) {
            const processQueue = this._processQueue(realm);
            if (processQueue.length > 0) {
                xhrLogger.warning("Authentication aborted for realm " + realm);
                this._abort(processQueue);
                this._processNext();
            }
        } else {
            xhrLogger.info("No pending authentication, ignoring abort");
        }
    }

    /**
     * Repeats pending requests
     * @param {LogonRequest[]} queue
     */
    _retry(queue) {
        for (const request of queue) {
            request.httpRequest.repeat();
        }
    }

    /**
     * Aborts pending requests
     * @param {LogonRequest[]} requests
     */
    _abort(requests) {
        for (const request of requests) {
            // Authentication failed, fire abort event and propagate buffered initial events;
            this.dispatchLogonAbortedEvent(request);
            request.httpRequest.resume();
        }
    }

    /**
     * Aborts a pending requests
     * @param {LogonRequest} request
     * @public
     */
    abortRequest(request) {
        if (!(request instanceof LogonRequest)) {
            throw new TypeError("Invalid logon request");
        }
        let queued = false;
        if (this.pending === request) {
            queued = true;
            this.pending = null;
        } else {
            const i = this.queue.indexOf(request);
            if (i !== -1) {
                queued = true;
                this.queue.splice(i, 1);
            }
        }
        if (queued) {
            this._abort([request]);
            this._processNext();
        }
    }

    /**
     * Aborts all pending requests
     * @public
     */
    abortAll() {
        const processQueue = this.queue;
        this.queue = [];
        if (this.pending) {
            processQueue.push(this.pending);
            this.pending = null;
        }
        this._abort(processQueue);
    }

    /**
     * @private
     */
    shutdown() {
        xhrLogger.info("Logon Manager shutdown");
        this.abortAll();
    }

}

module.exports = LogonManager;

/**
 * Logon Event enumeration
 * @type {{LOGON: string, LOGON_COMPLETE: string, LOGON_FAILED: string, LOGON_ABORTED: string}}
 * @public
 */
LogonManager.LogonEvent = LogonEvent;
},
"./LogonRequest.js": function (exports, require, module) {
"use strict";

/**
 * Logon request
 * @property {PendingRequest} httpRequest
 * @property {string} scheme
 * @property {string} realm
 * @public
 */
class LogonRequest {
    /**
     * Constructs a new LogonRequest
     * @param {object} request
     * @param {PendingRequest} request.httpRequest
     * @param {string} request.scheme
     * @param {string} [request.realm=request.httpRequest.url]
     */
    constructor(request) {
        if (!LogonRequest.isValid(request)) {
            throw new TypeError("Invalid Logon request");
        }
        this.httpRequest = request.httpRequest;
        this.scheme = request.scheme;
        this.realm = request.realm || request.httpRequest.url;
    }

    /**
     * Checks if the LogonRequest is valid
     * @returns {boolean}
     */
    static isValid(request) {
        if (!request) {
            return false;
        }
        const {httpRequest, scheme} = request;
        return (httpRequest && httpRequest.url && scheme
            && typeof httpRequest.repeat === "function"
            && typeof httpRequest.resume === "function");
    }

    /**
     * Cast an object to a LogonRequest
     * @param {object} request
     * @returns {LogonRequest}
     */
    static cast(request) {
        return (request instanceof LogonRequest) ? request : new LogonRequest(request);
    }
}

module.exports = LogonRequest;
},
"./OpenWindowAlert.js": function (exports, require, module) {
"use strict";

/**
 * Window open dialog to avoid being blocked by pop-up blocker
 * @property {string} dialogId Element id of the alert dialog
 * @public
 */
class OpenWindowAlert {
    constructor() {
        this.dialogId = "sap-xhrlib-alert-" + Date.now().toString(36);
    }

    get openButtonId() {
        return this.dialogId + "-open";
    }

    get cancelButtonId() {
        return this.dialogId + "-cancel";
    }

    createHeader() {
        const header = document.createElement("div");
        header.style.fontSize = "1.25rem";
        header.style.textAlign = "center";
        header.style.marginBottom = "16px";
        header.style.color = "#003283";
        const text = document.createTextNode("Authentication required");
        header.appendChild(text);
        return header;
    }

    createButtons(onOpen, onCancel) {
        const block = document.createElement("div");
        block.style.width = "256px";
        block.style.margin = "0 auto";
        const loginButton = document.createElement("button");
        loginButton.id = this.openButtonId;
        setTimeout(function () {
            loginButton.focus();
        }, 300);
        loginButton.onclick = function () {
            onOpen();
        };
        loginButton.style.width = "120px";
        loginButton.style.height = "32px";
        loginButton.style.color = "#ffffff";
        loginButton.style.backgroundColor = "#5496cd";
        loginButton.style.border = "1px solid #367db8";
        loginButton.style.borderRadius = "4px";
        loginButton.style.testShadow = "0 1px #000000";
        loginButton.style.outline = "none";
        loginButton.onblur = function () {
            loginButton._focus = false;
            loginButton.style.testShadow = "0 1px #000000";
            loginButton.style.backgroundColor = "#5496cd";
            loginButton.style.borderColor = "#367db8";
        };
        loginButton.onfocus = function () {
            loginButton._focus = true;
            loginButton.style.testShadow = "none";
            loginButton.style.backgroundColor = "#427cac";
            loginButton.style.borderColor = "#427cac";
        };
        loginButton.onmouseover = function () {
            if (!loginButton._focus) {
                loginButton.style.backgroundColor = "#367db8";
                loginButton.style.borderColor = "#367db8";
            }
        };
        loginButton.onmouseout = function () {
            if (!loginButton._focus) {
                loginButton.style.backgroundColor = "#5496cd";
                loginButton.style.borderColor = "#367db8";
            }
        };
        const loginText = document.createTextNode("To sign in");
        loginButton.appendChild(loginText);

        const cancelButton = document.createElement("button");
        cancelButton.id = this.cancelButtonId;
        cancelButton.type = "button";
        cancelButton.onclick = function () {
            onCancel();
        };
        cancelButton.style.marginLeft = "16px";
        cancelButton.style.width = "120px";
        cancelButton.style.height = "32px";
        cancelButton.style.color = "#346187";
        cancelButton.style.backgroundColor = "#f7f7f7";
        cancelButton.style.border = "1px solid #ababab";
        cancelButton.style.borderRadius = "4px";
        cancelButton.style.outline = "none";
        cancelButton.onblur = function () {
            cancelButton._focus = false;
            cancelButton.style.backgroundColor = "#f7f7f7";
            cancelButton.style.borderColor = "#ababab";
        };
        cancelButton.onfocus = function () {
            cancelButton._focus = true;
            cancelButton.style.backgroundColor = "#bfbfbf";
            cancelButton.style.borderColor = "#ababab";
        };
        cancelButton.onmouseover = function () {
            if (!cancelButton._focus) {
                cancelButton.style.backgroundColor = "rgba(191, 191, 191, 0.5)";
                cancelButton.style.borderColor = "rgba(191, 191, 191, 0.5)";
            }
        };
        cancelButton.onmouseout = function () {
            if (!cancelButton._focus) {
                cancelButton.style.backgroundColor = "#f7f7f7";
                cancelButton.style.borderColor = "#ababab";
            }
        };
        const cancelText = document.createTextNode("Cancel");
        cancelButton.appendChild(cancelText);
        block.appendChild(loginButton);
        block.appendChild(cancelButton);
        return block;
    }


    createMain(onOpen, onCancel) {
        const main = document.createElement("div");
        main.style.width = "288px";
        main.style.margin = "0 auto";
        main.style.padding = "8px";
        main.style.backgroundColor = "#daeef8";
        main.style.border = "1px solid #00abfc";
        main.style.borderRadius = "4px";
        main.style.fontSize = "1rem";
        main.appendChild(this.createHeader());
        main.appendChild(this.createButtons(onOpen, onCancel));
        return main;
    }

    /**
     * Creates the "open window" dialog
     * @param {function} onOpen Callback function to call when user triggers the open window action
     * @param {function} onCancel Callback function to call when user triggers the cancel action
     * @protected
     */
    createAlertDialog(onOpen, onCancel) {
        const alertDialog = document.createElement("div");
        alertDialog.id = this.dialogId;
        alertDialog.style.position = "absolute";
        alertDialog.style.top = "0";
        alertDialog.style.left = "0";
        alertDialog.style.height = "100%";
        alertDialog.style.width = "100%";
        alertDialog.style.margin = "0";
        alertDialog.style.padding = "16px 0";
        alertDialog.style.zIndex = "99999";
        alertDialog.appendChild(this.createMain(onOpen, onCancel));
        return alertDialog;
    }

    /**
     * Shows the "open window" dialog
     * @param {function} onOpen Callback function to call when user triggers open window action
     * @param {function} onCancel Callback function to call when user cancels open window action
     * @public
     */
    show(onOpen, onCancel) {
        this.close();
        this.alertDialog = this.createAlertDialog(onOpen, onCancel);
        document.body.appendChild(this.alertDialog);
    }

    /**
     * Closes the "open window" dialog
     * @public
     */
    close() {
        if (this.alertDialog) {
            this.alertDialog.parentNode.removeChild(this.alertDialog);
            this.alertDialog = null;
        }
    }
}

module.exports = OpenWindowAlert;
},
"./UrlTimeout.js": function (exports, require, module) {
"use strict";

const lowerBound = require("./util.js").lowerBound;
const xhrLogger = require("./Log.js").logger;

/**
 * @Manages custom url based timeout configuration
 * @param {int} [defaultTimeout = 600] Default timeout
 * @class
 */
class UrlTimeout {
    constructor(defaultTimeout) {
        this.defaultTimeout = defaultTimeout;
        this.timeouts = {};
        this.timeoutIndex = [];
    }

    indexTimeouts() {
        this.timeoutIndex = Object.keys(this.timeouts);
        this.timeoutIndex.sort();
    }

    /**
     * Returns the timeout applying for a given URL
     * @param {string} url
     * @returns {int}
     */
    getTimeout(url) {
        const index = lowerBound(url, this.timeoutIndex);
        if (index >= 0) {
            const u = this.timeoutIndex[index];
            if (url.substring(0, u.length) === u) {
                return this.timeouts[u];
            }
        }
        return this.defaultTimeout;
    }

    /**
     * Defines a custom timeout for a given URL prefix
     * @param {string} url URL prefix
     * @param {int} value Timeout in milliseconds.
     */
    setTimeout(url, value) {
        if (!url || !value) {
            throw new TypeError("Invalid URL prefix or timeout value");
        }
        xhrLogger.info("Setting timeout " + value + " on " + url);
        this.timeouts[url] = value;
        this.indexTimeouts();
    }

    /**
     * Resets the timeout for a given URL prefix
     * @param {string} url URL prefix
     */
    resetTimeout(url) {
        xhrLogger.info("Reset timeout to default on " + url);
        delete this.timeouts[url];
        this.indexTimeouts();
    }
}

module.exports = UrlTimeout;
},
"./util.js": function (exports, require, module) {
"use strict";

/**
 * For a sorted array a, returns the index of largest element smaller or equal to x or -1 if such an element does not exist
 */
function lowerBound(x, a) {
    let i, v, s = 0, e = a.length - 1;
    if (e < 0 || x < a[0]) {
        return -1;
    }
    if (x >= a[e]) {
        return e;
    }
    --e;
    // We have always a[s] <= x < a[e + 1]
    while (s < e) {
        // when e = s + 1, i = e otherwise, interval [s, e] is divided by approximately 2
        i = (s + e + 1) >> 1; // integer division by 2, s < i <= e
        v = a[i];
        if (x < v) {
            e = i - 1;
        } else { // v <= x
            s = i;
        }
    }
    return s;
}

function nop() {
}

/**
 * Pads a number with leading 0
 * @param {int} num
 * @param {int} len
 * @returns {string}
 */
function pad(num, len) {
    return String(num).padStart(len, "0");
}

/**
 * Returns current time as HH:mm:ss.fff
 */
function time() {
    const now = new Date();
    let output = pad(now.getHours(), 2) + ":" + pad(now.getMinutes(), 2) + ":";
    output += pad(now.getSeconds(), 2) + "." + pad(now.getMilliseconds(), 3);
    return output;
}

/**
 * Reads a ReadableStream into a Blob
 * @param {ReadableStream} stream
 * @returns {Promise<Blob>}
 */
async function toBlob(stream) {
    const chunks = [], reader = stream.getReader();
    while (true) {
        const {value, done} = await reader.read();
        if (done) {
            break;
        }
        chunks.push(value);
    }
    return new Blob(chunks);
}

module.exports = {lowerBound, nop, pad, time, toBlob};
},
"./WindowLogonManager.js": function (exports, require, module) {
"use strict";

const LogonManager = require("./LogonManager.js");
const XHRLogonManager = require("./XHRLogonManager.js");
const DefaultLogonFrameProvider = require("./DefaultLogonFrameProvider.js");
const OpenWindowAlert = require("./OpenWindowAlert.js");
const UrlTimeout = require("./UrlTimeout.js");

const xhrLogger = require("./Log.js").logger;
let windowLogonManager = null;

/**
 * FrameLogonManager handles window and strict-window XHR Logon scheme
 * @property {OpenWindowAlert} alertDialog Dialog for prompting the user to open the login window in case of pop-up blocking
 * @property {int} pollingInterval Polling period for legacy iframe handling
 * @public
 */
class WindowLogonManager {
    constructor() {
        xhrLogger.debug("Creating WindowLogonManager");
        this.alertDialog = new OpenWindowAlert();
        this.frameProvider = new DefaultLogonFrameProvider();
        this._timeout = new UrlTimeout(WindowLogonManager.defaultTimeout);
        this.pollingInterval = 5000;
    }

    /**
     * Returns the WindowLogonManager singleton and creates it if needed
     * @param {boolean} [noCreate] Does not create the WindowLogonManager instance if it does not exist
     * @returns {FrameLogonManager}
     * @public
     */
    static getInstance(noCreate) {
        if (!windowLogonManager && !noCreate) {
            windowLogonManager = new WindowLogonManager();
        }
        return windowLogonManager;
    }

    /**
     * Starts WindowLogonManager singleton
     * @public
     */
    static start() {
        WindowLogonManager.getInstance().start();
    }

    /**
     * Shuts WindowLogonManager singleton down
     * @public
     */
    static shutdown() {
        if (windowLogonManager) {
            windowLogonManager.shutdown();
            windowLogonManager = null;
        }
    }


    start() {
        const logonManager = LogonManager.getInstance();
        logonManager.addEventListener(LogonManager.LogonEvent.LOGON_COMPLETE, this);
        logonManager.addEventListener(LogonManager.LogonEvent.LOGON_FAILED, this);
        logonManager.addEventListener(LogonManager.LogonEvent.LOGON_ABORTED, this);
        logonManager.registerAuthHandler(XHRLogonManager.logonScheme(XHRLogonManager.Scheme.STRICT_WINDOW), this);
        logonManager.registerAuthHandler(XHRLogonManager.logonScheme(XHRLogonManager.Scheme.WINDOW), this);
    }

    shutdown() {
        const logonManager = LogonManager.getInstance();
        this.abortLogon();
        logonManager.removeEventListener(LogonManager.LogonEvent.LOGON_COMPLETE, this);
        logonManager.removeEventListener(LogonManager.LogonEvent.LOGON_FAILED, this);
        logonManager.removeEventListener(LogonManager.LogonEvent.LOGON_ABORTED, this);
        logonManager.unregisterAuthHandler(XHRLogonManager.logonScheme(XHRLogonManager.Scheme.IFRAME), this);
        logonManager.unregisterAuthHandler(XHRLogonManager.logonScheme(XHRLogonManager.Scheme.STRICT_WINDOW), this);
        logonManager.unregisterAuthHandler(XHRLogonManager.logonScheme(XHRLogonManager.Scheme.WINDOW), this);
    }

    /**
     * Returns the timeout applying for a given URL
     * @param {string} url
     * @returns {int}
     * @public
     */
    getTimeout(url) {
        return this._timeout.getTimeout(url);
    }

    /**
     * Defines a custom timeout for a given URL prefix
     * @param {string} url
     * @param {int} [value] Timeout in milliseconds.
     * @public
     */
    setTimeout(url, value) {
        this._timeout.setTimeout(url, value);
    }

    /**
     * Resets the timeout for a given URL prefix
     * @param {string} url
     * @public
     */
    resetTimeout(url) {
        this._timeout.resetTimeout(url);
    }


    /**
     * Handles iframe XHR Logon as a window one (for legacy ABAP systems)
     * @public
     */
    handleLegacyIFrame() {
        const scheme = XHRLogonManager.logonScheme(XHRLogonManager.Scheme.IFRAME);
        const logonManager = LogonManager.getInstance();
        logonManager.unregisterAllHandlers(scheme);
        logonManager.registerAuthHandler(scheme, this);
    }

    onLogon(request) {
        let handled = true;
        if (this.pending) {
            this.onLogonEnd(this.pending.realm);
        }
        xhrLogger.debug("Processing " + request.scheme + " logon for realm " + request.realm);
        switch (XHRLogonManager.xhrScheme(request.scheme)) {
            case XHRLogonManager.Scheme.WINDOW:
                this.onWindowLogon(request);
                break;
            case XHRLogonManager.Scheme.STRICT_WINDOW:
                this.onStrictWindowLogon(request);
                break;
            case XHRLogonManager.Scheme.IFRAME:
                this.onWindowLogon(request, true);
                break;
            default:
                handled = false;
                xhrLogger.warning("WindowLogonManager unsupported request scheme " + request.scheme);
                break;
        }
        return handled;
    }

    onWindowLogon(request, legacyIframe) {
        const self = this;
        if (legacyIframe) {
            xhrLogger.debug("Processing iframe logon as window logon for realm " + request.realm);
        } else {
            xhrLogger.debug("Processing window logon for realm " + request.realm);
        }
        const {httpRequest} = request;
        const timeout = this.getTimeout(httpRequest.url);
        const url = new URL(httpRequest.url, window.location);
        url.searchParams.set("xhr-logon", legacyIframe ? "iframe" : "window");
        const frame = this.frameProvider.create();
        let cancelId;
        frame.onload = function () {
            if (cancelId) {
                // Frame has loaded a new page, reset previous timer
                clearTimeout(cancelId);
            }
            cancelId = setTimeout(function () {
                self.createWindow(legacyIframe);
            }, timeout);
        };
        frame.xhrTimeout = timeout;
        frame.src = url.href;
        this.pending = {request, realm: request.realm, frame: frame.id, url: url.href};
    }

    onStrictWindowLogon(request) {
        const {httpRequest} = request;
        const url = new URL(httpRequest.url, window.location);
        url.searchParams.set("xhr-logon", "strict-window");
        xhrLogger.debug("Processing strict-window logon for realm " + request.realm);
        this.pending = {request, realm: request.realm, url: url.href};
        this.createWindow();
    }

    static openWindow(url, target) {
        return window.open(url, target);
    }

    createWindow(polling) {
        const self = this;
        if (!this.pending) {
            return;
        }
        const auxWindow = WindowLogonManager.openWindow(this.pending.url, "_blank");
        if (!auxWindow || auxWindow.closed) {
            xhrLogger.warning("Failed to open logon window, alerting user");
            this.alertDialog.show(function () {
                self.createWindow(polling);
            }, function () {
                self.abortLogon();
            });
            return;
        }
        this.window = auxWindow;
        try {
            auxWindow.opener = window;
        } catch (err) {
            void err;
        }
        this.windowMonitorId = setInterval(function () {
            // In cross-origin scenario, we cannot attach event handler to the auxiliary window
            if (!self.window || self.window.closed) {
                self.abortLogon();
            }
        }, 300);
        if (polling) {
            self.pollIntervalId = setInterval(function () {
                // Robust coarse-grained polling
                self.poll();
            }, self.pollingInterval);
        }

        auxWindow.addEventListener("load", function () {
            xhrLogger.info("Logon window opened");
            if (self.closed) {
                return;
            }
            if (polling) {
                setTimeout(function () {
                    self.poll();
                }, 300);
            }
            self.windowIntervalId = setInterval(function () {
                // Fine-grained polling
                try {
                    if (polling && typeof self.window.notifyParent === "function") {
                        self.poll();
                    }
                } catch (err) {
                    xhrLogger.warning("Logon polling failed: " + err.message);
                }
            }, 300);
        });
        auxWindow.addEventListener("close", function () {
            self.abortLogon();
        });
        setTimeout(function () {
            try {
                if (self.window) {
                    self.window.focus();
                }
            } catch (err) {
                xhrLogger.warning("Failed to switch focus to logon window");
            }
        }, 300);
    }

    poll() {
        if (this.pending) {
            // Force frame destruction and recreation as forcing reload seems not to be working
            const frame = this.frameProvider.create();
            this.pending.frame = frame.id;
            frame.src = this.pending.url;
        }
    }

    stopPolling() {
        if (this.windowMonitorId) {
            clearInterval(this.windowMonitorId);
            this.windowMonitorId = undefined;
        }
        if (this.windowIntervalId) {
            clearInterval(this.windowIntervalId);
            this.windowIntervalId = undefined;
        }
        if (this.pollIntervalId) {
            clearInterval(this.pollIntervalId);
            this.pollIntervalId = undefined;
        }
    }

    onLogonEnd(realm) {
        if (this.pending && realm === this.pending.realm) {
            this.stopPolling();
            this.frameProvider.destroy();
            this.alertDialog.close();
            if (this.window) {
                this.window.close();
                this.window = undefined;
            }
            this.pending = undefined;
        }
    }

    abortLogon() {
        if (this.pending) {
            xhrLogger.debug("Cancelling pending logon for realm " + this.pending.request);
            LogonManager.getInstance().abortLogon(this.pending.realm);
        }
    }

    handleEvent(event) {
        let handled = false;
        switch (event.type) {
            case LogonManager.LogonEvent.LOGON:
                handled = this.onLogon(event.request);
                break;
            case LogonManager.LogonEvent.LOGON_COMPLETE:
            case LogonManager.LogonEvent.LOGON_FAILED:
                this.onLogonEnd(event.response.realm);
                break;
            case LogonManager.LogonEvent.LOGON_ABORTED:
                if (this.pending && this.pending.request === event.request) {
                    this.onLogonEnd(event.request.realm);
                }
                break;
        }
        return handled;
    }
}

module.exports = WindowLogonManager;

/**
 * Default frame timeout to allow for silent re-authentication (e.g. browser still has a valid Identity Provider session)
 * @type {int}
 */
WindowLogonManager.defaultTimeout = 600;
},
"./xhr.js": function (exports, require, module) {
// ------------------------------------------------------------
// XMLHttpRequest enhancement
// ------------------------------------------------------------
"use strict";

const SAP_ENHANCED = "_SAP_ENHANCED";

function xhrEnhance() {
    const Log = require("./Log.js");
    const ChannelFactory = require("./ChannelFactory.js");
    const EventEmitter = require("./EventEmitter.js");

    const progressEvents = ["loadstart", "progress", "abort", "error", "load", "timeout", "loadend"];
    const xhrEvents = progressEvents.concat("readystatechange");
    const XMLHttpRequestPrototype = XMLHttpRequest.prototype;
    const xhrLogger = Log.logger;
    let uuid = 0;

    // Save reference to original XHR constructor in case it gets overloaded (e.g. by SinonJS)
    const _XMLHttpRequest = XMLHttpRequest;

    XMLHttpRequest[SAP_ENHANCED] = true;
    XMLHttpRequest.channelFactory = new ChannelFactory();

    function makeProtected(obj, members) {
        for (const member of members) {
            const fn = obj[member];
            if (fn) {
                const _member = "_" + member;
                const _fn = obj[_member];
                if (!_fn) {
                    obj[_member] = fn;
                }
            }
        }
    }

    makeProtected(XMLHttpRequestPrototype, ["abort", "open", "setRequestHeader", "send", "addEventListener", "removeEventListener"]);

    XMLHttpRequestPrototype._getHandlers = function () {
        let h = this._handlers;
        if (!h) {
            h = new EventEmitter(xhrEvents);
            this._handlers = h;
        }
        return h;
    };
    XMLHttpRequestPrototype.handleEvent = function (event) {
        this._getHandlers().dispatch(event);
    };
    XMLHttpRequestPrototype.suspendEvents = function () {
        this._getHandlers().suspended = true;
    };
    XMLHttpRequestPrototype.resumeEvents = function (release) {
        const handlers = this._getHandlers();
        handlers.suspended = false;
        if (release) {
            handlers.releaseEvents();
        } else {
            handlers.clearEvents();
        }
    };
    XMLHttpRequestPrototype.clearEvents = function () {
        this._getHandlers().clearEvents();
    };
    XMLHttpRequestPrototype.getEventHandler = function () {
        const self = this;
        let fnHandler = this._fnHandler;
        if (!fnHandler) {
            fnHandler = function (event) {
                self.handleEvent(event);
            };
            this._fnHandler = fnHandler;
        }
        return fnHandler;
    };
    XMLHttpRequestPrototype._checkEventSubscription = function (type, handlers) {
        // Some browser do not support multiple registrations of the same event handler
        handlers = handlers || this._getHandlers();
        if (!handlers.subscribed(type)) {
            this._addEventListener(type, this.getEventHandler());
            handlers.subscribe(type);
        }
    };

    XMLHttpRequestPrototype._checkEventSubscriptions = function () {
        const handlers = this._getHandlers();
        for (const xhrEvent of xhrEvents) {
            this._checkEventSubscription(xhrEvent, handlers);
        }
    };

    // ------------------------------------------------------------
    //      XMLHttpRequest override
    // ------------------------------------------------------------
    XMLHttpRequestPrototype.addEventListener = function (type, callback) {
        this._getHandlers().add(type, callback);
    };
    XMLHttpRequestPrototype.removeEventListener = function (type, callback) {
        this._getHandlers().remove(type, callback);
    };

    function protectEventHandler(event) {
        Object.defineProperty(XMLHttpRequestPrototype, "on" + event, {
            configurable: true,
            get: function () {
                return this["_on" + event] || null;
            },
            set: function (value) {
                const member = "_on" + event;
                if (this[member]) {
                    this.removeEventListener(event, this[member]);
                }
                if (typeof value === "function" || typeof value === "object") {
                    this[member] = value;
                    if (EventEmitter.isHandler(value)) {
                        this.addEventListener(event, value);
                    }
                } else {
                    this[member] = null;
                }
            }
        });
    }

    xhrEvents.forEach(function (event) {
        protectEventHandler(event);
    });

    /**
     * Cancels any network activity.
     * (XMLHttpRequest standard)
     */
    XMLHttpRequestPrototype.abort = function () {
        let channel;
        try {
            channel = this._channel;
            if (channel) {
                xhrLogger.debug("Aborting request " + channel.method + " " + channel.url);
                channel.aborting();
                this._abort();
                channel.aborted();
            } else {
                xhrLogger.debug("Aborting request");
                this._abort();
            }
        } catch (error) {
            xhrLogger.warning("Failed to abort request: " + error.message);
            if (channel) {
                channel.catch(error);
            } else {
                throw error;
            }
        }
    };

    /**
     * Sets the request method, request URL, and synchronous flag.
     * Throws a JavaScript TypeError if either method is not a valid HTTP method or url cannot be parsed.
     * Throws a "SecurityError" exception if method is a case-insensitive match for CONNECT, TRACE or TRACK.
     * Throws an "InvalidAccessError" exception if async is false, the JavaScript global environment is a document environment, and either the timeout attribute is not zero, the withCredentials attribute is true, or the responseType attribute is not the empty string.
     * (XMLHttpRequest standard)
     * @param {string} method
     * @param {string} url
     * @param {boolean} async
     * @param {string} username
     * @param {string} password
     */
    XMLHttpRequestPrototype.open = function (method, url, async, username, password) {
        //  Cf. XHR specification
        //      If the async argument is omitted, set async to true, and set username and password to null.
        //      Due to unfortunate legacy constraints, passing undefined for the async argument is treated differently from async being omitted.
        this._id = ++uuid;
        xhrLogger.debug("Opening request #" + this._id + " " + method + " " + url);
        const arglen = arguments.length;
        if (arglen <= 2) {
            async = true;
        }
        const origMethod = method;
        const origUrl = url;
        this._getHandlers().clearEvents(); // Clear possibly lingering events from previous execution
        const channel = _XMLHttpRequest.channelFactory.create(this, method, url, async, username, password);
        this._channel = channel;
        try {
            this._clearParams(); // In case of XHR reuse, delete previously stored replay data
            channel.opening();
            // Allow channels to overload URL and method (e.g. for method tunneling)
            method = channel.method;
            url = channel.url;
            if ((origUrl !== url) || (origMethod !== method)) {
                xhrLogger.debug("Rewriting request #" + this._id + " to " + method + " " + url);
            }
            if (arglen <= 2) {
                this._open(method, url);
            } else {
                this._open(method, url, async, username, password);
            }
            channel.opened();

            // Always listen to readystatechange event AFTER all filters
            this._checkEventSubscriptions();
            this._removeEventListener("readystatechange", this.getEventHandler());
            this._addEventListener("readystatechange", this.getEventHandler());
        } catch (error) {
            xhrLogger.warning("Failed to open request #" + this._id + " " + method + " " + url + ": " + error.message);
            channel.catch(error);
        }
    };

    /**
     * Appends an header to the list of author request headers, or if header is already in the list of author request headers, combines its value with value.
     * Throws an "InvalidStateError" exception if the state is not OPENED or if the send() flag is set.
     * Throws a JavaScript TypeError if header is not a valid HTTP header field name or if value is not a valid HTTP header field value.
     * (XMLHttpRequest standard)
     * @param {string} header
     * @param {string} value
     */
    XMLHttpRequestPrototype.setRequestHeader = function (header, value) {
        if (typeof value !== "string") {
            value = String(value);
        }
        this._setRequestHeader(header, value);
        const normalizedHeader = header.toLowerCase();
        const headers = this.headers;
        if (headers[normalizedHeader] === undefined) {
            headers[normalizedHeader] = value;
        } else {
            // If header is in the author request headers list, append ",", followed by U+0020, followed by value, to the value of the header matching header.
            headers[normalizedHeader] += ", " + value;
        }
    };

    /**
     * Performs a setRequestHeader for all own properties of the headers object
     * (non standard)
     * @param {object} headers
     */
    XMLHttpRequestPrototype.setRequestHeaders = function (headers) {
        if (typeof headers === "object") {
            const headerNames = Object.getOwnPropertyNames(headers);
            for (const header of headerNames) {
                this.setRequestHeader(header, headers[header]);
            }
        }
    };

    /**
     * Initiates the request. The optional argument provides the request entity body. The argument is ignored if request method is GET or HEAD.
     * Throws an "InvalidStateError" exception if the state is not OPENED or if the send() flag is set.
     * (XMLHttpRequest standard)
     * @param data
     */
    XMLHttpRequestPrototype.send = function (data) {
        let channel, method, url;
        try {
            channel = this._channel;
            if (channel) {
                // channel might not exist if object is not in the right state.
                // We let the native "send" method throw the corresponding exception
                method = channel.method;
                url = channel.url;
                xhrLogger.debug("Sending request #" + this._id + " " + method + " " + url);
                channel.sending();
            }
            this._saveParams(data);
            this._send(data);
            if (channel) {
                channel.sent();
            }
        } catch (error) {
            if (method) {
                xhrLogger.warning("Failed to send request #" + this._id + " " + method + " " + url + ": " + error.message);
            } else {
                xhrLogger.warning("Failed to send request #" + this._id + ": " + error.message);
            }
            if (channel) {
                channel.catch(error);
            } else {
                throw error;
            }
        }
    };

    // ------------------------------------------------------------
    //      XMLHttpRequest enhancement
    // ------------------------------------------------------------
    /**
     * Retrieves the current value of a request header
     * (non standard)
     * @param {string} header
     * @returns {string}
     */
    XMLHttpRequestPrototype.getRequestHeader = function (header) {
        return this.headers[header.toLowerCase()];
    };

    /**
     * Deletes the repeat data for a given request header @see XMLHttpRequest#repeat
     * (non standard)
     * @param {string} header name of the HTTP header
     */
    XMLHttpRequestPrototype.deleteRepeatHeader = function (header) {
        delete this.headers[header.toLowerCase()];
    };

    /**
     * Changes the repeat data for a given request header @see XMLHttpRequest#repeat
     * (non standard)
     * @param {string} header
     * @param {string} value
     */
    XMLHttpRequestPrototype.setRepeatHeader = function (header, value) {
        this.headers[header.toLowerCase()] = value;
    };

    /**
     * Reopens a request and restores the settings and headers from the previous execution
     * (non standard)
     */
    XMLHttpRequestPrototype.reopen = function () {
        const channel = this._channel;
        let method, url;
        if (channel) {
            method = channel.method;
            url = channel.url;
            xhrLogger.debug("Reopening request #" + this._id + " " + method + " " + url);
        } else {
            throw new TypeError("Cannot reopen request");
        }
        try {
            channel.reopening();
            channel.opening();
            this._open(method, url, channel.async, channel.username, channel.password);
            channel.opened();
            this._restoreParams();
            this.resumeEvents(); // Resume events and clear possibly lingering events from previous execution
        } catch (error) {
            xhrLogger.warning("Failed to reopen request #" + this._id + " " + method + " " + url + ": " + error.message);
            channel.catch(error);
        }
    };

    /**
     * Repeats a request
     * (non standard)
     */
    XMLHttpRequestPrototype.repeat = function () {
        const channel = this._channel, self = this;
        if (!channel) {
            throw new TypeError("Cannot repeat request");
        }
        setTimeout(function () {
            self.abort();
            self.reopen();
            self.send(self._data);
        }, 0);
    };

    XMLHttpRequestPrototype.toString = function () {
        const channel = this._channel;
        let str = "[object XMLHttpRequest]";
        if (channel) {
            str += " #" + this._id + " " + channel.method + " " + channel.url;
        }
        return str;
    };

    Object.defineProperties(XMLHttpRequestPrototype, {
        "channel": {
            get: function () {
                return this._channel;
            }
        },
        "headers": {
            get: function () {
                let headers = this._headers;
                if (!headers) {
                    headers = {};
                    this._headers = headers;
                }
                return headers;
            }
        },
        "id": {
            get: function () {
                return this._id;
            }
        }
    });

    // ------------------------------------------------------------
    //      Implementation
    // ------------------------------------------------------------
    XMLHttpRequestPrototype._clearParams = function () {
        delete this._headers;
        delete this._withCredentials;
        delete this._timeout;
        delete this._data;
    };
    XMLHttpRequestPrototype._restoreParams = function () {
        if (this._headers) {
            const headers = this._headers;
            this._headers = {};
            this.setRequestHeaders(headers);
        }
        if (this._withCredentials) {
            this.withCredentials = true;
        }
        const timeout = this._timeout;
        if (timeout) {
            this.timeout = timeout;
        }
    };
    XMLHttpRequestPrototype._saveParams = function (data) {
        if ((data !== undefined) && (data !== null)) {
            this._data = data;
        }
        if (this.withCredentials) {
            this._withCredentials = true;
        }
        const timeout = this.timeout;
        if (timeout) {
            this._timeout = timeout;
        }
    };
    Object.defineProperties(XMLHttpRequest, {
        "logger": {
            get: function () {
                return Log.logger;
            },
            set: function (logger) {
                Log.logger = logger;
            }
        }
    });
}

if (!XMLHttpRequest[SAP_ENHANCED]) {
    xhrEnhance();
}
module.exports = XMLHttpRequest;
},
"./XHRLogonFilter.js": function (exports, require, module) {
"use strict";

const {parseXHRLogonHeader} = require("./httpUtil.js");
const {X_REQUESTED_WITH, X_XHR_LOGON} = require("./constants.js");

const HEADERS_RECEIVED = 2, DONE = 4;

class XHRLogonFilter {
    constructor(manager, channel) {
        this.manager = manager;
        this.channel = channel;
        this.ignore = (this.manager.ignore && this.manager.ignore.ignored(channel.url));
        // Listen on the readystatechange event as this is the first one to be fired upon completion
        if (!this.ignore) {
            channel.xhr._addEventListener("readystatechange", this);
        }
    }

    sending(channel) {
        const url = new URL(channel.url, location.href);
        if (url.origin !== location.origin && !channel.xhr.withCredentials) {
            // Ignore Cross-Origin requests if withCredentials attribute is not set
            this.ignore = true;
        }
        if (this.ignore) {
            return;
        }
        const xhr = channel.xhr;
        const accept = this.manager.accept().join(",");
        if (xhr.getRequestHeader(X_XHR_LOGON) === undefined) {
            xhr.setRequestHeader(X_XHR_LOGON, "accept=" + JSON.stringify(accept));
        }
        if (xhr.getRequestHeader(X_REQUESTED_WITH) === undefined) {
            xhr.setRequestHeader(X_REQUESTED_WITH, "XMLHttpRequest");
        }
    }

    handleEvent() {
        const channel = this.channel;
        const xhr = channel.xhr;
        if (xhr.readyState < HEADERS_RECEIVED || xhr.status !== 403 || !channel.async) {
            return;
        }
        const httpHeader = xhr.getResponseHeader(X_XHR_LOGON);
        let accept, repeat;
        if (httpHeader) {
            xhr.suspendEvents();
            const xhrLogonHeader = parseXHRLogonHeader(httpHeader);
            accept = xhrLogonHeader.accept;
            for (let i = 0; i < accept.length; ++i) {
                if (accept[i] === "repeat") {
                    accept.splice(i, 1); // remove repeat from accept list to prevent looping
                    repeat = true;
                    break;
                }
            }
            if (xhr.readyState === DONE) {
                if (repeat && !channel.repeated) {
                    channel.repeated = true; // Prevent looping
                    accept = this.manager.accept(accept);
                    xhr.setRepeatHeader(X_XHR_LOGON, "accept=\"" + accept.join(",") + "\"");
                    xhr.repeat();
                } else {
                    this.manager.requestLogon(channel, xhrLogonHeader);
                }
            }
        }
    }
}

module.exports = XHRLogonFilter;
},
"./XHRLogonManager.js": function (exports, require, module) {
"use strict";

const {X_REQUESTED_WITH, X_XHR_LOGON} = require("./constants.js");
const _XMLHttpRequest = require("./xhr.js");
const IgnoreList = require("./IgnoreList.js");
const XHRLogonFilter = require("./XHRLogonFilter.js");
const LogonManager = require("./LogonManager.js");
const FetchTransformManager = require("./FetchTransformManager.js");
const XHRLogonPendingRequest = require("./XHRLogonPendingRequest.js");

const xhrLogger = require("./Log.js").logger;

const XHR_LOGON_PREFIX = "xhrlogon.";
const xhrLogonRegExp = /^\s*\{\s*"xhrLogon"\s*:/;
const NW_BASE_REALM = "SAP NetWeaver Application Server [";

let xhrLogonManager = null;


// Helper functions
function isSuccess(status) {
    return (status >= 200 && status < 300) || (status === 304);
}

function xhrLogonSchemes() {
    const schemes = [], allSchemes = LogonManager.getInstance().schemes;
    for (const scheme of allSchemes) {
        if (scheme.startsWith(XHR_LOGON_PREFIX)) {
            schemes.push(scheme.substring(XHR_LOGON_PREFIX.length));
        }
    }
    schemes.push(XHRLogonManager.Scheme.REPEAT); // Accept "repeat" scheme even if no handler is attached to it
    return schemes;
}

function effectiveRealm(realm) {
    if (!realm) {
        return "";
    }
    if (realm.startsWith(NW_BASE_REALM)) {
        return realm.substring(0, NW_BASE_REALM.length + 3) + "]";
    }
    return realm;
}

/**
 * XHRLogonManager handles XHR Logon protocol on the client
 * @property {string[]} schemes List of authentication schemes with registered handlers
 * @property {string[]} acceptOrder Ordered list of schemes in decreasing priority for scheme negotiation
 * @public
 */
class XHRLogonManager {
    constructor() {
        const self = this;
        xhrLogger.info("Creating XHR Logon Manager");
        this.eventHandler = function (event) {
            self.handleEvent(event);
        };
        this.filterFactory = function (channel) {
            channel.filters.push(new XHRLogonFilter(self, channel));
        };
    }

    /**
     * Returns the XHRLogonManager singleton and creates it if needed
     * @param {boolean} [noCreate] Does not create the LogonManager instance if it does not exist
     * @returns {XHRLogonManager}
     * @public
     */
    static getInstance(noCreate) {
        if (!xhrLogonManager && !noCreate) {
            xhrLogonManager = new XHRLogonManager();
        }
        return xhrLogonManager;
    }

    /**
     * Starts WindowLogonManager singleton
     * @public
     */
    static start() {
        XHRLogonManager.getInstance().start();
    }

    /**
     * Stops and destroys the XHRLogonManager singleton
     * @public
     */
    static shutdown() {
        if (xhrLogonManager) {
            xhrLogonManager.shutdown();
            xhrLogonManager = null;
        }
    }

    /**
     * Returns the Logon scheme associated to a given XHR-Logon scheme
     * @param {string} xhrScheme XHR Logon scheme (e.g. "repeat", "iframe", ...)
     * @returns {string} Logon scheme (i.e. `xhrlogon.${xhrScheme}`)
     * @public
     */
    static logonScheme(xhrScheme) {
        return XHR_LOGON_PREFIX + xhrScheme;
    }

    /**
     * Returns the XHR-Logon scheme associated to a given Logon scheme
     * @param {string} scheme Logon scheme (e.g. "xhrlogon.iframe", ...)
     * @returns {string} XHR-Logon scheme
     * @public
     */
    static xhrScheme(scheme) {
        return scheme.startsWith(XHR_LOGON_PREFIX) ? scheme.substring(XHR_LOGON_PREFIX.length) : "none";
    }

    /**
     * XHR logon request transform
     * @param {Request} request
     * @returns {Promise<undefined>}
     */
    static async xhrLogonRequestTransform(request) {
        let anonymous;
        const url = new URL(request.url);
        if (url.origin === window.location.origin) {
            anonymous = (request.credentials === 'omit');
        } else {
            anonymous = (request.credentials !== 'include');
        }

        if (anonymous) {
            // XHR Logon is meaningless on anonymous requests :-)
            return;
        }

        const accept = XHRLogonManager.getInstance().accept().join(",");
        if (!request.headers.has(X_XHR_LOGON)) {
            request.headers.set(X_XHR_LOGON, "accept=" + JSON.stringify(accept));
        }
        if (!request.headers.has(X_REQUESTED_WITH)) {
            request.headers.set(X_REQUESTED_WITH, "XMLHttpRequest");
        }
    }

    /**
     * XHR logon response transform
     * @param {Response} response
     * @returns {Promise<?Response>}
     */
    static async xhrLogonResponseTransform(response) {
        let pendingRequest = XHRLogonPendingRequest.getPendingRequest(response);
        if (pendingRequest) {
            return pendingRequest.onRepeatResponse(response);
        }
        if (response.status !== 403 || !response.headers.has(X_XHR_LOGON)) {
            return null;
        }
        pendingRequest = new XHRLogonPendingRequest(XHRLogonManager.getInstance(), response);
        return pendingRequest.processResponse();
    }

    /**
     * XHRLogonManager initialization
     */
    start() {
        if (!this.started) {
            xhrLogger.info("XHR Logon Manager startup");
            this.ignore = new IgnoreList();
            this._initializeTrustedOrigins();
            this._registerFilterFactory();
            this.acceptOrder = XHRLogonManager.defaultAccept.slice();
            window.addEventListener("message", this.eventHandler);
            const transformManager = FetchTransformManager.getInstance();
            transformManager.addTransform("request", XHRLogonManager.xhrLogonRequestTransform);
            transformManager.prependTransform("response", XHRLogonManager.xhrLogonResponseTransform);
            this.started = true;
        }
    }


    /**
     * XHRLogonManager shutdown
     */
    shutdown() {
        if (this.started) {
            xhrLogger.info("XHR Logon Manager shutdown");
            window.removeEventListener("message", this.eventHandler);
            this._unregisterFilterFactory();
            this.started = false;
        }
    }

    /**
     * Return the accepted schemes (optionally from a list of schemes)
     * @param {string[]} [schemes] List of schemes
     * @returns {string[]} List of client accepted schemes (in case of scheme mismatch, the "none" scheme will be added)
     */
    accept(schemes) {
        const accept = [], logonManager = LogonManager.getInstance();
        schemes = schemes || xhrLogonSchemes();
        if (schemes.length) {
            for (const scheme of schemes) {
                if (logonManager.isSchemeHandled(XHRLogonManager.logonScheme(scheme))) {
                    accept.push(scheme);
                }
            }
        }
        if (!accept.length) {
            accept.push(XHRLogonManager.Scheme.NONE);
        }
        return accept;
    }

    /**
     * Determines a suitable scheme from server accept list and client preferences
     * @param {string[]} schemes List of server accepted schemes
     * @returns {string} accepted scheme
     */
    acceptScheme(schemes) {
        if (!schemes || !schemes.length) {
            return XHRLogonManager.Scheme.NONE;
        }
        const acceptMap = {};
        for (const scheme of schemes) {
            acceptMap[scheme] = true;
        }
        const logonManager = LogonManager.getInstance();
        let result = XHRLogonManager.Scheme.NONE;
        for (const scheme of this.acceptOrder) {
            if (logonManager.isSchemeHandled(XHRLogonManager.logonScheme(scheme)) && acceptMap[scheme]) {
                result = scheme;
                break;
            }
        }
        return result;
    }

    /**
     * Triggers XHR Logon process
     * @param {Channel} channel
     * @param {object} xhrLogonRequest
     */
    requestLogon(channel, xhrLogonRequest) {
        const scheme = this.acceptScheme(xhrLogonRequest.accept);
        LogonManager.getInstance().requestLogon({
            httpRequest: channel,
            realm: effectiveRealm(xhrLogonRequest.realm),
            scheme: XHRLogonManager.logonScheme(scheme)
        });
    }

    /**
     * Registers an authentication handler for a given XHR Logon scheme
     * @param {string} scheme
     * @param {object|function} handler
     */
    registerAuthHandler(scheme, handler) {
        scheme = XHRLogonManager.logonScheme(scheme);
        LogonManager.getInstance().registerAuthHandler(scheme, handler);
    }

    /**
     * Unregisters an authentication handler for a given XHR Logon scheme
     * @param {string} scheme
     * @param {object|function} handler
     */
    unregisterAuthHandler(scheme, handler) {
        scheme = XHRLogonManager.logonScheme(scheme);
        LogonManager.getInstance().unregisterAuthHandler(scheme, handler);
    }

    /**
     * @private
     * @param event
     */
    handleEvent(event) {
        const data = event.data;
        if (xhrLogonRegExp.test(data)) {
            try {
                if (this.isTrusted(event.origin)) {
                    const xhrLogonStatus = JSON.parse(data);
                    if (typeof xhrLogonStatus.xhrLogon !== "object") {
                        xhrLogger.warning("Invalid xhrLogon message: " + data);
                    } else {
                        xhrLogonStatus.xhrLogon.realm = effectiveRealm(xhrLogonStatus.xhrLogon.realm);
                        xhrLogonStatus.xhrLogon.success = isSuccess(xhrLogonStatus.xhrLogon.status);
                        LogonManager.getInstance().logonCompleted(xhrLogonStatus.xhrLogon);
                    }
                } else {
                    xhrLogger.warning("Received xhrlogon message from untrusted origin " + event.origin);
                }
            } catch (error) {
                xhrLogger.warning("Invalid xhrLogon message: " + data);
            }
        }
    }

    _initializeTrustedOrigins() {
        // Note: http://www.example.com yields "" port on Chrome and Firefox but "80" on IE
        const origins = {}, loc = window.location, protocol = loc.protocol;
        origins[protocol + "//" + loc.host] = true;
        switch (protocol) {
            case "http:":
                if (loc.port === "") {
                    origins["http://" + loc.hostname + ":80"] = true;
                } else if (loc.port === "80") {
                    origins["http://" + loc.hostname] = true;
                }
                break;
            case "https:":
                if (loc.port === "") {
                    origins["https://" + loc.hostname + ":443"] = true;
                } else if (loc.port === "443") {
                    origins["https://" + loc.hostname] = true;
                }
                break;
            default:
                break;
        }
        this._trustedOrigins = origins;
    }

    isTrusted(origin) {
        return Boolean(this._trustedOrigins[origin]);
    }

    /**
     * Declares an origin (scheme://hostname[:port]) as trusted.
     * @param {string} origin
     */
    addTrustedOrigin(origin) {
        this._trustedOrigins[origin] = true;
    }

    _registerFilterFactory() {
        if (_XMLHttpRequest.channelFactory) {
            _XMLHttpRequest.channelFactory.addFilterFactory(this.filterFactory);
        }
    }

    _unregisterFilterFactory() {
        if (_XMLHttpRequest.channelFactory) {
            _XMLHttpRequest.channelFactory.removeFilterFactory(this.filterFactory);
        }
    }
}

module.exports = XHRLogonManager;

// Standard scheme names
XHRLogonManager.Scheme = {
    NONE: "none",
    REPEAT: "repeat",
    IFRAME: "iframe",
    WINDOW: "window",
    STRICT_WINDOW: "strict-window"
};

/// Default scheme order for scheme negotiation
XHRLogonManager.defaultAccept = [
    XHRLogonManager.Scheme.REPEAT, XHRLogonManager.Scheme.IFRAME,
    XHRLogonManager.Scheme.WINDOW, XHRLogonManager.Scheme.STRICT_WINDOW
];
},
"./XHRLogonPendingRequest.js": function (exports, require, module) {
"use strict";

const {nop} = require("./util.js");
const {abortError, parseXHRLogonHeader} = require("./httpUtil.js");
const FetchContext = require("./FetchContext.js");
const {X_XHR_LOGON} = require("./constants.js");

/**
 *  Pending Fetch request with ongoing XHR logon
 *  @property {Promise<Response>} responsePromise Promise eventually fulfilled to either the original response
 *      or the response to the repeated request after authentication
 */
class XHRLogonPendingRequest {
    constructor(manager, response) {
        this.manager = manager;
        this.originalResponse = response;
        this.context = FetchContext.get(response);
        this.url = this.context.request.url;
        this.context.xhrLogon = {pending: this};
        this.responsePromise = new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    static getPendingRequest(response) {
        const {xhrLogon} = FetchContext.get(response);
        return xhrLogon && xhrLogon.pending;
    }

    /**
     * Handles fetch response with an XHR Logon challenge
     * @returns {Promise<Response>}
     */
    async processResponse() {
        const xhrLogonHeader = parseXHRLogonHeader(this.originalResponse.headers.get(X_XHR_LOGON));
        if (!this.context.xhrLogon.repeat && xhrLogonHeader.accept.indexOf("repeat") !== -1) {
            this.context.xhrLogon.repeat = true;
            this.context.fetchRequest.execute().catch(nop);
        } else {
            this.manager.requestLogon(this, xhrLogonHeader);
        }

        return this.responsePromise;
    }

    async onRepeatResponse(response) {
        if (this.context.xhrLogon.repeat && response.status === 403 &&
            response.headers.has(X_XHR_LOGON)) {
            // XHR Logon repeat scheme has failed, trigger full blown authentication
            return this.processResponse();
        }
        this.resolve(response);
        throw abortError();
    }

    repeat() {
        this.context.fetchRequest.execute().catch(nop);
    }

    resume() {
        this.resolve(this.originalResponse);
    }
}

module.exports = XHRLogonPendingRequest;
}
};
export const xhrlib = r("./index.js");
