import { HttpClient, IHttpClientOptions, HttpClientResponse } from '@microsoft/sp-http';

export interface IFacebookWorkplaceProps {
  feed: any[],
  accessToken: string;
}
