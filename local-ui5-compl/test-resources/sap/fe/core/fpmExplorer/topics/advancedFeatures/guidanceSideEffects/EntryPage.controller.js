/*!
 * SAP UI development toolkit for HTML5 (SAPUI5)
 *      (c) Copyright 2009-2024 SAP SE. All rights reserved
 */
sap.ui.define(["sap/fe/core/PageController", "sap/ui/model/json/JSONModel"], function (PageController, JSONModel) {
  "use strict";

  const CODESNIPPETS = [/* 1.) Extend sap.fe.AppComponent instead of the UI5 Core Component */
  {
    id: "codeSideEffectSingleSource",
    code: {
      cds: /* cds */`

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

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectMultiSource",
    code: {
      cds: /* cds */`

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

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectTriggerAction",
    code: {
      cds: /* cds */`

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

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectBooleanSource",
    code: {
      cds: /* cds */`

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

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectSourceEntity",
    code: {
      cds: /* cds */`

annotate RootEntity with @(
	Common : {
		SideEffects #entitySource : {
			SourceEntities   : [items],
			TargetProperties   : ['totalAmount']
		}
	}
);

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectAction",
    code: {
      cds: /* cds */`

    entity RootEntity as projection on core.RootEntity actions {
        @(
            Common.SideEffects              : {TargetProperties : ['_it/*']},
            cds.odata.bindingparameter.name : '_it',
            Core.OperationAvailable : _it.OperationAvailable
        )
        action increaseAndCheckPrime();
    };

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectUnBoundAction",
    code: {
      cds: /* cds */`
	service Service {
		@Common.SideEffects : {
			TargetProperties: ['/sap.fe.core.Service.EntityContainer/RootEntity']
		}
		action unBoundAction();
	}

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectTargetEntity",
    code: {
      cds: /* cds */`

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

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }, {
    id: "codeSideEffectAbsolutePath",
    code: {
      cds: /* cds */`


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

`.slice(2, -2),
      // remove first and last 2 newlines

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
  }];
  return PageController.extend("sap.fe.core.fpmExplorer.guidanceSideEffects.EntryPage", {
    onInit: function () {
      PageController.prototype.onInit.apply(this);
      const uiModel = new JSONModel({
        isEditable: true
      });
      this.getView().setModel(uiModel, "ui");
      for (const oSnippet of CODESNIPPETS) {
        const oEditor = this.byId(oSnippet.id);
        oEditor.setValue(oSnippet.code.cds);
        oEditor.setMaxLines(20);
      }
    },
    onSelectTab: function (oEvent) {
      const sFilterId = oEvent.getParameter("selectedKey"); //e.g. codeSideEffectSingleSourceCDS
      const codeEditorId = sFilterId.substr(0, sFilterId.length - 3); //e.g. codeSideEffectSingleSource
      const snippet = sFilterId.substr(sFilterId.length - 3).toLowerCase(); //e.g. cds or xml
      const oEditor = this.byId(codeEditorId);
      //access code snippet by type, and set editor type accordingly
      oEditor.setValue(CODESNIPPETS.find(x => x.id === codeEditorId)?.code[snippet])?.setType(snippet != "cds" ? snippet : "red");
    },
    onPress: function (oEvent) {
      this.editFlow.invokeAction("sap.fe.core.Service.increaseAndCheckPrime", {
        contexts: oEvent.getSource().getBindingContext()
      });
    },
    onAddRound: function (oEvent) {
      this.editFlow.invokeAction("sap.fe.core.Service.addRound", {
        contexts: oEvent.getSource().getBindingContext(),
        invocationGrouping: "ChangeSet"
      });
    },
    onUnBoundAction: function (oEvent) {
      this.editFlow.invokeAction("sap.fe.core.Service.EntityContainer/unBoundAction", {
        model: oEvent.getSource().getModel(),
        invocationGrouping: "ChangeSet"
      });
    },
    onStartRound: function (oEvent) {
      this.onClearRounds(oEvent);
      this.onAddRound(oEvent);
    },
    onStopRound: function (oEvent) {
      this.editFlow.invokeAction("sap.fe.core.Service.stopRound", {
        contexts: oEvent.getSource().getBindingContext()
      });
    },
    onClearRounds: function (oEvent) {
      this.editFlow.invokeAction("sap.fe.core.Service.clearRounds", {
        contexts: oEvent.getSource().getBindingContext(),
        invocationGrouping: "ChangeSet"
      });
    },
    onDeleteBusinessPartner: function (oEvent) {
      this.editFlow.invokeAction("sap.fe.core.Service.deleteBusinessPartner", {
        contexts: oEvent.getSource().getBindingContext()
      });
    }
  });
}, false);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJDT0RFU05JUFBFVFMiLCJpZCIsImNvZGUiLCJjZHMiLCJzbGljZSIsInhtbCIsIlBhZ2VDb250cm9sbGVyIiwiZXh0ZW5kIiwib25Jbml0IiwicHJvdG90eXBlIiwiYXBwbHkiLCJ1aU1vZGVsIiwiSlNPTk1vZGVsIiwiaXNFZGl0YWJsZSIsImdldFZpZXciLCJzZXRNb2RlbCIsIm9TbmlwcGV0Iiwib0VkaXRvciIsImJ5SWQiLCJzZXRWYWx1ZSIsInNldE1heExpbmVzIiwib25TZWxlY3RUYWIiLCJvRXZlbnQiLCJzRmlsdGVySWQiLCJnZXRQYXJhbWV0ZXIiLCJjb2RlRWRpdG9ySWQiLCJzdWJzdHIiLCJsZW5ndGgiLCJzbmlwcGV0IiwidG9Mb3dlckNhc2UiLCJmaW5kIiwieCIsInNldFR5cGUiLCJvblByZXNzIiwiZWRpdEZsb3ciLCJpbnZva2VBY3Rpb24iLCJjb250ZXh0cyIsImdldFNvdXJjZSIsImdldEJpbmRpbmdDb250ZXh0Iiwib25BZGRSb3VuZCIsImludm9jYXRpb25Hcm91cGluZyIsIm9uVW5Cb3VuZEFjdGlvbiIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJvblN0YXJ0Um91bmQiLCJvbkNsZWFyUm91bmRzIiwib25TdG9wUm91bmQiLCJvbkRlbGV0ZUJ1c2luZXNzUGFydG5lciJdLCJzb3VyY2VSb290IjoiLiIsInNvdXJjZXMiOlsiRW50cnlQYWdlLmNvbnRyb2xsZXIudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFBhZ2VDb250cm9sbGVyIGZyb20gXCJzYXAvZmUvY29yZS9QYWdlQ29udHJvbGxlclwiO1xuaW1wb3J0IHR5cGUgQ29kZUVkaXRvciBmcm9tIFwic2FwL3VpL2NvZGVlZGl0b3IvQ29kZUVkaXRvclwiO1xuaW1wb3J0IEpTT05Nb2RlbCBmcm9tIFwic2FwL3VpL21vZGVsL2pzb24vSlNPTk1vZGVsXCI7XG5cbnR5cGUgc25pcHBldFR5cGUgPSB7IGNkczogc3RyaW5nOyB4bWw6IHN0cmluZyB9O1xudHlwZSBjb2RlU25pcHBldCA9IHsgaWQ6IHN0cmluZzsgY29kZTogc25pcHBldFR5cGUgfTtcbmNvbnN0IENPREVTTklQUEVUUzogQXJyYXk8Y29kZVNuaXBwZXQ+ID0gW1xuXHQvKiAxLikgRXh0ZW5kIHNhcC5mZS5BcHBDb21wb25lbnQgaW5zdGVhZCBvZiB0aGUgVUk1IENvcmUgQ29tcG9uZW50ICovXG5cdHtcblx0XHRpZDogXCJjb2RlU2lkZUVmZmVjdFNpbmdsZVNvdXJjZVwiLFxuXHRcdGNvZGU6IHtcblx0XHRcdGNkczogLyogY2RzICovIGBcblxuYW5ub3RhdGUgUm9vdEVudGl0eSB3aXRoIEAoXG5cdENvbW1vbiA6IHtcblx0XHRTaWRlRWZmZWN0cyAjc2luZ2xlU291cmNlUHJvcGVydHkgOiB7XG5cdFx0XHRTb3VyY2VQcm9wZXJ0aWVzIDogW1NvdXJjZVByb3BlcnR5MV0sXG4gICAgXHRcdFRhcmdldFByb3BlcnRpZXMgOiBbJ3RhcmdldFByb3BlcnR5MWEnLCAnZmllbGRDb250cm9sUHJvcGVydHkxJ11cblx0XHR9XG5cdH1cbikge1xuICAgICAgICB0YXJnZXRQcm9wZXJ0eTFiIEBDb21tb24uRmllbGRDb250cm9sIDogZmllbGRDb250cm9sUHJvcGVydHkxO1xuICB9O1xuXG5gLnNsaWNlKDIsIC0yKSwgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblxuXHRcdFx0eG1sOiBgXG5cbjxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJTZXJ2aWNlLlJvb3RFbnRpdHlcIj5cblx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5TaWRlRWZmZWN0c1wiIFF1YWxpZmllcj1cInNpbmdsZVNvdXJjZVByb3BlcnR5XCI+XG5cdCAgPFJlY29yZCBUeXBlPVwiQ29tbW9uLlNpZGVFZmZlY3RzVHlwZVwiPlxuXHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiU291cmNlUHJvcGVydGllc1wiPlxuXHRcdCAgPENvbGxlY3Rpb24+XG5cdFx0XHQ8UHJvcGVydHlQYXRoPnNvdXJjZVByb3BlcnR5MTwvUHJvcGVydHlQYXRoPlxuXHRcdCAgPC9Db2xsZWN0aW9uPlxuXHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRhcmdldFByb3BlcnRpZXNcIj5cblx0XHQgIDxDb2xsZWN0aW9uPlxuXHRcdFx0PFN0cmluZz50YXJnZXRQcm9wZXJ0eTFhPC9TdHJpbmc+XG5cdFx0XHQ8U3RyaW5nPmZpZWxkQ29udHJvbFByb3BlcnR5MTwvU3RyaW5nPlxuXHRcdCAgPC9Db2xsZWN0aW9uPlxuXHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0ICA8L1JlY29yZD5cblx0PC9Bbm5vdGF0aW9uPlxuPC9Bbm5vdGF0aW9ucz5cbjxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkvVGFyZ2V0UHJvcGVydHkxYlwiPlxuXHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkZpZWxkQ29udHJvbFwiIFBhdGg9XCJmaWVsZENvbnRyb2xQcm9wZXJ0eTFcIi8+XG5cdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uTGFiZWxcIiBTdHJpbmc9XCJJbnB1dCBFbmFibGVkIGJ5IEZpZWxkIENvbnRyb2xcIi8+XG48L0Fubm90YXRpb25zPlxuXG5gLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblxuXHR7XG5cdFx0aWQ6IFwiY29kZVNpZGVFZmZlY3RNdWx0aVNvdXJjZVwiLFxuXHRcdGNvZGU6IHtcblx0XHRcdGNkczogLyogY2RzICovIGBcblxuYW5ub3RhdGUgUm9vdEVudGl0eSB3aXRoIEAoXG5cdENvbW1vbiA6IHtcblx0XHRTaWRlRWZmZWN0cyAjbXVsdGlTb3VyY2VQcm9wZXJ0aWVzIDoge1xuXHRcdFx0U291cmNlUHJvcGVydGllcyA6IFtTb3VyY2VQcm9wZXJ0eTNhLCBTb3VyY2VQcm9wZXJ0eTNiXSxcblx0XHRcdFRhcmdldFByb3BlcnRpZXMgICA6IFsnVGFyZ2V0UHJvcGVydHkzJ10sXG5cdFx0XHRUcmlnZ2VyQWN0aW9uIDogJ3NhcC5mZS5jb3JlLlNlcnZpY2Uuc2lkZUVmZmVjdFRyaWdnZXJBY3Rpb25NdWx0aVNvdXJjZXMnXG5cdFx0fVxuXHR9XG4pO1xuLi4uXG5lbnRpdHkgUm9vdEVudGl0eSBhcyBwcm9qZWN0aW9uIG9uIGNvcmUuUm9vdEVudGl0eSBhY3Rpb25zIHtcblx0YWN0aW9uIHNpZGVFZmZlY3RUcmlnZ2VyQWN0aW9uTXVsdGlTb3VyY2VzKCk7XG59O1xuXG5gLnNsaWNlKDIsIC0yKSwgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblxuXHRcdFx0eG1sOiBgXG4uLi5cbjxTY2hlbWEgTmFtZXNwYWNlPVwic2FwLmZlLmNvcmUuU2VydmljZVwiIHhtbG5zPVwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvb2RhdGEvbnMvZWRtXCI+XG5cdC4uLlxuXHQ8QWN0aW9uIE5hbWU9XCJzaWRlRWZmZWN0VHJpZ2dlckFjdGlvbk11bHRpU291cmNlc1wiIElzQm91bmQ9XCJ0cnVlXCI+XG5cdFx0PFBhcmFtZXRlciBOYW1lPVwiaW5cIiBUeXBlPVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5XCIvPlxuXHQ8L0FjdGlvbj5cblx0Li4uXG5cdDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJTZXJ2aWNlLlJvb3RFbnRpdHlcIj5cblx0XHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlNpZGVFZmZlY3RzXCIgUXVhbGlmaWVyPVwibXVsdGlTb3VyY2VQcm9wZXJ0aWVzXCI+XG5cdFx0ICA8UmVjb3JkIFR5cGU9XCJDb21tb24uU2lkZUVmZmVjdHNUeXBlXCI+XG5cdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlNvdXJjZVByb3BlcnRpZXNcIj5cblx0XHRcdCAgPENvbGxlY3Rpb24+XG5cdFx0XHRcdDxQcm9wZXJ0eVBhdGg+c291cmNlUHJvcGVydHkzYTwvUHJvcGVydHlQYXRoPlxuXHRcdFx0XHQ8UHJvcGVydHlQYXRoPnNvdXJjZVByb3BlcnR5M2I8L1Byb3BlcnR5UGF0aD5cblx0XHRcdCAgPC9Db2xsZWN0aW9uPlxuXHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJUYXJnZXRQcm9wZXJ0aWVzXCI+XG5cdFx0XHQgIDxDb2xsZWN0aW9uPlxuXHRcdFx0XHQ8U3RyaW5nPnRhcmdldFByb3BlcnR5MzwvU3RyaW5nPlxuXHRcdFx0ICA8L0NvbGxlY3Rpb24+XG5cdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRyaWdnZXJBY3Rpb25cIiBTdHJpbmc9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLnNpZGVFZmZlY3RUcmlnZ2VyQWN0aW9uTXVsdGlTb3VyY2VzXCIvPlxuXHRcdCAgPC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHQ8L0Fubm90YXRpb25zPlxuXHQuLi5cbjwvU2NoZW1hPlxuXG5gLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblxuXHR7XG5cdFx0aWQ6IFwiY29kZVNpZGVFZmZlY3RUcmlnZ2VyQWN0aW9uXCIsXG5cdFx0Y29kZToge1xuXHRcdFx0Y2RzOiAvKiBjZHMgKi8gYFxuXG5hbm5vdGF0ZSBSb290RW50aXR5IHdpdGggQChcblx0Q29tbW9uIDoge1xuXHRcdFNpZGVFZmZlY3RzICN0cmlnZ2VyQWN0aW9uUHJvcGVydHkgOiB7XG5cdFx0XHRTb3VyY2VQcm9wZXJ0aWVzIDogW1NvdXJjZVByb3BlcnR5Ml0sXG5cdFx0XHRUYXJnZXRQcm9wZXJ0aWVzICAgOiBbJ1RhcmdldFByb3BlcnR5MiddLFxuICAgIFx0ICAgIFRyaWdnZXJBY3Rpb24gOiAnc2FwLmZlLmNvcmUuU2VydmljZS5zaWRlRWZmZWN0VHJpZ2dlckFjdGlvbidcblx0XHR9XG5cdH1cbik7XG4uLi5cbmVudGl0eSBSb290RW50aXR5IGFzIHByb2plY3Rpb24gb24gY29yZS5Sb290RW50aXR5IGFjdGlvbnMge1xuXHRhY3Rpb24gc2lkZUVmZmVjdFRyaWdnZXJBY3Rpb24oKTtcbn07XG5cbmAuc2xpY2UoMiwgLTIpLCAvLyByZW1vdmUgZmlyc3QgYW5kIGxhc3QgMiBuZXdsaW5lc1xuXG5cdFx0XHR4bWw6IGBcbi4uLlxuPFNjaGVtYSBOYW1lc3BhY2U9XCJzYXAuZmUuY29yZS5TZXJ2aWNlXCIgeG1sbnM9XCJodHRwOi8vZG9jcy5vYXNpcy1vcGVuLm9yZy9vZGF0YS9ucy9lZG1cIj5cblx0Li4uXG5cdDxBY3Rpb24gTmFtZT1cInNpZGVFZmZlY3RUcmlnZ2VyQWN0aW9uXCIgSXNCb3VuZD1cInRydWVcIj5cblx0XHQ8UGFyYW1ldGVyIE5hbWU9XCJpblwiIFR5cGU9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHlcIi8+XG5cdDwvQWN0aW9uPlxuXHQuLi5cblx0PEFubm90YXRpb25zIFRhcmdldD1cIlNlcnZpY2UuUm9vdEVudGl0eVwiPlxuXHRcdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uU2lkZUVmZmVjdHNcIiBRdWFsaWZpZXI9XCJ0cmlnZ2VyQWN0aW9uUHJvcGVydHlcIj5cblx0XHQgIDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5TaWRlRWZmZWN0c1R5cGVcIj5cblx0XHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiU291cmNlUHJvcGVydGllc1wiPlxuXHRcdFx0ICA8Q29sbGVjdGlvbj5cblx0XHRcdFx0PFByb3BlcnR5UGF0aD5zb3VyY2VQcm9wZXJ0eTI8L1Byb3BlcnR5UGF0aD5cblx0XHRcdCAgPC9Db2xsZWN0aW9uPlxuXHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJUYXJnZXRQcm9wZXJ0aWVzXCI+XG5cdFx0XHQgIDxDb2xsZWN0aW9uPlxuXHRcdFx0XHQ8U3RyaW5nPnRhcmdldFByb3BlcnR5MjwvU3RyaW5nPlxuXHRcdFx0ICA8L0NvbGxlY3Rpb24+XG5cdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRyaWdnZXJBY3Rpb25cIiBTdHJpbmc9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLnNpZGVFZmZlY3RUcmlnZ2VyQWN0aW9uXCIvPlxuXHRcdCAgPC9SZWNvcmQ+XG5cdFx0PC9Bbm5vdGF0aW9uPlxuXHQ8L0Fubm90YXRpb25zPlxuXHQuLi5cbjwvU2NoZW1hPlxuXG5gLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblxuXHR7XG5cdFx0aWQ6IFwiY29kZVNpZGVFZmZlY3RCb29sZWFuU291cmNlXCIsXG5cdFx0Y29kZToge1xuXHRcdFx0Y2RzOiAvKiBjZHMgKi8gYFxuXG5hbm5vdGF0ZSBSb290RW50aXR5IHdpdGggQChcblx0Q29tbW9uIDoge1xuXHRcdFNpZGVFZmZlY3RzICNib29sZWFuU291cmNlUHJvcGVydGllcyA6IHtcblx0XHRcdFNvdXJjZVByb3BlcnRpZXMgOiBbU291cmNlUHJvcGVydHk0XSxcblx0XHRcdFRhcmdldFByb3BlcnRpZXMgICA6IFsnZmllbGRDb250cm9sUHJvcGVydHkyJ11cblx0XHR9XG5cdH1cbil7XG5cdFRhcmdldFByb3BlcnR5NCBAQ29tbW9uLkZpZWxkQ29udHJvbDogZmllbGRDb250cm9sUHJvcGVydHkyO1xufTtcblxuYC5zbGljZSgyLCAtMiksIC8vIHJlbW92ZSBmaXJzdCBhbmQgbGFzdCAyIG5ld2xpbmVzXG5cblx0XHRcdHhtbDogYFxuXG48QW5ub3RhdGlvbnMgVGFyZ2V0PVwiU2VydmljZS5Sb290RW50aXR5XCI+XG4gPEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5TaWRlRWZmZWN0c1wiIFF1YWxpZmllcj1cImJvb2xlYW5Tb3VyY2VQcm9wZXJ0eVwiPlxuICA8UmVjb3JkIFR5cGU9XCJDb21tb24uU2lkZUVmZmVjdHNUeXBlXCI+XG4gXHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiU291cmNlUHJvcGVydGllc1wiPlxuXHRcdFx0XHQ8Q29sbGVjdGlvbj5cblx0XHRcdFx0XHQ8UHJvcGVydHlQYXRoPlNvdXJjZVByb3BlcnR5NDwvUHJvcGVydHlQYXRoPlxuXHRcdFx0XHQ8L0NvbGxlY3Rpb24+XG5cdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRhcmdldFByb3BlcnRpZXNcIj5cblx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0PFN0cmluZz5maWVsZENvbnRyb2xQcm9wZXJ0eTI8L1N0cmluZz5cblx0XHRcdFx0PC9Db2xsZWN0aW9uPlxuXHRcdFx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHRcdDwvUmVjb3JkPlxuXHQ8L0Fubm90YXRpb24+XG48L0Fubm90YXRpb25zPlxuPEFubm90YXRpb25zIFRhcmdldD1cInNhcC5mZS5jb3JlLlNlcnZpY2UuUm9vdEVudGl0eS9UYXJnZXRQcm9wZXJ0eTRcIj5cblx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5GaWVsZENvbnRyb2xcIiBQYXRoPVwiZmllbGRDb250cm9sUHJvcGVydHkyXCIvPlxuXHQ8QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLkxhYmVsXCIgU3RyaW5nPVwiSW5wdXQgRW5hYmxlZCBieSBGaWVsZCBDb250cm9sXCIvPlxuPC9Bbm5vdGF0aW9ucz5cblxuYC5zbGljZSgyLCAtMilcblx0XHR9XG5cdH0sXG5cblx0e1xuXHRcdGlkOiBcImNvZGVTaWRlRWZmZWN0U291cmNlRW50aXR5XCIsXG5cdFx0Y29kZToge1xuXHRcdFx0Y2RzOiAvKiBjZHMgKi8gYFxuXG5hbm5vdGF0ZSBSb290RW50aXR5IHdpdGggQChcblx0Q29tbW9uIDoge1xuXHRcdFNpZGVFZmZlY3RzICNlbnRpdHlTb3VyY2UgOiB7XG5cdFx0XHRTb3VyY2VFbnRpdGllcyAgIDogW2l0ZW1zXSxcblx0XHRcdFRhcmdldFByb3BlcnRpZXMgICA6IFsndG90YWxBbW91bnQnXVxuXHRcdH1cblx0fVxuKTtcblxuYC5zbGljZSgyLCAtMiksIC8vIHJlbW92ZSBmaXJzdCBhbmQgbGFzdCAyIG5ld2xpbmVzXG5cblx0XHRcdHhtbDogYFxuXG48QW5ub3RhdGlvbiBUZXJtPVwiQ29tbW9uLlNpZGVFZmZlY3RzXCIgUXVhbGlmaWVyPVwic291cmNlRW50aXR5XCI+XG4gIDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5TaWRlRWZmZWN0c1R5cGVcIj5cblx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJTb3VyY2VFbnRpdGllc1wiPlxuXHQgIDxDb2xsZWN0aW9uPlxuXHRcdDxOYXZpZ2F0aW9uUHJvcGVydHlQYXRoPml0ZW1zPC9OYXZpZ2F0aW9uUHJvcGVydHlQYXRoPlxuXHQgIDwvQ29sbGVjdGlvbj5cblx0PC9Qcm9wZXJ0eVZhbHVlPlxuXHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRhcmdldFByb3BlcnRpZXNcIj5cblx0ICA8Q29sbGVjdGlvbj5cblx0XHQ8U3RyaW5nPnRvdGFsQW1vdW50PC9TdHJpbmc+XG5cdCAgPC9Db2xsZWN0aW9uPlxuXHQ8L1Byb3BlcnR5VmFsdWU+XG4gIDwvUmVjb3JkPlxuPC9Bbm5vdGF0aW9uPlxuXG5gLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblxuXHR7XG5cdFx0aWQ6IFwiY29kZVNpZGVFZmZlY3RBY3Rpb25cIixcblx0XHRjb2RlOiB7XG5cdFx0XHRjZHM6IC8qIGNkcyAqLyBgXG5cbiAgICBlbnRpdHkgUm9vdEVudGl0eSBhcyBwcm9qZWN0aW9uIG9uIGNvcmUuUm9vdEVudGl0eSBhY3Rpb25zIHtcbiAgICAgICAgQChcbiAgICAgICAgICAgIENvbW1vbi5TaWRlRWZmZWN0cyAgICAgICAgICAgICAgOiB7VGFyZ2V0UHJvcGVydGllcyA6IFsnX2l0LyonXX0sXG4gICAgICAgICAgICBjZHMub2RhdGEuYmluZGluZ3BhcmFtZXRlci5uYW1lIDogJ19pdCcsXG4gICAgICAgICAgICBDb3JlLk9wZXJhdGlvbkF2YWlsYWJsZSA6IF9pdC5PcGVyYXRpb25BdmFpbGFibGVcbiAgICAgICAgKVxuICAgICAgICBhY3Rpb24gaW5jcmVhc2VBbmRDaGVja1ByaW1lKCk7XG4gICAgfTtcblxuYC5zbGljZSgyLCAtMiksIC8vIHJlbW92ZSBmaXJzdCBhbmQgbGFzdCAyIG5ld2xpbmVzXG5cblx0XHRcdHhtbDogYFxuXG4gIDxBY3Rpb24gTmFtZT1cImluY3JlYXNlQW5kQ2hlY2tQcmltZVwiIElzQm91bmQ9XCJ0cnVlXCI+XG5cdDxQYXJhbWV0ZXIgTmFtZT1cIl9pdFwiIFR5cGU9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHlcIi8+XG4gIDwvQWN0aW9uPlxuXG4gIDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLmluY3JlYXNlQW5kQ2hlY2tQcmltZShzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkpXCI+XG5cdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uU2lkZUVmZmVjdHNcIj5cblx0ICA8UmVjb3JkIFR5cGU9XCJDb21tb24uU2lkZUVmZmVjdHNUeXBlXCI+XG5cdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJUYXJnZXRQcm9wZXJ0aWVzXCI+XG5cdFx0ICA8Q29sbGVjdGlvbj5cblx0XHRcdDxTdHJpbmc+X2l0Lyo8L1N0cmluZz5cblx0XHQgIDwvQ29sbGVjdGlvbj5cblx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdCAgPC9SZWNvcmQ+XG5cdDwvQW5ub3RhdGlvbj5cblx0PEFubm90YXRpb24gVGVybT1cIkNvcmUuT3BlcmF0aW9uQXZhaWxhYmxlXCIgUGF0aD1cIl9pdC9PcGVyYXRpb25BdmFpbGFibGVcIi8+XG4gIDwvQW5ub3RhdGlvbnM+XG5cbmAuc2xpY2UoMiwgLTIpXG5cdFx0fVxuXHR9LFxuXG5cdHtcblx0XHRpZDogXCJjb2RlU2lkZUVmZmVjdFVuQm91bmRBY3Rpb25cIixcblx0XHRjb2RlOiB7XG5cdFx0XHRjZHM6IC8qIGNkcyAqLyBgXG5cdHNlcnZpY2UgU2VydmljZSB7XG5cdFx0QENvbW1vbi5TaWRlRWZmZWN0cyA6IHtcblx0XHRcdFRhcmdldFByb3BlcnRpZXM6IFsnL3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL1Jvb3RFbnRpdHknXVxuXHRcdH1cblx0XHRhY3Rpb24gdW5Cb3VuZEFjdGlvbigpO1xuXHR9XG5cbmAuc2xpY2UoMiwgLTIpLCAvLyByZW1vdmUgZmlyc3QgYW5kIGxhc3QgMiBuZXdsaW5lc1xuXG5cdFx0XHR4bWw6IGBcblxuPGVkbXg6RGF0YVNlcnZpY2VzPlxuXHQ8U2NoZW1hIE5hbWVzcGFjZT1cInNhcC5mZS5jb3JlLlNlcnZpY2VcIiB4bWxucz1cImh0dHA6Ly9kb2NzLm9hc2lzLW9wZW4ub3JnL29kYXRhL25zL2VkbVwiPlxuXHRcdDxFbnRpdHlDb250YWluZXIgTmFtZT1cIkVudGl0eUNvbnRhaW5lclwiPlxuXHRcdFx0PEFjdGlvbkltcG9ydCBOYW1lPVwidW5Cb3VuZEFjdGlvblwiIEFjdGlvbj1cInNhcC5mZS5jb3JlLlNlcnZpY2UudW5Cb3VuZEFjdGlvblwiLz5cblx0XHQ8L0VudGl0eUNvbnRhaW5lcj5cblx0XHQ8QWN0aW9uIE5hbWU9XCJ1bkJvdW5kQWN0aW9uXCIgSXNCb3VuZD1cImZhbHNlXCIvPlxuXHRcdDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLlVuYm91bmRBY3Rpb24oKVwiPlxuXHRcdFx0PEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5TaWRlRWZmZWN0c1wiPlxuXHRcdFx0XHQ8UmVjb3JkIFR5cGU9XCJDb21tb24uU2lkZUVmZmVjdHNUeXBlXCI+XG5cdFx0XHRcdFx0PFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJUYXJnZXRFbnRpdGllc1wiPlxuXHRcdFx0XHRcdFx0PENvbGxlY3Rpb24+XG5cdFx0XHRcdFx0XHRcdDxOYXZpZ2F0aW9uUHJvcGVydHlQYXRoPlwiL3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL1Jvb3RFbnRpdHlcIjwvTmF2aWdhdGlvblByb3BlcnR5UGF0aD5cblx0XHRcdFx0XHRcdDwvQ29sbGVjdGlvbj5cblx0XHRcdFx0XHQ8L1Byb3BlcnR5VmFsdWU+XG5cdFx0XHRcdDwvUmVjb3JkPlxuXHRcdFx0PC9Bbm5vdGF0aW9uPlxuXHRcdDwvQW5ub3RhdGlvbnM+XG5cdDwvU2NoZW1hPlxuPC9lZG14OkRhdGFTZXJ2aWNlcz5cblxuYC5zbGljZSgyLCAtMilcblx0XHR9XG5cdH0sXG5cdHtcblx0XHRpZDogXCJjb2RlU2lkZUVmZmVjdFRhcmdldEVudGl0eVwiLFxuXHRcdGNvZGU6IHtcblx0XHRcdGNkczogLyogY2RzICovIGBcblxuYW5ub3RhdGUgUm9vdEVudGl0eSB3aXRoIEAoXG4gICAgQ29tbW9uLlNpZGVFZmZlY3RzICNCdXNpbmVzc1BhcnRuZXIgOiB7XG4gICAgICAgIFNvdXJjZVByb3BlcnRpZXMgOiBbQnVzaW5lc3NQYXJ0bmVySURdLFxuICAgICAgICBUYXJnZXRFbnRpdGllcyAgIDogW2J1c2luZXNzUGFydG5lcl1cbiAgICB9XG4pO1xuLi4uXG5zZXJ2aWNlIFNlcnZpY2Uge1xuICAgIGVudGl0eSBSb290RW50aXR5ICAgICAgICAgICAgIGFzIHByb2plY3Rpb24gb24gY29yZS5Sb290RW50aXR5IGFjdGlvbnMge1xuICAgIC4uLlxuICAgICAgICBAKFxuICAgICAgICAgICAgQ29tbW9uLlNpZGVFZmZlY3RzICNJbnZhbGlkYXRlQ2FjaGVkVmFsdWVIZWxwIDoge1xuICAgICAgICAgICAgICAgIFRhcmdldFByb3BlcnRpZXMgOiBbJ19pdC9CdXNpbmVzc1BhcnRuZXJJRCddLFxuICAgICAgICAgICAgICAgIFRhcmdldEVudGl0aWVzIDogWycvc2FwLmZlLmNvcmUuU2VydmljZS5FbnRpdHlDb250YWluZXIvQnVzaW5lc3NQYXJ0bmVyQWRkcmVzcyddXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2RzLm9kYXRhLmJpbmRpbmdwYXJhbWV0ZXIubmFtZSA6ICdfaXQnXG4gICAgICAgIClcbiAgICAgICAgYWN0aW9uIGRlbGV0ZUJ1c2luZXNzUGFydG5lcigpO1xuICAgIH07XG4gICAgLi4uXG59XG4uLi5cblxuYC5zbGljZSgyLCAtMiksIC8vIHJlbW92ZSBmaXJzdCBhbmQgbGFzdCAyIG5ld2xpbmVzXG5cblx0XHRcdHhtbDogYFxuXG48QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5Sb290RW50aXR5XCI+XG4gICAgICAgIDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uU2lkZUVmZmVjdHNcIiBRdWFsaWZpZXI9XCJCdXNpbmVzc1BhcnRuZXJcIj5cbiAgICAgICAgICA8UmVjb3JkIFR5cGU9XCJDb21tb24uU2lkZUVmZmVjdHNUeXBlXCI+XG4gICAgICAgICAgICA8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlNvdXJjZVByb3BlcnRpZXNcIj5cbiAgICAgICAgICAgICAgPENvbGxlY3Rpb24+XG4gICAgICAgICAgICAgICAgPFByb3BlcnR5UGF0aD5CdXNpbmVzc1BhcnRuZXJJRDwvUHJvcGVydHlQYXRoPlxuICAgICAgICAgICAgICA8L0NvbGxlY3Rpb24+XG4gICAgICAgICAgICA8L1Byb3BlcnR5VmFsdWU+XG4gICAgICAgICAgICA8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRhcmdldEVudGl0aWVzXCI+XG4gICAgICAgICAgICAgIDxDb2xsZWN0aW9uPlxuICAgICAgICAgICAgICAgIDxOYXZpZ2F0aW9uUHJvcGVydHlQYXRoPmJ1c2luZXNzUGFydG5lcjwvTmF2aWdhdGlvblByb3BlcnR5UGF0aD5cbiAgICAgICAgICAgICAgPC9Db2xsZWN0aW9uPlxuICAgICAgICAgICAgPC9Qcm9wZXJ0eVZhbHVlPlxuICAgICAgICAgIDwvUmVjb3JkPlxuICAgICAgICA8L0Fubm90YXRpb24+XG48L0Fubm90YXRpb25zPlxuLi4uXG4gIDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLmRlbGV0ZUJ1c2luZXNzUGFydG5lcihzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkpXCI+XG5cdDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uU2lkZUVmZmVjdHNcIiBRdWFsaWZpZXI9XCJJbnZhbGlkYXRlQ2FjaGVkVmFsdWVIZWxwXCI+XG5cdCAgPFJlY29yZCBUeXBlPVwiQ29tbW9uLlNpZGVFZmZlY3RzVHlwZVwiPlxuXHRcdDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVGFyZ2V0UHJvcGVydGllc1wiPlxuXHRcdCAgPENvbGxlY3Rpb24+XG5cdFx0XHQ8U3RyaW5nPl9pdC9CdXNpbmVzc1BhcnRuZXJJRDwvU3RyaW5nPlxuXHRcdCAgPC9Db2xsZWN0aW9uPlxuXHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0XHQ8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRhcmdldEVudGl0aWVzXCI+XG5cdFx0ICA8Q29sbGVjdGlvbj5cblx0XHRcdDxOYXZpZ2F0aW9uUHJvcGVydHlQYXRoPi9zYXAuZmUuY29yZS5TZXJ2aWNlLkVudGl0eUNvbnRhaW5lci9CdXNpbmVzc1BhcnRuZXJBZGRyZXNzPC9OYXZpZ2F0aW9uUHJvcGVydHlQYXRoPlxuXHRcdCAgPC9Db2xsZWN0aW9uPlxuXHRcdDwvUHJvcGVydHlWYWx1ZT5cblx0ICA8L1JlY29yZD5cblx0PC9Bbm5vdGF0aW9uPlxuICA8L0Fubm90YXRpb25zPlxuXG5gLnNsaWNlKDIsIC0yKVxuXHRcdH1cblx0fSxcblxuXHR7XG5cdFx0aWQ6IFwiY29kZVNpZGVFZmZlY3RBYnNvbHV0ZVBhdGhcIixcblx0XHRjb2RlOiB7XG5cdFx0XHRjZHM6IC8qIGNkcyAqLyBgXG5cblxuICAgIGVudGl0eSBSb290RW50aXR5ICAgICAgICAgICAgIGFzIHByb2plY3Rpb24gb24gY29yZS5Sb290RW50aXR5IGFjdGlvbnMge1xuICAgICAgICBAKFxuICAgICAgICAgICAgQ29tbW9uLlNpZGVFZmZlY3RzICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICBUYXJnZXRQcm9wZXJ0aWVzIDogW1xuICAgICAgICAgICAgICAgICAgICAnL3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL0VudGl0aWVzU2luZ2xldG9uL0Jvb2xlYW5Qcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBUYXJnZXRFbnRpdGllcyA6IFsnL3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL0Fic29sdXRlRW50aXR5J11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjZHMub2RhdGEuYmluZGluZ3BhcmFtZXRlci5uYW1lIDogJ19pdCdcbiAgICAgICAgKVxuICAgICAgICBhY3Rpb24gYWRkUm91bmQoKTtcbiAgICAgICAgQChcbiAgICAgICAgICAgIENvbW1vbi5TaWRlRWZmZWN0cyAgICAgICAgICAgICAgOiB7XG4gICAgICAgICAgICAgICAgVGFyZ2V0UHJvcGVydGllcyA6IFtcbiAgICAgICAgICAgICAgICAgICAgJy9zYXAuZmUuY29yZS5TZXJ2aWNlLkVudGl0eUNvbnRhaW5lci9FbnRpdGllc1NpbmdsZXRvbi9Cb29sZWFuUHJvcGVydHknLFxuICAgICAgICAgICAgICAgIF0sXG4gICAgICAgICAgICAgICAgVGFyZ2V0RW50aXRpZXMgOiBbJy9zYXAuZmUuY29yZS5TZXJ2aWNlLkVudGl0eUNvbnRhaW5lci9BYnNvbHV0ZUVudGl0eSddXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2RzLm9kYXRhLmJpbmRpbmdwYXJhbWV0ZXIubmFtZSA6ICdfaXQnXG4gICAgICAgIClcbiAgICAgICAgYWN0aW9uIHN0b3BSb3VuZCgpO1xuICAgICAgICBAKFxuICAgICAgICAgICAgQ29tbW9uLlNpZGVFZmZlY3RzICAgICAgICAgICAgICA6IHtcbiAgICAgICAgICAgICAgICBUYXJnZXRQcm9wZXJ0aWVzIDogW1xuICAgICAgICAgICAgICAgICAgICAnL3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL0VudGl0aWVzU2luZ2xldG9uL0Jvb2xlYW5Qcm9wZXJ0eScsXG4gICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICBUYXJnZXRFbnRpdGllcyA6IFsnL3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL0Fic29sdXRlRW50aXR5J11cbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjZHMub2RhdGEuYmluZGluZ3BhcmFtZXRlci5uYW1lIDogJ19pdCdcbiAgICAgICAgKVxuICAgICAgICBhY3Rpb24gY2xlYXJSb3VuZHMoKTtcbiAgICB9O1xuXG5gLnNsaWNlKDIsIC0yKSwgLy8gcmVtb3ZlIGZpcnN0IGFuZCBsYXN0IDIgbmV3bGluZXNcblxuXHRcdFx0eG1sOiBgXG5cdC4uLlxuICAgIDxTY2hlbWEgTmFtZXNwYWNlPVwic2FwLmZlLmNvcmUuU2VydmljZVwiIHhtbG5zPVwiaHR0cDovL2RvY3Mub2FzaXMtb3Blbi5vcmcvb2RhdGEvbnMvZWRtXCI+XG4gICAgICA8RW50aXR5Q29udGFpbmVyIE5hbWU9XCJFbnRpdHlDb250YWluZXJcIj5cbiAgICAgICAgPEVudGl0eVNldCBOYW1lPVwiQWJzb2x1dGVFbnRpdHlcIiBFbnRpdHlUeXBlPVwic2FwLmZlLmNvcmUuU2VydmljZS5BYnNvbHV0ZUVudGl0eVwiLz5cbiAgICAgICAgPFNpbmdsZXRvbiBOYW1lPVwiRW50aXRpZXNTaW5nbGV0b25cIiBUeXBlPVwic2FwLmZlLmNvcmUuU2VydmljZS5FbnRpdGllc1NpbmdsZXRvblwiLz5cbiAgICAgIDwvRW50aXR5Q29udGFpbmVyPlxuICAgICAgLi4uXG4gICAgIDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLmFkZFJvdW5kKHNhcC5mZS5jb3JlLlNlcnZpY2UuUm9vdEVudGl0eSlcIj5cbiAgICAgICAgPEFubm90YXRpb24gVGVybT1cIkNvbW1vbi5TaWRlRWZmZWN0c1wiPlxuICAgICAgICAgIDxSZWNvcmQgVHlwZT1cIkNvbW1vbi5TaWRlRWZmZWN0c1R5cGVcIj5cbiAgICAgICAgICAgIDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVGFyZ2V0UHJvcGVydGllc1wiPlxuICAgICAgICAgICAgICA8Q29sbGVjdGlvbj5cbiAgICAgICAgICAgICAgICA8U3RyaW5nPi9zYXAuZmUuY29yZS5TZXJ2aWNlLkVudGl0eUNvbnRhaW5lci9FbnRpdGllc1NpbmdsZXRvbi9Cb29sZWFuUHJvcGVydHk8L1N0cmluZz5cbiAgICAgICAgICAgICAgPC9Db2xsZWN0aW9uPlxuICAgICAgICAgICAgPC9Qcm9wZXJ0eVZhbHVlPlxuICAgICAgICAgICAgPFByb3BlcnR5VmFsdWUgUHJvcGVydHk9XCJUYXJnZXRFbnRpdGllc1wiPlxuICAgICAgICAgICAgICA8Q29sbGVjdGlvbj5cbiAgICAgICAgICAgICAgICA8TmF2aWdhdGlvblByb3BlcnR5UGF0aD4vc2FwLmZlLmNvcmUuU2VydmljZS5FbnRpdHlDb250YWluZXIvQWJzb2x1dGVFbnRpdHk8L05hdmlnYXRpb25Qcm9wZXJ0eVBhdGg+XG4gICAgICAgICAgICAgIDwvQ29sbGVjdGlvbj5cbiAgICAgICAgICAgIDwvUHJvcGVydHlWYWx1ZT5cbiAgICAgICAgICA8L1JlY29yZD5cbiAgICAgICAgPC9Bbm5vdGF0aW9uPlxuICAgICAgPC9Bbm5vdGF0aW9ucz5cbiAgICAgIDxBbm5vdGF0aW9ucyBUYXJnZXQ9XCJzYXAuZmUuY29yZS5TZXJ2aWNlLnN0b3BSb3VuZChzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkpXCI+XG4gICAgICAgIDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uU2lkZUVmZmVjdHNcIj5cbiAgICAgICAgICA8UmVjb3JkIFR5cGU9XCJDb21tb24uU2lkZUVmZmVjdHNUeXBlXCI+XG4gICAgICAgICAgICA8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRhcmdldFByb3BlcnRpZXNcIj5cbiAgICAgICAgICAgICAgPENvbGxlY3Rpb24+XG4gICAgICAgICAgICAgICAgPFN0cmluZz4vc2FwLmZlLmNvcmUuU2VydmljZS5FbnRpdHlDb250YWluZXIvRW50aXRpZXNTaW5nbGV0b24vQm9vbGVhblByb3BlcnR5PC9TdHJpbmc+XG4gICAgICAgICAgICAgIDwvQ29sbGVjdGlvbj5cbiAgICAgICAgICAgIDwvUHJvcGVydHlWYWx1ZT5cbiAgICAgICAgICAgIDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVGFyZ2V0RW50aXRpZXNcIj5cbiAgICAgICAgICAgICAgPENvbGxlY3Rpb24+XG4gICAgICAgICAgICAgICAgPE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg+L3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL0Fic29sdXRlRW50aXR5PC9OYXZpZ2F0aW9uUHJvcGVydHlQYXRoPlxuICAgICAgICAgICAgICA8L0NvbGxlY3Rpb24+XG4gICAgICAgICAgICA8L1Byb3BlcnR5VmFsdWU+XG4gICAgICAgICAgPC9SZWNvcmQ+XG4gICAgICAgIDwvQW5ub3RhdGlvbj5cbiAgICAgIDwvQW5ub3RhdGlvbnM+XG4gICAgICA8QW5ub3RhdGlvbnMgVGFyZ2V0PVwic2FwLmZlLmNvcmUuU2VydmljZS5jbGVhclJvdW5kcyhzYXAuZmUuY29yZS5TZXJ2aWNlLlJvb3RFbnRpdHkpXCI+XG4gICAgICAgIDxBbm5vdGF0aW9uIFRlcm09XCJDb21tb24uU2lkZUVmZmVjdHNcIj5cbiAgICAgICAgICA8UmVjb3JkIFR5cGU9XCJDb21tb24uU2lkZUVmZmVjdHNUeXBlXCI+XG4gICAgICAgICAgICA8UHJvcGVydHlWYWx1ZSBQcm9wZXJ0eT1cIlRhcmdldFByb3BlcnRpZXNcIj5cbiAgICAgICAgICAgICAgPENvbGxlY3Rpb24+XG4gICAgICAgICAgICAgICAgPFN0cmluZz4vc2FwLmZlLmNvcmUuU2VydmljZS5FbnRpdHlDb250YWluZXIvRW50aXRpZXNTaW5nbGV0b24vQm9vbGVhblByb3BlcnR5PC9TdHJpbmc+XG4gICAgICAgICAgICAgIDwvQ29sbGVjdGlvbj5cbiAgICAgICAgICAgIDwvUHJvcGVydHlWYWx1ZT5cbiAgICAgICAgICAgIDxQcm9wZXJ0eVZhbHVlIFByb3BlcnR5PVwiVGFyZ2V0RW50aXRpZXNcIj5cbiAgICAgICAgICAgICAgPENvbGxlY3Rpb24+XG4gICAgICAgICAgICAgICAgPE5hdmlnYXRpb25Qcm9wZXJ0eVBhdGg+L3NhcC5mZS5jb3JlLlNlcnZpY2UuRW50aXR5Q29udGFpbmVyL0Fic29sdXRlRW50aXR5PC9OYXZpZ2F0aW9uUHJvcGVydHlQYXRoPlxuICAgICAgICAgICAgICA8L0NvbGxlY3Rpb24+XG4gICAgICAgICAgICA8L1Byb3BlcnR5VmFsdWU+XG4gICAgICAgICAgPC9SZWNvcmQ+XG4gICAgICAgIDwvQW5ub3RhdGlvbj5cbiAgICAgIDwvQW5ub3RhdGlvbnM+XG5cbmAuc2xpY2UoMiwgLTIpXG5cdFx0fVxuXHR9XG5dO1xuXG5leHBvcnQgZGVmYXVsdCBQYWdlQ29udHJvbGxlci5leHRlbmQoXCJzYXAuZmUuY29yZS5mcG1FeHBsb3Jlci5ndWlkYW5jZVNpZGVFZmZlY3RzLkVudHJ5UGFnZVwiLCB7XG5cdG9uSW5pdDogZnVuY3Rpb24gKHRoaXM6IFBhZ2VDb250cm9sbGVyKSB7XG5cdFx0UGFnZUNvbnRyb2xsZXIucHJvdG90eXBlLm9uSW5pdC5hcHBseSh0aGlzKTtcblx0XHRjb25zdCB1aU1vZGVsOiBKU09OTW9kZWwgPSBuZXcgSlNPTk1vZGVsKHsgaXNFZGl0YWJsZTogdHJ1ZSB9KTtcblx0XHR0aGlzLmdldFZpZXcoKS5zZXRNb2RlbCh1aU1vZGVsLCBcInVpXCIpO1xuXHRcdGZvciAoY29uc3Qgb1NuaXBwZXQgb2YgQ09ERVNOSVBQRVRTKSB7XG5cdFx0XHRjb25zdCBvRWRpdG9yOiBDb2RlRWRpdG9yID0gdGhpcy5ieUlkKG9TbmlwcGV0LmlkKSBhcyBDb2RlRWRpdG9yO1xuXHRcdFx0b0VkaXRvci5zZXRWYWx1ZShvU25pcHBldC5jb2RlLmNkcyk7XG5cdFx0XHRvRWRpdG9yLnNldE1heExpbmVzKDIwKTtcblx0XHR9XG5cdH0sXG5cblx0b25TZWxlY3RUYWI6IGZ1bmN0aW9uIChvRXZlbnQ6IGFueSkge1xuXHRcdGNvbnN0IHNGaWx0ZXJJZCA9IG9FdmVudC5nZXRQYXJhbWV0ZXIoXCJzZWxlY3RlZEtleVwiKTsgLy9lLmcuIGNvZGVTaWRlRWZmZWN0U2luZ2xlU291cmNlQ0RTXG5cdFx0Y29uc3QgY29kZUVkaXRvcklkID0gc0ZpbHRlcklkLnN1YnN0cigwLCBzRmlsdGVySWQubGVuZ3RoIC0gMyk7IC8vZS5nLiBjb2RlU2lkZUVmZmVjdFNpbmdsZVNvdXJjZVxuXHRcdGNvbnN0IHNuaXBwZXQgPSBzRmlsdGVySWQuc3Vic3RyKHNGaWx0ZXJJZC5sZW5ndGggLSAzKS50b0xvd2VyQ2FzZSgpIGFzIGtleW9mIHNuaXBwZXRUeXBlOyAvL2UuZy4gY2RzIG9yIHhtbFxuXHRcdGNvbnN0IG9FZGl0b3IgPSB0aGlzLmJ5SWQoY29kZUVkaXRvcklkKSBhcyBDb2RlRWRpdG9yO1xuXHRcdC8vYWNjZXNzIGNvZGUgc25pcHBldCBieSB0eXBlLCBhbmQgc2V0IGVkaXRvciB0eXBlIGFjY29yZGluZ2x5XG5cdFx0b0VkaXRvci5zZXRWYWx1ZShDT0RFU05JUFBFVFMuZmluZCgoeCkgPT4geC5pZCA9PT0gY29kZUVkaXRvcklkKT8uY29kZVtzbmlwcGV0XSk/LnNldFR5cGUoc25pcHBldCAhPSBcImNkc1wiID8gc25pcHBldCA6IFwicmVkXCIpO1xuXHR9LFxuXG5cdG9uUHJlc3M6IGZ1bmN0aW9uIChvRXZlbnQ6IGFueSkge1xuXHRcdCh0aGlzIGFzIGFueSkuZWRpdEZsb3cuaW52b2tlQWN0aW9uKFwic2FwLmZlLmNvcmUuU2VydmljZS5pbmNyZWFzZUFuZENoZWNrUHJpbWVcIiwge1xuXHRcdFx0Y29udGV4dHM6IG9FdmVudC5nZXRTb3VyY2UoKS5nZXRCaW5kaW5nQ29udGV4dCgpXG5cdFx0fSk7XG5cdH0sXG5cblx0b25BZGRSb3VuZDogZnVuY3Rpb24gKG9FdmVudDogYW55KSB7XG5cdFx0KHRoaXMgYXMgYW55KS5lZGl0Rmxvdy5pbnZva2VBY3Rpb24oXCJzYXAuZmUuY29yZS5TZXJ2aWNlLmFkZFJvdW5kXCIsIHtcblx0XHRcdGNvbnRleHRzOiBvRXZlbnQuZ2V0U291cmNlKCkuZ2V0QmluZGluZ0NvbnRleHQoKSxcblx0XHRcdGludm9jYXRpb25Hcm91cGluZzogXCJDaGFuZ2VTZXRcIlxuXHRcdH0pO1xuXHR9LFxuXG5cdG9uVW5Cb3VuZEFjdGlvbjogZnVuY3Rpb24gKG9FdmVudDogYW55KSB7XG5cdFx0KHRoaXMgYXMgYW55KS5lZGl0Rmxvdy5pbnZva2VBY3Rpb24oXCJzYXAuZmUuY29yZS5TZXJ2aWNlLkVudGl0eUNvbnRhaW5lci91bkJvdW5kQWN0aW9uXCIsIHtcblx0XHRcdG1vZGVsOiBvRXZlbnQuZ2V0U291cmNlKCkuZ2V0TW9kZWwoKSxcblx0XHRcdGludm9jYXRpb25Hcm91cGluZzogXCJDaGFuZ2VTZXRcIlxuXHRcdH0pO1xuXHR9LFxuXG5cdG9uU3RhcnRSb3VuZDogZnVuY3Rpb24gKG9FdmVudDogYW55KSB7XG5cdFx0dGhpcy5vbkNsZWFyUm91bmRzKG9FdmVudCk7XG5cdFx0dGhpcy5vbkFkZFJvdW5kKG9FdmVudCk7XG5cdH0sXG5cblx0b25TdG9wUm91bmQ6IGZ1bmN0aW9uIChvRXZlbnQ6IGFueSkge1xuXHRcdCh0aGlzIGFzIGFueSkuZWRpdEZsb3cuaW52b2tlQWN0aW9uKFwic2FwLmZlLmNvcmUuU2VydmljZS5zdG9wUm91bmRcIiwge1xuXHRcdFx0Y29udGV4dHM6IG9FdmVudC5nZXRTb3VyY2UoKS5nZXRCaW5kaW5nQ29udGV4dCgpXG5cdFx0fSk7XG5cdH0sXG5cblx0b25DbGVhclJvdW5kczogZnVuY3Rpb24gKG9FdmVudDogYW55KSB7XG5cdFx0KHRoaXMgYXMgYW55KS5lZGl0Rmxvdy5pbnZva2VBY3Rpb24oXCJzYXAuZmUuY29yZS5TZXJ2aWNlLmNsZWFyUm91bmRzXCIsIHtcblx0XHRcdGNvbnRleHRzOiBvRXZlbnQuZ2V0U291cmNlKCkuZ2V0QmluZGluZ0NvbnRleHQoKSxcblx0XHRcdGludm9jYXRpb25Hcm91cGluZzogXCJDaGFuZ2VTZXRcIlxuXHRcdH0pO1xuXHR9LFxuXG5cdG9uRGVsZXRlQnVzaW5lc3NQYXJ0bmVyOiBmdW5jdGlvbiAob0V2ZW50OiBhbnkpIHtcblx0XHQodGhpcyBhcyBhbnkpLmVkaXRGbG93Lmludm9rZUFjdGlvbihcInNhcC5mZS5jb3JlLlNlcnZpY2UuZGVsZXRlQnVzaW5lc3NQYXJ0bmVyXCIsIHtcblx0XHRcdGNvbnRleHRzOiBvRXZlbnQuZ2V0U291cmNlKCkuZ2V0QmluZGluZ0NvbnRleHQoKVxuXHRcdH0pO1xuXHR9XG59KTtcbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztFQU1BLE1BQU1BLFlBQWdDLEdBQUcsQ0FDeEM7RUFDQTtJQUNDQyxFQUFFLEVBQUUsNEJBQTRCO0lBQ2hDQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQUU7O01BRWJDLEdBQUcsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1g7RUFDRCxDQUFDLEVBRUQ7SUFDQ0gsRUFBRSxFQUFFLDJCQUEyQjtJQUMvQkMsSUFBSSxFQUFFO01BQ0xDLEdBQUcsRUFBRSxTQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUFFOztNQUViQyxHQUFHLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0QsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDWDtFQUNELENBQUMsRUFFRDtJQUNDSCxFQUFFLEVBQUUsNkJBQTZCO0lBQ2pDQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQUU7O01BRWJDLEdBQUcsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0QsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDWDtFQUNELENBQUMsRUFFRDtJQUNDSCxFQUFFLEVBQUUsNkJBQTZCO0lBQ2pDQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQUU7O01BRWJDLEdBQUcsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNYO0VBQ0QsQ0FBQyxFQUVEO0lBQ0NILEVBQUUsRUFBRSw0QkFBNEI7SUFDaENDLElBQUksRUFBRTtNQUNMQyxHQUFHLEVBQUUsU0FBVTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUFFOztNQUViQyxHQUFHLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0QsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDWDtFQUNELENBQUMsRUFFRDtJQUNDSCxFQUFFLEVBQUUsc0JBQXNCO0lBQzFCQyxJQUFJLEVBQUU7TUFDTEMsR0FBRyxFQUFFLFNBQVU7QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUNDLEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7TUFBRTs7TUFFYkMsR0FBRyxFQUFFO0FBQ1I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNYO0VBQ0QsQ0FBQyxFQUVEO0lBQ0NILEVBQUUsRUFBRSw2QkFBNkI7SUFDakNDLElBQUksRUFBRTtNQUNMQyxHQUFHLEVBQUUsU0FBVTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUFFOztNQUViQyxHQUFHLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDLENBQUNELEtBQUssQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQ1g7RUFDRCxDQUFDLEVBQ0Q7SUFDQ0gsRUFBRSxFQUFFLDRCQUE0QjtJQUNoQ0MsSUFBSSxFQUFFO01BQ0xDLEdBQUcsRUFBRSxTQUFVO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUMsQ0FBQ0MsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztNQUFFOztNQUViQyxHQUFHLEVBQUU7QUFDUjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDRCxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUNYO0VBQ0QsQ0FBQyxFQUVEO0lBQ0NILEVBQUUsRUFBRSw0QkFBNEI7SUFDaENDLElBQUksRUFBRTtNQUNMQyxHQUFHLEVBQUUsU0FBVTtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQyxDQUFDQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO01BQUU7O01BRWJDLEdBQUcsRUFBRTtBQUNSO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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