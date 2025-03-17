/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */
import Log from "sap/base/Log";
import { getObjectPageCardManifestForPreview } from "sap/cards/ap/common/services/RetrieveCard";
import type Dialog from "sap/m/Dialog";
import MessageBox from "sap/m/MessageBox";
import VersionInfo from "sap/ui/VersionInfo";
import Component from "sap/ui/core/Component";
import type Control from "sap/ui/core/Control";
import Fragment from "sap/ui/core/Fragment";
import CoreLib from "sap/ui/core/Lib";
import { CardManifest } from "sap/ui/integration/widgets/Card";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import { CardGeneratorDialogController } from "./app/CardGeneratorDialogController";
import { ApplicationInfo, ODataModelVersion } from "./helpers/ApplicationInfo";
import { getCardGeneratorDialogModel } from "./helpers/CardGeneratorModel";
import { createInitialManifest, renderCardPreview, updateExistingCardManifest } from "./helpers/IntegrationCardHelper";
import { createPathWithEntityContext } from "./odata/ODataUtils";

enum CardTypes {
	INTEGRATION = "integration",
	ADAPTIVE = "adaptive"
}

let cardGeneratorDialog: Promise<Control | Control[]> | undefined;

export async function initializeAsync(oAppComponent: Component) {
	const oResourceBundle = CoreLib.getResourceBundleFor("sap.cards.ap.generator.i18n");
	const resourceModel = new ResourceModel({
		bundleUrl: oResourceBundle.oUrlInfo.url,
		bundle: oResourceBundle //Reuse created bundle to stop extra network calls
	});
	const applicationInfo = ApplicationInfo.createInstance(oAppComponent);
	const bValidConfiguration = await applicationInfo.validateCardGeneration();
	if (!bValidConfiguration) {
		const warningMsg: string = resourceModel.getObject("GENERATE_CARD_NOT_SUPPORTED");
		MessageBox.warning(warningMsg, {
			actions: MessageBox.Action.OK,
			emphasizedAction: MessageBox.Action.OK
		});
		return;
	}

	if (!cardGeneratorDialog) {
		cardGeneratorDialog = Fragment.load({
			id: "cardGeneratorDialog",
			name: "sap.cards.ap.generator.app.CardGeneratorDialog",
			controller: CardGeneratorDialogController
		});
	}

	let mCardManifest: CardManifest | undefined;
	const sapCoreVersionInfo = await VersionInfo.load({
		library: "sap.ui.core"
	});
	try {
		mCardManifest = await getObjectPageCardManifestForPreview(oAppComponent, {
			cardType: CardTypes.INTEGRATION,
			includeActions: false,
			hideActions: false,
			isDesignMode: true
		});
	} catch (oError: unknown) {
		Log.error("Error while fetching the card manifest.");
	}
	const dialogModel = await getCardGeneratorDialogModel(oAppComponent, mCardManifest);
	cardGeneratorDialog
		.then(async function (oDialog: Dialog) {
			const mManifest = oAppComponent.getManifest();
			const cardTitle: string = mManifest["sap.app"].title;
			const cardSubtitle: string = mManifest["sap.app"].description;
			const sapAppId = mManifest["sap.app"].id;
			const oAppModel = oAppComponent.getModel();
			if (!oAppModel) {
				throw new Error("No model found in the view");
			}

			const { odataModel, serviceUrl, entitySet, entitySetWithObjectContext } = applicationInfo.fetchDetails();
			const bODataV4 = odataModel === ODataModelVersion.V4;
			const sServiceUrl = serviceUrl;
			const entitySetName = entitySet;
			const path = await createPathWithEntityContext(entitySetWithObjectContext, oAppModel, bODataV4);
			const mIntegrationCardManifest =
				updateExistingCardManifest(mCardManifest, dialogModel.getProperty("/configuration/$data")) ||
				createInitialManifest({
					title: cardTitle,
					subTitle: cardSubtitle,
					service: sServiceUrl,
					entitySet: path,
					serviceModel: oAppModel,
					sapAppId: sapAppId,
					sapCoreVersionInfo,
					entitySetName,
					data: dialogModel.getProperty("/configuration/$data")
				});

			if (!oDialog.getModel("i18n")) {
				oDialog.setModel(resourceModel, "i18n");
			}
			renderCardPreview(mIntegrationCardManifest);
			oDialog.setModel(dialogModel);
			CardGeneratorDialogController.initialize(oAppComponent, oDialog, entitySetName);
			oDialog.open();
			const element = document.getElementById("cardGeneratorDialog--contentSplitter");
			if (element) {
				element.style.backgroundColor = "#f8f8f8";
			}
			return oDialog;
		})
		.catch(function (oError: Error) {
			Log.error("Error while loading or initializing the dialog:", oError);
		});
}
