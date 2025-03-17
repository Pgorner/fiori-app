/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *  * (c) Copyright 2009-2025 SAP SE. All rights reserved
 */

import Button from "sap/m/Button";
import CheckBox, { CheckBox$SelectEvent } from "sap/m/CheckBox";
import Input, { Input$LiveChangeEvent } from "sap/m/Input";
import { InputBase$ChangeEvent } from "sap/m/InputBase";
import Label from "sap/m/Label";
import MessageBox from "sap/m/MessageBox";
import MessageStrip from "sap/m/MessageStrip";
import MessageToast from "sap/m/MessageToast";
import Toolbar from "sap/m/Toolbar";
import VBox from "sap/m/VBox";
import Library from "sap/m/library";
import Event from "sap/ui/base/Event";
import Control from "sap/ui/core/Control";
import type { MetadataOptions } from "sap/ui/core/Element";
import EventBus from "sap/ui/core/EventBus";
import MessageType from "sap/ui/core/message/MessageType";
import SimpleForm from "sap/ui/layout/form/SimpleForm";
import FileUploader, { FileUploader$ChangeEvent, FileUploader$FileSizeExceedEvent } from "sap/ui/unified/FileUploader";
import Container from "sap/ushell/Container";
import UserInfo from "sap/ushell/services/UserInfo";
import BaseLayout from "./BaseLayout";
import BaseSettingsPanel from "./BaseSettingsPanel";
import NewsAndPagesContainer from "./NewsAndPagesContainer";
import NewsPanel from "./NewsPanel";
import { CHANGE_TYPES } from "./flexibility/Layout.flexibility";
import { INewsPersData } from "./interface/KeyUserInterface";
import { KEYUSER_SETTINGS_PANELS_KEYS } from "./utils/Constants";
import HttpHelper from "./utils/HttpHelper";

const Constants = {
	NEWS_FEED_POST_API: "/sap/opu/odata4/ui2/insights_srv/srvd/ui2/" + "insights_repo_srv/0001/" + "NEWS_FEED"
};

interface ShowError {
	showError: boolean;
	date: Date;
}

/**
 *
 * Class for News Settings Panel for KeyUser Settings Dialog.
 *
 * @extends BaseSettingsPanel
 *
 * @author SAP SE
 * @version 0.0.1
 * @since 1.121
 *
 * @internal
 * @experimental Since 1.121
 * @private
 *
 * @alias sap.cux.home.KeyUserNewsSettingsPanel
 */
export default class KeyUserNewsSettingsPanel extends BaseSettingsPanel {
	static readonly metadata: MetadataOptions = {
		library: "sap.cux.home"
	};

	private controlMap!: Map<string, Control | Element>;
	private _eventBus!: EventBus;
	private customNewsVisibility!: boolean;
	private validChanges!: boolean;

	/**
	 * Init lifecycle method
	 *
	 * @public
	 * @override
	 */
	public init(): void {
		super.init();
		this.controlMap = new Map();

		//setup panel
		this.setProperty("key", KEYUSER_SETTINGS_PANELS_KEYS.NEWS);
		this.setProperty("title", this._i18nBundle.getText("editNewsFeed"));

		// //setup layout content
		this.addAggregation("content", this.getContent());

		// fired every time on panel navigation
		this.attachPanelNavigated(() => this.loadSettings());

		this._eventBus = EventBus.getInstance();
		this._eventBus.subscribe(
			"KeyUserChanges",
			"newsFeedLoadFailed",
			(channelId?: string, eventId?: string, data?: object) => {
				//errorstate is false when import is successful
				if ((data as unknown as ShowError)?.showError) {
					this.showMessageStrip(true, MessageType.Warning, "invalidNewsUrl");
					this.validChanges = false;
				} else {
					this.getMessageStrip().setVisible(false);
					this.validChanges = true;
				}
			},
			this
		);
	}

	private getCurrentKeyUserChange(): INewsPersData {
		const keyUserChanges = this.getKeyUserChanges();
		const existingChange = keyUserChanges.find((change) => {
			return change.changeSpecificData.changeType === CHANGE_TYPES.NEWS_FEED_URL;
		});
		return existingChange?.changeSpecificData.content as INewsPersData;
	}

