import { Activity } from "sap/fe/core/controllerextensions/collaboration/CollaborationCommon";
import CollaborationAPI from "sap/fe/test/api/CollaborationAPI";
import type Opa5 from "sap/ui/test/Opa5";
import OpaBuilder from "sap/ui/test/OpaBuilder";

function CollaborationClient(oPageDefinition: { appId: string; componentId: string }) {
	const sAppId = oPageDefinition.appId,
		sComponentId = oPageDefinition.componentId,
		viewId = `${sAppId}::${sComponentId}`;

	return {
		actions: {
			iEnterDraft: function (userID: string, userName: string) {
				return OpaBuilder.create(this as any as Opa5)
					.hasId(viewId)
					.do(function (view: any) {
						const oContext = view.getBindingContext();
						CollaborationAPI.enterDraft(oContext, userID, userName);
					})
					.viewId("")
					.description("Remote session entering draft")
					.execute();
			},

			iLeaveDraft: function () {
				return OpaBuilder.create(this as any as Opa5)
					.do(function () {
						CollaborationAPI.leaveDraft();
					})
					.description("Remote session leaving draft")
					.execute();
			},

			iLockPropertyForEdition: function (sPropertyPath: string) {
				return OpaBuilder.create(this as any as Opa5)
					.do(function () {
						CollaborationAPI.lockField(sPropertyPath);
					})
					.description(`Remote session locking property ${sPropertyPath}`)
					.execute();
			},

			iUnlockPropertyForEdition: function () {
				return OpaBuilder.create(this as any as Opa5)
					.do(function () {
						CollaborationAPI.unlockField();
					})
					.description("Remote session unlocking property ")
					.execute();
			},

			iUpdatePropertyValue: function (sPropertyPath: string, value: any) {
				return OpaBuilder.create(this as any as Opa5)
					.do(function () {
						CollaborationAPI.updatePropertyValue(sPropertyPath, value);
					})
					.description(`Remote session updating property ${sPropertyPath} with ${value}`)
					.execute();
			},

			iDiscardDraft: function () {
				return OpaBuilder.create(this as any as Opa5)
					.do(function () {
						CollaborationAPI.discardDraft();
					})
					.description("Remote session discarding draft")
					.execute();
			},

			iDeleteObject: function (objectPath: string) {
				return OpaBuilder.create(this as any as Opa5)
					.do(function () {
						CollaborationAPI.deleteObject(objectPath);
					})
					.description(`Remote session deleting object ${objectPath}`)
					.execute();
			}
		},
		assertions: {
			iCheckDefaultUserChangedValue: function (sPropertyPath: string) {
				return OpaBuilder.create(this as any as Opa5)
					.check(function () {
						return CollaborationAPI.checkReceived({
							userID: "DEFAULT_USER",
							userAction: Activity.Change,
							clientContent: sPropertyPath
						});
					})
					.description(`Remote session received change notification for${sPropertyPath} changed`)
					.execute();
			},
			iCheckDefaultUserRemovedLock: function (sPropertyPath: string) {
				return OpaBuilder.create(this as any as Opa5)
					.check(function () {
						// Check that we have received an UNLOCK without a CHANGE
						return (
							!CollaborationAPI.checkReceived(
								{
									userID: "DEFAULT_USER",
									userAction: Activity.Change,
									clientContent: sPropertyPath
								},
								false
							) &&
							CollaborationAPI.checkReceived({
								userID: "DEFAULT_USER",
								userAction: Activity.Unlock,
								clientContent: sPropertyPath
							})
						);
					})
					.description(`Remote session received unlock without change notification for${sPropertyPath}`)
					.execute();
			},
			iCheckValueIsLockedByDefaultUser: function (sPropertyPath: string) {
				return OpaBuilder.create(this as unknown as Opa5)
					.check(function () {
						return CollaborationAPI.checkLockedByOther(sPropertyPath);
					})
					.description(`On remote session, property ${sPropertyPath} is currently locked by another user`)
					.execute();
			},
			iCheckValueIsNotLockedByDefaultUser: function (sPropertyPath: string) {
				return OpaBuilder.create(this as unknown as Opa5)
					.check(function () {
						return !CollaborationAPI.checkLockedByOther(sPropertyPath);
					})
					.description(`On remote session, property ${sPropertyPath} is not locked by another user`)
					.execute();
			},
			iCheckDefaultUserLeftDraft: function () {
				return OpaBuilder.create(this as any as Opa5)
					.check(function () {
						return CollaborationAPI.checkReceived({ userID: "DEFAULT_USER", userAction: Activity.Leave });
					})
					.description("Remote session received notification on default user leaving the draft session")
					.execute();
			},

			iCheckDefaultUserEnteredDraft: function () {
				return OpaBuilder.create(this as any as Opa5)
					.check(function () {
						return CollaborationAPI.checkReceived({ userID: "DEFAULT_USER", userAction: Activity.Join });
					})
					.description("Remote session received notification on default user entering the draft session")
					.execute();
			},

			iCheckDefaultUserCreatedDocument: function (sDocumentPath?: string) {
				return OpaBuilder.create(this as any as Opa5)
					.check(function () {
						return CollaborationAPI.checkReceived({
							userID: "DEFAULT_USER",
							userAction: Activity.Create,
							clientContent: sDocumentPath
						});
					})
					.description(
						sDocumentPath
							? `Remote session received create notification for ${sDocumentPath}`
							: "Remote session received create notification"
					)
					.execute();
			}
		}
	};
}

export default CollaborationClient;
