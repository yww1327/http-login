import { Injectable } from '@angular/core';
import { Response } from 'src/app/response';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertController, NavController } from '@ionic/angular';
import { throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  url = 'https://api.next.cocoing.info/admin/notifications';

  constructor(
    private http: HttpClient,
    private alertCtrl: AlertController,
    private navCtrl: NavController
  ) { }

  handleError = (error: HttpErrorResponse) => {
    if (error.error instanceof ErrorEvent) {
      // "前端本身" or "沒連上網路" 而產生的錯誤
      console.error('An error occurred:', error.error.message);
    } else {
      // 後端回傳的錯誤訊息，error.error 之中會有為何失敗的原因
      console.error(`HTTP status code ${error.status}, reason:`, error.error);
    }
    // 最後的回傳值的型別應為 observable
    return throwError('Something bad happened; please try again later.');
  };

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      //message: 'Sorry, please try again.',
      buttons: ['OK']
    });

    alert.present();
  }

  async getAllNotificationsFromApi() {
    const response = await this.http.get<Response>(this.url).toPromise();
    return response;
  }

  async deleteNotificationFromApi(id) {
    const response = await this.http.request('delete', this.url, {body: { id: id }}).toPromise();
    return response;
  }

  async creatNewNotificationFromApi(title, description) {
    const body = {
      title: title,
      description: description
    };
    const response = await this.http.post<Response>(this.url, body).subscribe( data => {
      this.presentAlert();
      this.navCtrl.navigateForward('/tabs/tab1');
    });
    return response;
  }

  async updateNotificationFromApi(id, title, description) {
    const body = {
      id: id,
      title: title,
      description: description
    };
    const response = await this.http.patch<Response>(this.url, body).subscribe( data => {
      this.presentAlert();
      this.navCtrl.navigateForward('/tabs/tab1');
    });
    return response;
  }

}
