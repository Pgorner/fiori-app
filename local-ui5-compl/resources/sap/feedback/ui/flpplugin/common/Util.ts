import { ThemeId } from '@sap-px/pxapi';
import Constants from './Constants';
import { APP_FRAMEWORK } from './Enumerations';

export default class Util {
	public static convertStringToThemeId(stringValue: string): ThemeId {
		return ThemeId[stringValue as keyof typeof ThemeId] || ThemeId.none;
	}

	public static formatLanguageTag(input: string): string {
		const trimmedInput = input.trim();

		if (trimmedInput && trimmedInput.length > 0) {
			return trimmedInput.toUpperCase();
		} else {
			return Constants.DEFAULT_LANGUAGE;
		}
	}
	public static stringToTitleCase(input: string): string {
		if (input) {
			return input.replace(/\w\S*/g, (intermediate: string) => {
				return intermediate.charAt(0).toUpperCase() + intermediate.substring(1).toLowerCase();
			});
		}
		return input;
	}

	public static convertAppFrameworkTypeToId(frameworkType: string | undefined): string {
		if (frameworkType) {
			return APP_FRAMEWORK[frameworkType.toLowerCase() as keyof typeof APP_FRAMEWORK] || APP_FRAMEWORK.unknown;
		}
		return APP_FRAMEWORK.unknown;
	}

	public static getWindowSearchLocation(): string {
		return window.location.search;
	}

	private static isUrlParamSet(urlParamKey: string): boolean {
		const queryString = this.getWindowSearchLocation();
		if (queryString) {
			const urlParams = new URLSearchParams(queryString);
			if (urlParams && urlParams.has(urlParamKey)) {
				return true;
			}
		}
		return false;
	}

	private static getUrlParamValue(urlParamKey: string): string | null {
		const queryString = this.getWindowSearchLocation();
		if (queryString) {
			const urlParams = new URLSearchParams(queryString);
			if (urlParams && urlParams.has(urlParamKey)) {
				const urlParamState = urlParams.get(urlParamKey);
				if (urlParamState) {
					return urlParamState.trim().toLocaleLowerCase();
				}
			}
		}
		return null;
	}

	public static isUnitIdUrlParamSet(): boolean {
		return this.isUrlParamSet(Constants.URL_PARAMS.UNITID);
	}

	public static getUnitIdUrlParamValue(): string | null {
		return this.getUrlParamValue(Constants.URL_PARAMS.UNITID);
	}

	public static isEnvironmentUrlParamSet(): boolean {
		return this.isUrlParamSet(Constants.URL_PARAMS.ENVIRONMENT);
	}

	public static getEnvironmentUrlParamValue(): string | null {
		return this.getUrlParamValue(Constants.URL_PARAMS.ENVIRONMENT);
	}

	public static ensureGlobalContext(firstLevel?: string, secondLevel?: string): any {
		if (!globalThis.sap) {
			globalThis.sap = {} as typeof sap;
		}
		const globalSapObject = globalThis.sap as any;
		if (firstLevel) {
			if (!globalSapObject[firstLevel]) {
				globalSapObject[firstLevel] = {};
			}
			const createdFirstLevel = globalSapObject[firstLevel];
			if (secondLevel) {
				if (!createdFirstLevel[secondLevel]) {
					createdFirstLevel[secondLevel] = {};
				}
				return createdFirstLevel[secondLevel];
			}
			return createdFirstLevel;
		}
		return globalSapObject;
	}
}
