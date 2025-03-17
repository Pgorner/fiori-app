service Service {
  @odata.draft.enabled
  entity RootEntity {
    key ID                      : Integer       @title: 'Identifier';
        TitleProperty           : String        @title: 'Title';
        DescriptionProperty     : String        @title: 'Description';
        NameProperty            : String        @title: 'Some Text';
        Rating                  : Decimal(4, 2) @title: 'Rating';
        OverallSDProcessStatus  : String(1)     @(
          Core.Immutable: true,
          Common        : {
            Text                    : _OverallSDProcessStatus.OverallSDProcessStatus_Text,
            IsUpperCase             : true,
            Label                   : 'Overall Status',
            ValueListWithFixedValues: false,
            ValueList               : {
              Label         : 'Overall SD Process Status',
              CollectionPath: 'OverallSDProcessStatus',
              Parameters    : [
                {
                  $Type            : 'Common.ValueListParameterInOut',
                  LocalDataProperty: OverallSDProcessStatus,
                  ValueListProperty: 'OverallSDProcessStatus'
                },
                {
                  $Type            : 'Common.ValueListParameterDisplayOnly',
                  ValueListProperty: 'OverallSDProcessStatus_Text'
                }
              ]
            }
          }
        );

        _OverallSDProcessStatus : Association to OverallSDProcessStatus
                                    on _OverallSDProcessStatus.OverallSDProcessStatus = OverallSDProcessStatus;
  } actions {
    @(cds.odata.bindingparameter.name: '_it')
    action updateRating();
    @(cds.odata.bindingparameter.name: '_it')
    action updateStatus();
  }

  entity OverallSDProcessStatus                  @(title: 'Overall SD Process Status') {
    key OverallSDProcessStatus      : String(1)  @(
          Common: {Text: OverallSDProcessStatus_Text},
          title : 'Overall Status'
        );
        OverallSDProcessStatus_Text : String(20) @(
          Core.Immutable: true,
          Common        : {
            Label    : 'Description',
            QuickInfo: 'Status Description'
          }
        );
        StatusCriticality           : Integer;
  }

  annotate RootEntity with
  @(UI: {
    PresentationVariant                          : {Visualizations: ['@UI.LineItem']},
    PresentationVariant #Rating                  : {Visualizations: ['@UI.LineItem#Rating']},
    PresentationVariant #Status                  : {Visualizations: ['@UI.LineItem#Status']},
    HeaderInfo                                   : {
      TypeName      : 'Root Entity',
      TypeNamePlural: 'Root Entities'
    },
    SelectionFields                              : [ID],
    DataPoint #Rating                            : {
      Value        : Rating,
      TargetValue  : 5.0,
      Title        : 'Rating',
      Visualization: #Rating
    },
    FieldGroup #multipleFields                   : {
      $Type: 'UI.FieldGroupType',
      Data : [{
        $Type : 'UI.DataFieldForAnnotation',
        Target: '@UI.DataPoint#Rating',
      }, ],
    },
    LineItem                                     : [
      {Value: ID},
      {Value: TitleProperty},
      {
        $Type : 'UI.DataFieldForAnnotation',
        Target: '@UI.FieldGroup#multipleFields',
        Label : 'Rating'
      },
      {
        $Type                : 'UI.DataField',
        Value                : OverallSDProcessStatus,
        Criticality          : _OverallSDProcessStatus.StatusCriticality,
        ![@HTML5.CssDefaults]: {width: '10em'}
      },
    ],
    LineItem #Rating                             : [
      {Value: ID},
      {Value: TitleProperty},
      {
        $Type : 'UI.DataFieldForAnnotation',
        Target: '@UI.FieldGroup#multipleFields',
        Label : 'Rating'
      }
    ],
    LineItem #Status                             : [
      {Value: ID},
      {Value: TitleProperty},
      {
        $Type                : 'UI.DataField',
        Value                : OverallSDProcessStatus,
        Criticality          : _OverallSDProcessStatus.StatusCriticality,
        ![@HTML5.CssDefaults]: {width: '10em'}
      },
    ],
    SelectionPresentationVariant #GoodRating     : {
      Text               : 'Good Rating',
      SelectionVariant   : {
        Text         : 'Good Rating',
        SelectOptions: [{
          $Type       : 'UI.SelectOptionType',
          PropertyName: Rating,
          Ranges      : [
            {
              Option: #EQ,
              Low   : '5',
              Sign  : #I
            },
            {
              Option: #EQ,
              Low   : '4',
              Sign  : #I
            }
          ]
        }]
      },
      PresentationVariant: ![@UI.PresentationVariant#Rating]
    },
    SelectionPresentationVariant #BadRating      : {
      Text               : 'Bad Rating',
      SelectionVariant   : {
        Text         : 'Bad Rating',
        SelectOptions: [{
          $Type       : 'UI.SelectOptionType',
          PropertyName: Rating,
          Ranges      : [
            {
              Option: #EQ,
              Low   : '2',
              Sign  : #I
            },
            {
              Option: #EQ,
              Low   : '1',
              Sign  : #I
            }
          ]
        }]
      },
      PresentationVariant: ![@UI.PresentationVariant#Rating]
    },

    SelectionPresentationVariant #OpenStatus     : {
      Text               : 'Open Status',
      SelectionVariant   : {
        Text         : 'Open Status',
        SelectOptions: [{
          $Type       : 'UI.SelectOptionType',
          PropertyName: OverallSDProcessStatus,
          Ranges      : [{
            Option: #EQ,
            Low   : 'A',
            Sign  : #I
          }]
        }]
      },
      PresentationVariant: ![@UI.PresentationVariant#Status]
    },
    SelectionPresentationVariant #CompletedStatus: {
      Text               : 'Completed Status',
      SelectionVariant   : {
        Text         : 'Completed Status',
        SelectOptions: [{
          $Type       : 'UI.SelectOptionType',
          PropertyName: OverallSDProcessStatus,
          Ranges      : [{
            Option: #EQ,
            Low   : 'D',
            Sign  : #I
          }]
        }]
      },
      PresentationVariant: ![@UI.PresentationVariant#Status]
    },
    SelectionVariant #All                        : {
      Text         : 'All',
      SelectOptions: [
        {
          $Type       : 'UI.SelectOptionType',
          PropertyName: Rating
        },
        {
          $Type       : 'UI.SelectOptionType',
          PropertyName: OverallSDProcessStatus
        }
      ]
    }
  });
}
