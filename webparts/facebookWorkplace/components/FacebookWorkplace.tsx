import * as React from 'react';
import styles from './FacebookWorkplace.module.scss';
import { IFacebookWorkplaceProps } from './IFacebookWorkplaceProps';
import * as Markdown from 'react-markdown';
import * as moment from 'moment';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';

export const CollapseBox = ({ entry, type }) => {
  return (
    <div className={styles.toggle}>
      {type == 'comments' &&
        entry.comments.data.map((item, key) => {
          return (
            <div className={styles.comments} key={key}>
              <div><a href={`https://work.facebook.com/${item.from.id}`}>{item.from.name}</a></div>
              <div className={styles.commentDate}>{moment(item.created_time).format("MMMM DD YYYY HH:MM")}</div>
              <span>{item.message}</span>
            </div>)
        })
      }
      { type == 'attachments' &&
        entry.attachments.data.map((item, key) =>
          <div className={styles.comments} key={key}>
            <div><a href={item.url}>{item.title}</a></div>
          </div>
        )
      }
      {
        type == 'likes' &&
        entry.reactions.data.map((item, key) =>
          <div className={styles.likes} key={key}><a href={`https://work.facebook.com/${item.id}`}>{item.name}</a></div>
        )
      }
    </div>
  )
}

export default class FacebookWorkplace extends React.Component<IFacebookWorkplaceProps, { toggleIndex: number, type: string; moreIndex: number, lightboxImage: string, photoIndex: number }> {
  constructor(props: IFacebookWorkplaceProps) {
    super(props);
    this.state = {
      toggleIndex: -1,
      type: '',
      moreIndex: -1,
      lightboxImage: null,
      photoIndex: 0
    };
    this.handleToogleClick = this.handleToogleClick.bind(this)


  }

  public showImage = function(imageUrl: string) {

  }

  public render(): React.ReactElement<IFacebookWorkplaceProps> {
    const { photoIndex, lightboxImage } = this.state;

    return (
      <div className={styles.facebookWorkplace}>
        <div className={styles.container}>
          <div className={styles.row}>
            <div className={styles.column}>
              {this.props.feed &&
                this.props.feed.sort((prev, next) => {
                  return new Date(prev.created_time).getTime() - new Date(next.created_time).getTime();
                }).reverse().map((entry, i) => {

                  let likesCnt = entry.reactions == null ? 0 : entry.reactions.summary.total_count;
                  let commentsCnt = entry.comments == null ? 0 : entry.comments.summary.total_count;
                  let attachmentsCnt = (entry.attachments == null || entry.type != "status") ? 0 : entry.attachments.data.length;

                  if (entry.message != null && entry.message.length > 450) {
                    entry.shortMessage = entry.message.substring(0, entry.message.indexOf('.',450) + 1) + "..."
                  }
                  else {
                    entry.shortMessage = entry.message;
                  }

                  return (
                    <div key={entry.id} className={styles.box}>
                      <div className={styles.header}>
                        <div className={styles.avatar}>
                          <img
                            src={`https://graph.facebook.com/${entry.from.id}/picture?type=square&access_token=${this.props.accessToken}`}></img>
                        </div>
                        <div className={styles.title}>
                          <span>{entry.from.name}</span>
                          <span>{moment(entry.created_time).format('MMMM DD')}</span>
                        </div>
                      </div>
                      <div className={styles.content}>
                        {
                          entry.name &&
                          <b>{entry.name}</b>
                        }
                        <div className={styles.description}>
                          <Markdown source={this.state.moreIndex == entry.id ? entry.message : entry.shortMessage} />
                          {
                            entry.message != entry.shortMessage &&
                              <a onClick={() => this.handleMoreClick(entry.id)} className={styles.more}>More</a>
                          }                          
                          {
                            entry.full_picture &&
                              <a onClick={() => this.setState({ lightboxImage: entry.id })}>
                                <img src={entry.full_picture} className={styles.photo} />
                              </a>
                          }
                          {lightboxImage == entry.id && ( //TODO SHOW GALLERY

                            /*<Lightbox
                              mainSrc={entry.full_picture}
                              nextSrc={this.props.feed[i+1].full_picture}
                              prevSrc={this.props.feed[i+1].full_picture}*/
                              <Lightbox
                              mainSrc={entry.attachments.data[0].subattachments.data[this.state.photoIndex].media.image.src}
                              //nextSrc={entry.attachments.data[0].subattachments.data[(this.state.photoIndex + 1) % entry.attachments.data[0].subattachments.length].media.image.src}
                              //prevSrc={entry.attachments.data[0].subattachments.data[(this.state.photoIndex + entry.attachments.data[0].subattachments.length - 1) % entry.attachments.data[0].subattachments.length].media.image.src}   
                              onMovePrevRequest={() =>
                                this.setState({
                                  photoIndex: (photoIndex + entry.attachments.data[0].subattachments.data.length - 1) % entry.attachments.data[0].subattachments.data.length,
                                })
                              }
                              onMoveNextRequest={() =>
                                this.setState({
                                  photoIndex: (photoIndex + 1) % entry.attachments.data[0].subattachments.data.length,
                                })
                              }                                                 
                              onCloseRequest={() => this.setState({ lightboxImage: null })}
                            />
                          )}                             
                        </div>
                      </div>
                      <div className={styles.footer}>
                        <a onClick={() => likesCnt > 0 && this.handleToogleClick(entry.id, 'likes')}><b>{likesCnt}</b> Likes</a>
                        <a onClick={() => commentsCnt > 0 && this.handleToogleClick(entry.id, 'comments')}><b>{commentsCnt}</b> Comments</a>
                        <a onClick={() => attachmentsCnt > 0 && this.handleToogleClick(entry.id, 'attachments')}><b>{attachmentsCnt}</b> Attachments</a>
                        <a href={"https://workplace.facebook.com/" + entry.id} target="_blank" className={styles.goto}>Open</a>
                      </div>
                      {this.state.toggleIndex == entry.id &&
                        <CollapseBox entry={entry} type={this.state.type} />
                      }
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div> 
      </div>
    );
  }

  public handleToogleClick(id, type) {
    var toggleIndex = -1;
    if (this.state.toggleIndex != id || this.state.type != type)
      toggleIndex = id;
    this.setState({ toggleIndex: toggleIndex, type: type });
  }

  public handleMoreClick(id) {
    var moreIndex = -1;
    if (this.state.moreIndex != id )
      moreIndex = id;

    console.log("handle more click")

    this.setState({ toggleIndex: -1, type: '', moreIndex: moreIndex });
  }
}

export const Loading = ({ status }) => {
  return (
    <div className={styles.description}>{status}</div>
  )
}