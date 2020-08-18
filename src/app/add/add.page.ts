import { Component, OnInit } from '@angular/core';
import { NavController, AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators'; 
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  title = "";
  description = "";

  constructor(
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if(!(JSON.parse(localStorage.getItem('access_token')))) {
      this.navCtrl.navigateForward('/login');
    }
  }

  async submit() {
    try {
      const response = await this.creatNewNotificationFromApi(this.title, this.description);
    } catch(error) {
      console.error(error);
      catchError(this.handleError);
    }
  }

  async creatNewNotificationFromApi(title, description) {
    const url = 'https://api.cocoing.info/admin/notifications';
    const body = {
      title: title,
      description: description
    };
    const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      })
    };
    const response = await this.http.post<Response>(url, body, httpOptions).subscribe( data => {
      this.presentAlert();
      this.navCtrl.navigateForward('/tabs');
    });
    return response;
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'Success',
      //message: 'Sorry, please try again.',
      buttons: ['OK']
    });

    alert.present();
  }

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

}
