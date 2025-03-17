service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                  : Integer @title: 'Identifier';
        TitleProperty       : String  @title: 'Title'        @readonly: true;
        DescriptionProperty : String  @title: 'Description'  @readonly: true;
        BooleanProperty     : Boolean @title: 'Enable Unbound Action';
        DialogProperty      : Boolean @title: 'Always Show Confirmation Dialog';
        UIHiddenProperty    : String  @UI.Hidden;
        _Child              : Composition of many ChildEntity
                                on _Child.Parent = $self;
  } actions {
    @(
      Common.SideEffects             : {TargetProperties: ['_it/BooleanProperty']},
      cds.odata.bindingparameter.name: '_it'
    )
    action boundAction();
    action boundActionWithParameters(Parameter1 : String, Parameter2 : String);
  }

  action unboundAction();

  annotate RootEntity with
  @(UI: {
    HeaderInfo                          : {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities',
      Title         : {
        $Type: 'UI.DataField',
        Value: TitleProperty
      }
    },
    HeaderFacets                        : [{
      $Type : 'UI.ReferenceFacet',
      ID    : 'HeaderFacetIdentifier1',
      Target: '@UI.FieldGroup#HeaderGeneralInformation'
    }],
    Facets                              : [{
      $Type : 'UI.ReferenceFacet',
      ID    : 'FacetIdentifier1',
      Target: '_Child/@UI.LineItem'
    }],
    FieldGroup #HeaderGeneralInformation: {Data: [
      {
        $Type: 'UI.DataField',
        Value: DescriptionProperty
      },
      {
        $Type: 'UI.DataField',
        Value: BooleanProperty
      },
      {
        $Type: 'UI.DataField',
        Value: DialogProperty
      }
    ]}
  });

  entity ChildEntity {
    key ID                       : Integer @title: 'Child Identifier';
        ChildTitleProperty       : String  @title: 'Child Title';
        ChildDescriptionProperty : String  @title: 'Child Description';
        Parent                   : Association to RootEntity;
  } actions {
    @(
      Common.SideEffects             : {TargetProperties: ['_it/ChildTitleProperty']},
      cds.odata.bindingparameter.name: '_it'
    )
    action boundActionSetTitle(Title : String);
  }

  annotate ChildEntity with @(UI: {
    HeaderInfo: {
      TypeName      : 'Child Entity',
      TypeNamePlural: 'Child Entities',
      TypeImageUrl  : 'sap-icon://alert',
      Title         : {
        $Type: 'UI.DataField',
        Value: ChildTitleProperty
      }
    },
    Facets    : [{
      $Type : 'UI.ReferenceFacet',
      ID    : 'FacetIdentifier1',
      Target: '@UI.FieldGroup'
    }],
    LineItem  : [
      {Value: ID},
      {Value: ChildTitleProperty},
      {Value: ChildDescriptionProperty}
    ],
    FieldGroup: {Data: [{
      $Type: 'UI.DataField',
      Value: ChildDescriptionProperty
    }]}
  });
}