	/**
	 * Returns the content for the KeyUser news Settings Panel.
	 *
	 * @private
	 * @returns {VBox} The control containing the KeyUser news Settings Panel content.
	 */
	private getContent(): VBox {
		const wrapperVBoxId = `${this.getId()}-wrapperVBox`;
		const wrapperVBox = new VBox(wrapperVBoxId);
		this.controlMap.set(wrapperVBoxId, wrapperVBox);

		return wrapperVBox;
	}

	public async isValidChanges(newsVisible: boolean) {
		this.validChanges = true;
		const fileUploader = this.getFileUploader();
		const keyUserChangeContent = this.getCurrentKeyUserChange();
		const showCustom =
			this.customNewsVisibility === undefined ? Boolean(this._getPanel().getProperty("showCustom")) : this.customNewsVisibility;
		if (this.getNewsFeedUploadBtn().getEnabled()) {
			if (showCustom) {
				MessageBox.error(String(this._i18nBundle.getText("newsFeedSaveUploadChanges")));
				this.validChanges = false;
			} else {
				if (fileUploader) {
					fileUploader.setValue(
						keyUserChangeContent.customNewsFeedFileName || String(this._getPanel().getProperty("customFileName"))
					);
				}
			}
		} else if (showCustom && fileUploader.getValue() === "" && newsVisible) {
			this.showMessageStrip(true, MessageType.Error, "noNewsFileError");
			this.validChanges = false;
		} else if (!showCustom && newsVisible && !this.getMessageStrip().getVisible()) {
			const newsUrl = keyUserChangeContent.newsFeedURL;
			await (this._getPanel() as NewsPanel).setURL(String(newsUrl));
		}
		return this.validChanges;
	}

	public clearNewsPanelChanges() {
		const newsPanel = this._getPanel();
		this.getMessageStrip().setVisible(false);
		const newsUrlInput = this.controlMap.get(`${this.getId()}-newsFeedURLInput`) as Input;
		newsUrlInput.setValue(String(newsPanel.getProperty("url")));
		this.customNewsVisibility = Boolean(newsPanel.getProperty("showCustom"));
		(this.controlMap.get(`${this.getId()}-customNewsUploadFileUploader`) as FileUploader).setEnabled(this.customNewsVisibility);
		(this.controlMap.get(`${this.getId()}-newsFeedURLInput`) as Input).setEnabled(!this.customNewsVisibility);
		(this.controlMap.get(`${this.getId()}-customNewsFeedCheckBox`) as CheckBox).setSelected(this.customNewsVisibility);
		this.getFileUploader().setValue(String(newsPanel.getProperty("customFileName")));
		this.clearKeyUserChanges();
	}

	private addMessageStrip(wrapperVBox: VBox): void {
		const keyUserNewsPanelToolbarId = `${this.getId()}-keyUserNewsPanelToolbar`;
		if (!this.controlMap.get(keyUserNewsPanelToolbarId)) {
			const keyUserNewsPanelToolbar = new Toolbar(keyUserNewsPanelToolbarId, { height: "auto" });
			const messageStripWrapper = new VBox(`${this.getId()}-messageStripWrapper`, { width: "100%" });
			const messageStripId = `${this.getId()}-messageStrip`;
			const messsageStrip = new MessageStrip(messageStripId, {
				showIcon: true,
				visible: false
			});
			this.controlMap.set(messageStripId, messsageStrip);
			messageStripWrapper.addItem(messsageStrip);
			keyUserNewsPanelToolbar.addContent(messageStripWrapper);
			this.controlMap.set(keyUserNewsPanelToolbarId, keyUserNewsPanelToolbar);
		}
		wrapperVBox.addItem(this.controlMap.get(keyUserNewsPanelToolbarId) as Toolbar);
	}

