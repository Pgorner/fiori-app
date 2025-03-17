import PageController from "sap/fe/core/PageController";
import type CodeEditor from "sap/ui/codeeditor/CodeEditor";
import JSONModel from "sap/ui/model/json/JSONModel";

type snippetType = { cds: string; xml: string };
type codeSnippet = { id: string; code: snippetType };
const CODESNIPPETS: Array<codeSnippet> = [
	/* 1.) Extend sap.fe.AppComponent instead of the UI5 Core Component */
	{
		id: "codeSideEffectSingleSource",
		code: {
			cds: /* cds */ `

annotate RootEntity with @(
	Common : {
		SideEffects #singleSourceProperty : {
			SourceProperties : [SourceProperty1],
    		TargetProperties : ['targetProperty1a', 'fieldControlProperty1']
		}
	}
) {
        targetProperty1b @Common.FieldControl : fieldControlProperty1;
  };

`.slice(2, -2), // remove first and last 2 newlines

			xml: `

<Annotations Target="Service.RootEntity">
	<Annotation Term="Common.SideEffects" Qualifier="singleSourceProperty">
	  <Record Type="Common.SideEffectsType">
		<PropertyValue Property="SourceProperties">
		  <Collection>
			<PropertyPath>sourceProperty1</PropertyPath>
		  </Collection>
		</PropertyValue>
		<PropertyValue Property="TargetProperties">
		  <Collection>
			<String>targetProperty1a</String>
			<String>fieldControlProperty1</String>
		  </Collection>
		</PropertyValue>
	  </Record>
	</Annotation>
</Annotations>
<Annotations Target="sap.fe.core.Service.RootEntity/TargetProperty1b">
	<Annotation Term="Common.FieldControl" Path="fieldControlProperty1"/>
	<Annotation Term="Common.Label" String="Input Enabled by Field Control"/>
</Annotations>

`.slice(2, -2)
		}
	},

	{
		id: "codeSideEffectMultiSource",
		code: {
			cds: /* cds */ `

annotate RootEntity with @(
	Common : {
		SideEffects #multiSourceProperties : {
			SourceProperties : [SourceProperty3a, SourceProperty3b],
			TargetProperties   : ['TargetProperty3'],
			TriggerAction : 'sap.fe.core.Service.sideEffectTriggerActionMultiSources'
		}
	}
);
...
entity RootEntity as projection on core.RootEntity actions {
	action sideEffectTriggerActionMultiSources();
};

`.slice(2, -2), // remove first and last 2 newlines

			xml: `
...
<Schema Namespace="sap.fe.core.Service" xmlns="http://docs.oasis-open.org/odata/ns/edm">
	...
	<Action Name="sideEffectTriggerActionMultiSources" IsBound="true">
		<Parameter Name="in" Type="sap.fe.core.Service.RootEntity"/>
	</Action>
	...
	<Annotations Target="Service.RootEntity">
		<Annotation Term="Common.SideEffects" Qualifier="multiSourceProperties">
		  <Record Type="Common.SideEffectsType">
			<PropertyValue Property="SourceProperties">
			  <Collection>
				<PropertyPath>sourceProperty3a</PropertyPath>
				<PropertyPath>sourceProperty3b</PropertyPath>
			  </Collection>
			</PropertyValue>
			<PropertyValue Property="TargetProperties">
			  <Collection>
				<String>targetProperty3</String>
			  </Collection>
			</PropertyValue>
			<PropertyValue Property="TriggerAction" String="sap.fe.core.Service.sideEffectTriggerActionMultiSources"/>
		  </Record>
		</Annotation>
	</Annotations>
	...
</Schema>

`.slice(2, -2)
		}
	},

	{
		id: "codeSideEffectTriggerAction",
		code: {
			cds: /* cds */ `

annotate RootEntity with @(
	Common : {
		SideEffects #triggerActionProperty : {
			SourceProperties : [SourceProperty2],
			TargetProperties   : ['TargetProperty2'],
    	    TriggerAction : 'sap.fe.core.Service.sideEffectTriggerAction'
		}
	}
);
...
entity RootEntity as projection on core.RootEntity actions {
	action sideEffectTriggerAction();
};

`.slice(2, -2), // remove first and last 2 newlines

			xml: `
...
<Schema Namespace="sap.fe.core.Service" xmlns="http://docs.oasis-open.org/odata/ns/edm">
	...
	<Action Name="sideEffectTriggerAction" IsBound="true">
		<Parameter Name="in" Type="sap.fe.core.Service.RootEntity"/>
	</Action>
	...
	<Annotations Target="Service.RootEntity">
		<Annotation Term="Common.SideEffects" Qualifier="triggerActionProperty">
		  <Record Type="Common.SideEffectsType">
			<PropertyValue Property="SourceProperties">
			  <Collection>
				<PropertyPath>sourceProperty2</PropertyPath>
			  </Collection>
			</PropertyValue>
			<PropertyValue Property="TargetProperties">
			  <Collection>
				<String>targetProperty2</String>
			  </Collection>
			</PropertyValue>
			<PropertyValue Property="TriggerAction" String="sap.fe.core.Service.sideEffectTriggerAction"/>
		  </Record>
		</Annotation>
	</Annotations>
	...
</Schema>

`.slice(2, -2)
		}
	},

	{
		id: "codeSideEffectBooleanSource",
		code: {
			cds: /* cds */ `

annotate RootEntity with @(
	Common : {
		SideEffects #booleanSourceProperties : {
			SourceProperties : [SourceProperty4],
			TargetProperties   : ['fieldControlProperty2']
		}
	}
){
	TargetProperty4 @Common.FieldControl: fieldControlProperty2;
};

`.slice(2, -2), // remove first and last 2 newlines

			xml: `

<Annotations Target="Service.RootEntity">
 <Annotation Term="Common.SideEffects" Qualifier="booleanSourceProperty">
  <Record Type="Common.SideEffectsType">
 		<PropertyValue Property="SourceProperties">
				<Collection>
					<PropertyPath>SourceProperty4</PropertyPath>
				</Collection>
			</PropertyValue>
			<PropertyValue Property="TargetProperties">
				<Collection>
					<String>fieldControlProperty2</String>
				</Collection>
			</PropertyValue>
		</Record>
	</Annotation>
</Annotations>
<Annotations Target="sap.fe.core.Service.RootEntity/TargetProperty4">
	<Annotation Term="Common.FieldControl" Path="fieldControlProperty2"/>
	<Annotation Term="Common.Label" String="Input Enabled by Field Control"/>
</Annotations>

`.slice(2, -2)
		}
	},

	{
		id: "codeSideEffectSourceEntity",
		code: {
			cds: /* cds */ `

annotate RootEntity with @(
	Common : {
		SideEffects #entitySource : {
			SourceEntities   : [items],
			TargetProperties   : ['totalAmount']
		}
	}
);

`.slice(2, -2), // remove first and last 2 newlines

			xml: `

<Annotation Term="Common.SideEffects" Qualifier="sourceEntity">
  <Record Type="Common.SideEffectsType">
	<PropertyValue Property="SourceEntities">
	  <Collection>
		<NavigationPropertyPath>items</NavigationPropertyPath>
	  </Collection>
	</PropertyValue>
	<PropertyValue Property="TargetProperties">
	  <Collection>
		<String>totalAmount</String>
	  </Collection>
	</PropertyValue>
  </Record>
</Annotation>

`.slice(2, -2)
		}
	},

	{
		id: "codeSideEffectAction",
		code: {
			cds: /* cds */ `

    entity RootEntity as projection on core.RootEntity actions {
        @(
            Common.SideEffects              : {TargetProperties : ['_it/*']},
            cds.odata.bindingparameter.name : '_it',
            Core.OperationAvailable : _it.OperationAvailable
        )
        action increaseAndCheckPrime();
    };

`.slice(2, -2), // remove first and last 2 newlines

			xml: `

  <Action Name="increaseAndCheckPrime" IsBound="true">
	<Parameter Name="_it" Type="sap.fe.core.Service.RootEntity"/>
  </Action>

  <Annotations Target="sap.fe.core.Service.increaseAndCheckPrime(sap.fe.core.Service.RootEntity)">
	<Annotation Term="Common.SideEffects">
	  <Record Type="Common.SideEffectsType">
		<PropertyValue Property="TargetProperties">
		  <Collection>
			<String>_it/*</String>
		  </Collection>
		</PropertyValue>
	  </Record>
	</Annotation>
	<Annotation Term="Core.OperationAvailable" Path="_it/OperationAvailable"/>
  </Annotations>

`.slice(2, -2)
		}
	},

	{
		id: "codeSideEffectUnBoundAction",
		code: {
			cds: /* cds */ `
	service Service {
		@Common.SideEffects : {
			TargetProperties: ['/sap.fe.core.Service.EntityContainer/RootEntity']
		}
		action unBoundAction();
	}

`.slice(2, -2), // remove first and last 2 newlines

			xml: `

<edmx:DataServices>
	<Schema Namespace="sap.fe.core.Service" xmlns="http://docs.oasis-open.org/odata/ns/edm">
		<EntityContainer Name="EntityContainer">
			<ActionImport Name="unBoundAction" Action="sap.fe.core.Service.unBoundAction"/>
		</EntityContainer>
		<Action Name="unBoundAction" IsBound="false"/>
		<Annotations Target="sap.fe.core.Service.UnboundAction()">
			<Annotation Term="Common.SideEffects">
				<Record Type="Common.SideEffectsType">
					<PropertyValue Property="TargetEntities">
						<Collection>
							<NavigationPropertyPath>"/sap.fe.core.Service.EntityContainer/RootEntity"</NavigationPropertyPath>
						</Collection>
					</PropertyValue>
				</Record>
			</Annotation>
		</Annotations>
	</Schema>
</edmx:DataServices>

`.slice(2, -2)
		}
	},
	{
		id: "codeSideEffectTargetEntity",
		code: {
			cds: /* cds */ `

annotate RootEntity with @(
    Common.SideEffects #BusinessPartner : {
        SourceProperties : [BusinessPartnerID],
        TargetEntities   : [businessPartner]
    }
);
...
service Service {
    entity RootEntity             as projection on core.RootEntity actions {
    ...
        @(
            Common.SideEffects #InvalidateCachedValueHelp : {
                TargetProperties : ['_it/BusinessPartnerID'],
                TargetEntities : ['/sap.fe.core.Service.EntityContainer/BusinessPartnerAddress']
            },
            cds.odata.bindingparameter.name : '_it'
        )
        action deleteBusinessPartner();
    };
    ...
}
...

`.slice(2, -2), // remove first and last 2 newlines

			xml: `

<Annotations Target="sap.fe.core.Service.RootEntity">
        <Annotation Term="Common.SideEffects" Qualifier="BusinessPartner">
          <Record Type="Common.SideEffectsType">
            <PropertyValue Property="SourceProperties">
              <Collection>
                <PropertyPath>BusinessPartnerID</PropertyPath>
              </Collection>
            </PropertyValue>
            <PropertyValue Property="TargetEntities">
              <Collection>
                <NavigationPropertyPath>businessPartner</NavigationPropertyPath>
              </Collection>
            </PropertyValue>
          </Record>
        </Annotation>
</Annotations>
...
  <Annotations Target="sap.fe.core.Service.deleteBusinessPartner(sap.fe.core.Service.RootEntity)">
	<Annotation Term="Common.SideEffects" Qualifier="InvalidateCachedValueHelp">
	  <Record Type="Common.SideEffectsType">
		<PropertyValue Property="TargetProperties">
		  <Collection>
			<String>_it/BusinessPartnerID</String>
		  </Collection>
		</PropertyValue>
		<PropertyValue Property="TargetEntities">
		  <Collection>
			<NavigationPropertyPath>/sap.fe.core.Service.EntityContainer/BusinessPartnerAddress</NavigationPropertyPath>
		  </Collection>
		</PropertyValue>
	  </Record>
	</Annotation>
  </Annotations>

`.slice(2, -2)
		}
	},

	{
		id: "codeSideEffectAbsolutePath",
		code: {
			cds: /* cds */ `


    entity RootEntity             as projection on core.RootEntity actions {
        @(
            Common.SideEffects              : {
                TargetProperties : [
                    '/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty',
                ],
                TargetEntities : ['/sap.fe.core.Service.EntityContainer/AbsoluteEntity']
            },
            cds.odata.bindingparameter.name : '_it'
        )
        action addRound();
        @(
            Common.SideEffects              : {
                TargetProperties : [
                    '/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty',
                ],
                TargetEntities : ['/sap.fe.core.Service.EntityContainer/AbsoluteEntity']
            },
            cds.odata.bindingparameter.name : '_it'
        )
        action stopRound();
        @(
            Common.SideEffects              : {
                TargetProperties : [
                    '/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty',
                ],
                TargetEntities : ['/sap.fe.core.Service.EntityContainer/AbsoluteEntity']
            },
            cds.odata.bindingparameter.name : '_it'
        )
        action clearRounds();
    };

`.slice(2, -2), // remove first and last 2 newlines

			xml: `
	...
    <Schema Namespace="sap.fe.core.Service" xmlns="http://docs.oasis-open.org/odata/ns/edm">
      <EntityContainer Name="EntityContainer">
        <EntitySet Name="AbsoluteEntity" EntityType="sap.fe.core.Service.AbsoluteEntity"/>
        <Singleton Name="EntitiesSingleton" Type="sap.fe.core.Service.EntitiesSingleton"/>
      </EntityContainer>
      ...
     <Annotations Target="sap.fe.core.Service.addRound(sap.fe.core.Service.RootEntity)">
        <Annotation Term="Common.SideEffects">
          <Record Type="Common.SideEffectsType">
            <PropertyValue Property="TargetProperties">
              <Collection>
                <String>/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty</String>
              </Collection>
            </PropertyValue>
            <PropertyValue Property="TargetEntities">
              <Collection>
                <NavigationPropertyPath>/sap.fe.core.Service.EntityContainer/AbsoluteEntity</NavigationPropertyPath>
              </Collection>
            </PropertyValue>
          </Record>
        </Annotation>
      </Annotations>
      <Annotations Target="sap.fe.core.Service.stopRound(sap.fe.core.Service.RootEntity)">
        <Annotation Term="Common.SideEffects">
          <Record Type="Common.SideEffectsType">
            <PropertyValue Property="TargetProperties">
              <Collection>
                <String>/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty</String>
              </Collection>
            </PropertyValue>
            <PropertyValue Property="TargetEntities">
              <Collection>
                <NavigationPropertyPath>/sap.fe.core.Service.EntityContainer/AbsoluteEntity</NavigationPropertyPath>
              </Collection>
            </PropertyValue>
          </Record>
        </Annotation>
      </Annotations>
      <Annotations Target="sap.fe.core.Service.clearRounds(sap.fe.core.Service.RootEntity)">
        <Annotation Term="Common.SideEffects">
          <Record Type="Common.SideEffectsType">
            <PropertyValue Property="TargetProperties">
              <Collection>
                <String>/sap.fe.core.Service.EntityContainer/EntitiesSingleton/BooleanProperty</String>
              </Collection>
            </PropertyValue>
            <PropertyValue Property="TargetEntities">
              <Collection>
                <NavigationPropertyPath>/sap.fe.core.Service.EntityContainer/AbsoluteEntity</NavigationPropertyPath>
              </Collection>
            </PropertyValue>
          </Record>
        </Annotation>
      </Annotations>

`.slice(2, -2)
		}
	}
];

