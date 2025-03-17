import type ResourceBundle from "sap/base/i18n/ResourceBundle";
import MessageToast from "sap/m/MessageToast";
import type Event from "sap/ui/base/Event";
import CacheManager from "sap/ui/core/cache/CacheManager";
import Controller from "sap/ui/core/mvc/Controller";
import type View from "sap/ui/core/mvc/View";
import type JSONModel from "sap/ui/model/json/JSONModel";
import i18nModel from "sap/ui/model/resource/ResourceModel";

class RequestSettingsController extends Controller {
	viewInstance!: View | undefined;

	onInit(): void {
		this.viewInstance = this.getView();
	}

	onSave(period: number): void {
		const internalModel = this.viewInstance?.getModel() as JSONModel;
		internalModel.setProperty("/oldperiod", period);
	}

	onCancel(): void {
		const internalModel = this.viewInstance?.getModel() as JSONModel;
		const oldPeriod = internalModel.getProperty("/oldperiod") as number;
		if (oldPeriod) {
			internalModel.setProperty("/period", oldPeriod);
		}
	}

	onChange(event: Event<{ value: string }>): void {
		const internalModel = this.viewInstance?.getModel() as JSONModel;
		const period = event.getParameter("value");
		internalModel.setProperty("/period", period);
	}

	onCleanup(): void {
		// Remove all optimistic batch entries via cache manager
		CacheManager.delWithFilters();
		const i18n = new i18nModel({ bundleName: "sap.fe.plugins.managecache.comp.i18n.messagebundle" });
		const successToast = (i18n.getResourceBundle() as ResourceBundle).getText("M_CLEANUP_SUCCESS");
		MessageToast.show(successToast);
	}
}
export default RequestSettingsController;
