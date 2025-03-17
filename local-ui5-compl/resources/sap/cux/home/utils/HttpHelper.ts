/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Log from "sap/base/Log";
import BaseObject from "sap/ui/base/Object";
import { REPO_BASE_URL } from "./Constants";

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
	private constructor() {
		super();
	}

	/**
	 * Fetches the CSRF Token
	 * @returns {Promise<string | void>} Promise that resolves with the CSRF Token
	 */
	private static fetchCSRFToken(): Promise<string | void> {
		return fetch(REPO_BASE_URL, {
			method: "HEAD",
			headers: {
				"X-CSRF-Token": "Fetch"
			}
		})
			.then((response) => {
				const token = response.headers.get("X-CSRF-Token");
				if (response.ok && token) {
					return token;
				}
				throw new Error("Cannot fetch X-CSRF-Token.");
			})
			.catch((error: Error) => {
				Log.error(error.message);
			});
	}

	/**
	 * Post Method
	 * @param {string} url - The URL to post to
	 * @param {object} payload - The payload to post
	 * @returns {Promise<unknown>} Promise that resolves with the response
	 */
	public static Post(url: string, payload: object): Promise<unknown> {
		return AppManager.fetchCSRFToken()
			.then((csrfToken) => {
				return fetch(url, {
					method: "POST",
					headers: {
						"X-CSRF-Token": csrfToken as string,
						"content-type": "application/json"
					},
					body: JSON.stringify(payload)
				});
			})
			.then((response) => {
				return response.json();
			})
			.catch((error: Error) => {
				Log.error(error.message);
			});
	}

	/**
	 * Get Method for JSON Data
	 * @param {string} url - The URL to get from
	 * @returns {Promise<unknown>} Promise that resolves with the JSON data response
	 */
	public static GetJSON(url: string): Promise<unknown> {
		return fetch(url)
			.then((response) => {
				return response.json();
			})
			.catch((error: Error) => {
				Log.error(error.message);
			});
	}
}
