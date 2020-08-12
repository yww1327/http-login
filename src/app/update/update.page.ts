import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController, AlertController } from '@ionic/angular';
import { catchError } from 'rxjs/operators'; 
import { element } from 'protractor';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-update',
  templateUrl: './update.page.html',
  styleUrls: ['./update.page.scss'],
})
export class UpdatePage implements OnInit {

  target = null;
  id = '';
  title = '';
  description = '';

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private alertCtrl: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if(!(JSON.parse(localStorage.getItem('access_token')))) {
      this.navCtrl.navigateForward('/login');
    } else {
      this.id = this.route.snapshot.paramMap.get('id');
      this.initialize();
    }
  }

  async initialize() {
    try {
      const response = await this.getAllNotificationsFromApi();
      
      this.target = response;
      this.target = this.target["data"];

      this.target.forEach(element => {
        if(element["id"] === Number(this.id)) {
          this.target = element;
        }
      });
      
      this.title = this.target.title;
      this.description = this.target.description;
    } catch (error) {
      console.error(error);
    }
  }

  async submit() {
    try {
      const response = await this.updateNotificationFromApi(this.id, this.title, this.description);
    } catch(error) {
      console.error(error);
      catchError(this.handleError);
    }
  }
  
  async getAllNotificationsFromApi() {
    const url = 'https://api.next.cocoing.info/admin/notifications';
    const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };
    const response = await this.http.get<Response>(url, httpOptions).toPromise();
    return response;
  }

  async updateNotificationFromApi(id, title, description) {
    const url = 'https://api.next.cocoing.info/admin/notifications';
    const body = {
      id: id,
      title: title,
      description: description
    };
    const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
    console.log(accessToken);
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };
    const response = await this.http.patch<Response>(url, body, httpOptions).subscribe( data => {
      this.presentAlert();
      this.navCtrl.navigateForward('/tabs/tab1');
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
