import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';

import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls';

import * as strings from 'CalendarWebPartStrings';
import Calendar from './components/Calendar';
import { ICalendarProps } from './components/ICalendarProps';

export interface ICalendarWebPartProps {
  siteUrl: string;
  listTitle: string;
  startDateField: string,
  endDateField: string
  interactive: boolean;
  defaultView: string;
}

export default class CalendarWebPart extends BaseClientSideWebPart<ICalendarWebPartProps> {


  public render(): void {
    const element: React.ReactElement<ICalendarProps> = React.createElement(
      Calendar,
      {
        siteUrl: this.properties.siteUrl || this.context.pageContext.web.absoluteUrl,
        listTitle: this.properties.listTitle,
        startDateField: this.properties.startDateField,
        endDateField: this.properties.endDateField,
        interactive: this.properties.interactive,
        defaultView: this.properties.defaultView,
      }
    );

    ReactDom.render(element, this.domElement);
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected get disableReactivePropertyChanges(): boolean {
    return true;
  }

  protected listFields(propertyPath: string, oldValue: any, newValue: any): void {
      super.onPropertyPaneFieldChanged(propertyPath, oldValue, newValue);
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('siteUrl', {
                  label: strings.SiteUrlLabel
                }),
                PropertyFieldListPicker('listTitle', {
                  label: strings.ListTitle,
                  selectedList: this.properties.listTitle,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.listFields.bind(this),
                  properties: this.properties,
                  context: this.context,
                  webAbsoluteUrl: this.properties.siteUrl || this.context.pageContext.web.absoluteUrl,
                  onGetErrorMessage: null,
                  deferredValidationTime: 0,
                  key: 'listPickerFieldId'
                }),
                PropertyPaneTextField("startDateField", {
                  label: strings.StartDateField
                  //options: this.fieldsListCollection,
                  //selectedKey: this.selectedStartDate,
                }),
                PropertyPaneTextField("endDateField", {
                  label: strings.EndDateField
                  //options: this.fieldsListCollection,
                  //selectedKey: this.selectedEndDate
                }),
                PropertyPaneToggle('interactive', {
                  label: strings.Interactive
                }),
                PropertyPaneDropdown('defaultView', {
                  label: strings.DefaultView,
                  selectedKey: 'dayGridMonth',
                  options: [
                    { key: 'dayGridMonth', text: 'Month', },
                    { key: 'timeGridWeek', text: 'Week' },
                    { key: 'timeGridDay', text: 'Day' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
