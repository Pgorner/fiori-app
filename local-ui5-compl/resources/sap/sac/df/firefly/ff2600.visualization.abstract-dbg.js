/*!
 * SAPUI5
    (c) Copyright 2009-2021 SAP SE. All rights reserved
  
 */
/*global sap*/
sap.ui.define(
[
"sap/sac/df/firefly/ff0200.io"
],
function(oFF)
{
"use strict";

oFF.SacStyleUtils = {

	isStyleLineEmpty:function(styledLine)
	{
			return oFF.isNull(styledLine) || styledLine.isEmpty();
	}
};

oFF.SacTableConstantMapper = {

	mapAlertSymbolToString:function(sacAlertSymbol)
	{
			let result = null;
		if (sacAlertSymbol === oFF.SacAlertSymbol.GOOD)
		{
			result = oFF.SacTableConstants.TIT_GOOD;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.WARNING)
		{
			result = oFF.SacTableConstants.TIT_WARNING;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.ALERT)
		{
			result = oFF.SacTableConstants.TIT_ALERT;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.DIAMOND)
		{
			result = oFF.SacTableConstants.TIT_DIAMOND;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.INFORMATION)
		{
			result = oFF.SacTableConstants.TIT_INFORMATION;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.SAP_CHECKMARK)
		{
			result = oFF.SacTableConstants.TIT_SAP_CHECKMARK;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.SAP_ALERT)
		{
			result = oFF.SacTableConstants.TIT_SAP_ALERT;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.SAP_ERROR)
		{
			result = oFF.SacTableConstants.TIT_SAP_ERROR;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.SAP_INFORMATION)
		{
			result = oFF.SacTableConstants.TIT_SAP_INFORMATION;
		}
		else if (sacAlertSymbol === oFF.SacAlertSymbol.OUTLINE_FILL)
		{
			result = oFF.SacTableConstants.TIT_OUTLINE_FILL;
		}
		return result;
	}
};

oFF.SacTableConstants = {

	BASE64_SVG_HATCHING_1:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzEtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuNSIgaGVpZ2h0PSI2IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iNiI+PHJlY3Qgd2lkdGg9IjYiIGhlaWdodD0iNiIgZmlsbD0iI0ZGRkZGRiI+PC9yZWN0PjxwYXRoIGQ9Ik0tMSwxIGwyLC0yIE0wLDYgbDYsLTYgTTUsNyBsMiwtMiIgc3Ryb2tlPSJyZ2IoNjYsIDY2LCA2NikiIHN0cm9rZS13aWR0aD0iMSI+PC9wYXRoPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2hhdGNoaW5nMS1zdmctcGF0dGVybi1fX3BhdHRlcm41KSI+PC9yZWN0Pjwvc3ZnPg==",
	BASE64_SVG_HATCHING_2:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzItc3ZnLXBhdHRlcm4tX19wYXR0ZXJuNiIgaGVpZ2h0PSI4IiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIiB3aWR0aD0iOCI+PHJlY3Qgd2lkdGg9IjgiIGhlaWdodD0iOCIgZmlsbD0iI0ZGRkZGRiI+PC9yZWN0PjxwYXRoIGQ9Ik0tMSwxIGwyLC0yIE0wLDggbDgsLTggTTcsOSBsMiwtMiIgc3Ryb2tlPSJyZ2IoNjYsIDY2LCA2NikiIHN0cm9rZS13aWR0aD0iMiI+PC9wYXRoPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2hhdGNoaW5nMi1zdmctcGF0dGVybi1fX3BhdHRlcm42KSI+PC9yZWN0Pjwvc3ZnPg==",
	BASE64_SVG_HATCHING_3:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzMtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuNyIgaGVpZ2h0PSIxMCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjEwIj48cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9yZWN0PjxwYXRoIGQ9Ik0tMSwxIGwyLC0yIE0wLDEwIGwxMCwtMTAgTTksMTEgbDIsLTIiIHN0cm9rZT0iI0ZGRkZGRiIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaGF0Y2hpbmczLXN2Zy1wYXR0ZXJuLV9fcGF0dGVybjcpIj48L3JlY3Q+PC9zdmc+",
	BASE64_SVG_HATCHING_4:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzQtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuOCIgaGVpZ2h0PSIyNSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjguMzMzMzMzMzMzMzMzMzM0Ij48cmVjdCB3aWR0aD0iOC4zMzMzMzMzMzMzMzMzMzQiIGhlaWdodD0iMjUiIGZpbGw9IiNGRkZGRkYiPjwvcmVjdD48Y2lyY2xlIGN4PSI2LjI1IiBjeT0iMi4wODMzMzMzMzMzMzMzMzM1IiByPSIxIiBmaWxsPSJyZ2IoNjYsIDY2LCA2NikiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIuMDgzMzMzMzMzMzMzMzMzNSIgY3k9IjYuMjUiIHI9IjEiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNi4yNSIgY3k9IjEwLjQxNjY2NjY2NjY2NjY2OCIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIyLjA4MzMzMzMzMzMzMzMzMzUiIGN5PSIxNC41ODMzMzMzMzMzMzMzMzQiIHI9IjEiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iNi4yNSIgY3k9IjE4Ljc1IiByPSIxIiBmaWxsPSJyZ2IoNjYsIDY2LCA2NikiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIuMDgzMzMzMzMzMzMzMzMzNSIgY3k9IjIyLjkxNjY2NjY2NjY2NjY2OCIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNoYXRjaGluZzQtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuOCkiPjwvcmVjdD48L3N2Zz4=",
	BASE64_SVG_HATCHING_5:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzUtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuOSIgaGVpZ2h0PSIzNSIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjExLjY2NjY2NjY2NjY2NjY2NiI+PHJlY3Qgd2lkdGg9IjExLjY2NjY2NjY2NjY2NjY2NiIgaGVpZ2h0PSIzNSIgZmlsbD0iI0ZGRkZGRiI+PC9yZWN0PjxjaXJjbGUgY3g9IjguNzUiIGN5PSIyLjkxNjY2NjY2NjY2NjY2NjUiIHI9IjEiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMi45MTY2NjY2NjY2NjY2NjY1IiBjeT0iOC43NSIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSI4Ljc1IiBjeT0iMTQuNTgzMzMzMzMzMzMzMzMyIiByPSIxIiBmaWxsPSJyZ2IoNjYsIDY2LCA2NikiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjIuOTE2NjY2NjY2NjY2NjY2NSIgY3k9IjIwLjQxNjY2NjY2NjY2NjY2NCIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSI4Ljc1IiBjeT0iMjYuMjUiIHI9IjEiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMi45MTY2NjY2NjY2NjY2NjY1IiBjeT0iMzIuMDgzMzMzMzMzMzMzMzMiIHI9IjEiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9jaXJjbGU+PC9wYXR0ZXJuPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjaGF0Y2hpbmc1LXN2Zy1wYXR0ZXJuLV9fcGF0dGVybjkpIj48L3JlY3Q+PC9zdmc+",
	BASE64_SVG_HATCHING_6:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzYtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuMTAiIGhlaWdodD0iNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxMy4zMzMzMzMzMzMzMzMzMzQiPjxyZWN0IHdpZHRoPSIxMy4zMzMzMzMzMzMzMzMzMzQiIGhlaWdodD0iNDAiIGZpbGw9IiNGRkZGRkYiPjwvcmVjdD48Y2lyY2xlIGN4PSIxMCIgY3k9IjMuMzMzMzMzMzMzMzMzMzMzNSIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIzLjMzMzMzMzMzMzMzMzMzMzUiIGN5PSIxMCIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIxMCIgY3k9IjE2LjY2NjY2NjY2NjY2NjY2OCIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIzLjMzMzMzMzMzMzMzMzMzMzUiIGN5PSIyMy4zMzMzMzMzMzMzMzMzMzYiIHI9IjEiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMTAiIGN5PSIzMCIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIzLjMzMzMzMzMzMzMzMzMzMzUiIGN5PSIzNi42NjY2NjY2NjY2NjY2NyIgcj0iMSIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNoYXRjaGluZzYtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuMTApIj48L3JlY3Q+PC9zdmc+",
	BASE64_SVG_HATCHING_7:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzctc3ZnLXBhdHRlcm4tX19wYXR0ZXJuMTEiIGhlaWdodD0iMTUiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHdpZHRoPSIxNSI+PHJlY3Qgd2lkdGg9IjE1IiBoZWlnaHQ9IjE1IiBmaWxsPSIjRkZGRkZGIj48L3JlY3Q+PGNpcmNsZSBjeD0iMy43NSIgY3k9IjMuNzUiIHI9IjEiIGZpbGw9InJnYig2NiwgNjYsIDY2KSI+PC9jaXJjbGU+PGNpcmNsZSBjeD0iMy43NSIgY3k9IjExLjI1IiByPSIyIiBmaWxsPSJyZ2IoNjYsIDY2LCA2NikiPjwvY2lyY2xlPjxjaXJjbGUgY3g9IjExLjI1IiBjeT0iMy43NSIgcj0iMiIgZmlsbD0icmdiKDY2LCA2NiwgNjYpIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIxMS4yNSIgY3k9IjExLjI1IiByPSIxIiBmaWxsPSJyZ2IoNjYsIDY2LCA2NikiPjwvY2lyY2xlPjwvcGF0dGVybj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2hhdGNoaW5nNy1zdmctcGF0dGVybi1fX3BhdHRlcm4xMSkiPjwvcmVjdD48L3N2Zz4=",
	BASE64_SVG_HATCHING_8:"PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXR0ZXJuIGlkPSJoYXRjaGluZzgtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuMTIiIGhlaWdodD0iOCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgd2lkdGg9IjgiPjxyZWN0IHdpZHRoPSI4IiBoZWlnaHQ9IjgiIGZpbGw9IiNGRkZGRkYiPjwvcmVjdD48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJyZ2IoNjYsIDY2LCA2NikiIHg9IjAiIHk9IjAiPjwvcmVjdD48cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSJyZ2IoNjYsIDY2LCA2NikiIHg9IjQiIHk9IjQiPjwvcmVjdD48L3BhdHRlcm4+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNoYXRjaGluZzgtc3ZnLXBhdHRlcm4tX19wYXR0ZXJuMTIpIj48L3JlY3Q+PC9zdmc+",
	BMC_S_HASH:"hash",
	BMC_S_ID:"id",
	B_BOTTOM:"Bottom",
	B_COORDINATE_HEADER:"SHOW_COORDINATE_HEADER",
	B_DIMENSION_TITLES:"SHOW_DIMENSION_TITLES",
	B_FREEZE_COLUMNS:"FREEZE_COLUMNS",
	B_FREEZE_ROWS:"FREEZE_ROWS",
	B_LEFT:"Left",
	B_MERGE_REPETITIVE_HEADERS:"MERGE_REPETITIVE_HEADERS",
	B_REPETITIVE_MEMBER_NAMES:"SHOW_REPETITIVE_MEMBER_NAMES",
	B_RIGHT:"Right",
	B_SHOW_FORMULAS:"SHOW_FORMULAS",
	B_SHOW_FREEZE_LINES:"SHOW_FREEZE_LINES",
	B_SHOW_GRID:"SHOW_GRID",
	B_SHOW_REFERENCES:"SHOW_REFERENCES",
	B_SHOW_SUBTITLE:"SHOW_SUBTITLE",
	B_SHOW_TABLE_DETAILS:"SHOW_TABLE_DETAILS",
	B_SHOW_TABLE_TITLE:"SHOW_TABLE_TITLE",
	B_STRIPE_DATA_COLUMNS:"STRIPE_DATA_COLUMNS",
	B_STRIPE_DATA_ROWS:"STRIPE_DATA_ROWS",
	B_TOP:"Top",
	CCD_B_MEASURE_ON_COLUMN:"measureOnColumn",
	CCD_L_COLUMNS:"columns",
	CCD_L_ROWS:"rows",
	CCD_N_END_COL:"endCol",
	CCD_N_END_ROW:"endRow",
	CCD_N_MAX:"max",
	CCD_N_MAX_TEXT_HEIGHT:"maxTextHeight",
	CCD_N_MAX_TEXT_WIDTH:"maxTextWidth",
	CCD_N_MIN:"min",
	CCD_N_START_COL:"startCol",
	CCD_N_START_ROW:"startRow",
	CCO_HORIZONTAL:"horizontal",
	CCO_VERTICAL:"vertical",
	CCT_BAR:"bar",
	CCT_VARIANCE_BAR:"varianceBar",
	CCT_VARIANCE_PIN:"pin",
	CCV_B_HIDE_VALUE:"hideValue",
	CCV_N_PLAIN:"plain",
	CCV_SN_HEIGHT_BAR_FILLED:"heightBarFilled",
	CCV_SN_HEIGHT_LINE:"heightLine",
	CCV_SN_WIDTH_BAR_FILLED:"widthBarFilled",
	CCV_SN_WIDTH_LINE:"widthLine",
	CCV_SN_X_BAR:"xBar",
	CCV_SN_X_LINE:"xLine",
	CCV_SN_X_PIN:"xPin",
	CCV_SN_X_TEXT:"xText",
	CCV_SN_Y_BAR:"yBar",
	CCV_SN_Y_LINE:"yLine",
	CCV_SN_Y_PIN:"yPin",
	CCV_SN_Y_TEXT:"yText",
	CCV_S_DOMINANT_BASE_LINE:"dominantBaseLine",
	CCV_S_TEXT_ANCHOR:"textAnchor",
	CCV_S_VALUE:"value",
	CC_B_SHOW_VALUE:"showValue",
	CC_L_DIMENSIONS:"dimensions",
	CC_M_IN_CELL_CHART_CONTEXT:"InCellChartContext",
	CC_N_COL:"col",
	CC_N_ROW:"row",
	CC_SU_LINE_COLOR:"lineColor",
	CC_S_BAR_COLOR:"barColor",
	CC_S_CELL_CHART_ORIENTATION:"orientation",
	CC_S_CHART_TYPE:"chartType",
	CC_S_MEMBER_ID:"memberId",
	CC_S_ORIGINAL_DIMENSION:"originalDimension",
	CIA_S_DATA_SAP_UI_ICON_CONTENT:"data-sap-ui-icon-content",
	CIS_NV_MARGIN_RIGHT:5,
	CIS_N_MARGIN_LEFT:"marginLeft",
	CIS_N_MARGIN_RIGHT:"marginRight",
	CIS_SV_ROTATE:"z 270deg",
	CIS_SV_SAP_ICONS:"SAP-icons",
	CIS_S_FONT_FAMILY:"fontFamily",
	CIS_S_ROTATE:"rotate",
	CI_B_ICON_AFTER:"iconAfter",
	CI_M_DATA_ATTRIBUTES:"dataAttributes",
	CI_M_STYLE:"style",
	CI_SV_CLASS_NAME_SAP_UI_ICON:"sapUiIcon",
	CI_S_CLASS_NAME:"className",
	CM_N_COLUMNS:"columns",
	CM_N_ORIGINAL_COLUMN:"originalColumn",
	CM_N_ORIGINAL_ROW:"originalRow",
	CM_N_ROWS:"rows",
	CS_B_ADDED_ON_THE_FLY_UNRESPONSIVE:"addedOnTheFlyUnresponsive",
	CS_B_EMPTY_COLUMN:"emptyColumn",
	CS_B_FIXED:"fixed",
	CS_B_HAS_WRAP_CELL:"hasWrapCell",
	CS_COMMENT_DOCUMENT_ID:"commentDocumentId",
	CS_N_COLUMN:"column",
	CS_N_MIN_WIDTH:"minWidth",
	CS_N_WIDTH:"width",
	CS_S_ID:"id",
	CT_ATTRIBUTE:12,
	CT_ATTRIBUTE_COL_DIM_HEADER:19,
	CT_ATTRIBUTE_COL_DIM_MEMBER:21,
	CT_ATTRIBUTE_ROW_DIM_HEADER:18,
	CT_ATTRIBUTE_ROW_DIM_MEMBER:20,
	CT_CHART:3,
	CT_CHILD:2,
	CT_COLUMN_COORDINATE:10,
	CT_COLUMN_COORDINATE_SELECTED_DESIGN_MODE:26,
	CT_COLUMN_COORDINATE_SELECTED_VIEW_MODE:28,
	CT_COL_DIM_HEADER:15,
	CT_COL_DIM_MEMBER:16,
	CT_COMMENT:25,
	CT_COORDINATE_CORNER:24,
	CT_CUSTOM:23,
	CT_DATA_LOCKING:7,
	CT_EMPTY:13,
	CT_EMPTY_AXIS_COLUMN_HEADER:35,
	CT_EMPTY_AXIS_ROW_HEADER:34,
	CT_HEADER:1,
	CT_IMAGE:31,
	CT_INPUT:2,
	CT_MARQUEE:9,
	CT_MEMBER_SELECTOR:4,
	CT_MERGED_DUMMY_CELL:30,
	CT_NEW_LINE_ON_COLUMN:33,
	CT_NEW_LINE_ON_ROW:32,
	CT_NONE:0,
	CT_ROW_COORDINATE:11,
	CT_ROW_COORDINATE_SELECTED_DESIGN_MODE:27,
	CT_ROW_COORDINATE_SELECTED_VIEW_MODE:29,
	CT_ROW_DIM_HEADER:14,
	CT_ROW_DIM_MEMBER:17,
	CT_SELF:1,
	CT_THRESHOLD:6,
	CT_TITLE:22,
	CT_UNBOOKED:5,
	CT_VALIDATION:8,
	CT_VALUE:0,
	C_ACTUAL:"AC",
	C_BUDGET:"BU",
	C_B_ALLOW_DRAG_DROP:"allowDragDrop",
	C_B_DRAGGABLE:"draggable",
	C_B_EDITABLE:"editable",
	C_B_EXPANDED:"expanded",
	C_B_IS_INA_TOTALS_CONTEXT:"isInATotalsContext",
	C_B_IS_IN_HIERARCHY:"isInHierarchy",
	C_B_LOCKED:"locked",
	C_B_MODIFIED:"modified",
	C_B_MODIFIED_MDE:"modifiedMDE",
	C_B_REFERENCE_TO_LOCKED_CELL:"referenceToLockedCell",
	C_B_REPEATED_MEMBER_NAME:"repeatedMemberName",
	C_B_REVERSED_HIERARCHY:"reversedHierarchy",
	C_B_SHOW_DRILL_ICON:"showDrillIcon",
	C_B_SHOW_HYPERLINK:"showHyperlink",
	C_B_STYLE_UPDATED_BY_USER:"styleUpdatedByUser",
	C_B_VERSION_EDITED:"versionEdited",
	C_FORECAST:"FC",
	C_L_CELL_ICONS_RIGHT:"cellIconsRight",
	C_M_CELL_CHART:"cellChart",
	C_M_CONTEXT:"context",
	C_M_DATA_LOCKING:"dataLocking",
	C_M_MERGED:"merged",
	C_M_REFERENCE:"reference",
	C_M_STYLE:"style",
	C_M_VALIDATION:"validation",
	C_NONE:"none",
	C_N_CELL_TYPE:"cellType",
	C_N_COLUMN:"column",
	C_N_COMMENT_TYPE:"commentType",
	C_N_HIERARCHY_PADDING_LEFT:"hierarchyPaddingLeft",
	C_N_HIERARCHY_PADDING_TOP:"hierarchyPaddingTop",
	C_N_LEVEL:"level",
	C_N_REF_COL:"refCol",
	C_N_REF_ROW:"refRow",
	C_N_ROW:"row",
	C_N_X:"x",
	C_N_Y:"y",
	C_PLANNING:"PL",
	C_ROLLING_FORECAST:"RF",
	C_SN_FIELD:"FIELD",
	C_SN_PLAIN:"plain",
	C_S_CATEGORY:"category",
	C_S_DRILL_ICON_COLOR:"drillIconColor",
	C_S_FORMATTED:"formatted",
	C_S_FORMAT_STRING:"formatString",
	C_S_ID:"id",
	C_S_PASTABLE:"pastable",
	DC_M_MEMBER:"member",
	DC_S_HASH:"hash",
	DC_S_ID:"id",
	DEFAULT_CELL_PADDING:7,
	DEFAULT_FONT_FAMILY:"\"72-Web\", Arial, Helvetica, sans-serif",
	DEFAULT_FONT_SIZE:14,
	DEFAULT_TEXT_BOX_SIZE:16,
	DF_C_N_HIERARCHY_PADDING_LEFT:16,
	DF_C_N_HIERARCHY_PADDING_TOP:16,
	DF_R_N_HEIGHT:27,
	DF_R_N_HEIGHT_REDUCED:17,
	DF_R_N_HEIGHT_VERTICAL_CHARTS:124,
	DLT_LOADING:"loading",
	DLT_LOCKED:"locked",
	DLT_MIXED:"mixed",
	DLT_UNKNOWN:"unknown",
	DL_N_TYPE:"type",
	DL_S_TOOLTIP:"tooltip",
	DROP_AREAS:"areas",
	DROP_AREA_COLUMN_FROM:"columnFrom",
	DROP_AREA_COLUMN_TO:"columnTo",
	DROP_AREA_ROW_FROM:"rowFrom",
	DROP_AREA_ROW_TO:"rowTo",
	DROP_CELLS:"cells",
	DROP_CELL_COLUMN:"column",
	DROP_CELL_ROW:"row",
	DROP_COLUMN_INDICES:"columns",
	DROP_INDICES_DRAW_START:"drawStartIndex",
	DROP_INDICES_INDEX:"index",
	DROP_ROW_INDICES:"rows",
	FCSM_L_STYLE:"style",
	FO_N_ALLTEXT:"alltext",
	FO_N_SUBTITLE:"subtitle",
	FO_N_TITLE:"title",
	FS_B_BOLD:"bold",
	FS_B_ITALIC:"italic",
	FS_B_STRIKETHROUGH:"strikethrough",
	FS_B_UNDERLINE:"underline",
	FS_N_SIZE:"size",
	FS_S_COLOR:"color",
	FS_S_FAMILY:"family",
	HA_CENTER:0,
	HA_LEFT:-1,
	HA_RIGHT:1,
	HC_S_BACKGROUND_COLOR:"backgroundColor",
	ICCC_S_ID:"id",
	IMAGE_FILE_EXTENSIONS:null,
	IMG_B64_PREFIX:"url(data:image/svg+xml;base64,",
	IMG_B64_PREFIX_SHORT:"data:image/svg+xml;base64,",
	IMG_B64_SUFFIX:")",
	I_HEIGHT:"HEIGHT",
	I_INDEX:"index",
	I_MAX_CELL_WIDTH:"MAX_CELL_WIDTH",
	I_MAX_RECOMMENDED_CELL_WIDTH:"MAX_RECOMMENDED_CELL_WIDTH",
	I_MIN_CELL_WIDTH:"MIN_CELL_WIDTH",
	I_SIZE:"size",
	I_WIDTH:"WIDTH",
	LPT_BACKGROUND_IMAGE:11,
	LPT_NON_FILL:9,
	LPT_SOLID:10,
	LPT_WHITE_FILL:12,
	LP_ALL:6,
	LP_BOTTOM:1,
	LP_LEFT:3,
	LP_LEFT_RIGHT:5,
	LP_NONE:7,
	LP_N_STYLE:"style",
	LP_N_WIDTH:"width",
	LP_RIGHT:4,
	LP_S_BACKGROUND:"background",
	LP_S_BORDER_COLOR:"borderColor",
	LP_S_COLOR:"color",
	LP_TOP:0,
	LP_TOP_BOTTOM:2,
	LS_DASHED:2,
	LS_DOTTED:3,
	LS_NONE:0,
	LS_SOLID:1,
	L_COLUMN_DIMENSION_PATHS:"COLUMN_DIMENSION_PATHS",
	L_DIMENSION_COLOR_PALETTE:"DIMENSION_COLOR_PALETTE",
	L_REFERENCE_PATH:"REFERENCE_PATH",
	L_ROW_DIMENSION_PATHS:"ROW_DIMENSION_PATHS",
	MC_N_LEVEL:"level",
	MC_S_DESCRIPTION:"description",
	MC_S_PARENT:"parent",
	MIME_TYPE_IMAGE:"image",
	M_CONDITIONS_INFO:"ConditionsInfo",
	M_FILTER_INFO:"FilterInfo",
	M_FILTER_INFO_LINKED:"LinkedFilter",
	M_FILTER_INFO_QM:"QueryModelFilter",
	M_RANKING_INFO:"RankingInfo",
	M_VARIABLE_INFO:"VariableInfo",
	N_CELL_VALUE_HIGH:"CELL_VALUE_HIGH",
	N_CELL_VALUE_LOW:"CELL_VALUE_LOW",
	N_COLUMN_INDEX:"COLUMN_INDEX",
	N_COLUMN_TUPLE_INDEX:"columnTupleIndex",
	N_INSERT_POSITION_OFFSET:"INSERT_POSITION_OFFSET",
	N_MEMBER_SORT_ICONS_EXTENSIVE:1,
	N_MEMBER_SORT_ICONS_MAXIMAL:2,
	N_MEMBER_SORT_ICONS_MINIMAL:0,
	N_MEMBER_SORT_ICONS_NONE:-1,
	N_ROW_INDEX:"ROW_INDEX",
	N_ROW_TUPLE_INDEX:"rowTupleIndex",
	N_TUPLE_INDEX:"tupleIndex",
	RCS_N_INDEX:"index",
	RCS_N_SIZE:"size",
	RHS_COMPACT:0,
	RHS_CONDENSED:1,
	RHS_COZY:2,
	RHS_CUSTOM:3,
	RHS_SUPER_CONDENSED:4,
	R_B_CHANGED_ON_THE_FLY_UNRESPONSIVE:"changedOnTheFlyUnresponsive",
	R_B_FIXED:"fixed",
	R_L_CELLS:"cells",
	R_N_HEIGHT:"height",
	R_N_ROW:"row",
	R_S_ID:"id",
	SAM_N_MERGED_START_COL:"mergedStartCol",
	SAM_N_MERGED_START_ROW:"mergedStartRow",
	SCT_ATTRIBUTE:15,
	SCT_CELL_CHART:9,
	SCT_COLUMN:14,
	SCT_CUSTOM_CELL:8,
	SCT_DATACELL_REGION:4,
	SCT_DATA_CELL:7,
	SCT_DIMENSION:5,
	SCT_DIMENSION_MEMBER:6,
	SCT_HEADER_CELL:10,
	SCT_HEADER_REGION:3,
	SCT_MULTI_CELL:17,
	SCT_MULTI_REGION:18,
	SCT_ROW:13,
	SCT_SUBTITLE:12,
	SCT_TITLE:11,
	SCT_TITLE_REGION:2,
	SCT_WIDGET:0,
	SLA_B_IS_CELL_CHART_SELECTION:"isCellChartSelection",
	SLA_M_IN_CELL_CHART_CONTEXT:"inCellChartContext",
	SLA_N_CORNER_COL:"cornerCol",
	SLA_N_CORNER_ROW:"cornerRow",
	SLA_N_END_COL:"endCol",
	SLA_N_END_ROW:"endRow",
	SLA_N_MERGED_START_COL:"mergedStartCol",
	SLA_N_MERGED_START_ROW:"mergedStartRow",
	SLA_N_START_COL:"startCol",
	SLA_N_START_ROW:"startRow",
	SLA_S_TYPE:"type",
	SLP_N_BOTTOM:"bottom",
	SLP_N_LEFT:"left",
	SLP_N_RIGHT:"right",
	SLP_N_TOP:"top",
	SL_M_PADDING:"padding",
	SL_M_PATTERN:"pattern",
	SL_N_POSITION:"position",
	SL_N_SIZE:"size",
	SL_N_STYLE:"style",
	SL_S_COLOR:"color",
	SRT_ALL:"all",
	SRT_BOX:"box",
	SRT_COLUMNS:"columns",
	SRT_MIXED:"mixed",
	SRT_REGION:"region",
	SRT_ROWS:"rows",
	STAL_N_HORIZONTAL:"horizontal",
	STAL_N_VERTICAL:"vertical",
	ST_B_WRAP:"wrap",
	ST_L_LINES:"lines",
	ST_M_ALIGNMENT:"alignment",
	ST_M_FONT:"font",
	ST_M_SUBTITLE_FONT:"subtitleFont",
	ST_M_TITLE_FONT:"titleFont",
	ST_S_FILL_COLOR:"fillColor",
	ST_S_THRESHOLD_COLOR:"thresholdColor",
	ST_S_THRESHOLD_ICON_TYPE:"thresholdIconType",
	SV_COLUMN_STRIPE_COLOR:"rgba(220, 220, 220, 0.5)",
	SV_ROW_STRIPE_COLOR:"rgba(220, 220, 220, 1)",
	S_AXIS_TYPE:"AXIS_TYPE",
	S_CELL_CHART_BAR_COLOR:"CELL_CHART_BAR_COLOR",
	S_CELL_CHART_LINE_COLOR:"CELL_CHART_LINE_COLOR",
	S_CELL_COLOR:"CELL_COLOR",
	S_CELL_FONT_COLOR:"CELL_FONT_COLOR",
	S_CELL_VALUE_COMPARATOR:"CELL_VALUE_COMPARATOR",
	S_CELL_VALUE_COMPARATOR_BETWEEN:"CELL_VALUE_BETWEEN",
	S_CELL_VALUE_COMPARATOR_BETWEEN_EXCLUDING:"CELL_VALUE_BETWEEN_EXCLUDING",
	S_CELL_VALUE_COMPARATOR_EQUAL:"CELL_VALUE_EQUAL",
	S_CELL_VALUE_COMPARATOR_GREATER_EQUAL:"CELL_VALUE_GREATER_EQUAL",
	S_CELL_VALUE_COMPARATOR_GREATER_THAN:"CELL_VALUE_GREATER_THAN",
	S_CELL_VALUE_COMPARATOR_LESS_EQUAL:"CELL_VALUE_LESS_EQUAL",
	S_CELL_VALUE_COMPARATOR_LESS_THAN:"CELL_VALUE_LESS_THAN",
	S_CELL_VALUE_COMPARATOR_NOT_BETWEEN:"CELL_VALUE_NOT_BETWEEN",
	S_CELL_VALUE_COMPARATOR_NOT_BETWEEN_EXCLUDING:"CELL_VALUE_NOT_BETWEEN_EXCLUDING",
	S_CELL_VALUE_SET_SIGN:"CELL_VALUE_SET_SIGN",
	S_DATA_SECTION_BOTTOM_LINE_COLOR:"dataSectionBottomLineColor",
	S_DIMENSION_INDEX:"DIMENSION_INDEX",
	S_DIMENSION_NAME:"DIMENSION_NAME",
	S_DIMENSION_TO_COLORATE:"DIMENSION_TO_COLORATE",
	S_HEADER_COLOR:"HEADER_COLOR",
	S_HEADER_END_ROW_LINE_COLOR:"headerEndRowLineColor",
	S_INFO_PROVIDER_NAME:"InfoProviderName",
	S_INSERT_TYPE:"INSERT_TYPE",
	S_MEASURE_DIMENSION_OVERWRITE_TEXT:"MEASURE_DIMENSION_OVERWRITE_TEXT",
	S_MEMBER_NAME:"MEMBER_NAME",
	S_PRETTY_PRINTED_TITLE:"PrettyPrintedTitle",
	S_QUERY_NAME:"QueryName",
	S_QUERY_TEXT:"QueryText",
	S_SCALE_LONG_BILLION:"ScaleLongBillion",
	S_SCALE_LONG_MILLION:"ScaleLongMillion",
	S_SCALE_LONG_THOUSAND:"ScaleLongThousand",
	S_SCALE_SHORT_BILLION:"ScaleShortBillion",
	S_SCALE_SHORT_MILLION:"ScaleShortMillion",
	S_SCALE_SHORT_THOUSAND:"ScaleShortThousand",
	S_STRUCTURE_DIMENSION_OVERWRITE_TEXT:"STRUCTURE_DIMENSION_OVERWRITE_TEXT",
	S_TITLE:"TITLE",
	S_TOTAL_INCLUDING_MEMBER_OVERWRITE_TEXT:"TOTAL_INCLUDING_MEMBER_OVERWRITE_TEXT",
	S_TOTAL_LEVEL_0_COLOR:"TOTAL_LEVEL_0_COLOR",
	S_TOTAL_LEVEL_1_COLOR:"TOTAL_LEVEL_1_COLOR",
	S_TOTAL_LEVEL_2_COLOR:"TOTAL_LEVEL_2_COLOR",
	S_TOTAL_LEVEL_3_COLOR:"TOTAL_LEVEL_3_COLOR",
	S_TOTAL_LEVEL_4_COLOR:"TOTAL_LEVEL_4_COLOR",
	S_TOTAL_LEVEL_5_COLOR:"TOTAL_LEVEL_5_COLOR",
	S_TOTAL_LEVEL_6_COLOR:"TOTAL_LEVEL_6_COLOR",
	S_TOTAL_MEMBER_OVERWRITE_TEXT:"TOTAL_MEMBER_OVERWRITE_TEXT",
	S_TOTAL_REMAINING_MEMBER_OVERWRITE_TEXT:"TOTAL_REMAINING_MEMBER_OVERWRITE_TEXT",
	S_VALUE_EXCEPTION_ERROR:"S_VALUE_EXCEPTION_ERROR",
	S_VALUE_EXCEPTION_NO_VALUE:"S_VALUE_EXCEPTION_NO_VALUE",
	S_VALUE_EXCEPTION_NULL:"S_VALUE_EXCEPTION_NULL",
	S_VALUE_EXCEPTION_OTHER:"S_VALUE_EXCEPTION_OTHER",
	S_VALUE_EXCEPTION_UNDEFINED:"S_VALUE_EXCEPTION_UNDEFINED",
	TDP_N_ROW_HEIGHT:"rowHeight",
	TDP_N_TOTAL_ROWS:"totalRows",
	TD_B_ALLOW_KEY_EVENT_PROPAGATION:"allowKeyEventPropagation",
	TD_B_DESIGN_MODE:"designMode",
	TD_B_DETAILS_VISIBLE:"detailsVisible",
	TD_B_DEVICE_PREVIEW:"devicePreview",
	TD_B_EDITABLE:"editable",
	TD_B_EDIT_MODE:"editMode",
	TD_B_HAS_FIXED_ROWS_COLS:"hasFixedRowsCols",
	TD_B_HAS_LA_DATAPOINT_SELECTION:"hasLADatapointSelection",
	TD_B_IS_INTERACTIVE_HIERARCHY:"hasInteractiveHierarchy",
	TD_B_MOBILE:"mobile",
	TD_B_PARTIAL:"partial",
	TD_B_RESPONSIVE:"responsive",
	TD_B_REVERSED_HIERARCHY:"reversedHierarchy",
	TD_B_SCROLL_TO_TOP:"scrollToTop",
	TD_B_SHOW_COORDINATE_HEADER:"showCoordinateHeader",
	TD_B_SHOW_FREEZE_LINES:"showFreezeLines",
	TD_B_SHOW_GRID:"showGrid",
	TD_B_SUBTITLE_VISIBLE:"subtitleVisible",
	TD_B_TITLE_VISIBLE:"titleVisible",
	TD_B_USE_SECTIONS:"useSections",
	TD_DCCIH_N_END_COL:"endCol",
	TD_DCCIH_N_END_ROW:"endRow",
	TD_DCCIH_N_START_COL:"startCol",
	TD_DCCIH_N_START_ROW:"startRow",
	TD_L_CLASSES_TO_IGNORE:"classesToIgnore",
	TD_L_COLUMN_SETTINGS:"columnSettings",
	TD_L_HIGHLIGHTED_CELLS:"highlightedCells",
	TD_L_ROWS:"rows",
	TD_L_TITLE_CHUNKS:"titleChunks",
	TD_M_ACTIVE_NEW_LINE_MEMBER_CELL:"activeNewLineMemberCell",
	TD_M_CELL_CHART_DATA:"cellChartData",
	TD_M_DIMENSION_CELL_COORDINATES_IN_HEADER:"dimensionCellCoordinatesInHeader",
	TD_M_FEATURE_TOGGLES:"featureToggles",
	TD_M_FEATURE_TOGGLES_ACCESSIBILITY_KEYBOARD_SUPPORT:"accessibilityKeyboardSupport",
	TD_M_FEATURE_TOGGLES_ACCESSIBILITY_SCREEN_READER_SUPPORT:"accessibilityScreenReaderSupport",
	TD_M_FEATURE_TOGGLES_DIM_HEADER_CELLS_WITH_ICONS:"dimHeaderCellsWithIcons",
	TD_M_FEATURE_TOGGLES_NATIVE_TEXT_EDIT:"nativeTextEdit",
	TD_M_FOCUSED_CELL:"focusedCell",
	TD_M_FONT_OVERRIDE:"fontOverride",
	TD_M_FORMULA_CELL_STYLE_MAP:"formulaCellStyleMap",
	TD_M_ROW_HEIGHT_SETTING:"RowHeightSetting",
	TD_M_SCROLL_POSITION:"scrollPosition",
	TD_M_STYLE:"style",
	TD_M_SUBTITLE_STYLE:"subtitleStyle",
	TD_M_TITLE:"title",
	TD_M_TITLE_STYLE:"titleStyle",
	TD_M_TOKEN_DATA:"tokenData",
	TD_N_COLUMN:"column",
	TD_N_DATA_REGION_CORNER_COL:"dataRegionCornerCol",
	TD_N_DATA_REGION_CORNER_ROW:"dataRegionCornerRow",
	TD_N_DATA_REGION_END_COL:"dataRegionEndCol",
	TD_N_DATA_REGION_END_ROW:"dataRegionEndRow",
	TD_N_DATA_REGION_HEADER_END_ROW:"dataRegionHeaderEndRow",
	TD_N_DATA_REGION_START_COL:"dataRegionStartCol",
	TD_N_DATA_REGION_START_ROW:"dataRegionStartRow",
	TD_N_FREEZE_END_COL:"freezeEndCol",
	TD_N_FREEZE_END_ROW:"freezeEndRow",
	TD_N_LAST_ROW_INDEX:"lastRowIndex",
	TD_N_PREFETCHED_HEIGHT_BELOW_TABLE:"prefetchedHeightBelowTable",
	TD_N_ROW:"row",
	TD_N_ROW_HEIGHT_CUSTOM_PIXELS:"rowHeightCustomPixels",
	TD_N_TOTAL_HEIGHT:"totalHeight",
	TD_N_TOTAL_ROWS_DIFF:"totalRowsDiff",
	TD_N_TOTAL_WIDTH:"totalWidth",
	TD_N_WIDGET_HEIGHT:"widgetHeight",
	TD_N_WIDGET_WIDTH:"widgetWidth",
	TD_S_ID:"id",
	TD_S_ID_FOR_TABLE_NAME_ARIA_LABEL:"idForTableNameAriaLabel",
	TD_S_TABLE_ID:"tableId",
	TD_S_TITLE_TEXT:"titleText",
	TE_L_CHILDREN:"children",
	TE_L_CLASSES:"classes",
	TE_O_ATTRIBUTES:"attributes",
	TE_O_STYLES:"styles",
	TE_S_TAG:"tag",
	TE_S_TEXT:"text",
	TH_B_DOUBLE_OVERLAY:"doubleOverlay",
	TH_N_COLUMN:"column",
	TH_N_HOVER_CONTEXT_TYPE:"hoverContextType",
	TH_N_ROW:"row",
	TH_S_DIMENSION_ID:"dimensionId",
	TIT_ALERT:"alert",
	TIT_DIAMOND:"diamond",
	TIT_GOOD:"good",
	TIT_INFORMATION:"information",
	TIT_OUTLINE_FILL:"outline-fill",
	TIT_SAP_ALERT:"sap-alert",
	TIT_SAP_CHECKMARK:"sap-checkmark",
	TIT_SAP_ERROR:"sap-error",
	TIT_SAP_INFORMATION:"sap-information",
	TIT_WARNING:"warning",
	TSI_L_COLUMN_SETTINGS:"columnSettings",
	TSI_L_ROWS:"rows",
	TSI_M_FONT_OVERRIDE:"fontOverride",
	TSI_M_STYLE:"style",
	TS_L_SELECTED_REGIONS:"selectedRegions",
	TS_N_HEIGHT:"height",
	TS_N_SELECTION_CONTEXT_TYPE:"selectionContextType",
	VA_BOTTOM:2,
	VA_MIDDLE:1,
	VA_TOP:0,
	VT_INVALID:"INVALID",
	VT_UNDEFINED:"UNDEFINED",
	VT_VALID:"VALID",
	V_S_THRESHOLD_COLOR_BAD:"#E78C07",
	V_S_THRESHOLD_COLOR_CRITICAL:"#f24269",
	V_S_THRESHOLD_COLOR_GOOD:"#77D36F",
	V_S_THRESHOLD_COLOR_NORMAL:"#4242FF",
	V_S_THRESHOLD_TYPE_BAD:"warning",
	V_S_THRESHOLD_TYPE_CRITICAL:"alert",
	V_S_THRESHOLD_TYPE_GOOD:"good",
	V_S_THRESHOLD_TYPE_NORMAL:"good",
	V_S_TOOLTIP:"tooltip",
	V_S_TYPE:"type",
	staticSetup:function()
	{
			oFF.SacTableConstants.IMAGE_FILE_EXTENSIONS = oFF.XStringTokenizer.splitString(".apng;.png;.avif;.gif;.jpg;.jpeg;.jfif;.pjpeg;.pjp;.svg;.webp;.bmp;.ico;.cur;.tif;.tiff", ";");
	}
};

oFF.SacGridRendererFactory = {

	s_instance:null,
	createGridRenderer:function(table)
	{
			return oFF.SacGridRendererFactory.s_instance.newGridRenderer(table);
	},
	setInstance:function(theFactory)
	{
			oFF.SacGridRendererFactory.s_instance = theFactory;
	}
};

oFF.SacTableFactory = {

	s_instance:null,
	createTableObject:function()
	{
			return oFF.SacTableFactory.s_instance.newTableObject();
	},
	setInstance:function(theFactory)
	{
			oFF.SacTableFactory.s_instance = theFactory;
	}
};

oFF.ChartVisualizationLineStyle = function() {};
oFF.ChartVisualizationLineStyle.prototype = new oFF.XConstant();
oFF.ChartVisualizationLineStyle.prototype._ff_c = "ChartVisualizationLineStyle";

oFF.ChartVisualizationLineStyle.DASH = null;
oFF.ChartVisualizationLineStyle.DASH_DOT = null;
oFF.ChartVisualizationLineStyle.DOT = null;
oFF.ChartVisualizationLineStyle.INHERIT = null;
oFF.ChartVisualizationLineStyle.LONG_DASH = null;
oFF.ChartVisualizationLineStyle.LONG_DASH_DOT = null;
oFF.ChartVisualizationLineStyle.LONG_DASH_DOT_DOT = null;
oFF.ChartVisualizationLineStyle.SHORT_DASH = null;
oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT = null;
oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT_DOT = null;
oFF.ChartVisualizationLineStyle.SHORT_DOT = null;
oFF.ChartVisualizationLineStyle.SOLID = null;
oFF.ChartVisualizationLineStyle.s_instances = null;
oFF.ChartVisualizationLineStyle.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.ChartVisualizationLineStyle(), name);
	oFF.ChartVisualizationLineStyle.s_instances.put(name, object);
	return object;
};
oFF.ChartVisualizationLineStyle.lookup = function(name)
{
	return oFF.ChartVisualizationLineStyle.s_instances.getByKey(name);
};
oFF.ChartVisualizationLineStyle.staticSetup = function()
{
	oFF.ChartVisualizationLineStyle.s_instances = oFF.XHashMapByString.create();
	oFF.ChartVisualizationLineStyle.SOLID = oFF.ChartVisualizationLineStyle.create("Solid");
	oFF.ChartVisualizationLineStyle.SHORT_DASH = oFF.ChartVisualizationLineStyle.create("ShortDash");
	oFF.ChartVisualizationLineStyle.SHORT_DOT = oFF.ChartVisualizationLineStyle.create("ShortDot");
	oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT = oFF.ChartVisualizationLineStyle.create("ShortDashDot");
	oFF.ChartVisualizationLineStyle.SHORT_DASH_DOT_DOT = oFF.ChartVisualizationLineStyle.create("ShortDashDotDot");
	oFF.ChartVisualizationLineStyle.DOT = oFF.ChartVisualizationLineStyle.create("Dot");
	oFF.ChartVisualizationLineStyle.DASH = oFF.ChartVisualizationLineStyle.create("Dash");
	oFF.ChartVisualizationLineStyle.LONG_DASH = oFF.ChartVisualizationLineStyle.create("LongDash");
	oFF.ChartVisualizationLineStyle.DASH_DOT = oFF.ChartVisualizationLineStyle.create("DashDot");
	oFF.ChartVisualizationLineStyle.LONG_DASH_DOT = oFF.ChartVisualizationLineStyle.create("LongDashDot");
	oFF.ChartVisualizationLineStyle.LONG_DASH_DOT_DOT = oFF.ChartVisualizationLineStyle.create("LongDashDotDot");
	oFF.ChartVisualizationLineStyle.INHERIT = oFF.ChartVisualizationLineStyle.create("Inherit");
};

