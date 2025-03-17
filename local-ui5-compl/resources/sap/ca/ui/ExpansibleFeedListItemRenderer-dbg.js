/*
 * Copyright (C) 2009-2014 SAP SE or an SAP affiliate company. All rights reserved
 */
jQuery.sap.declare("sap.ca.ui.ExpansibleFeedListItemRenderer");

jQuery.sap.require("sap.ui.core.Renderer");
jQuery.sap.require("sap.m.FeedListItemRenderer");

/**
 * @class ExpansibleFeedListItem renderer.
 * @static
 */
sap.ca.ui.ExpansibleFeedListItemRenderer = sap.ui.core.Renderer.extend(sap.m.FeedListItemRenderer);


/**
 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
 *
 * @param {sap.ui.core.RenderManager} oRm the RenderManager that can be used for writing to the render output buffer
 * @param {sap.ui.core.Control} oFeedListItem an object representation of the control that should be rendered
 */

sap.ca.ui.ExpansibleFeedListItemRenderer.renderLIContent = function (oRm, oFeedListItem) {
	// convenience variable
	var sMyId = oFeedListItem.getId(),
		bIsPhone = jQuery.device.is.phone;

	oRm.write('<article');
	oRm.writeControlData(oFeedListItem);
	oRm.addClass('sapMFeedListItem');
	oRm.addClass('sapCaUiExpansibleFeedListItem');

	oRm.writeClasses();
	oRm.write('>');

	// icon
	if (!!oFeedListItem.getShowIcon()) {
		oRm.write('<figure id="' + sMyId + '-figure" class ="sapMFeedListItemFigure');
		if (!!oFeedListItem.getIcon()) {
			oRm.write('">');
		} else {
			oRm.write(' sapMFeedListItemIsDefaultIcon">');
		}
		if (!!oFeedListItem.getIconActive()) {
			oRm.write('<a id="' + sMyId + '-iconRef" >');
		}
		oRm.renderControl(oFeedListItem._getAvatar());
		if (!!oFeedListItem.getIconActive()) {
			oRm.write('</a>');
		}
		oRm.write('</figure>');
	}

	// text (starting with sender)
	if (bIsPhone) {
		oRm.write('<div class= "sapMFeedListItemHeader ');
		if (!!oFeedListItem.getShowIcon()) {
			oRm.write('sapMFeedListItemHasFigure ');
		}
		if (!!oFeedListItem.getSender() && !!oFeedListItem.getTimestamp()) {
			oRm.write('sapMFeedListItemFullHeight');
		}
		oRm.write('" >');
		if (!!oFeedListItem.getSender()) {
			oRm.write('<p id="' + sMyId + '-name" class="sapMFeedListItemTextName">');
			oRm.renderControl(oFeedListItem._getLinkControl());
			oRm.write('</p>');
		}
		if (!!oFeedListItem.getTimestamp()) {
			//write date
			oRm.write('<p class="sapMFeedListItemTimestamp">');
			oRm.writeEscaped(oFeedListItem.getTimestamp());
			oRm.write('</p>');
		}

		oRm.write('</div>');
		oRm.write('<p id="' + sMyId + '-text" class="sapMFeedListItemText">');
		oRm.writeEscaped(oFeedListItem.getText(), true);
		oRm.write('</p>');

		if (oFeedListItem.getMaxLines() > 0) {
			sap.ca.ui.ExpansibleFeedListItemRenderer.renderSeeMoreContent(oRm, oFeedListItem);
		}

		if (!!oFeedListItem.getInfo()) {
			// info
			oRm.write('<p class="sapMFeedListItemFooter">');
			if (!!oFeedListItem.getInfo()) {
				oRm.write('<span class="sapMFeedListItemInfo">');
				oRm.writeEscaped(oFeedListItem.getInfo());
				oRm.write('</span>');
			}
		}
	} else {
		oRm.write('<div class= "sapMFeedListItemText ');
		if (!!oFeedListItem.getShowIcon()) {
			oRm.write('sapMFeedListItemHasFigure ');
		}
		oRm.write('" >');
		oRm.write('<p id="' + sMyId + '-text" class="sapMFeedListItemTextText">');
		if (!!oFeedListItem.getSender()) {
			oRm.write('<span id="' + sMyId + '-name" class="sapMFeedListItemTextName">');
			oRm.renderControl(oFeedListItem._getLinkControl());
			oRm.write(': ');
			oRm.write('</span>');
		}
		oRm.writeEscaped(oFeedListItem.getText(), true);
		if (oFeedListItem.getMaxLines() > 0) {
			sap.ca.ui.ExpansibleFeedListItemRenderer.renderSeeMoreContent(oRm, oFeedListItem);
		}
		if (!!oFeedListItem.getInfo() || !!oFeedListItem.getTimestamp()) {
			// info and date
			oRm.write('<p class="sapMFeedListItemFooter">');
			if (!!oFeedListItem.getInfo()) {
				oRm.writeEscaped(oFeedListItem.getInfo());
				//Write Interpunct separator if necessary (with spaces before and after)
				if (!!oFeedListItem.getTimestamp()) {
					oRm.write("&#160;&#160;&#x00B7;&#160;&#160;");
				}
			}
			if (!!oFeedListItem.getTimestamp()) {
				oRm.writeEscaped(oFeedListItem.getTimestamp());
			}
		}
		oRm.write('</p>');
		oRm.write('</div>');
	}
	oRm.write('</article>');
};

sap.ca.ui.ExpansibleFeedListItemRenderer.renderSeeMoreContent = function (rm, oFeedListItem) {
	rm.write('<div');
	rm.addClass('sapCaUiExpansibleFeedListItemSeeMoreLink');
	rm.writeClasses();
	rm.write('>');
	rm.write("<p");
	rm.addClass('sapCaUiExpansibleFeedListItemSeeMoreLinkDots');
	rm.writeClasses();
	rm.write(">...</p>");
	rm.renderControl(oFeedListItem._getSeeMoreLink());
	rm.write('</div>');
};

