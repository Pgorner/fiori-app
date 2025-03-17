/*!
 * 
		SAP UI development toolkit for HTML5 (SAPUI5)
		(c) Copyright 2009-2015 SAP SE. All rights reserved
	
 */
sap.ui.define([
    "../utils/CardRanking"
], function (CardRanking) {
	"use strict";

    // -----------------------------------------------------------------|| Class Information ||----------------------------------------------------------------------------------//
	//
	// This file is intended to do ranking calculation for cards on drag & drop.
	//
	// --------------------------------------------------------------------------------------------------------------------------------------------------------------------------//

    function setCardsRanking(iDragIndex, iDropIndex, aCards) {
        if (iDragIndex < iDropIndex) {
            return CardRanking.reorder(aCards, iDragIndex, iDropIndex + 1);
        }

        return CardRanking.reorder(aCards, iDragIndex, iDropIndex);
    }

    function updateCardsRanking(iDragItemIndex, iDropItemIndex, aCards) {
        var aUpdatedCards = setCardsRanking(iDragItemIndex, iDropItemIndex, aCards);
            aUpdatedCards = aUpdatedCards.map(function(oOrgCard){
                var oCard = JSON.parse(JSON.stringify(oOrgCard));
                var sCardId = oCard.descriptorContent["sap.app"].id;
                oCard.descriptorContent["sap.insights"].ranking = oCard.rank;
                oCard.descriptorContent = JSON.stringify(oCard.descriptorContent);
                return {
                    id: sCardId,
                    descriptorContent: oCard.descriptorContent
                };
            });
            return aUpdatedCards;
    }

    return {
        updateCardsRanking: updateCardsRanking
    };
});