oFF.ChartVisualizationStackingType = function() {};
oFF.ChartVisualizationStackingType.prototype = new oFF.XConstant();
oFF.ChartVisualizationStackingType.prototype._ff_c = "ChartVisualizationStackingType";

oFF.ChartVisualizationStackingType.NONE = null;
oFF.ChartVisualizationStackingType.NORMAL = null;
oFF.ChartVisualizationStackingType.PERCENT = null;
oFF.ChartVisualizationStackingType.s_instances = null;
oFF.ChartVisualizationStackingType.create = function(name)
{
	let chartStacking = new oFF.ChartVisualizationStackingType();
	chartStacking._setupInternal(name);
	oFF.ChartVisualizationStackingType.s_instances.put(name, chartStacking);
	return chartStacking;
};
oFF.ChartVisualizationStackingType.lookup = function(name)
{
	return oFF.ChartVisualizationStackingType.s_instances.getByKey(name);
};
oFF.ChartVisualizationStackingType.staticSetup = function()
{
	oFF.ChartVisualizationStackingType.s_instances = oFF.XHashMapByString.create();
	oFF.ChartVisualizationStackingType.NONE = oFF.ChartVisualizationStackingType.create("None");
	oFF.ChartVisualizationStackingType.NORMAL = oFF.ChartVisualizationStackingType.create("Normal");
	oFF.ChartVisualizationStackingType.PERCENT = oFF.ChartVisualizationStackingType.create("Percent");
};

