import * as React from 'react';
import styles from './InstagramFeed.module.scss';
import * as $ from 'jquery';
window['jQuery'] = window['$'] = $;

import { IInstagramFeedProps } from './IInstagramFeedProps';
import { SPComponentLoader } from '@microsoft/sp-loader'

export default class InstagramFeed extends React.Component<IInstagramFeedProps, { scriptLoaded: boolean }> {

  constructor(props) {
    super(props);
    this.state = { scriptLoaded: false };
  }

  componentDidMount() {
    console.log("DID MOUNT")

  }


  public render(): React.ReactElement<IInstagramFeedProps> {

    console.log("render");
    console.log(this.props);

    SPComponentLoader.loadScript("https://metablob.blob.core.windows.net/ossur/modern-intranet/js/elfsight-instagram-feed.js", {
      globalExportsName:"insta"
    }).then(() => {
      console.log("SCRIPT LOADED!");

        $('#insta').eappsInstagramFeed({
          api: 'https://insta-proxy-php.azurewebsites.net/api',
          source: this.props.source,
          width: 'auto',
          layout: 'grid',
          columns: this.props.columns,
          rows: this.props.rows,
          lang: 'en'
        });       
    });
    
    return (
      <div id="insta"></div>
    );
  }
}
