/* eslint-disable */
sap.ui.define([
	"sap/m/ColumnListItem",
	"sap/m/ListType",
	"sap/m/Image",
	"sap/m/Link",
	"sap/m/Text",
	"sap/m/Table",
	"sap/m/Column",
	"sap/ui/core/TextAlign",
	"sap/ui/model/json/JSONModel",
	"sap/suite/ui/commons/UnifiedThingGroup",
	"sap/suite/ui/commons/ThingGroupDesign",
	"sap/ui/layout/Grid",
	"sap/m/HBox",
	"sap/m/VBox",
	"sap/suite/ui/commons/FacetOverview",
	"./Utilities"
], function(ColumnListItem, ListType, Image, Link, Text, Table, Column, TextAlign, JSONModel, UnifiedThingGroup,
	ThingGroupDesign, Grid, HBox, VBox, FacetOverview, Utilities
	){
	'use strict';

	var oContactsWithImagesData = {
		navigation: [
			{
				image: "demokit/images/people/img_contacts_01.png",
				name: "Megan Miller",
				title: "Sales Representative",
				phone: "+382832838238",
				email: "megan.miller@sap.com"
			},
			{
				image: "demokit/images/people/img_contacts_02.png",
				name: "Peter McNamara",
				title: "Sales Executive",
				phone: "1-800-1002030",
				email: "peter.mcnamara@sap.com"
			},
			{
				image: "demokit/images/people/img_contacts_03.png",
				name: "George W.Brunick",
				title: "Cash Manager",
				phone: "1(605)-1232-123-1",
				email: "george.brunick@sap.com"
			},
			{
				image: "demokit/images/people/img_contacts_04.png",
				name: "Lilian R.Owens",
				title: "Cash Manager",
				phone: "1(789)-1232-123-1",
				email: "lilian.owens@sap.com"
			}
		]
	};
	
	var oTemplateContactsWithImagesData = new ColumnListItem({
		type: ListType.Inactive,
		unread: false,
		cells: [
			new Image({ src: "{image}", width: "74px", height: "74px" }),
			new Link({ text: "{name}" }),
			new Text({ text: "{title}" }),
			new Link({ text: "{phone}" }),
			new Link({ text: "{email}" })
		]
	});
	
	var oListContactsWithImagesForm = new Table({
		threshold: 2,
		inset: false,
		showUnread: true,
		scrollToLoad: true,
		columns: [
			new Column({
				hAlign: TextAlign.Begin,
				header: new Text({ text: "" })
			}),
			new Column({
				hAlign: TextAlign.Begin,
				header: new Text({ text: "Name" })
			}),
			new Column({
				hAlign: TextAlign.Begin,
				header: new Text({ text: "Job Title" }),
				minScreenWidth: "Tablet",
				demandPopin: true
			}),
			new Column({
				hAlign: TextAlign.Begin,
				width: "30%",
				header: new Text({ text: "Phone" }),
				minScreenWidth: "Tablet",
				demandPopin: true
			}),
			new Column({
				hAlign: TextAlign.Begin,
				width: "30%",
				header: new Text({ text: "Email" }),
				minScreenWidth: "Tablet",
				demandPopin: true
			})
		],
		items: {
			path: "/navigation",
			template: oTemplateContactsWithImagesData
		}
	});
	
	var oModelContactsWithImages = new JSONModel();
	oModelContactsWithImages.setData(oContactsWithImagesData);
	oListContactsWithImagesForm.setModel(oModelContactsWithImages);
	
	var oContactsWithImagesFormGroup = new UnifiedThingGroup("contacts", {
		title: "Contacts",
		description: "4711, Marketing",
		content: oListContactsWithImagesForm,
		design: ThingGroupDesign.TopIndent
	});
	
	var image1 = new Image({
		src: "demokit/images/people/img_contacts_01.png",
		width: "48px",
		height: "48px"
	});
	image1.addStyleClass("sapUtiContactsImage");
	var image2 = new Image({
		src: "demokit/images/people/img_contacts_02.png",
		width: "48px",
		height: "48px"
	});
	image2.addStyleClass("sapUtiContactsImage");
	var image3 = new Image({
		src: "demokit/images/people/img_contacts_03.png",
		width: "48px",
		height: "48px"
	});
	image3.addStyleClass("sapUtiContactsImage");
	var image4 = new Image({
		src: "demokit/images/people/img_contacts_04.png",
		width: "48px",
		height: "48px"
	});
	image4.addStyleClass("sapUtiContactsImage");
	
	var oContactsContent = new Grid("form-contacts", {
		defaultSpan: "L6 M6 S6",
		content: [
			new HBox({
				items: [
					image1,
					new VBox({
						items: [
							new Text({ text: "Megan Miller" }).addStyleClass("sapUtiTextName"),
							new Text({ text: "Sales Representative" }).addStyleClass("sapUtiTextValue")
						]
					})
				]
			}).addStyleClass("sapUtiContactsBox"),
			new HBox({
				items: [
					image2,
					new VBox({
						items: [
							new Text({ text: "Peter McNamara" }).addStyleClass("sapUtiTextName"),
							new Text({ text: "Sales Executive" }).addStyleClass("sapUtiTextValue")
						]
					})
				]
			}).addStyleClass("sapUtiContactsBox"),
			new HBox({
				items: [
					image3,
					new VBox({
						items: [
							new Text({ text: "George W.Brunick" }).addStyleClass("sapUtiTextName"),
							new Text({ text: "Cash Manager" }).addStyleClass("sapUtiTextValue")
						]
					})
				]
			}).addStyleClass("sapUtiContactsBox"),
			new HBox({
				items: [
					image4,
					new VBox({
						items: [
							new Text({ text: "Lilian R.Owens" }).addStyleClass("sapUtiTextName"),
							new Text({ text: "Cash Manager" }).addStyleClass("sapUtiTextValue")
						]
					})
				]
			}).addStyleClass("sapUtiContactsBox")
		]
	}).addStyleClass("sapUtiContactsGrid");
	
	if (Utilities.isPhone) {
		oContactsContent.setDefaultSpan("L12 M12 S12");
	}
	
	var oContactsFacet = function(setFacetContent){ 
		return new FacetOverview("contacts-facet", {
			title: "Contacts",
			quantity: 6,
			content: oContactsContent,
			heightType: Utilities.isPhone ? "Auto" : "L",
			press: function() {
				setFacetContent("contactsImages");
			}
		});
	}

	return {
		oContactsFacet,
		oContactsWithImagesFormGroup
	};
});