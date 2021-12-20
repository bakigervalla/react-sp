import * as React from 'react';
import styles from './MenuOfTheDay.module.scss';
import { IMenuOfTheDayProps } from './IMenuOfTheDayProps';
import * as moment from 'moment';

export interface IState {
  weekDays: {},
  currDay: string,
  item: {
    Date: null,
    Title: "",
    viiv: "", // SoupOfTheDay
    OData__x006d_cj9: "", //Vegetarian
    Vegetables: []
  },
  vegetables: any[]
};

const list = [
  {
    name: "Salat",
    image: "https://image.shutterstock.com/image-photo/green-salat-bowl-on-desk-260nw-1255399798.jpg"
  },
  {
    name: "Tómatar",
    image: "https://eatofresh.com/media/catalog/product/cache/1/image/9df78eab33525d08d6e5fb8d27136e95/e/a/eatofresh_tomato.jpg"
  },
  {
    name: "Paprikur",
    image: "https://m2.mbl.is/egOEK28SWBE-irIepfk4hxhVZU4=/1640x1093/smart/frimg/5/83/583670.jpg"
  },
  {
    name: "Agúrkur",
    image: "https://samvirke.dk/sites/default/files/styles/image_component_large/public/migrated/ag/agurk.ny_.-jpg_0.jpg.jpeg?itok=-ijXwlq6"
  },
  {
    name: "Gulrætur",
    image: "https://freshexpress.lk/wp-content/uploads/2019/09/iStock-619252960-330x247.jpg"
  },
  {
    name: "Rótargranmeti",
    image: "https://freshexpress.lk/wp-content/uploads/2019/09/iStock-619252960-330x247.jpg"
  },
  {
    name: "Spergilkál",
    image: "https://islenskt.is/images/Vorur/spergilkal.jpg"
  },
  {
    name: "Baunir",
    image: "https://www.himneskt.is/media/uncategorized/large-470/baunir4.jpg"
  },
  {
    name: "Pasta",
    image: "https://www.thespruceeats.com/thmb/hJtP5QhBfZayjUD7RCyVbydJHtk=/960x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-885397466-5c0cc0634cedfd00012758a7.jpg"
  },
  {
    name: "Kjöt",
    image: "https://m2.mbl.is/lzpm84JvoZYaFijszMPmuTEI7RE=/1640x1093/smart/frimg/1/1/65/1016583.jpg"
  },
  {
    name: "Pestó",
    image: "https://static01.nyt.com/images/2015/05/20/dining/20HIT_PESTO/20HIT_PESTO-articleLarge.jpg"
  },
  {
    name: "Hummus",
    image: "https://www.simplyrecipes.com/wp-content/uploads/2017/12/easy-hummus-horiz-a-1800.jpg"
  },
  {
    name: "Dressing",
    image: "https://assets.epicurious.com/photos/59bc186dbf70cb1b35bc3e22/6:4/w_620%2Ch_413/SIMPLE-IS-BEST-DRESSING-RECIPE-07092017.jpg"
  }
];

export default class MenuOfTheDay extends React.Component<IMenuOfTheDayProps, IState> {
  state: IState;

  constructor(props: IMenuOfTheDayProps) {
    super(props);

    this.state = {
      weekDays: [
        { key: 1, name: "MON" },
        { key: 2, name: "TUE" },
        { key: 3, name: "WED" },
        { key: 4, name: "THU" },
        { key: 5, name: "FRI" }
      ],
      currDay: moment(new Date()).format('ddd').toUpperCase(), // new Date().toString().split(' ')[0].toUpperCase(),
      item: {
        Date: null,
        Title: "",
        viiv: "", // SoupOfTheDay
        OData__x006d_cj9: "", //Vegetarian
        Vegetables: []
      },
      vegetables: []
    }
  }

  public render(): React.ReactElement<IMenuOfTheDayProps> {

    const { weekDays, currDay, item, vegetables } = this.state;

    return (
      <div className={styles.menuOfTheDay} >
        <div className={styles.grid}>
          <HeaderBox handleChange={this.handleDayChange} days={weekDays} currDay={currDay} />
          <ContentBox item={item} images={vegetables} />
        </div>
      </div>
    );
  }

  componentDidMount() {
    this.getSPListData(this.state.currDay);
  }

  handleDayChange = e => {
    var day = e.target.innerText;
    this.setState({ currDay: day });

    this.getSPListData(day);
  }

  getSPListData(day = "") {
    day === "" ? this.state.currDay : day;
    var dateFilter = moment().day(`${day}day`).format('YYYY-MM-DD').toString();

    fetch(`${this.props.siteUrl}/_api/web/lists/getbytitle('MenuOfTheDay')/items?$filter=Date eq '${dateFilter}'`, {
      method: 'get',
      headers: new Headers({
        'Accept': 'application/json; odata=verbose;'
      }),
    })
      .then(response => response.json())
      .then(data => {
        let dailyMenu = data.d.results[0]
        let vegies = dailyMenu == null ? null : dailyMenu.Vegetables;
        let filteredVegies = vegies == null ? [] : list.filter(itm => vegies.results.includes(itm.name));

        this.setState({ item: dailyMenu, vegetables: filteredVegies });
      })
      .catch(error => console.log(error));
  }
}

export const HeaderBox = ({ handleChange, days, currDay }) => {

  return (
    <div className={`${styles.row} ${styles.header}`}>
      <div className={styles.column6}>
        <span className={styles.title}>Menu of the day</span>
      </div>
      <div className={styles.column6}>
        <div className={styles.wdays}>
          {days.map((item, key) => {
            return <h3 className={currDay == item.name ? styles.active : ""} key={key} onClick={handleChange}>{item.name}</h3>;
          })}
        </div>
      </div>
    </div >
  );
};

export const ContentBox = ({ item, images }) => (
  item != null &&
  <div className={`${styles.row} ${styles.content}`} >
    <div className={styles.column6}>
      <div className={`${styles.maincourse} ${styles.active}`}>
        <h1>Main course</h1>
        <h2>{item.Title}</h2>
      </div>
      <div className={`${styles.vegan} ${styles.active}`}>
        <h1>Vegan menu</h1>
        <h2>{item.OData__x006d_cj9}</h2>
      </div>
    </div>
    <div className={styles.column6}>
      <div className={`${styles.saladbar} ${styles.active}`}>
        <h1>Salad bar</h1>
        {images != null &&
          images.map(img => <img src={img.image} />)
        }
      </div>
    </div>
  </div >
);