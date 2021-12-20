declare interface ICalendarWebPartStrings {
  SiteUrlLabel: string,
  ListTitle: string,
  StartDateField: string,
  EndDateField: string,
  Interactive: string,
  DefaultView: string
}

declare module 'CalendarWebPartStrings' {
  const strings: ICalendarWebPartStrings;
  export = strings;
}
