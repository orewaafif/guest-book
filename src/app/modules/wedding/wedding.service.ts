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

  allMessages(): Observable<IMessage[]> {
    return this.http.get<IMessage[]>(this.msgUrl)
  }

  createMessage(payload: IMessage): Observable<IMessage> {
    return this.http.post<IMessage>(this.msgUrl, payload)
  }

  updateMessage(payload: IMessage) {
    return this.http.put<IMessage>(this.msgUrl + '/mine', payload)
  }

  deleteMessage() {
    return this.http.delete<IMessage>(this.msgUrl + '/mine')
  }

  getMessage() {
    return this.http.get<IMessage>(this.msgUrl + '/mine')
  }

}

export interface IMessage {
  _id?: string
  sender?: string
  message?: string
}
