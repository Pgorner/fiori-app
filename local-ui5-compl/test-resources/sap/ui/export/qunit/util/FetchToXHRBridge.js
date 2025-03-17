sap.ui.define([], function() {
	"use strict";

	/**
	 * Maps native fetch API calls to XMLHttpRequest.
	 *
	 * This class is essential for enabling the fetch API in testing or demo scenarios where a real OData service is unavailable.
	 * Typically, a MockServer is used in such scenarios, but the sap.ui.core.util.MockServer can only handle XMLHttpRequest (XHR).
	 * By using this bridge, fetch API calls are redirected to use XHR, allowing the MockServer to process the requests.
	 */
	class FetchToXHRBridge {
		static fnFetch = window.fetch;

		static activate() {
			window.fetch = this.createXHRFrom;
		}

		static async createXHRFrom(oResource, oOptions) {
			const {promise: oPromise, resolve: fnResolve, reject: fnReject} = Promise.withResolvers();
			let oRequest;

			if (oResource instanceof Request) {
				oRequest = oResource;
			} else {
				oRequest = new Request(oResource, oOptions);
			}

			const oXHR = new XMLHttpRequest();

			oXHR.open(oRequest.method, oRequest.url);

			for (const [sKey, sValue] of oRequest.headers.entries()) {
				oXHR.setRequestHeader(sKey, sValue);
			}

			oXHR.onload = function() {
				const oResponse = new Response(oXHR.responseText, {
					status: oXHR.status,
					statusText: oXHR.statusText,
					headers: new Headers(oXHR.getAllResponseHeaders().split("\r\n").reduce((oAcc, sHeader) => {
						if (!sHeader) {
							return oAcc;
						}

						const [sKey, sValue] = sHeader.split(": ");
						oAcc[sKey] = sValue;

						return oAcc;
					}, {}))
				});

				fnResolve(oResponse);
			};

			oXHR.onerror = fnReject;

			oXHR.send(await oRequest.text());

			return oPromise;
		}

		static deactivate() {
			window.fetch = this.fnFetch;
		}
	}

	return FetchToXHRBridge;
});