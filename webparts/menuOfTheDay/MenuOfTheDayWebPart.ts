import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import MenuOfTheDay from './components/MenuOfTheDay';
import { IMenuOfTheDayProps } from './components/IMenuOfTheDayProps';

export interface IMenuOfTheDayWebPartProps {
  description: string;
}

export default class MenuOfTheDayWebPart extends BaseClientSideWebPart <IMenuOfTheDayWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMenuOfTheDayProps> = React.createElement(
      MenuOfTheDay,
      {
        siteUrl: this.context.pageContext.web.absoluteUrl
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
}
