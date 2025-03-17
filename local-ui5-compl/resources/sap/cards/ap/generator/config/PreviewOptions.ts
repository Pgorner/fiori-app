/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
export const PREVIEW_OPTIONS = {
	hosts: [
		{
			key: "int-default",
			text: "GENERATOR_DEFAULT_INT",
			height: "auto",
			width: "500px",
			type: "integration"
		},
		{
			key: "int-my-home",
			text: "GENERATOR_MY_HOME_INT",
			height: "530px",
			width: "300px",
			type: "integration"
		},
		{
			key: "adaptive-ms-teams-light",
			text: "GENERATOR_MS_TEAM_LIGHT_ADAPTIVE",
			type: "adaptive",
			hostConfig: "teams-light"
		},
		{
			key: "adaptive-ms-teams-dark",
			text: "GENERATOR_MS_TEAM_DARK_ADAPTIVE",
			type: "adaptive",
			hostConfig: "teams-dark"
		},
		{
			key: "int-custom",
			text: "GENERATOR_CUSTOM_INT",
			type: "custom",
			height: "auto",
			width: "auto"
		}
	]
};