	private handleSelectCustomNewsFeed(oEvent: CheckBox$SelectEvent): void {
		this.customNewsVisibility = oEvent.getSource().getSelected();

		(this.controlMap.get(`${this.getId()}-customNewsUploadFileUploader`) as FileUploader).setEnabled(this.customNewsVisibility);
		(this.controlMap.get(`${this.getId()}-newsFeedURLInput`) as Input).setEnabled(!this.customNewsVisibility);

		const newsPanel = this._getPanel() as NewsPanel;
		const newsPageContainer = newsPanel.getParent() as NewsAndPagesContainer;
		const layout = newsPageContainer.getParent() as BaseLayout;
		const keyUserChangeContent = this.getCurrentKeyUserChange();
		if (!keyUserChangeContent) {
			this.addKeyUserChanges({
				selectorControl: layout,
				changeSpecificData: {
					changeType: CHANGE_TYPES.NEWS_FEED_URL,
					content: {
						oldNewsFeedUrl: String(this._getPanel().getProperty("url")),
						oldShowCustomNewsFeed: Boolean(this._getPanel().getProperty("showCustom")),
						oldCustomNewsFeedKey: String(this._getPanel().getProperty("customFeedKey")),
						newsFeedURL: String(this._getPanel().getProperty("url")),
						showCustomNewsFeed: this.customNewsVisibility,
						customNewsFeedKey: String(this._getPanel().getProperty("customFeedKey")),
						customNewsFeedFileName: String(this._getPanel().getProperty("customFileName"))
					}
				}
			});
			this._eventBus.publish("KeyUserChanges", "addNewsPagesChanges", { changes: this.getKeyUserChanges() });
		} else if (keyUserChangeContent.showCustomNewsFeed !== this.customNewsVisibility) {
			keyUserChangeContent.showCustomNewsFeed = this.customNewsVisibility;
		}
		this.removeUrlMesageStrip();
		this._eventBus.publish("KeyUserChanges", "disabledSaveBtn", { disable: false, date: new Date() });
	}

	/**
	 * Add CheckBox for Custom News Feed.
	 *
	 * @private
	 */
	private addCustomNewsFeedCheckBox(wrapperVBox: VBox): void {
		const customNewsFeedCheckBoxId = `${this.getId()}-customNewsFeedCheckBox`;
		if (!this.controlMap.get(customNewsFeedCheckBoxId)) {
			const customNewsFeedCheckBox = new CheckBox(`${this.getId()}-customNewsFeedCheckBox`, {
				text: this._i18nBundle.getText("selectCustomNewsFeed"),
				selected: Boolean(this._getPanel().getProperty("showCustom")),
				select: this.handleSelectCustomNewsFeed.bind(this)
			}).addStyleClass("sapUiTinyMargin");
			this.controlMap.set(customNewsFeedCheckBoxId, customNewsFeedCheckBox);
		} else if (!this.getCurrentKeyUserChange()) {
			(this.controlMap.get(`${this.getId()}-customNewsFeedCheckBox`) as CheckBox).setSelected(
				Boolean(this._getPanel().getProperty("showCustom"))
			);
		}
		wrapperVBox.addItem(this.controlMap.get(customNewsFeedCheckBoxId) as CheckBox);
	}

	private onNewsUrlChange(oEvent: InputBase$ChangeEvent): void {
		const newsPanel = this._getPanel() as NewsPanel;
		const newsPageContainer = newsPanel.getParent() as NewsAndPagesContainer;
		const layout = newsPageContainer.getParent() as BaseLayout;
		let newsUrl = oEvent.getParameter("value");
		const keyUserContent = this.getCurrentKeyUserChange();
		const validUrl = this.getValidURL(String(newsUrl));
		if (!validUrl) {
			return;
		} else {
			newsUrl = validUrl;
		}
		if (!keyUserContent) {
			this.addKeyUserChanges({
				selectorControl: layout,
				changeSpecificData: {
					changeType: CHANGE_TYPES.NEWS_FEED_URL,
					content: {
						oldNewsFeedUrl: String(this._getPanel().getProperty("url")),
						oldShowCustomNewsFeed: Boolean(this._getPanel().getProperty("showCustom")),
						oldCustomNewsFeedKey: String(this._getPanel().getProperty("customFeedKey")),
						newsFeedURL: newsUrl,
						showCustomNewsFeed: false,
						customNewsFeedKey: String(this._getPanel().getProperty("customFeedKey")),
						customNewsFeedFileName: String(this._getPanel().getProperty("customFileName"))
					}
				}
			});
			this._eventBus.publish("KeyUserChanges", "addNewsPagesChanges", { changes: this.getKeyUserChanges() });
		} else if (keyUserContent.newsFeedURL !== newsUrl) {
			keyUserContent.newsFeedURL = newsUrl;
			keyUserContent.showCustomNewsFeed = false;
		}
	}