oFF.VisualizationBackgroundPatternType = function() {};
oFF.VisualizationBackgroundPatternType.prototype = new oFF.XConstant();
oFF.VisualizationBackgroundPatternType.prototype._ff_c = "VisualizationBackgroundPatternType";

oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_1 = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_2 = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_3 = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_4 = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_5 = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_6 = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_7 = null;
oFF.VisualizationBackgroundPatternType.HATCHIING_8 = null;
oFF.VisualizationBackgroundPatternType.INHERIT = null;
oFF.VisualizationBackgroundPatternType.NOFILL = null;
oFF.VisualizationBackgroundPatternType.SOLID = null;
oFF.VisualizationBackgroundPatternType.WHITE_FILL = null;
oFF.VisualizationBackgroundPatternType.s_instances = null;
oFF.VisualizationBackgroundPatternType.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.VisualizationBackgroundPatternType(), name);
	oFF.VisualizationBackgroundPatternType.s_instances.put(name, object);
	return object;
};
oFF.VisualizationBackgroundPatternType.lookup = function(name)
{
	return oFF.VisualizationBackgroundPatternType.s_instances.getByKey(name);
};
oFF.VisualizationBackgroundPatternType.staticSetup = function()
{
	oFF.VisualizationBackgroundPatternType.s_instances = oFF.XHashMapByString.create();
	oFF.VisualizationBackgroundPatternType.HATCHIING_1 = oFF.VisualizationBackgroundPatternType.create("Hatching1");
	oFF.VisualizationBackgroundPatternType.HATCHIING_2 = oFF.VisualizationBackgroundPatternType.create("Hatching2");
	oFF.VisualizationBackgroundPatternType.HATCHIING_3 = oFF.VisualizationBackgroundPatternType.create("Hatching3");
	oFF.VisualizationBackgroundPatternType.HATCHIING_4 = oFF.VisualizationBackgroundPatternType.create("Hatching4");
	oFF.VisualizationBackgroundPatternType.HATCHIING_5 = oFF.VisualizationBackgroundPatternType.create("Hatching5");
	oFF.VisualizationBackgroundPatternType.HATCHIING_6 = oFF.VisualizationBackgroundPatternType.create("Hatching6");
	oFF.VisualizationBackgroundPatternType.HATCHIING_7 = oFF.VisualizationBackgroundPatternType.create("Hatching7");
	oFF.VisualizationBackgroundPatternType.HATCHIING_8 = oFF.VisualizationBackgroundPatternType.create("Hatching8");
	oFF.VisualizationBackgroundPatternType.NOFILL = oFF.VisualizationBackgroundPatternType.create("Nofill");
	oFF.VisualizationBackgroundPatternType.SOLID = oFF.VisualizationBackgroundPatternType.create("Solid");
	oFF.VisualizationBackgroundPatternType.BACKGROUND_IMAGE = oFF.VisualizationBackgroundPatternType.create("BackgroundImage");
	oFF.VisualizationBackgroundPatternType.WHITE_FILL = oFF.VisualizationBackgroundPatternType.create("WhiteFill");
	oFF.VisualizationBackgroundPatternType.INHERIT = oFF.VisualizationBackgroundPatternType.create("Inherit");
};

