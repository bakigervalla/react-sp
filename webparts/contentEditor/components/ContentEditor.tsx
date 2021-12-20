import * as React from 'react';
import styles from './ContentEditor.module.scss';
import { IContentEditorProps } from './IContentEditorProps';
import { Link, Fabric, Icon } from 'office-ui-fabric-react';
import { RichText } from "@pnp/spfx-controls-react/lib/RichText";

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';
import { DisplayMode } from '@microsoft/sp-core-library';

export interface IContentEditor {
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
  onChange: null;
}

export default class ContentEditor extends React.Component<IContentEditorProps, {imageOpen: boolean}> {
  constructor(props: IContentEditor) {
    super(props);

    this.state = {
      imageOpen: false
    }
  }

  public render(): React.ReactElement<IContentEditorProps> {
    return (
      <Fabric>
        {this.props.layout === 'background' &&
          <div className={styles.contentEditor}>
            <div className={styles.container} style={{ background: ` url(${this.props.imageURL})` }}>
              <div className={styles.row}>
                <div className={styles.column12}>
                  <p className={styles.title}>
                    {this.props.title}
                  </p>
                  <p className={styles.description}>
                  {this.props.displayMode == DisplayMode.Edit ?
                    <RichText className={styles.quill} value={this.props.content}
                      onChange={ (text) => this.onTextChange(text) } />
                    :
                    <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                  }
                  </p>
                  <Link
                    className={styles.button}
                    href={this.props.link}
                    target={this.props.linkMode}>
                    {this.props.linkText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        }
        {this.props.layout !== 'background' &&
          <div className={styles.contentEditor}>
            <div className={styles.container}>
              <div className={styles.row}>
                <div className={[styles.column, this.props.layout].join(' ')}>
                  {this.props.imageURL &&
                    <a onClick={()=> this.setState({imageOpen: true})}>
                      <img src={this.props.imageURL} />
                    </a>
                  }
                </div>
                {
                  this.state.imageOpen &&
                  <Lightbox mainSrc={this.props.imageURL} onCloseRequest={() => this.setState({imageOpen: false})} />
                }
                <div className={styles.column}>
                  <p className={styles.title}>
                    {this.props.title}
                  </p>
                  {this.props.displayMode == DisplayMode.Edit ?
                    <RichText className={styles.quill} value={this.props.content}
                      onChange={ (text) => this.onTextChange(text) } />
                    :
                    <div dangerouslySetInnerHTML={{__html: this.props.content}}></div>
                  }
                  <Link
                    className={styles.button}
                    href={this.props.link}
                    target={this.props.linkMode}>
                    {this.props.linkText}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        }
      </Fabric>
    );
  }

  public onTextChange = (newText: string) => {
    this.props.onChange(newText);
    return newText;
  }
}