	private showMessageStrip(bShow: boolean, type: MessageType, textKey: string): void {
		this.getMessageStrip().setType(type);
		this.getMessageStrip().setVisible(bShow);
		this.getMessageStrip().setText(String(this._i18nBundle.getText(textKey)));
		if (type === MessageType.Error) {
			this._eventBus.publish("KeyUserChanges", "disabledSaveBtn", { disable: bShow, date: new Date() });
		}
	}

	private getValidURL(urlString: string): string {
		try {
			const url = new URL(urlString);
			return url.href;
		} catch {
			return "";
		}
	}

	public removeUrlMesageStrip() {
		this._eventBus.publish("KeyUserChanges", "disabledSaveBtn", { disable: false, date: new Date() });
		this.getMessageStrip().setVisible(false);
		const newsUrlInput = this.controlMap.get(`${this.getId()}-newsFeedURLInput`) as Input;
		if (!this.getValidURL(newsUrlInput.getValue())) {
			newsUrlInput.setValue("");
		}
	}

	private onUrlLiveChange(oEvent: Input$LiveChangeEvent) {
		const sNewValue = oEvent.getParameter("value") || "";
		this.showMessageStrip(!this.getValidURL(sNewValue), MessageType.Error, "invalidNewsUrl");
	}

	private getMessageStrip(): MessageStrip {
		const messageStripId = `${this.getId()}-messageStrip`;
		return this.controlMap.get(messageStripId) as MessageStrip;
	}

	/**
	 * Add SimpleForm for News URL.
	 *
	 * @private
	 */
	private addNewsURLSimpleForm(wrapperVBox: VBox): void {
		const newsFeedURLSimpleFormId = `${this.getId()}-newsFeedURLSimpleForm`;
		if (!this.controlMap.get(newsFeedURLSimpleFormId)) {
			const newsFeedURLSimpleForm = new SimpleForm(`${this.getId()}-newsFeedURLSimpleForm`, {
				content: [
					new Label(`${this.getId()}-newsFeedURLLabel`, {
						text: this._i18nBundle.getText("editNewsURL")
					})
				]
			}).addStyleClass("sapContrastPlus");
			const newsFeedURLInputId = `${this.getId()}-newsFeedURLInput`;
			const newsFeedURLInput = new Input(newsFeedURLInputId, {
				value: String(this._getPanel().getProperty("url")),
				type: Library.InputType.Url,
				change: this.onNewsUrlChange.bind(this),
				liveChange: this.onUrlLiveChange.bind(this),
				enabled: !this._getPanel().getProperty("showCustom")
			});
			this.controlMap.set(newsFeedURLInputId, newsFeedURLInput);
			newsFeedURLSimpleForm.addContent(newsFeedURLInput);
			this.controlMap.set(newsFeedURLSimpleFormId, newsFeedURLSimpleForm);
		} else if (this.getCurrentKeyUserChange()) {
			(this.controlMap.get(`${this.getId()}-newsFeedURLInput`) as Input).setValue(String(this._getPanel().getProperty("url")));
		}
		wrapperVBox.addItem(this.controlMap.get(newsFeedURLSimpleFormId) as SimpleForm);
	}

	private handleFileChange(oEvent: FileUploader$ChangeEvent): void {
		const fileUploader = oEvent.getSource();
		this.getMessageStrip().setVisible(false);
		this._eventBus.publish("KeyUserChanges", "disabledSaveBtn", { disable: false, date: new Date() });
		this.setNewsFeedEnabled(fileUploader.getValue() !== "");
	}

	private setNewsFeedEnabled(bEnabled: boolean): void {
		const newsFeedUploadBtn = this.getNewsFeedUploadBtn();
		if (newsFeedUploadBtn) {
			newsFeedUploadBtn.setEnabled(bEnabled);
		}
	}

	private getNewsFeedUploadBtn(): Button {
		const customNewsUploadFileUploaderButtonId = `${this.getId()}-customNewsUploadFileUploaderButton`;
		return this.controlMap.get(customNewsUploadFileUploaderButtonId) as Button;
	}

