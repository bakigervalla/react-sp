declare interface IContentEditorWebPartStrings {
  PropertyPaneTitle: string;
  PropertyPaneDescription: string;
  BasicGroupName: string;
  TitleLabel: string;
  LayoutLabel: string;
  ContentLinkLabel: string;
  ContentLabel: string;
  ImageURLLabel: string;
  LinkLabel: string;
  LinktextLabel: string;
  LinkmodeLabel: string;
}

declare module 'ContentEditorWebPartStrings' {
  const strings: IContentEditorWebPartStrings;
  export = strings;
}
