service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                  : Integer @title: 'Identifier';
        TitleProperty       : String  @title: 'Title';
        DescriptionProperty : String  @title: 'Description';
        NameProperty        : String  @title: 'Name';
        items               : Association to many ChildEntity
                                on items.Parent = $self;
  }

  entity ChildEntity {
    key ID              : Integer @title: 'Item Identifier';
        BooleanProperty : Boolean @title: 'Button Active';
        TextProperty    : String  @title: 'Text from Meta Model';
        Parent          : Association to RootEntity;
  }

  annotate RootEntity with
  @(
    UI                                       : {
      HeaderInfo: {
        TypeName      : 'Root Entity',
        TypeNamePlural: 'Root Entities',
        Title         : {
          $Type: 'UI.DataField',
          Value: NameProperty
        },
        Description   : {
          $Type: 'UI.DataField',
          Value: DescriptionProperty
        }
      },
      Facets    : [{
        $Type : 'UI.ReferenceFacet',
        Label : '{@i18n>tableWithCustomColumns}',
        Target: 'items/@UI.LineItem',
      }],
    },
    Capabilities.DeleteRestrictions.Deletable: false
  );

  annotate ChildEntity with @(UI: {LineItem: [{Value: BooleanProperty}]}) {
    ID;
    Parent;
  };
}