oFF.VisualizationChartPointShape = function() {};
oFF.VisualizationChartPointShape.prototype = new oFF.XConstant();
oFF.VisualizationChartPointShape.prototype._ff_c = "VisualizationChartPointShape";

oFF.VisualizationChartPointShape.CIRCLE = null;
oFF.VisualizationChartPointShape.DIAMOND = null;
oFF.VisualizationChartPointShape.INHERIT = null;
oFF.VisualizationChartPointShape.SQUARE = null;
oFF.VisualizationChartPointShape.TRIANGLE = null;
oFF.VisualizationChartPointShape.TRIANGLE_DOWN = null;
oFF.VisualizationChartPointShape.s_instances = null;
oFF.VisualizationChartPointShape.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.VisualizationChartPointShape(), name);
	oFF.VisualizationChartPointShape.s_instances.put(name, object);
	return object;
};
oFF.VisualizationChartPointShape.lookup = function(name)
{
	return oFF.VisualizationChartPointShape.s_instances.getByKey(name);
};
oFF.VisualizationChartPointShape.staticSetup = function()
{
	oFF.VisualizationChartPointShape.s_instances = oFF.XHashMapByString.create();
	oFF.VisualizationChartPointShape.CIRCLE = oFF.VisualizationChartPointShape.create("Circle");
	oFF.VisualizationChartPointShape.SQUARE = oFF.VisualizationChartPointShape.create("Square");
	oFF.VisualizationChartPointShape.DIAMOND = oFF.VisualizationChartPointShape.create("Diamond");
	oFF.VisualizationChartPointShape.TRIANGLE = oFF.VisualizationChartPointShape.create("Triangle");
	oFF.VisualizationChartPointShape.TRIANGLE_DOWN = oFF.VisualizationChartPointShape.create("TriangleDown");
	oFF.VisualizationChartPointShape.INHERIT = oFF.VisualizationChartPointShape.create("Inherit");
};

