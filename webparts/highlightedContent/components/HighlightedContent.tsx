import * as React from 'react';
import styles from './HighlightedContent.module.scss';
import { IHighlightedContentProps } from './IHighlightedContentProps';
import * as moment from 'moment';
import Slider from "react-slick";
import { SPComponentLoader } from '@microsoft/sp-loader'
export interface IState {
  isMobile: boolean,
  userLocation: string,
  items: [{
    Id: number,
    Title: string,
    Summary: string,
    ImageURL: string,
    URL: string,
    Expires: Date,
    Created: Date,
    audienceLocation: []
  }],
  error: { status: number, message: string }
};

export default class HighlightedContent extends React.Component<IHighlightedContentProps, IState> {
  state: IState;

  constructor(props: IHighlightedContentProps) {
    super(props);

    this.state = {
      isMobile: (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1),
      userLocation: "",
      items: [{
        Id: -1,
        Title: "",
        Summary: "",
        ImageURL: "",
        URL: "",
        Created: null,
        Expires: null,
        audienceLocation: []
      }],
      error: { status: 0, message: "" }
    };

  }
  public render(): React.ReactElement<IHighlightedContentProps> {

    /*var settings = {
      dots: false,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      fade: true,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 3000
    };*/
    var settings = {
      autoplay:true,
      autoplaySpeed:this.props.autoplaySpeed,
      speed:this.props.speed,
      dots:this.props.dots
    };

    console.log(settings)
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css");
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css");

    return (
      
      <div className={styles.news}>
        <Slider {...settings}>
        {
          this.state.items.map((highlight, i) => (
            <div key={highlight.Id} className={styles.newsOpening}>
              <a href={highlight.URL}>
                <div className={styles.background} style={{ backgroundImage: `url(${highlight.ImageURL})` }}></div>
                <div className={styles.shadow}></div>
                <div className={styles.content}><span className={styles.date}>{moment(highlight.Created).format('MMMM DD')}</span>
                  <h2>{highlight.Title}</h2>
                  <div className={styles.comments}>{highlight.Summary}</div>
                </div>
              </a>
            </div>
          ))
        }
        </Slider>
      </div>);
  }

  componentDidMount() {
    //this.getUserProperties();
    this.getListItems();
  }

  private getUserProperties = () => {
    fetch(`${this.props.siteUrl}/_api/sp.userprofiles.peoplemanager/GetMyProperties`, {
      method: 'get',
      headers: new Headers({
        'Accept': 'application/json'
      }),
    })
      .then(response => response.json())
      .then(data => {
        var location = data.UserProfileProperties.filter(function (itm) {
          return itm.Key === 'Office';
        })

        this.setState({ userLocation: location[0]['Value'] || "" });

        // fetch content
        this.getListItems();

      })
      .catch(error => console.log(error));
  }

  private getListItems = () => {
    var date = new Date();
    fetch(`${this.props.siteUrl}/_api/web/lists/getbytitle('HighlightedContent')/items?$filter=Expires ge datetime'${date.toISOString()}'`, {
      method: 'get',
      headers: new Headers({
        'Accept': 'application/json; odata=verbose'
      }),
    })
      .then(response => response.json())
      .then(data => data.error == null ?
        this.setState({ items: data.d.results })
        : this.setState({ error: { status: -1, message: data.error.message.value } })
      )
      .catch(error => console.log(error));
  }

}