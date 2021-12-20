import { DisplayMode } from '@microsoft/sp-core-library';

export interface IContentEditorProps {
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
  onChange: Function;
}
