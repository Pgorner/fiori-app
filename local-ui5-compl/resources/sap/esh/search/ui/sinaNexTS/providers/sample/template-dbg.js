/*! 
 * SAPUI5

		(c) Copyright 2009-2021 SAP SE. All rights reserved
	 
 */

(function(){
sap.ui.define(["./template_metadata", "./template_details_folklorists", "./template_details_legends", "./template_details_publications"], function (___template_metadata, ___template_details_folklorists, ___template_details_legends, ___template_details_publications) {
  "use strict";

  const createTemplateMetadata = ___template_metadata["createTemplateMetadata"];
  const createTemplateDetailsFolklorists = ___template_details_folklorists["createTemplateDetails"];
  const createTemplateDetailsLegends = ___template_details_legends["createTemplateDetails"];
  const createTemplateDetailsPublications = ___template_details_publications["createTemplateDetails"];
  function createTemplate(oContext) {
    const gen = {};
    // folklorists
    gen.metadata = [];
    // legends
    gen.metadata2 = [];
    // publications
    gen.metadata3 = [];
    gen.getMetadataById = function (list, id) {
      let res = null;
      for (let i = 0; i < list.length; i++) {
        if (list[i].id === id) {
          res = list[i];
          break;
        }
      }
      return res;
    };
    gen.searchResultSetItemArray = [];
    gen.searchResultSetItemArray2 = [];
    gen.searchResultSetItemArray3 = [];
    gen.chartResultSetArray = [];
    let titleAttributes, detailAttributes;
    gen._init = function (metadataRoot) {
      // folklorists
      const metadata1 = metadataRoot.metadata;
      // legends
      const metadata2 = metadataRoot.metadata2;
      // publications
      const metadata3 = metadataRoot.metadata3;
      oContext.sina.createDataSource({
        id: "Folklorists",
        label: "Folklorist",
        labelPlural: "Folklorists",
        type: oContext.sina.DataSourceType.BusinessObject,
        attributesMetadata: metadata1
      });
      oContext.sina.createDataSource({
        id: "Urban_Legends",
        label: "Urban Legend",
        labelPlural: "Urban Legends",
        type: oContext.sina.DataSourceType.BusinessObject,
        attributesMetadata: metadata2
      });
      oContext.sina.createDataSource({
        id: "Publications",
        label: "Publication",
        labelPlural: "Publications",
        type: oContext.sina.DataSourceType.BusinessObject,
        attributesMetadata: metadata3
      });
    };

    /*
     *     Metadata
     */
    if (oContext.sina) {
      // folklorists
      gen.metadata = createTemplateMetadata(oContext).metadata;
      // legends
      gen.metadata2 = createTemplateMetadata(oContext).metadata2;
      // publications
      gen.metadata3 = createTemplateMetadata(oContext).metadata3;
    }
    if (oContext.searchQuery && oContext.searchQuery.filter && oContext.searchQuery.filter.dataSource && oContext.sina && oContext.sina.getDataSource("Folklorists")) {
      /*
       *     'folklorist' searchResultSetItem 1: Andrew McCain
       */

      const searchTermsArray = [];
      let searchTerms = oContext.searchQuery.filter.searchTerm;
      /* eslint no-useless-escape:0 */
      searchTerms = searchTerms.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
      const searchTermsArray1 = searchTerms.split(" ");
      for (let i = 0; i < searchTermsArray1.length; i++) {
        const elem = searchTermsArray1[i];
        if (elem.match(/\w/) !== null) {
          searchTermsArray.push(elem);
        }
      }
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "FOLKLORIST",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Folklorist",
        value: "Andrew McCain",
        valueFormatted: "Andrew McCain",
        metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
      })];
      detailAttributes = createTemplateDetailsFolklorists(oContext, gen).george;

      /*
          create a suv link for George !
      */

      //oContext.addSuvLinkToSearchResultItem(detailAttributes[10]);
      oContext.addSuvLinkToSearchResultItem(detailAttributes[10], null, searchTermsArray);
      gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Folklorists"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'folklorists' searchResultSetItem 2:Carol Mandelbaum
       */

      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "FOLKLORIST",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Folklorist",
        value: "Carol Mandelbaum",
        valueFormatted: "Carol Mandelbaum",
        metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
      })];
      detailAttributes = createTemplateDetailsFolklorists(oContext, gen).shira;
      gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Folklorists"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'folklorists' searchResultSetItem 3:Ryan Anderson
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "FOLKLORIST",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Folklorist",
        value: "Ryan Anderson",
        valueFormatted: "Ryan Anderson",
        metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
      })];
      detailAttributes = createTemplateDetailsFolklorists(oContext, gen).benjamin;
      gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Folklorists"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'folklorists' searchResultSetItem 4:Simon Kingston
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "FOLKLORIST",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Folklorist",
        value: "Simon Kingston",
        valueFormatted: "Simon Kingston",
        metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
      })];
      detailAttributes = createTemplateDetailsFolklorists(oContext, gen).richard;
      gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Folklorists"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'folklorists' searchResultSetItem 5:Cynthia MacDonald
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "FOLKLORIST",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Folklorist",
        value: "Cynthia MacDonald",
        valueFormatted: "Cynthia MacDonald",
        metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
      })];
      detailAttributes = createTemplateDetailsFolklorists(oContext, gen).rosalie;
      gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Folklorists"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'folklorists' searchResultSetItem 6:Douglas Milford
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "FOLKLORIST",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Folklorist",
        value: "Douglas Milford",
        valueFormatted: "Douglas Milford",
        metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
      })];
      detailAttributes = createTemplateDetailsFolklorists(oContext, gen).bill;
      gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Folklorists"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'folklorists' searchResultSetItem 7: The Fureys
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "FOLKLORIST",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Folklorist",
        value: "The Fureys, Irish folk band orig. formed in 1974",
        valueFormatted: "The Fureys, Irish folk band orig. formed in 1974",
        metadata: gen.getMetadataById(gen.metadata, "FOLKLORIST")
      })];
      detailAttributes = detailAttributes = createTemplateDetailsFolklorists(oContext, gen).fureys;
      gen.searchResultSetItemArray.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Folklorists"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: "The Fureys, Wikipedia",
          targetUrl: "https://en.wikipedia.org/wiki/The_Fureys",
          target: "_blank"
        }),
        detailAttributes: detailAttributes
      }));

      /*
       *     'legends' searchResultSetItem 1: Sewer Alligator
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "Sewer Alligator",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).alligator;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes,
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: "Alligators in the Sewers, Wikipedia",
          targetUrl: "https://en.wikipedia.org/wiki/Sewer_alligator",
          target: "_blank"
        })
      }));

      /*
       *     'legends' searchResultSetItem 2: Slender Man
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "Slender Man",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).slenderman;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: [],
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: "Slender Man, Wikipedia",
          targetUrl: "https://en.wikipedia.org/wiki/Slender_Man",
          target: "_blank"
        })
      }));

      /*
       *     'legends' searchResultSetItem 3: Chupacabra
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "Chupacabra",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).chupacabra;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: [],
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: "Chupacabra, Wikipedia",
          targetUrl: "https://en.wikipedia.org/wiki/Chupacabra",
          target: "_blank"
        })
      }));

      /*
       *     'legends' searchResultSetItem 3: Vanishing_hitchhiker 1
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "Vanishing Hitchhiker",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).hitchhiker;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: [],
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: "Vanishing Hitchhiker, Wikipedia",
          targetUrl: "https://en.wikipedia.org/wiki/Vanishing_hitchhiker",
          target: "_blank"
        })
      }));

      /*
       *     'legends' searchResultSetItem 4: Vanishing_hitchhiker 2
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "Vanishing Hitchhiker",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).hitchhiker2;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: [],
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: 'Journal Article "The Vanishing Hitchhiker" by Richard K. Beardsley and Cynthia MacDonald in the California Folklore Quarterly.',
          targetUrl: "https://www.jstor.org/stable/1495600",
          target: "_blank"
        })
      }));

      /*
       *     'legends' searchResultSetItem 5: Baby Train
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "The Baby Train",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).babytrain;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: [],
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: "Baby Train, Wikipedia",
          targetUrl: "https://en.wikipedia.org/wiki/Baby_Train",
          target: "_blank"
        })
      }));

      /*
       *     'legends' searchResultSetItem 6: Baby Train - XXL title link
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "The Baby Train (Web page of Wikipedia) - - - Extra long title link",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).babytrain;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: [],
        defaultNavigationTarget: oContext.sina.createNavigationTarget({
          text: "Baby Train, page of Wikipedia --- XXL title link",
          targetUrl: "https://en.wikipedia.org/wiki/Baby_Train",
          target: "_blank"
        })
      }));

      /*
       *     'legends' searchResultSetItem 7: Baby Train - without link / XXL title
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "The Baby Train (Web page of Wikipedia) - - - Without link / XXL title",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).babytrain;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: []
      }));

      /*
       *     'legends' searchResultSetItem 8: Baby Train - without link
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        valueHighlighted: "",
        isHighlighted: false,
        label: "Caption",
        value: "",
        valueFormatted: "The Baby Train - no link",
        metadata: gen.getMetadataById(gen.metadata2, "CAPTION")
      })];
      detailAttributes = createTemplateDetailsLegends(oContext, gen).babytrain;
      gen.searchResultSetItemArray2.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Urban_Legends"),
        titleAttributes: titleAttributes,
        detailAttributes: detailAttributes,
        titleDescriptionAttributes: []
      }));

      /*
       *     'publications' searchResultSetItem 1:
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        value: "Sewer Alligator",
        valueFormatted: "Sewer Alligator",
        valueHighlighted: "Sewer Alligator",
        isHighlighted: false,
        label: "Caption",
        metadata: gen.getMetadataById(gen.metadata3, "PUB")
      })];
      detailAttributes = createTemplateDetailsPublications(oContext, gen).alligatorbook;
      oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
      gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Publications"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'publications' searchResultSetItem 2:
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        value: "Slender Man",
        valueFormatted: "Slender Man",
        valueHighlighted: "Slender Man",
        isHighlighted: false,
        label: "Caption",
        metadata: gen.getMetadataById(gen.metadata3, "PUB")
      })];
      detailAttributes = createTemplateDetailsPublications(oContext, gen).slendermanbook;
      oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
      gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Publications"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'publications' searchResultSetItem 3:
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        value: "Chupacabra",
        valueFormatted: "Chupacabra",
        valueHighlighted: "Chupacabra",
        isHighlighted: false,
        label: "Caption",
        metadata: gen.getMetadataById(gen.metadata3, "PUB")
      })];
      detailAttributes = createTemplateDetailsPublications(oContext, gen).chupacabrabook;
      oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
      gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Publications"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'publications' searchResultSetItem 4:
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        value: "Vanishing Hitchhiker",
        valueFormatted: "Vanishing Hitchhiker",
        valueHighlighted: "Vanishing Hitchhiker",
        isHighlighted: false,
        label: "Caption",
        metadata: gen.getMetadataById(gen.metadata3, "PUB")
      })];
      detailAttributes = createTemplateDetailsPublications(oContext, gen).hitchhikerbook;
      oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
      gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Publications"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'publications' searchResultSetItem 5:
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        value: "Vanishing Hitchhiker",
        valueFormatted: "Vanishing Hitchhiker",
        valueHighlighted: "Vanishing Hitchhiker",
        isHighlighted: false,
        label: "Caption",
        metadata: gen.getMetadataById(gen.metadata3, "PUB")
      })];
      detailAttributes = createTemplateDetailsPublications(oContext, gen).hitchhiker2book;
      oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
      gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Publications"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));

      /*
       *     'publications' searchResultSetItem 6:
       */
      titleAttributes = [oContext.sina._createSearchResultSetItemAttribute({
        id: "CAPTION",
        value: "The Baby Train",
        valueFormatted: "The Baby Train",
        valueHighlighted: "The Baby Train",
        isHighlighted: false,
        label: "Caption",
        metadata: gen.getMetadataById(gen.metadata3, "PUB")
      })];
      detailAttributes = createTemplateDetailsPublications(oContext, gen).babytrainbook;
      oContext.addSuvLinkToSearchResultItem(detailAttributes[0], null, searchTermsArray);
      gen.searchResultSetItemArray3.push(oContext.sina._createSearchResultSetItem({
        attributes: titleAttributes.concat(detailAttributes),
        dataSource: oContext.sina.getDataSource("Publications"),
        titleAttributes: titleAttributes,
        titleDescriptionAttributes: [],
        detailAttributes: detailAttributes
      }));
    } // end if datasource etc

    return gen;
  }
  var __exports = {
    __esModule: true
  };
  __exports.createTemplate = createTemplate;
  return __exports;
});
})();