oFF.SacAlertCategory = function() {};
oFF.SacAlertCategory.prototype = new oFF.XConstant();
oFF.SacAlertCategory.prototype._ff_c = "SacAlertCategory";

oFF.SacAlertCategory.BAD = null;
oFF.SacAlertCategory.CRITICAL = null;
oFF.SacAlertCategory.GOOD = null;
oFF.SacAlertCategory.NORMAL = null;
oFF.SacAlertCategory.create = function(name, priority)
{
	let object = oFF.XConstant.setupName(new oFF.SacAlertCategory(), name);
	object.m_priority = priority;
	return object;
};
oFF.SacAlertCategory.staticSetup = function()
{
	oFF.SacAlertCategory.NORMAL = oFF.SacAlertCategory.create("NORMAL", 0);
	oFF.SacAlertCategory.GOOD = oFF.SacAlertCategory.create("GOOD", 1);
	oFF.SacAlertCategory.CRITICAL = oFF.SacAlertCategory.create("CRITICAL", 2);
	oFF.SacAlertCategory.BAD = oFF.SacAlertCategory.create("BAD", 3);
};
oFF.SacAlertCategory.prototype.m_priority = 0;
oFF.SacAlertCategory.prototype.getPriority = function()
{
	return this.m_priority;
};

oFF.SacAlertLevel = function() {};
oFF.SacAlertLevel.prototype = new oFF.XConstant();
oFF.SacAlertLevel.prototype._ff_c = "SacAlertLevel";

oFF.SacAlertLevel.BAD_1 = null;
oFF.SacAlertLevel.BAD_2 = null;
oFF.SacAlertLevel.BAD_3 = null;
oFF.SacAlertLevel.CRITICAL_1 = null;
oFF.SacAlertLevel.CRITICAL_2 = null;
oFF.SacAlertLevel.CRITICAL_3 = null;
oFF.SacAlertLevel.GOOD_1 = null;
oFF.SacAlertLevel.GOOD_2 = null;
oFF.SacAlertLevel.GOOD_3 = null;
oFF.SacAlertLevel.NORMAL = null;
oFF.SacAlertLevel.create = function(value, category, priority)
{
	let object = new oFF.SacAlertLevel();
	object.setupExt(value, priority, category);
	return object;
};
oFF.SacAlertLevel.getByLevelValue = function(level)
{
	switch (level)
	{
		case 0:
			return oFF.SacAlertLevel.NORMAL;

		case 1:
			return oFF.SacAlertLevel.GOOD_1;

		case 2:
			return oFF.SacAlertLevel.GOOD_2;

		case 3:
			return oFF.SacAlertLevel.GOOD_3;

		case 4:
			return oFF.SacAlertLevel.CRITICAL_1;

		case 5:
			return oFF.SacAlertLevel.CRITICAL_2;

		case 6:
			return oFF.SacAlertLevel.CRITICAL_3;

		case 7:
			return oFF.SacAlertLevel.BAD_1;

		case 8:
			return oFF.SacAlertLevel.BAD_2;

		case 9:
			return oFF.SacAlertLevel.BAD_3;

		default:
			return null;
	}
};
oFF.SacAlertLevel.staticSetup = function()
{
	oFF.SacAlertLevel.NORMAL = oFF.SacAlertLevel.create(0, oFF.SacAlertCategory.NORMAL, 1);
	oFF.SacAlertLevel.GOOD_1 = oFF.SacAlertLevel.create(1, oFF.SacAlertCategory.GOOD, 1);
	oFF.SacAlertLevel.GOOD_2 = oFF.SacAlertLevel.create(2, oFF.SacAlertCategory.GOOD, 2);
	oFF.SacAlertLevel.GOOD_3 = oFF.SacAlertLevel.create(3, oFF.SacAlertCategory.GOOD, 3);
	oFF.SacAlertLevel.CRITICAL_1 = oFF.SacAlertLevel.create(4, oFF.SacAlertCategory.CRITICAL, 1);
	oFF.SacAlertLevel.CRITICAL_2 = oFF.SacAlertLevel.create(5, oFF.SacAlertCategory.CRITICAL, 2);
	oFF.SacAlertLevel.CRITICAL_3 = oFF.SacAlertLevel.create(6, oFF.SacAlertCategory.CRITICAL, 3);
	oFF.SacAlertLevel.BAD_1 = oFF.SacAlertLevel.create(7, oFF.SacAlertCategory.BAD, 1);
	oFF.SacAlertLevel.BAD_2 = oFF.SacAlertLevel.create(8, oFF.SacAlertCategory.BAD, 2);
	oFF.SacAlertLevel.BAD_3 = oFF.SacAlertLevel.create(9, oFF.SacAlertCategory.BAD, 3);
};
oFF.SacAlertLevel.prototype.m_category = null;
oFF.SacAlertLevel.prototype.m_level = 0;
oFF.SacAlertLevel.prototype.m_priority = 0;
oFF.SacAlertLevel.prototype.getCategory = function()
{
	return this.m_category;
};
oFF.SacAlertLevel.prototype.getLevel = function()
{
	return this.m_level;
};
oFF.SacAlertLevel.prototype.getPriority = function()
{
	return this.m_priority;
};
oFF.SacAlertLevel.prototype.setupExt = function(value, priority, category)
{
	this._setupInternal(oFF.XInteger.convertToString(value));
	this.m_priority = priority;
	this.m_level = value;
	this.m_category = category;
};

oFF.SacAlertSymbol = function() {};
oFF.SacAlertSymbol.prototype = new oFF.XConstant();
oFF.SacAlertSymbol.prototype._ff_c = "SacAlertSymbol";

oFF.SacAlertSymbol.ALERT = null;
oFF.SacAlertSymbol.DIAMOND = null;
oFF.SacAlertSymbol.GOOD = null;
oFF.SacAlertSymbol.INFORMATION = null;
oFF.SacAlertSymbol.OUTLINE_FILL = null;
oFF.SacAlertSymbol.SAP_ALERT = null;
oFF.SacAlertSymbol.SAP_CHECKMARK = null;
oFF.SacAlertSymbol.SAP_ERROR = null;
oFF.SacAlertSymbol.SAP_INFORMATION = null;
oFF.SacAlertSymbol.WARNING = null;
oFF.SacAlertSymbol.s_instances = null;
oFF.SacAlertSymbol.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacAlertSymbol(), name);
	oFF.SacAlertSymbol.s_instances.put(name, object);
	return object;
};
oFF.SacAlertSymbol.lookup = function(name)
{
	return oFF.SacAlertSymbol.s_instances.getByKey(name);
};
oFF.SacAlertSymbol.staticSetup = function()
{
	oFF.SacAlertSymbol.s_instances = oFF.XHashMapByString.create();
	oFF.SacAlertSymbol.GOOD = oFF.SacAlertSymbol.create("Good");
	oFF.SacAlertSymbol.WARNING = oFF.SacAlertSymbol.create("Warning");
	oFF.SacAlertSymbol.ALERT = oFF.SacAlertSymbol.create("Alert");
	oFF.SacAlertSymbol.DIAMOND = oFF.SacAlertSymbol.create("Diamond");
	oFF.SacAlertSymbol.INFORMATION = oFF.SacAlertSymbol.create("Information");
	oFF.SacAlertSymbol.SAP_CHECKMARK = oFF.SacAlertSymbol.create("SapCheckmark");
	oFF.SacAlertSymbol.SAP_ALERT = oFF.SacAlertSymbol.create("SapAlert");
	oFF.SacAlertSymbol.SAP_ERROR = oFF.SacAlertSymbol.create("SapError");
	oFF.SacAlertSymbol.SAP_INFORMATION = oFF.SacAlertSymbol.create("SapInformation");
	oFF.SacAlertSymbol.OUTLINE_FILL = oFF.SacAlertSymbol.create("OutlineFill");
};

oFF.SacCellChartOrientation = function() {};
oFF.SacCellChartOrientation.prototype = new oFF.XConstant();
oFF.SacCellChartOrientation.prototype._ff_c = "SacCellChartOrientation";

oFF.SacCellChartOrientation.HORIZONTAL = null;
oFF.SacCellChartOrientation.VERTICAL = null;
oFF.SacCellChartOrientation.s_instances = null;
oFF.SacCellChartOrientation.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacCellChartOrientation(), name);
	oFF.SacCellChartOrientation.s_instances.put(name, object);
	return object;
};
oFF.SacCellChartOrientation.lookup = function(name)
{
	return oFF.SacCellChartOrientation.s_instances.getByKey(name);
};
oFF.SacCellChartOrientation.staticSetup = function()
{
	oFF.SacCellChartOrientation.s_instances = oFF.XHashMapByString.create();
	oFF.SacCellChartOrientation.HORIZONTAL = oFF.SacCellChartOrientation.create("Horizontal");
	oFF.SacCellChartOrientation.VERTICAL = oFF.SacCellChartOrientation.create("Vertical");
};

oFF.SacCellChartType = function() {};
oFF.SacCellChartType.prototype = new oFF.XConstant();
oFF.SacCellChartType.prototype._ff_c = "SacCellChartType";

oFF.SacCellChartType.BAR = null;
oFF.SacCellChartType.PIN = null;
oFF.SacCellChartType.VARIANCE_BAR = null;
oFF.SacCellChartType.s_instances = null;
oFF.SacCellChartType.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacCellChartType(), name);
	oFF.SacCellChartType.s_instances.put(name, object);
	return object;
};
oFF.SacCellChartType.lookup = function(name)
{
	return oFF.SacCellChartType.s_instances.getByKey(name);
};
oFF.SacCellChartType.staticSetup = function()
{
	oFF.SacCellChartType.s_instances = oFF.XHashMapByString.create();
	oFF.SacCellChartType.BAR = oFF.SacCellChartType.create("Bar");
	oFF.SacCellChartType.VARIANCE_BAR = oFF.SacCellChartType.create("VarianceBar");
	oFF.SacCellChartType.PIN = oFF.SacCellChartType.create("Pin");
};

oFF.SacCellType = function() {};
oFF.SacCellType.prototype = new oFF.XConstant();
oFF.SacCellType.prototype._ff_c = "SacCellType";

