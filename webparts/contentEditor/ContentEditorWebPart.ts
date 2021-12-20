import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, DisplayMode } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneDropdown,
} from '@microsoft/sp-webpart-base';

import * as strings from 'ContentEditorWebPartStrings';
import ContentEditor from './components/ContentEditor';
import { IContentEditorProps } from './components/IContentEditorProps';

export interface IContentEditorWebPartProps {
  description: string;
  title: string;
  layout: string;
  contentLink: string;
  content: string;
  imageURL: string;
  link: string;
  linkText: string;
  linkMode: string;
  displayMode: DisplayMode;
}

export default class ContentEditorWebPart extends BaseClientSideWebPart<IContentEditorWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IContentEditorProps> = React.createElement(
      ContentEditor,
      {
        description: this.properties.description,
        title: this.properties.title,
        layout: this.properties.layout,
        contentLink: this.properties.contentLink,
        content: this.properties.content,
        imageURL: this.properties.imageURL,
        link: this.properties.link,
        linkText: this.properties.linkText,
        linkMode: this.properties.linkMode,
        displayMode: this.displayMode,
        onChange: this.onRichTextChange,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  onRichTextChange = (newText: string) => {
    this.properties.content = newText;
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
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.TitleLabel
                }),
                PropertyPaneDropdown('layout', {
                  label: strings.LayoutLabel,
                  options: [
                    { key: "left", text: "Image on Left" },
                    { key: "right", text: "Image on Right" },
                    { key: "background", text: "Image in Background" }
                  ],
                  selectedKey: 'left',
                }),
                PropertyPaneTextField('contentLink', {
                  label: strings.ContentLinkLabel
                }),
                // PropertyPaneTextField('content', {
                //   label: strings.ContentLabel,
                //   multiline: true,
                //   rows: 14
                // }),
                PropertyPaneTextField('imageURL', {
                  label: strings.ImageURLLabel
                }),
                PropertyPaneTextField('link', {
                  label: strings.LinkLabel
                }),
                PropertyPaneTextField('linkText', {
                  label: strings.LinktextLabel
                }),
                PropertyPaneDropdown('linkMode', {
                  label: strings.LinkmodeLabel,
                  options: [
                    { key: "_self", text: "Normal - Open in same tab" },
                    { key: "_blank", text: "External - Open in new tab" }
                  ],
                  selectedKey: '_self',
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
