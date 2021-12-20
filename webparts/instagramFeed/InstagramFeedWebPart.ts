import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'InstagramFeedWebPartStrings';
import InstagramFeed from './components/InstagramFeed';
import { IInstagramFeedProps } from './components/IInstagramFeedProps';
import { SPComponentLoader } from '@microsoft/sp-loader'
import { Loading } from '../../shared/Loading'

export interface IInstagramFeedWebPartProps {
  columns: string;
  rows: string;
  source: string;
}

export default class InstagramFeedWebPart extends BaseClientSideWebPart<IInstagramFeedWebPartProps> {

  public render(): void {

    console.log("render web part.");


    ReactDom.render(React.createElement(
      InstagramFeed,
      this.properties
    ), this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('rows', {
                  label: 'How many rows to show at full width'
                }),
                PropertyPaneTextField('columns', {
                  label: 'How many columns to show at full width'
                }),
                PropertyPaneTextField('source', {
                  label: 'User (@microsoft) or hashtag (#sharepoint) to display'
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