oFF.SacCellType.ATTRIBUTE = null;
oFF.SacCellType.ATTRIBUTE_COL_DIM_HEADER = null;
oFF.SacCellType.ATTRIBUTE_COL_DIM_MEMBER = null;
oFF.SacCellType.ATTRIBUTE_ROW_DIM_HEADER = null;
oFF.SacCellType.ATTRIBUTE_ROW_DIM_MEMBER = null;
oFF.SacCellType.CHART = null;
oFF.SacCellType.COLUMN_COORDINATE = null;
oFF.SacCellType.COLUMN_COORDINATE_SELECTED_DESIGN_MODE = null;
oFF.SacCellType.COLUMN_COORDINATE_SELECTED_VIEW_MODE = null;
oFF.SacCellType.COL_DIM_HEADER = null;
oFF.SacCellType.COL_DIM_MEMBER = null;
oFF.SacCellType.COMMENT = null;
oFF.SacCellType.COORDINATE_CORNER = null;
oFF.SacCellType.CUSTOM = null;
oFF.SacCellType.DATA_LOCKING = null;
oFF.SacCellType.EMPTY = null;
oFF.SacCellType.EMPTY_AXIS_COLUMN_HEADER = null;
oFF.SacCellType.EMPTY_AXIS_ROW_HEADER = null;
oFF.SacCellType.HEADER = null;
oFF.SacCellType.IMAGE = null;
oFF.SacCellType.INPUT = null;
oFF.SacCellType.MARQUEE = null;
oFF.SacCellType.MEMBER_SELECTOR = null;
oFF.SacCellType.MERGED_DUMMY_CELL = null;
oFF.SacCellType.NEW_LINE_ON_COLUMN = null;
oFF.SacCellType.NEW_LINE_ON_ROW = null;
oFF.SacCellType.ROW_COORDINATE = null;
oFF.SacCellType.ROW_COORDINATE_SELECTED_DESIGN_MODE = null;
oFF.SacCellType.ROW_COORDINATE_SELECTED_VIEW_MODE = null;
oFF.SacCellType.ROW_DIM_HEADER = null;
oFF.SacCellType.ROW_DIM_MEMBER = null;
oFF.SacCellType.THRESHOLD = null;
oFF.SacCellType.TITLE = null;
oFF.SacCellType.UNBOOKED = null;
oFF.SacCellType.VALIDATION = null;
oFF.SacCellType.VALUE = null;
oFF.SacCellType.s_instances = null;
oFF.SacCellType.create = function(name, internalValue)
{
	let object = new oFF.SacCellType();
	object.setupExt(name, internalValue);
	oFF.SacCellType.s_instances.put(name, object);
	return object;
};
oFF.SacCellType.lookup = function(name)
{
	return oFF.SacCellType.s_instances.getByKey(name);
};
oFF.SacCellType.staticSetup = function()
{
	oFF.SacCellType.s_instances = oFF.XHashMapByString.create();
	oFF.SacCellType.VALUE = oFF.SacCellType.create("Value", 0);
	oFF.SacCellType.HEADER = oFF.SacCellType.create("Header", 1);
	oFF.SacCellType.INPUT = oFF.SacCellType.create("Input", 2);
	oFF.SacCellType.CHART = oFF.SacCellType.create("Chart", 3);
	oFF.SacCellType.UNBOOKED = oFF.SacCellType.create("MemberSelector", 4);
	oFF.SacCellType.UNBOOKED = oFF.SacCellType.create("Unbooked", 5);
	oFF.SacCellType.THRESHOLD = oFF.SacCellType.create("Threshold", 6);
	oFF.SacCellType.DATA_LOCKING = oFF.SacCellType.create("DataLocking", 7);
	oFF.SacCellType.VALIDATION = oFF.SacCellType.create("Validation", 8);
	oFF.SacCellType.MARQUEE = oFF.SacCellType.create("Marqee", 9);
	oFF.SacCellType.COLUMN_COORDINATE = oFF.SacCellType.create("ColumnCoordinate", 10);
	oFF.SacCellType.ROW_COORDINATE = oFF.SacCellType.create("RowCoordinate", 11);
	oFF.SacCellType.ATTRIBUTE = oFF.SacCellType.create("Attribute", 12);
	oFF.SacCellType.EMPTY = oFF.SacCellType.create("EMPTY", 13);
	oFF.SacCellType.ROW_DIM_HEADER = oFF.SacCellType.create("RowDimHeader", 14);
	oFF.SacCellType.COL_DIM_HEADER = oFF.SacCellType.create("ColDimHeader", 15);
	oFF.SacCellType.ROW_DIM_MEMBER = oFF.SacCellType.create("RowDimMember", 16);
	oFF.SacCellType.COL_DIM_MEMBER = oFF.SacCellType.create("ColDimMember", 17);
	oFF.SacCellType.ATTRIBUTE_ROW_DIM_HEADER = oFF.SacCellType.create("AttributeRowDimHeader", 18);
	oFF.SacCellType.ATTRIBUTE_COL_DIM_HEADER = oFF.SacCellType.create("AttributeColDimHeader", 19);
	oFF.SacCellType.ATTRIBUTE_ROW_DIM_MEMBER = oFF.SacCellType.create("AttributeRowDimMember", 20);
	oFF.SacCellType.ATTRIBUTE_COL_DIM_MEMBER = oFF.SacCellType.create("AttributeColDimMember", 21);
	oFF.SacCellType.TITLE = oFF.SacCellType.create("Title", 22);
	oFF.SacCellType.CUSTOM = oFF.SacCellType.create("Custom", 23);
	oFF.SacCellType.COORDINATE_CORNER = oFF.SacCellType.create("CoordinateCorner", 24);
	oFF.SacCellType.COMMENT = oFF.SacCellType.create("Comment", 25);
	oFF.SacCellType.COLUMN_COORDINATE_SELECTED_DESIGN_MODE = oFF.SacCellType.create("ColumnCoordinateSelectedDesignMode", 26);
	oFF.SacCellType.ROW_COORDINATE_SELECTED_DESIGN_MODE = oFF.SacCellType.create("RowCoordinateSelectedDesignMode", 27);
	oFF.SacCellType.COLUMN_COORDINATE_SELECTED_VIEW_MODE = oFF.SacCellType.create("ColumnCoordinateSelectedViewMode", 28);
	oFF.SacCellType.ROW_COORDINATE_SELECTED_VIEW_MODE = oFF.SacCellType.create("RowCoordinateSelectedViewMode", 29);
	oFF.SacCellType.MERGED_DUMMY_CELL = oFF.SacCellType.create("MergedDummyCell", 30);
	oFF.SacCellType.IMAGE = oFF.SacCellType.create("Image", 31);
	oFF.SacCellType.NEW_LINE_ON_ROW = oFF.SacCellType.create("NewLineOnRow", 32);
	oFF.SacCellType.NEW_LINE_ON_COLUMN = oFF.SacCellType.create("NewLineOnColumn", 33);
	oFF.SacCellType.EMPTY_AXIS_ROW_HEADER = oFF.SacCellType.create("EmptyAxisRowHeader", 34);
	oFF.SacCellType.EMPTY_AXIS_COLUMN_HEADER = oFF.SacCellType.create("EmptyAxisColumnHeader", 35);
};
oFF.SacCellType.prototype.m_internalValue = 0;
oFF.SacCellType.prototype.getInternalValue = function()
{
	return this.m_internalValue;
};
oFF.SacCellType.prototype.setupExt = function(name, internalValue)
{
	this._setupInternal(name);
	this.m_internalValue = internalValue;
};

oFF.SacLayoutDirection = function() {};
oFF.SacLayoutDirection.prototype = new oFF.XConstant();
oFF.SacLayoutDirection.prototype._ff_c = "SacLayoutDirection";

oFF.SacLayoutDirection.HORIZONTAL = null;
oFF.SacLayoutDirection.INHERIT = null;
oFF.SacLayoutDirection.VERTICAL = null;
oFF.SacLayoutDirection.s_instances = null;
oFF.SacLayoutDirection.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacLayoutDirection(), name);
	oFF.SacLayoutDirection.s_instances.put(name, object);
	return object;
};
oFF.SacLayoutDirection.lookup = function(name)
{
	return oFF.SacLayoutDirection.s_instances.getByKey(name);
};
oFF.SacLayoutDirection.staticSetup = function()
{
	oFF.SacLayoutDirection.s_instances = oFF.XHashMapByString.create();
	oFF.SacLayoutDirection.HORIZONTAL = oFF.SacLayoutDirection.create("Horizontal");
	oFF.SacLayoutDirection.VERTICAL = oFF.SacLayoutDirection.create("Vertical");
	oFF.SacLayoutDirection.INHERIT = oFF.SacLayoutDirection.create("Inherit");
};

oFF.SacTableAxisType = function() {};
oFF.SacTableAxisType.prototype = new oFF.XConstant();
oFF.SacTableAxisType.prototype._ff_c = "SacTableAxisType";

oFF.SacTableAxisType.COLUMNS = null;
oFF.SacTableAxisType.ROWS = null;
oFF.SacTableAxisType.s_instances = null;
oFF.SacTableAxisType.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacTableAxisType(), name);
	oFF.SacTableAxisType.s_instances.put(name, object);
	return object;
};
oFF.SacTableAxisType.lookup = function(name)
{
	return oFF.SacTableAxisType.s_instances.getByKey(name);
};
oFF.SacTableAxisType.staticSetup = function()
{
	oFF.SacTableAxisType.s_instances = oFF.XHashMapByString.create();
	oFF.SacTableAxisType.ROWS = oFF.SacTableAxisType.create("Rows");
	oFF.SacTableAxisType.COLUMNS = oFF.SacTableAxisType.create("Columns");
};

oFF.SacTableLineStyle = function() {};
oFF.SacTableLineStyle.prototype = new oFF.XConstant();
oFF.SacTableLineStyle.prototype._ff_c = "SacTableLineStyle";

oFF.SacTableLineStyle.DASHED = null;
oFF.SacTableLineStyle.DOTTED = null;
oFF.SacTableLineStyle.INHERIT = null;
oFF.SacTableLineStyle.NONE = null;
oFF.SacTableLineStyle.SOLID = null;
oFF.SacTableLineStyle.s_instances = null;
oFF.SacTableLineStyle.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacTableLineStyle(), name);
	oFF.SacTableLineStyle.s_instances.put(name, object);
	return object;
};
oFF.SacTableLineStyle.lookup = function(name)
{
	return oFF.SacTableLineStyle.s_instances.getByKey(name);
};
oFF.SacTableLineStyle.staticSetup = function()
{
	oFF.SacTableLineStyle.s_instances = oFF.XHashMapByString.create();
	oFF.SacTableLineStyle.NONE = oFF.SacTableLineStyle.create("None");
	oFF.SacTableLineStyle.SOLID = oFF.SacTableLineStyle.create("Solid");
	oFF.SacTableLineStyle.DASHED = oFF.SacTableLineStyle.create("Dashed");
	oFF.SacTableLineStyle.DOTTED = oFF.SacTableLineStyle.create("Dotted");
	oFF.SacTableLineStyle.INHERIT = oFF.SacTableLineStyle.create("Inherit");
};

oFF.SacTableMemberHeaderHandling = function() {};
oFF.SacTableMemberHeaderHandling.prototype = new oFF.XConstant();
oFF.SacTableMemberHeaderHandling.prototype._ff_c = "SacTableMemberHeaderHandling";

oFF.SacTableMemberHeaderHandling.BAND = null;
oFF.SacTableMemberHeaderHandling.FIRST_MEMBER = null;
oFF.SacTableMemberHeaderHandling.INHERIT = null;
oFF.SacTableMemberHeaderHandling.MERGE = null;
oFF.SacTableMemberHeaderHandling.REPETITIVE = null;
oFF.SacTableMemberHeaderHandling.s_instances = null;
oFF.SacTableMemberHeaderHandling.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacTableMemberHeaderHandling(), name);
	oFF.SacTableMemberHeaderHandling.s_instances.put(name, object);
	return object;
};
oFF.SacTableMemberHeaderHandling.lookup = function(name)
{
	return oFF.SacTableMemberHeaderHandling.s_instances.getByKey(name);
};
oFF.SacTableMemberHeaderHandling.staticSetup = function()
{
	oFF.SacTableMemberHeaderHandling.s_instances = oFF.XHashMapByString.create();
	oFF.SacTableMemberHeaderHandling.BAND = oFF.SacTableMemberHeaderHandling.create("Band");
	oFF.SacTableMemberHeaderHandling.FIRST_MEMBER = oFF.SacTableMemberHeaderHandling.create("FirstMember");
	oFF.SacTableMemberHeaderHandling.REPETITIVE = oFF.SacTableMemberHeaderHandling.create("Repetitive");
	oFF.SacTableMemberHeaderHandling.MERGE = oFF.SacTableMemberHeaderHandling.create("Merge");
	oFF.SacTableMemberHeaderHandling.INHERIT = oFF.SacTableMemberHeaderHandling.create("Inherit");
};

oFF.SacValueException = function() {};
oFF.SacValueException.prototype = new oFF.XConstant();
oFF.SacValueException.prototype._ff_c = "SacValueException";

