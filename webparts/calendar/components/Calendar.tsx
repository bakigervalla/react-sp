import * as React from 'react';
import styles from './Calendar.module.scss';
import { ICalendarProps } from './ICalendarProps';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import * as moment from 'moment';

import Sidebar from './sidebar/sidebar-component';

interface IState {
  siteUrl: string;
  events: [],
  event: {}
  isOpen?: boolean;
}

export default class Calendar extends React.Component<ICalendarProps, IState> {
  state: IState;
  constructor(props: ICalendarProps) {
    super(props);

    this.state = {
      siteUrl: this.props.siteUrl,
      events: [],
      event: {},
      isOpen: false
    }
  }

  componentDidMount() {
    if (this.props.listTitle && this.props.startDateField && this.props.endDateField)
    this.getEvents();
  }

  public render(): React.ReactElement<ICalendarProps> {
    
    var { events } = this.state;
    /*events.forEach((event: any) => { //TODO add color to sharepoint list
      event.color = "#b1f522";
    });*/

    var settings = {
      defaultView: this.props.defaultView || "dayGridMonth",
      header: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
      displayEventTime: false,
      events: events,
      editable: this.props.interactive,
      eventClick: this.handleEventClick,
      eventDrop: this.handleEventDrop,
      eventDurationEditable: false
    };

    return (
      <div className={styles.calendar}>
        <FullCalendar {...settings} />
        <Sidebar
          isOpen={this.state.isOpen}
          event={this.state.event}
          onClose={this.onSidebarClosed.bind(this)} />
      </div>
    )
  }

   private getEvents = () => {
    fetch(`${this.state.siteUrl}/_api/web/lists/getbyid('${this.props.listTitle}')/items`, {
      method: 'get',
      headers: new Headers({
        'Accept': 'application/json; odata=verbose'
      }),
    })
      .then(response => response.json())
      .then(data => {
        let events = data.d.results.map(d =>
          ({ id: d.Id, title: d.Title, eventDetails: d.EventDetails, start: d[this.props.startDateField], end: d[this.props.endDateField] })
        );

        console.log(events);
        this.setState({ events: events });
      })
      .catch(error => console.log(error));
  }

  handleEventClick = (args: any) => {
    var { event } = args;

    this.setState({
      isOpen: !this.state.isOpen,
      event: event
    });
  }

  handleEventDrop = (args: any) => {
    var { event } = args;
    this.getListItemEntityTypeName()
      .then((listItemEntityTypeName) => {

        var updateItem = {
          "__metadata": { "type": listItemEntityTypeName.ListItemEntityTypeFullName },
          [this.props.startDateField]: moment(event.start).format('YYYY-MM-DD HH:mm')
        };

        if (this.props.startDateField != this.props.endDateField) {
          updateItem[this.props.endDateField] = moment(event.end).format('YYYY-MM-DD HH:mm');
        }
    
        const listItem: string = JSON.stringify(updateItem);
        this.getDigest()
          .then((digest) => {
            fetch(`${this.state.siteUrl}/_api/web/lists/getbyid('${this.props.listTitle}')/items(${event.id})`, {
              method: 'POST',
              headers: new Headers({
                'Accept': 'application/json;odata=nometadata',
                'Content-type': 'application/json;odata=verbose',
                'IF-MATCH': '*',
                'X-HTTP-Method': 'MERGE',
                "X-RequestDigest": digest.d.GetContextWebInformation.FormDigestValue
              }),
              body: listItem
            })
              .catch(error => console.log(error));
          });

      });
  }

  private getListItemEntityTypeName(): Promise<any> {
    return new Promise<any>((resolve: (listItemEntityTypeName: any) => void, reject: (error: any) => void): void => {
      fetch(`${this.props.siteUrl}/_api/web/lists/getbyid('${this.props.listTitle}')?$select=ListItemEntityTypeFullName`, {
        headers: new Headers({
          'Accept': 'application/json;odata=nometadata',
          'odata-version': ''
        }),
      })
        .then(response => resolve(response.json()))
        .catch(error => reject(error));
    });
  }

  private getDigest(): Promise<any> {
    return new Promise<any>((resolve: (data: any) => void, reject: (error: any) => void): void => {
      fetch(`${this.state.siteUrl}/_api/contextinfo`, {
        method: 'POST',
        headers: new Headers({
          'Accept': 'application/json; odata=verbose'
        }),
      })
        .then(response => resolve(response.json()))
        .catch(error => reject(error));
    });
  }

  private onSidebarClosed() {
    this.setState({
      isOpen: false
    });
  }

}