	private handleFileUploadError(oEvent: FileUploader$FileSizeExceedEvent): void {
		const fileUploader = oEvent.getSource();
		const iMaxFileSize = fileUploader.getMaximumFileSize();
		this.setNewsFeedEnabled(false);
		MessageBox.error(String(this._i18nBundle.getText("newsFeedMaxFileSizeError", [iMaxFileSize])));
	}

	handleFileDialogClose(event: Event): void {
		const fileUploader = event.getSource<FileUploader>();
		let fileName = fileUploader.getValue();
		// if file selection dialog is closed and no file is selected, set value as last uploaded file

		if (fileName === "") {
			fileName = this.getCurrentKeyUserChange()?.customNewsFeedFileName || String(this._getPanel().getProperty("customFileName"));
			this.setNewsFeedEnabled(false);
		}
		fileUploader.setValue(fileName);
	}

	private async handleNewsFeedFileUpload(): Promise<void> {
		let errorMsg = this._i18nBundle.getText("newsFeedFileUploadError");
		try {
			const aResponse = await Promise.all([this.getUploadedFile(), Container.getServiceAsync<UserInfo>("UserInfo")]);
			const fileData = aResponse[0];
			const userInfo = aResponse[1];
			const sUserId = userInfo && userInfo.getId();
			const payload = { changeId: sUserId + "_" + Date.now().toString(), attachment: fileData };
			const oResponse = await HttpHelper.Post(Constants.NEWS_FEED_POST_API, payload);
			const keyUserChangeContent = this.getCurrentKeyUserChange();
			const newsPanel = this._getPanel() as NewsPanel;
			const newsPageContainer = newsPanel.getParent() as NewsAndPagesContainer;
			const layout = newsPageContainer.getParent() as BaseLayout;
			if (oResponse && (oResponse as { error: { message: string } }).error) {
				this.getFileUploader().setValue("");
				if (keyUserChangeContent) {
					keyUserChangeContent.customNewsFeedFileName = "";
				} else {
					this.addKeyUserChanges({
						selectorControl: layout,
						changeSpecificData: {
							changeType: CHANGE_TYPES.NEWS_FEED_URL,
							content: {
								oldNewsFeedUrl: String(this._getPanel().getProperty("url")),
								oldShowCustomNewsFeed: Boolean(this._getPanel().getProperty("showCustom")),
								oldCustomNewsFeedKey: String(this._getPanel().getProperty("customFeedKey")),
								newsFeedURL: String(this._getPanel().getProperty("url")),
								showCustomNewsFeed: true,
								customNewsFeedKey: String(this._getPanel().getProperty("customFeedKey")),
								customNewsFeedFileName: String(this._getPanel().getProperty("customFileName"))
							}
						}
					});
				}
				errorMsg = (oResponse as { error: { message: string } }).error.message.includes("NODATA")
					? this._i18nBundle.getText("newsFeedEmptyFileError")
					: errorMsg;
				throw new Error(errorMsg);
			}
			const customKey = (oResponse as { changeId: string }).changeId;
			if (keyUserChangeContent) {
				keyUserChangeContent.customNewsFeedKey = customKey;
				keyUserChangeContent.customNewsFeedFileName = this.getFileUploader().getValue();
			} else {
				this.addKeyUserChanges({
					selectorControl: layout,
					changeSpecificData: {
						changeType: CHANGE_TYPES.NEWS_FEED_URL,
						content: {
							oldNewsFeedUrl: String(this._getPanel().getProperty("url")),
							oldShowCustomNewsFeed: Boolean(this._getPanel().getProperty("showCustom")),
							oldCustomNewsFeedKey: String(this._getPanel().getProperty("customFeedKey")),
							newsFeedURL: String(this._getPanel().getProperty("url")),
							showCustomNewsFeed: true,
							customNewsFeedKey: customKey,
							customNewsFeedFileName: this.getFileUploader().getValue()
						}
					}
				});
				this._eventBus.publish("KeyUserChanges", "addNewsPagesChanges", { changes: this.getKeyUserChanges() });
			}
			MessageToast.show(String(this._i18nBundle.getText("customNewsFeedUploaded")));
			this.setNewsFeedEnabled(false);
		} catch (oErr) {
			MessageBox.error((oErr as { message: string }).message);
			this.setNewsFeedEnabled(false);
		}
	}