oFF.SacValueException.DIV0 = null;
oFF.SacValueException.ERROR = null;
oFF.SacValueException.MIXED_CURRENCIES_OR_UNITS = null;
oFF.SacValueException.NO_AUTHORITY = null;
oFF.SacValueException.NO_PRESENTATION = null;
oFF.SacValueException.NULL_VALUE = null;
oFF.SacValueException.OVERFLOW = null;
oFF.SacValueException.UNDEFINED = null;
oFF.SacValueException.UNDEFINED_NOP = null;
oFF.SacValueException.ZERO = null;
oFF.SacValueException.s_instances = null;
oFF.SacValueException.create = function(value)
{
	let valueException = oFF.XConstant.setupName(new oFF.SacValueException(), value);
	oFF.SacValueException.s_instances.put(value, valueException);
	return valueException;
};
oFF.SacValueException.get = function(name)
{
	return oFF.SacValueException.s_instances.getByKey(name);
};
oFF.SacValueException.staticSetup = function()
{
	oFF.SacValueException.s_instances = oFF.XHashMapByString.create();
	oFF.SacValueException.NULL_VALUE = oFF.SacValueException.create("NullValue");
	oFF.SacValueException.ZERO = oFF.SacValueException.create("Zero");
	oFF.SacValueException.UNDEFINED = oFF.SacValueException.create("Undefined");
	oFF.SacValueException.OVERFLOW = oFF.SacValueException.create("Overflow");
	oFF.SacValueException.NO_PRESENTATION = oFF.SacValueException.create("NoPresentation");
	oFF.SacValueException.DIV0 = oFF.SacValueException.create("Div0");
	oFF.SacValueException.ERROR = oFF.SacValueException.create("Error");
	oFF.SacValueException.NO_AUTHORITY = oFF.SacValueException.create("NoAuthority");
	oFF.SacValueException.MIXED_CURRENCIES_OR_UNITS = oFF.SacValueException.create("MixedCurrenciesOrUnits");
	oFF.SacValueException.UNDEFINED_NOP = oFF.SacValueException.create("UndefinedNop");
};

oFF.SacVisualizationHorizontalAlignment = function() {};
oFF.SacVisualizationHorizontalAlignment.prototype = new oFF.XConstant();
oFF.SacVisualizationHorizontalAlignment.prototype._ff_c = "SacVisualizationHorizontalAlignment";

oFF.SacVisualizationHorizontalAlignment.CENTER = null;
oFF.SacVisualizationHorizontalAlignment.INHERIT = null;
oFF.SacVisualizationHorizontalAlignment.LEFT = null;
oFF.SacVisualizationHorizontalAlignment.RIGHT = null;
oFF.SacVisualizationHorizontalAlignment.s_instances = null;
oFF.SacVisualizationHorizontalAlignment.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacVisualizationHorizontalAlignment(), name);
	oFF.SacVisualizationHorizontalAlignment.s_instances.put(name, object);
	return object;
};
oFF.SacVisualizationHorizontalAlignment.lookup = function(name)
{
	return oFF.SacVisualizationHorizontalAlignment.s_instances.getByKey(name);
};
oFF.SacVisualizationHorizontalAlignment.staticSetup = function()
{
	oFF.SacVisualizationHorizontalAlignment.s_instances = oFF.XHashMapByString.create();
	oFF.SacVisualizationHorizontalAlignment.LEFT = oFF.SacVisualizationHorizontalAlignment.create("Left");
	oFF.SacVisualizationHorizontalAlignment.CENTER = oFF.SacVisualizationHorizontalAlignment.create("Center");
	oFF.SacVisualizationHorizontalAlignment.RIGHT = oFF.SacVisualizationHorizontalAlignment.create("Right");
	oFF.SacVisualizationHorizontalAlignment.INHERIT = oFF.SacVisualizationHorizontalAlignment.create("Inherit");
};

oFF.SacVisualizationVerticalAlignment = function() {};
oFF.SacVisualizationVerticalAlignment.prototype = new oFF.XConstant();
oFF.SacVisualizationVerticalAlignment.prototype._ff_c = "SacVisualizationVerticalAlignment";

oFF.SacVisualizationVerticalAlignment.BOTTOM = null;
oFF.SacVisualizationVerticalAlignment.INHERIT = null;
oFF.SacVisualizationVerticalAlignment.MIDDLE = null;
oFF.SacVisualizationVerticalAlignment.TOP = null;
oFF.SacVisualizationVerticalAlignment.s_instances = null;
oFF.SacVisualizationVerticalAlignment.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.SacVisualizationVerticalAlignment(), name);
	oFF.SacVisualizationVerticalAlignment.s_instances.put(name, object);
	return object;
};
oFF.SacVisualizationVerticalAlignment.lookup = function(name)
{
	return oFF.SacVisualizationVerticalAlignment.s_instances.getByKey(name);
};
oFF.SacVisualizationVerticalAlignment.staticSetup = function()
{
	oFF.SacVisualizationVerticalAlignment.s_instances = oFF.XHashMapByString.create();
	oFF.SacVisualizationVerticalAlignment.TOP = oFF.SacVisualizationVerticalAlignment.create("Top");
	oFF.SacVisualizationVerticalAlignment.MIDDLE = oFF.SacVisualizationVerticalAlignment.create("Middle");
	oFF.SacVisualizationVerticalAlignment.BOTTOM = oFF.SacVisualizationVerticalAlignment.create("Bottom");
	oFF.SacVisualizationVerticalAlignment.INHERIT = oFF.SacVisualizationVerticalAlignment.create("Inherit");
};

oFF.TableClipboardBehaviour = function() {};
oFF.TableClipboardBehaviour.prototype = new oFF.XConstant();
oFF.TableClipboardBehaviour.prototype._ff_c = "TableClipboardBehaviour";

oFF.TableClipboardBehaviour.INACTIVE = null;
oFF.TableClipboardBehaviour.LAST_SELECT = null;
oFF.TableClipboardBehaviour.MULTI_SELECT = null;
oFF.TableClipboardBehaviour.SINGLE_SELECT = null;
oFF.TableClipboardBehaviour.create = function(name)
{
	let object = oFF.XConstant.setupName(new oFF.TableClipboardBehaviour(), name);
	return object;
};
oFF.TableClipboardBehaviour.staticSetup = function()
{
	oFF.TableClipboardBehaviour.INACTIVE = oFF.TableClipboardBehaviour.create("Inactive");
	oFF.TableClipboardBehaviour.SINGLE_SELECT = oFF.TableClipboardBehaviour.create("SingleSelect");
	oFF.TableClipboardBehaviour.LAST_SELECT = oFF.TableClipboardBehaviour.create("LastSelect");
	oFF.TableClipboardBehaviour.MULTI_SELECT = oFF.TableClipboardBehaviour.create("MultiSelect");
};

oFF.ChartAxisDomainType = function() {};
oFF.ChartAxisDomainType.prototype = new oFF.XConstantWithParent();
oFF.ChartAxisDomainType.prototype._ff_c = "ChartAxisDomainType";

oFF.ChartAxisDomainType.CATEGORIAL = null;
oFF.ChartAxisDomainType.DIFFERENTIAL = null;
oFF.ChartAxisDomainType.NOMINAL = null;
oFF.ChartAxisDomainType.ORDINAL = null;
oFF.ChartAxisDomainType.RELATIONAL = null;
oFF.ChartAxisDomainType.SCALAR = null;
oFF.ChartAxisDomainType.s_all = null;
oFF.ChartAxisDomainType.create = function(name, parent)
{
	let newConstant = new oFF.ChartAxisDomainType();
	newConstant.setupExt(name, parent);
	oFF.ChartAxisDomainType.s_all.add(newConstant);
	return newConstant;
};
oFF.ChartAxisDomainType.getAll = function()
{
	return oFF.ChartAxisDomainType.s_all.getValuesAsReadOnlyList();
};
oFF.ChartAxisDomainType.lookup = function(name)
{
	return oFF.ChartAxisDomainType.s_all.getByKey(name);
};
oFF.ChartAxisDomainType.staticSetup = function()
{
	oFF.ChartAxisDomainType.s_all = oFF.XListOfNameObject.create();
	oFF.ChartAxisDomainType.CATEGORIAL = oFF.ChartAxisDomainType.create("Categorial", null);
	oFF.ChartAxisDomainType.NOMINAL = oFF.ChartAxisDomainType.create("Nominal", oFF.ChartAxisDomainType.CATEGORIAL);
	oFF.ChartAxisDomainType.ORDINAL = oFF.ChartAxisDomainType.create("Ordinal", oFF.ChartAxisDomainType.CATEGORIAL);
	oFF.ChartAxisDomainType.SCALAR = oFF.ChartAxisDomainType.create("Scalar", null);
	oFF.ChartAxisDomainType.DIFFERENTIAL = oFF.ChartAxisDomainType.create("Differential", oFF.ChartAxisDomainType.SCALAR);
	oFF.ChartAxisDomainType.RELATIONAL = oFF.ChartAxisDomainType.create("Relational", oFF.ChartAxisDomainType.SCALAR);
};

oFF.ChartVisualizationAxisPosition = function() {};
oFF.ChartVisualizationAxisPosition.prototype = new oFF.XConstantWithParent();
oFF.ChartVisualizationAxisPosition.prototype._ff_c = "ChartVisualizationAxisPosition";

oFF.ChartVisualizationAxisPosition.HIDDEN = null;
oFF.ChartVisualizationAxisPosition.X = null;
oFF.ChartVisualizationAxisPosition.X_BOTTOM = null;
oFF.ChartVisualizationAxisPosition.X_TOP = null;
oFF.ChartVisualizationAxisPosition.Y = null;
oFF.ChartVisualizationAxisPosition.Y_LEFT = null;
oFF.ChartVisualizationAxisPosition.Y_RIGHT = null;
oFF.ChartVisualizationAxisPosition.Z = null;
oFF.ChartVisualizationAxisPosition.s_all = null;
oFF.ChartVisualizationAxisPosition.create = function(name, opposite, parent)
{
	let newConstant = new oFF.ChartVisualizationAxisPosition();
	newConstant.setupExt(name, parent);
	newConstant.m_opposite = opposite;
	oFF.ChartVisualizationAxisPosition.s_all.add(newConstant);
	return newConstant;
};
oFF.ChartVisualizationAxisPosition.getAll = function()
{
	return oFF.ChartVisualizationAxisPosition.s_all.getValuesAsReadOnlyList();
};
oFF.ChartVisualizationAxisPosition.getOpposite = function(orig)
{
	if (orig === oFF.ChartVisualizationAxisPosition.Y_RIGHT)
	{
		return oFF.ChartVisualizationAxisPosition.Y_LEFT;
	}
	if (orig === oFF.ChartVisualizationAxisPosition.Y_LEFT)
	{
		return oFF.ChartVisualizationAxisPosition.Y_RIGHT;
	}
	if (orig === oFF.ChartVisualizationAxisPosition.X_BOTTOM)
	{
		return oFF.ChartVisualizationAxisPosition.X_TOP;
	}
	if (orig === oFF.ChartVisualizationAxisPosition.X_TOP)
	{
		return oFF.ChartVisualizationAxisPosition.X_BOTTOM;
	}
	return orig;
};
oFF.ChartVisualizationAxisPosition.getSwapped = function(orig)
{
	if (orig === oFF.ChartVisualizationAxisPosition.Y_RIGHT)
	{
		return oFF.ChartVisualizationAxisPosition.X_TOP;
	}
	if (orig === oFF.ChartVisualizationAxisPosition.Y_LEFT)
	{
		return oFF.ChartVisualizationAxisPosition.X_BOTTOM;
	}
	if (orig === oFF.ChartVisualizationAxisPosition.X_BOTTOM)
	{
		return oFF.ChartVisualizationAxisPosition.Y_LEFT;
	}
	if (orig === oFF.ChartVisualizationAxisPosition.X_TOP)
	{
		return oFF.ChartVisualizationAxisPosition.Y_RIGHT;
	}
	return orig;
};
oFF.ChartVisualizationAxisPosition.lookup = function(name)
{
	return oFF.ChartVisualizationAxisPosition.s_all.getByKey(name);
};
oFF.ChartVisualizationAxisPosition.staticSetup = function()
{
	oFF.ChartVisualizationAxisPosition.s_all = oFF.XListOfNameObject.create();
	oFF.ChartVisualizationAxisPosition.X = oFF.ChartVisualizationAxisPosition.create("X", false, null);
	oFF.ChartVisualizationAxisPosition.X_BOTTOM = oFF.ChartVisualizationAxisPosition.create("XBottom", false, oFF.ChartVisualizationAxisPosition.X);
	oFF.ChartVisualizationAxisPosition.X_TOP = oFF.ChartVisualizationAxisPosition.create("XTop", true, oFF.ChartVisualizationAxisPosition.X);
	oFF.ChartVisualizationAxisPosition.Y = oFF.ChartVisualizationAxisPosition.create("Y", false, null);
	oFF.ChartVisualizationAxisPosition.Y_LEFT = oFF.ChartVisualizationAxisPosition.create("YLeft", false, oFF.ChartVisualizationAxisPosition.Y);
	oFF.ChartVisualizationAxisPosition.Y_RIGHT = oFF.ChartVisualizationAxisPosition.create("YRight", true, oFF.ChartVisualizationAxisPosition.Y);
	oFF.ChartVisualizationAxisPosition.Z = oFF.ChartVisualizationAxisPosition.create("Z", false, null);
	oFF.ChartVisualizationAxisPosition.HIDDEN = oFF.ChartVisualizationAxisPosition.create("Hidden", false, null);
};
oFF.ChartVisualizationAxisPosition.prototype.m_opposite = false;
oFF.ChartVisualizationAxisPosition.prototype.isOpposite = function()
{
	return this.m_opposite;
};

