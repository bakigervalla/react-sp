import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'FacebookWorkplaceWebPartStrings';
import FacebookWorkplace, { Loading } from './components/FacebookWorkplace';
import { IFacebookWorkplaceProps } from './components/IFacebookWorkplaceProps';

export interface IFacebookWorkplaceWebPartProps {
  feedId: string;
  accessToken: string;
  numberOfPosts: number;
}

export default class FacebookWorkplaceWebPart extends BaseClientSideWebPart<IFacebookWorkplaceWebPartProps> {

  public getFeed(): Promise<any> {

    var groupUrl = `https://graph.facebook.com/${this.properties.feedId}/feed?access_token=${this.properties.accessToken}&fields=id,name,story,message,from,created_time,link,picture,type,object_id,full_picture,comments.summary(true),attachments,reactions.summary(true)&limit=${this.properties.numberOfPosts}`
    return this.context.httpClient.get(groupUrl, HttpClient.configurations.v1);
  }

  public render(): void {
    this.properties.accessToken = "DQVJ2eklzdG10U2NVU1dqcDAyMG0tRnNhRXR0MWZAmY0ttZAGJTSzZAPZAkQ1WEVFN3JEeVMyWHVfRmhjRGlZAXzR1dUJOcUI1N1JJMi1yR2txd0Y2VnY4M29uVi1wbmNGQUdZAdktpOTlDZA29Sd3BFS2E1aXFrRk14M2pUZADkyRlpQUk9IRDVYZAThpM1BYUFAzX2dYQ21Eajl3QjQ2SzYteWU3emRSRTl1bVNGaTNjb0dJaFgtLTlsbVJ1YlpjbFpVQzRvcWtieDhVQXF3YXFuWURhXwZDZD";
    if (this.properties.feedId && this.properties.feedId.length > 0) {

      // Loader
      const element: React.ReactElement = React.createElement(
        Loading, { status: 'Loading group feed...' }
      );
      ReactDom.render(element, this.domElement);

      this.getFeed().then(d => {
        d.json().then(responseData => {
          const element: React.ReactElement<IFacebookWorkplaceProps> = React.createElement(
            FacebookWorkplace,
            {
              feed: responseData.data,
              accessToken: this.properties.accessToken
            }
          );
          ReactDom.render(element, this.domElement);
        });
      })
    }
    else {
      // Loader
      const element: React.ReactElement = React.createElement(
        Loading, { status: 'Please provide a Workplace Group ID.' }
      );
      ReactDom.render(element, this.domElement);
    }
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
                PropertyPaneTextField('feedId', {
                  label: strings.FeedIdLabel
                  //value: "543336625876806" Critical: remove on live
                }),
                PropertyPaneSlider('numberOfPosts', {
                  label: strings.NumberOfPostsLabel,
                  min: 1,
                  max: 50,
                  value: 6,
                  showValue: true,
                  step: 1
                })
              ]
            }
          ]
        }
      ]
    };
  }
}