	private getUploadedFile(): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			const fileUploader = this.getFileUploader();

			if (fileUploader && !fileUploader.getValue()) {
				const errorMsg = this._i18nBundle.getText("noNewsFileError");
				reject(new Error(errorMsg));
			}

			const file = fileUploader.oFileUpload.files[0];
			const reader = new FileReader();
			reader.onload = function () {
				const base64String = (reader.result as string).replace("data:", "").replace(/^.+,/, "");
				resolve(base64String);
			};
			reader.readAsDataURL(file);
		});
	}

	private getFileUploader(): FileUploader {
		const customNewsUploadFileUploader = `${this.getId()}-customNewsUploadFileUploader`;
		return this.controlMap.get(customNewsUploadFileUploader) as FileUploader;
	}

	/**
	 * Add SimpleForm for Custom News Upload Form.
	 *
	 * @private
	 */
	private addCustomNewsUploadSimpleForm(wrapperVBox: VBox): void {
		const customNewsUploadSimpleFormId = `${this.getId()}-customNewsUploadSimpleForm`;
		if (!this.controlMap.get(customNewsUploadSimpleFormId)) {
			const customNewsUploadSimpleForm = new SimpleForm(`${this.getId()}-customNewsUploadSimpleForm`, {
				content: [
					new Label(`${this.getId()}-customNewsUploadLabel`, {
						text: this._i18nBundle.getText("customNewsFeed")
					})
				]
			}).addStyleClass("sapContrastPlus");
			const customNewsUploadVBox = new VBox(`${this.getId()}-customNewsUploadVBox`);
			const customNewsUploadFileUploader = `${this.getId()}-customNewsUploadFileUploader`;
			const customNewsUploadFileUploaderControl = new FileUploader(customNewsUploadFileUploader, {
				name: "newsFeedFileUploader",
				tooltip: this._i18nBundle.getText("uploadNewsFeedFile"),
				fileType: ["xlsx"],
				width: "100%",
				change: this.handleFileChange.bind(this),
				maximumFileSize: 25,
				fileSizeExceed: this.handleFileUploadError.bind(this),
				sameFilenameAllowed: true,
				afterDialogClose: this.handleFileDialogClose.bind(this),
				value: String(this._getPanel().getProperty("customFileName")),
				enabled: this._getPanel().getProperty("showCustom") as boolean
			});
			this.controlMap.set(customNewsUploadFileUploader, customNewsUploadFileUploaderControl);
			const customNewsUploadFileUploaderButtonId = `${this.getId()}-customNewsUploadFileUploaderButton`;
			const customNewsUploadFileUploaderButton = new Button(customNewsUploadFileUploaderButtonId, {
				text: this._i18nBundle.getText("uploadNewsFeedBtn"),
				press: this.handleNewsFeedFileUpload.bind(this),
				type: "Emphasized",
				enabled: false
			});
			this.controlMap.set(customNewsUploadFileUploaderButtonId, customNewsUploadFileUploaderButton);
			customNewsUploadVBox.addItem(customNewsUploadFileUploaderControl);
			customNewsUploadVBox.addItem(customNewsUploadFileUploaderButton);
			customNewsUploadSimpleForm.addContent(customNewsUploadVBox);
			this.controlMap.set(customNewsUploadSimpleFormId, customNewsUploadSimpleForm);
		}
		wrapperVBox.addItem(this.controlMap.get(customNewsUploadSimpleFormId) as SimpleForm);
	}

	/**
	 * Load settings for the panel.
	 *
	 * @private
	 */
	private loadSettings(): void {
		const wrapperVBoxId = `${this.getId()}-wrapperVBox`;
		const wrapperVBox = this.controlMap.get(wrapperVBoxId) as VBox;
		wrapperVBox.removeAllItems();
		this.addMessageStrip(wrapperVBox);
		this.addCustomNewsFeedCheckBox(wrapperVBox);
		this.addNewsURLSimpleForm(wrapperVBox);
		this.addCustomNewsUploadSimpleForm(wrapperVBox);
	}
}