oFF.ChartVisualizationType = function() {};
oFF.ChartVisualizationType.prototype = new oFF.XConstantWithParent();
oFF.ChartVisualizationType.prototype._ff_c = "ChartVisualizationType";

oFF.ChartVisualizationType.ABSTRACT_SERIES = null;
oFF.ChartVisualizationType.AREA = null;
oFF.ChartVisualizationType.BAR = null;
oFF.ChartVisualizationType.BAR_COLUMN = null;
oFF.ChartVisualizationType.BAR_COLUMN_GROUP_STACK = null;
oFF.ChartVisualizationType.BELL_CURVE = null;
oFF.ChartVisualizationType.BOX_PLOT = null;
oFF.ChartVisualizationType.BUBBLE = null;
oFF.ChartVisualizationType.BULLET = null;
oFF.ChartVisualizationType.COLUMN = null;
oFF.ChartVisualizationType.COMB_COLUMN_LINE = null;
oFF.ChartVisualizationType.COMB_STACKED_COLUMN_LINE = null;
oFF.ChartVisualizationType.DOUGHNUT = null;
oFF.ChartVisualizationType.HEAT_MAP = null;
oFF.ChartVisualizationType.HISTOGRAM = null;
oFF.ChartVisualizationType.LINE = null;
oFF.ChartVisualizationType.METRIC = null;
oFF.ChartVisualizationType.MOSAIC = null;
oFF.ChartVisualizationType.NONE = null;
oFF.ChartVisualizationType.PACKED_BUBBLE = null;
oFF.ChartVisualizationType.PIE = null;
oFF.ChartVisualizationType.POINT = null;
oFF.ChartVisualizationType.RADAR = null;
oFF.ChartVisualizationType.SANKEY = null;
oFF.ChartVisualizationType.SCATTER_PLOT = null;
oFF.ChartVisualizationType.SPLINE = null;
oFF.ChartVisualizationType.STACKED_BAR = null;
oFF.ChartVisualizationType.STACKED_COLUMN = null;
oFF.ChartVisualizationType.TIME_SERIES = null;
oFF.ChartVisualizationType.TREE_MAP = null;
oFF.ChartVisualizationType.VARIABLE_PIE = null;
oFF.ChartVisualizationType.VARI_WIDE = null;
oFF.ChartVisualizationType.VIOLIN = null;
oFF.ChartVisualizationType.WATERFALL = null;
oFF.ChartVisualizationType.WORD_CLOUD = null;
oFF.ChartVisualizationType.s_all = null;
oFF.ChartVisualizationType.create = function(name, parent, allowsPositiveAndNegativeValuesMix)
{
	let newConstant = new oFF.ChartVisualizationType();
	newConstant.setupExt(name, parent);
	newConstant.m_allowsPositiveAndNegativeValuesMix = allowsPositiveAndNegativeValuesMix;
	oFF.ChartVisualizationType.s_all.add(newConstant);
	return newConstant;
};
oFF.ChartVisualizationType.getAll = function()
{
	return oFF.ChartVisualizationType.s_all.getValuesAsReadOnlyList();
};
oFF.ChartVisualizationType.lookup = function(name)
{
	return oFF.ChartVisualizationType.s_all.getByKey(name);
};
oFF.ChartVisualizationType.staticSetup = function()
{
	oFF.ChartVisualizationType.s_all = oFF.XListOfNameObject.create();
	oFF.ChartVisualizationType.NONE = oFF.ChartVisualizationType.create("None", null, true);
	oFF.ChartVisualizationType.ABSTRACT_SERIES = oFF.ChartVisualizationType.create("AbstractSeries", null, true);
	oFF.ChartVisualizationType.BAR_COLUMN = oFF.ChartVisualizationType.create("BarColumn", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.BAR = oFF.ChartVisualizationType.create("Bar", oFF.ChartVisualizationType.BAR_COLUMN, true);
	oFF.ChartVisualizationType.COLUMN = oFF.ChartVisualizationType.create("Column", oFF.ChartVisualizationType.BAR_COLUMN, true);
	oFF.ChartVisualizationType.COMB_COLUMN_LINE = oFF.ChartVisualizationType.create("CombColumnLine", oFF.ChartVisualizationType.COLUMN, true);
	oFF.ChartVisualizationType.STACKED_BAR = oFF.ChartVisualizationType.create("StackedBar", oFF.ChartVisualizationType.BAR, true);
	oFF.ChartVisualizationType.STACKED_COLUMN = oFF.ChartVisualizationType.create("StackedColumn", oFF.ChartVisualizationType.COLUMN, true);
	oFF.ChartVisualizationType.COMB_STACKED_COLUMN_LINE = oFF.ChartVisualizationType.create("CombStackedColumnLine", oFF.ChartVisualizationType.STACKED_COLUMN, true);
	oFF.ChartVisualizationType.BAR_COLUMN_GROUP_STACK = oFF.ChartVisualizationType.create("BarColumnGroupStack", oFF.ChartVisualizationType.BAR_COLUMN, true);
	oFF.ChartVisualizationType.POINT = oFF.ChartVisualizationType.create("Point", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.LINE = oFF.ChartVisualizationType.create("Line", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.AREA = oFF.ChartVisualizationType.create("Area", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.BELL_CURVE = oFF.ChartVisualizationType.create("BellCurve", null, true);
	oFF.ChartVisualizationType.BOX_PLOT = oFF.ChartVisualizationType.create("BoxPlot", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.HISTOGRAM = oFF.ChartVisualizationType.create("Histogram", null, true);
	oFF.ChartVisualizationType.VIOLIN = oFF.ChartVisualizationType.create("Violin", null, true);
	oFF.ChartVisualizationType.SANKEY = oFF.ChartVisualizationType.create("Sankey", null, true);
	oFF.ChartVisualizationType.BUBBLE = oFF.ChartVisualizationType.create("Bubble", null, true);
	oFF.ChartVisualizationType.PACKED_BUBBLE = oFF.ChartVisualizationType.create("PackedBubble", null, true);
	oFF.ChartVisualizationType.SCATTER_PLOT = oFF.ChartVisualizationType.create("ScatterPlot", null, true);
	oFF.ChartVisualizationType.SPLINE = oFF.ChartVisualizationType.create("Spline", null, true);
	oFF.ChartVisualizationType.TIME_SERIES = oFF.ChartVisualizationType.create("TimeSeries", null, true);
	oFF.ChartVisualizationType.METRIC = oFF.ChartVisualizationType.create("Metric", null, true);
	oFF.ChartVisualizationType.BULLET = oFF.ChartVisualizationType.create("Bullet", null, true);
	oFF.ChartVisualizationType.HEAT_MAP = oFF.ChartVisualizationType.create("HeatMap", null, true);
	oFF.ChartVisualizationType.TREE_MAP = oFF.ChartVisualizationType.create("TreeMap", null, true);
	oFF.ChartVisualizationType.DOUGHNUT = oFF.ChartVisualizationType.create("Donut", null, false);
	oFF.ChartVisualizationType.PIE = oFF.ChartVisualizationType.create("Pie", null, false);
	oFF.ChartVisualizationType.VARIABLE_PIE = oFF.ChartVisualizationType.create("VariablePie", null, true);
	oFF.ChartVisualizationType.VARI_WIDE = oFF.ChartVisualizationType.create("VariWide", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.MOSAIC = oFF.ChartVisualizationType.create("Mosaic", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.RADAR = oFF.ChartVisualizationType.create("Radar", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.WATERFALL = oFF.ChartVisualizationType.create("Waterfall", oFF.ChartVisualizationType.ABSTRACT_SERIES, true);
	oFF.ChartVisualizationType.WORD_CLOUD = oFF.ChartVisualizationType.create("WordCloud", null, true);
};
oFF.ChartVisualizationType.prototype.m_allowsPositiveAndNegativeValuesMix = false;
oFF.ChartVisualizationType.prototype.isAllowsPositiveAndNegativeValuesMix = function()
{
	return this.m_allowsPositiveAndNegativeValuesMix;
};

oFF.SacValueSign = function() {};
oFF.SacValueSign.prototype = new oFF.XConstantWithParent();
oFF.SacValueSign.prototype._ff_c = "SacValueSign";

oFF.SacValueSign.ABSTRACT = null;
oFF.SacValueSign.DEFINED = null;
oFF.SacValueSign.EXPLICIT = null;
oFF.SacValueSign.NEGATIVE = null;
oFF.SacValueSign.NORMAL = null;
oFF.SacValueSign.NULL_VALUE = null;
oFF.SacValueSign.POSITIVE = null;
oFF.SacValueSign.UNBOOKED = null;
oFF.SacValueSign.UNDEFINED = null;
oFF.SacValueSign.ZERO = null;
oFF.SacValueSign.create = function(name, parent)
{
	let object = new oFF.SacValueSign();
	oFF.XConstantWithParent.setupWithNameAndParent(object, name, parent);
	return object;
};
oFF.SacValueSign.staticSetup = function()
{
	oFF.SacValueSign.ABSTRACT = oFF.SacValueSign.create("Abstract", null);
	oFF.SacValueSign.DEFINED = oFF.SacValueSign.create("Explicit", oFF.SacValueSign.ABSTRACT);
	oFF.SacValueSign.DEFINED = oFF.SacValueSign.create("Defined", oFF.SacValueSign.EXPLICIT);
	oFF.SacValueSign.NORMAL = oFF.SacValueSign.create("Normal", oFF.SacValueSign.DEFINED);
	oFF.SacValueSign.NULL_VALUE = oFF.SacValueSign.create("Null", oFF.SacValueSign.EXPLICIT);
	oFF.SacValueSign.ZERO = oFF.SacValueSign.create("Zero", oFF.SacValueSign.DEFINED);
	oFF.SacValueSign.UNDEFINED = oFF.SacValueSign.create("Undefined", oFF.SacValueSign.ABSTRACT);
	oFF.SacValueSign.UNBOOKED = oFF.SacValueSign.create("Unbooked", oFF.SacValueSign.ABSTRACT);
	oFF.SacValueSign.POSITIVE = oFF.SacValueSign.create("Positive", oFF.SacValueSign.NORMAL);
	oFF.SacValueSign.NEGATIVE = oFF.SacValueSign.create("Negative", oFF.SacValueSign.NORMAL);
};

oFF.VisualizationAbstractModule = function() {};
oFF.VisualizationAbstractModule.prototype = new oFF.DfModule();
oFF.VisualizationAbstractModule.prototype._ff_c = "VisualizationAbstractModule";

oFF.VisualizationAbstractModule.s_module = null;
oFF.VisualizationAbstractModule.getInstance = function()
{
	if (oFF.isNull(oFF.VisualizationAbstractModule.s_module))
	{
		oFF.DfModule.checkInitialized(oFF.IoModule.getInstance());
		oFF.VisualizationAbstractModule.s_module = oFF.DfModule.startExt(new oFF.VisualizationAbstractModule());
		oFF.TableClipboardBehaviour.staticSetup();
		oFF.SacVisualizationVerticalAlignment.staticSetup();
		oFF.SacVisualizationHorizontalAlignment.staticSetup();
		oFF.SacLayoutDirection.staticSetup();
		oFF.SacAlertSymbol.staticSetup();
		oFF.SacAlertCategory.staticSetup();
		oFF.SacAlertLevel.staticSetup();
		oFF.SacCellChartOrientation.staticSetup();
		oFF.SacCellChartType.staticSetup();
		oFF.SacTableLineStyle.staticSetup();
		oFF.SacTableMemberHeaderHandling.staticSetup();
		oFF.VisualizationBackgroundPatternType.staticSetup();
		oFF.VisualizationChartPointShape.staticSetup();
		oFF.SacCellType.staticSetup();
		oFF.SacTableAxisType.staticSetup();
		oFF.SacValueException.staticSetup();
		oFF.SacValueSign.staticSetup();
		oFF.SacTableConstants.staticSetup();
		oFF.ChartVisualizationAxisPosition.staticSetup();
		oFF.ChartAxisDomainType.staticSetup();
		oFF.ChartVisualizationType.staticSetup();
		oFF.ChartVisualizationStackingType.staticSetup();
		oFF.ChartVisualizationLineStyle.staticSetup();
		oFF.DfModule.stopExt(oFF.VisualizationAbstractModule.s_module);
	}
	return oFF.VisualizationAbstractModule.s_module;
};
oFF.VisualizationAbstractModule.prototype.getName = function()
{
	return "ff2600.visualization.abstract";
};

oFF.VisualizationAbstractModule.getInstance();

return oFF;
} );