export default PageController.extend("sap.fe.core.fpmExplorer.guidanceSideEffects.EntryPage", {
	onInit: function (this: PageController) {
		PageController.prototype.onInit.apply(this);
		const uiModel: JSONModel = new JSONModel({ isEditable: true });
		this.getView().setModel(uiModel, "ui");
		for (const oSnippet of CODESNIPPETS) {
			const oEditor: CodeEditor = this.byId(oSnippet.id) as CodeEditor;
			oEditor.setValue(oSnippet.code.cds);
			oEditor.setMaxLines(20);
		}
	},

	onSelectTab: function (oEvent: any) {
		const sFilterId = oEvent.getParameter("selectedKey"); //e.g. codeSideEffectSingleSourceCDS
		const codeEditorId = sFilterId.substr(0, sFilterId.length - 3); //e.g. codeSideEffectSingleSource
		const snippet = sFilterId.substr(sFilterId.length - 3).toLowerCase() as keyof snippetType; //e.g. cds or xml
		const oEditor = this.byId(codeEditorId) as CodeEditor;
		//access code snippet by type, and set editor type accordingly
		oEditor.setValue(CODESNIPPETS.find((x) => x.id === codeEditorId)?.code[snippet])?.setType(snippet != "cds" ? snippet : "red");
	},

	onPress: function (oEvent: any) {
		(this as any).editFlow.invokeAction("sap.fe.core.Service.increaseAndCheckPrime", {
			contexts: oEvent.getSource().getBindingContext()
		});
	},

	onAddRound: function (oEvent: any) {
		(this as any).editFlow.invokeAction("sap.fe.core.Service.addRound", {
			contexts: oEvent.getSource().getBindingContext(),
			invocationGrouping: "ChangeSet"
		});
	},

	onUnBoundAction: function (oEvent: any) {
		(this as any).editFlow.invokeAction("sap.fe.core.Service.EntityContainer/unBoundAction", {
			model: oEvent.getSource().getModel(),
			invocationGrouping: "ChangeSet"
		});
	},

	onStartRound: function (oEvent: any) {
		this.onClearRounds(oEvent);
		this.onAddRound(oEvent);
	},

	onStopRound: function (oEvent: any) {
		(this as any).editFlow.invokeAction("sap.fe.core.Service.stopRound", {
			contexts: oEvent.getSource().getBindingContext()
		});
	},

	onClearRounds: function (oEvent: any) {
		(this as any).editFlow.invokeAction("sap.fe.core.Service.clearRounds", {
			contexts: oEvent.getSource().getBindingContext(),
			invocationGrouping: "ChangeSet"
		});
	},

	onDeleteBusinessPartner: function (oEvent: any) {
		(this as any).editFlow.invokeAction("sap.fe.core.Service.deleteBusinessPartner", {
			contexts: oEvent.getSource().getBindingContext()
		});
	}
});
