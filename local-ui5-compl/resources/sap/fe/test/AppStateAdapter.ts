import jQuery from "sap/ui/thirdparty/jquery";

export default class AppStateAdapter {
	saveAppState(sKey: string, sSessionKey: string, sValue: string, sAppName: string, sComponent: string): jQuery.Promise {
		const fetchPromise = fetch("/sap/bc/appState", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				key: sKey,
				sessionKey: sSessionKey,
				value: sValue,
				appName: sAppName,
				component: sComponent
			})
		});
		const oMyDeferred = jQuery.Deferred() as JQuery.Deferred<unknown, unknown, unknown>;
		fetchPromise
			.then(async (response) => {
				return response.json();
			})
			.then((data) => {
				oMyDeferred.resolve(data);
			})
			.catch((error) => {
				oMyDeferred.reject(error);
			});
		return oMyDeferred.promise();
	}

	loadAppState(sKey: string): jQuery.Promise {
		const oMyDeferred = jQuery.Deferred() as JQuery.Deferred<unknown, unknown, unknown>;
		const fetchPromise = fetch(`/sap/bc/appState/${sKey}`, {
			method: "GET"
		});
		fetchPromise
			.then(async (response) => {
				return response.json();
			})
			.then((data) => {
				oMyDeferred.resolve(data.key, data.value);
			})
			.catch((error) => {
				oMyDeferred.reject(error);
			});
		return oMyDeferred.promise();
	}
}
