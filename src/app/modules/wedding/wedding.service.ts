import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { apiUrl } from 'src/app/common/utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeddingService {

  get msgUrl() {
    return apiUrl() + 'messages'
  }

  constructor(
    private http: HttpClient
  ) { }

  allMessages(queryParams?: string): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.msgUrl + queryParams || '')
  }

  createMessage(payload: IMessage, queryParams?: string): Observable<IMessage> {
    return this.http.post<IMessage>(this.msgUrl + (queryParams || ''), payload)
  }

  updateMessage(payload: IMessage, queryParams?: string) {
    return this.http.put<IMessage>(this.msgUrl + '/mine' + (queryParams || ''), payload)
  }

  deleteMessage(queryParams?: string) {
    return this.http.delete<IMessage>(this.msgUrl + '/mine' + (queryParams || ''))
  }

  getMessage(queryParams?: string) {
    return this.http.get<IMessage>(this.msgUrl + '/mine' + (queryParams || ''))
  }

}

export interface IMessage {
  _id?: string
  sender?: string
  message?: string
  code?: string
}
