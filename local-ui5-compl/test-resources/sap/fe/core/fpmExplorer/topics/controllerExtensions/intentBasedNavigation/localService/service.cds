service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                  : Integer       @title: 'Identifier';
        TitleProperty       : String        @title: 'Title';
        DescriptionProperty : String        @title: 'Description';
        NameProperty        : String        @title: 'Some Text';
        NumberProperty      : Decimal(4, 2) @title: 'Number';
        Currency            : String        @title: 'Currency';
        BooleanProperty     : Boolean       @title: 'Boolean';
        Progress            : Decimal(4, 1) @title: 'Progress';
  }

  annotate RootEntity with
  @(
    UI                                       : {HeaderInfo: {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities',
      Title         : {
        $Type: 'UI.DataField',
        Value: TitleProperty
      },
      Description   : {
        $Type: 'UI.DataField',
        Value: DescriptionProperty
      }
    }},
    Capabilities.DeleteRestrictions.Deletable: false
  );
}
