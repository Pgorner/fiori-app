service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                  : Integer  @Core.Computed  @title: 'Identifier';
        TitleProperty       : String   @title: 'Title';
        DescriptionProperty : String   @title: 'Description';
        NameProperty        : String   @title: 'Name';
        footer              : String   @title: 'Quarter';
        unit                : String   @title: 'Unit of Measure';
        kpivalue            : Integer  @title: 'Value';
        scale               : String   @title: 'Scale';
        color               : String   @title: 'Color';
        trend               : String   @title: 'Trend';
        items               : Association to many ChildEntity
                                on items.Parent = $self;
  }

  entity ChildEntity {
    key ID                    : Integer @title: 'Item Identifier';
        StringProperty        : String  @title: 'String';
        TextProperty          : String  @title: 'Text';
        PropertyWithValueHelp : String  @title: 'With Value Help';
        Parent                : Association to RootEntity;
  }

  entity ValueHelpEntity {
    key KeyProp     : String(1)  @title: 'Value Help Key';

        @Core.Immutable
        Description : String(20) @title: 'Value Help Description';
  }

  annotate RootEntity with
  @(
    UI                                       : {
      PresentationVariant           : {Visualizations: ['@UI.LineItem']},
      SelectionFields               : [ID],
      HeaderInfo                    : {
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
      },
      Facets                        : [
        {
          $Type : 'UI.ReferenceFacet',
          Label : 'General Information',
          Target: '@UI.FieldGroup#GeneralInformation',
        },
        {
          $Type : 'UI.ReferenceFacet',
          Label : 'Details',
          Target: 'items/@UI.LineItem'
        }
      ],
      FieldGroup #GeneralInformation: {
        $Type: 'UI.FieldGroupType',
        Label: 'General Information',
        Data : [
          {
            $Type: 'UI.DataField',
            Value: TitleProperty,
          },
          {
            $Type: 'UI.DataField',
            Value: NameProperty,
          },
          {
            $Type: 'UI.DataField',
            Value: DescriptionProperty
          },
        ],
      },
      LineItem                      : [
        {Value: ID},
        {Value: TitleProperty},
        {Value: DescriptionProperty},
        {Value: NameProperty}
      ]
    },
    Capabilities.DeleteRestrictions.Deletable: false
  );

  annotate ChildEntity with @(UI: {
    HeaderInfo    : {
      TypeName      : 'Child Entity',
      TypeNamePlural: 'Child Entities',
      Title         : {
        $Type: 'UI.DataField',
        Value: ID
      }
    },

    Facets        : [{
      $Type            : 'UI.ReferenceFacet',
      Label            : 'Details',
      Target           : '@UI.Identification',
      ![@UI.Importance]: #High
    }],


    Identification: [

    {
      $Type            : 'UI.DataField',
      Value            : ID,
      ![@UI.Importance]: #High
    }],

    LineItem      : [
      {Value: ID},
      {Value: PropertyWithValueHelp},
      {Value: StringProperty},
      {Value: TextProperty}
    ]
  }) {
    PropertyWithValueHelp @(Common: {ValueList: {
      Label         : 'Value with Value Help',
      CollectionPath: 'ValueHelpEntity',
      Parameters    : [
        {
          $Type            : 'Common.ValueListParameterInOut',
          LocalDataProperty: PropertyWithValueHelp,
          ValueListProperty: 'KeyProp'
        },
        {
          $Type            : 'Common.ValueListParameterDisplayOnly',
          ValueListProperty: 'Description'
        }
      ]
    }});
  }
}
