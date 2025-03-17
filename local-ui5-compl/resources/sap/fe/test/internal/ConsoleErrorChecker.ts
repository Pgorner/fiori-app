type MessageMatcherFunction = (message: string) => boolean;
type Karma = {
	log: (level: any, ...data: any[]) => void;
	config: {
		ui5?: {
			config: {
				strictconsoleerrors?: boolean; // Karma options are all lowercase at runtime!
			};
		};
	};
};

function wrapPatterns(pattern: RegExp | string): MessageMatcherFunction {
	if (pattern instanceof RegExp) {
		return (message) => message.match(pattern) !== null;
	} else {
		return (message) => message.includes(pattern);
	}
}

/**
 * List of error message patterns that are always accepted.
 */
const GLOBALLY_ACCEPTED_ERRORS = [
	/library-preload\.(json|js)/, // accept errors related to files that are not there when running from source to prevent false positives
	"/resources/sap/fe/macros/manifest.json" // see above
].map(wrapPatterns);

class ConsoleErrorChecker {
	private matchers: MessageMatcherFunction[] = [];

	private messages: string[] = [];

	private readonly karma: Karma | undefined;

	private readonly isStrict: boolean;

	private readonly observer = new MutationObserver((mutations) => {
		const opaFrame = mutations.reduce((iFrame: HTMLIFrameElement | null, mutation: MutationRecord) => {
			if (iFrame !== null) {
				return iFrame;
			}

			for (const node of Array.from(mutation.addedNodes)) {
				if (node instanceof Element) {
					const element = node.querySelector("#OpaFrame");
					if (element instanceof HTMLIFrameElement && element.contentWindow) {
						return element;
					}
				}
			}

			return iFrame;
		}, null);

		if (opaFrame && opaFrame.contentWindow) {
			this.prepareWindow(opaFrame.contentWindow);
		}
	});

	constructor(window: Window & { __karma__?: Karma }) {
		QUnit.moduleStart(() => {
			this.observer.observe(window.document.body, { childList: true });
		});

		QUnit.moduleDone(() => {
			this.observer.disconnect();
		});

		QUnit.testStart(() => {
			this.reset();
		});

		QUnit.log(() => {
			this.handleFailedMessages();
		});

		this.karma = window.__karma__;

		// either go for Karma config option "ui5.config.strictConsoleErrors" or use URL query parameter "strict"
		const search = new URLSearchParams(window.location.search);
		const urlParam = search.get("strictConsoleErrors");
		if (urlParam !== null) {
			this.isStrict = urlParam === "true";
		} else {
			this.isStrict = this.karma?.config.ui5?.config.strictconsoleerrors ?? false;
		}

		this.reset();
	}

	private handleFailedMessages() {
		const failedMessages = this.messages;
		this.messages = [];

		if (failedMessages.length > 0) {
			QUnit.assert.pushResult({
				result: false,
				source: "FE Console Log Check",
				message: `There were ${failedMessages.length} unexpected console errors`,
				actual: failedMessages,
				expected: []
			});
		}
	}

	private reset() {
		this.messages = [];

		// this sets the default to apply if no allowed patterns are set via setAcceptedErrorPatterns().
		if (this.isStrict) {
			this.matchers = GLOBALLY_ACCEPTED_ERRORS;
		} else {
			this.matchers = [() => true];
		}
	}

	setAcceptedErrorPatterns(patterns?: (RegExp | string)[]) {
		if (!patterns || patterns.length === 0) {
			this.matchers = GLOBALLY_ACCEPTED_ERRORS;
		} else {
			this.matchers = patterns.map(wrapPatterns).concat(GLOBALLY_ACCEPTED_ERRORS);
		}
	}

	private checkAndLog(type: any, ...data: any[]) {
		// only check the error messages
		if (type === "error") {
			const messageText = data[0];
			const isAllowed = this.matchers.some((matcher) => matcher(messageText));
			if (!isAllowed) {
				this.messages.push(messageText);
			}
		}

		if (this.karma) {
			// wrap the data to facilitate parsing in the backend
			const wrappedData = data.map((d) => [d]);
			this.karma.log(type, wrappedData);
		}
	}

	private prepareWindow(window: Window) {
		const console: Console = (window as any).console;

		// capture console.log(), console.debug(), etc.
		const patchConsoleMethod = (method: "log" | "info" | "warn" | "error" | "debug") => {
			const fnOriginal = console[method];
			console[method] = (...data: any[]): void => {
				this.checkAndLog(method, ...data);
				return fnOriginal.apply(console, data);
			};
		};

		patchConsoleMethod("log");
		patchConsoleMethod("debug");
		patchConsoleMethod("info");
		patchConsoleMethod("warn");
		patchConsoleMethod("error");

		// capture console.assert()
		// see https://console.spec.whatwg.org/#assert
		console.assert = function (condition = false, ...data: any[]) {
			if (condition) {
				return;
			}

			const message = "Assertion failed";
			if (data.length === 0) {
				data.push(message);
			} else {
				let first = data[0];
				if (typeof first !== "string") {
					data.unshift(message);
				} else {
					first = `${message}: ${first}`;
					data[0] = first;
				}
			}

			console.error(...data);
		};

		// capture errors
		function onPromiseRejection(this: ConsoleErrorChecker, event: PromiseRejectionEvent) {
			const message = `UNHANDLED PROMISE REJECTION: ${event.reason}`;
			this.checkAndLog("error", message, event.reason?.stack);
		}

		function onError(this: ConsoleErrorChecker, event: ErrorEvent) {
			const message = event.message;
			this.checkAndLog("error", message, event.filename);
		}

		window.addEventListener("error", onError.bind(this), { passive: true });
		window.addEventListener("unhandledrejection", onPromiseRejection.bind(this), { passive: true });
	}

	static getInstance(window: Window & { sapFEConsoleErrorChecker?: ConsoleErrorChecker }): ConsoleErrorChecker {
		// the global instance is needed to support multiple tests in a row (in Karma)
		if (!window.sapFEConsoleErrorChecker) {
			window.sapFEConsoleErrorChecker = new ConsoleErrorChecker(window);
		}
		return window.sapFEConsoleErrorChecker;
	}
}

export default ConsoleErrorChecker.getInstance(window);
