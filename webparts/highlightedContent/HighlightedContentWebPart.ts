import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'HighlightedContentWebPartStrings';
import HighlightedContent from './components/HighlightedContent';
import { IHighlightedContentProps } from './components/IHighlightedContentProps';


export interface IHighlightedContentWebPartProps {
  speed: number,
  autoplaySpeed: number,
  dots: boolean
}

export default class HighlightedContentWebPart extends BaseClientSideWebPart<IHighlightedContentWebPartProps> {

  public render(): void {

    console.log(this.properties);

    const element: React.ReactElement<IHighlightedContentProps> = React.createElement(
      HighlightedContent,
      {
        siteUrl: this.context.pageContext.web.absoluteUrl,
        speed: this.properties.speed || 1000,
        autoplaySpeed: this.properties.autoplaySpeed || 5000,
        dots: this.properties.dots
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
                PropertyPaneSlider('autoplaySpeed', {
                  label: 'Time to display each slide (ms)',
                  min: 1000,
                  max: 10000,
                  value: 5000,
                  showValue: true,
                  step: 500
                }),                
                PropertyPaneSlider('speed', {
                  label: 'Time it takes to shift slides (ms)',
                  min: 100,
                  max: 2000,
                  value: 800,
                  showValue: true,
                  step: 100
                }),
                PropertyPaneToggle('dots', {
                  label: 'Show dots to select pages',
                  checked: true
                }),                                 
              ]
            }
          ]
        }
      ]
    };
  }
}
