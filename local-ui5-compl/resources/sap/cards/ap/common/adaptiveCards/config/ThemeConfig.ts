/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import { teamsDark } from "./themes/TeamsDark";
import { teamsLight } from "./themes/TeamsLight";

type ThemeConfig = {
	[key: string]: object;
};

export const themeConfig: ThemeConfig = {
	"teams-dark": teamsDark,
	"teams-light": teamsLight
};
