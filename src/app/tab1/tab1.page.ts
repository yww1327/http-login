import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { catchError, mergeMap, delay, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  /*rawResponse = null;
  notifications = null;*/

  accessToken = '';
  data$ = of(null);

  // Step 2. 在 constructor 裡面注入 HttpClient
  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  // Step 3. 撰寫呼叫 api 的程式碼
  ngOnInit() {
    if (!(JSON.parse(localStorage.getItem('access_token')))) {
      this.navCtrl.navigateForward('/login');
    } else {
      this.route.params.subscribe(val => this.initialize());
    }
  }

  async initialize() {
    /*try {
      // 在元件初始化的時候，透過後端 api 取得資料
      const response = await this.getAllNotificationsFromApi();
      // Step 5. 將資料顯示到畫面上
      this.rawResponse = response;
      this.notifications = this.rawResponse["data"];
    } catch (error) {
      // Step 4. 過程中如果發生錯誤，需要另外進行的錯誤處理
      console.error(error);
      this.presentErrorAlert();
    }*/
    try {
      this.accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
      this.data$ = this.getAllNotifications();
    } catch (error) {
      console.error(error);
      this.presentErrorAlert();
    }
  }

  checkSameUser(name) {
    const currentUser = JSON.parse(localStorage.getItem('access_token'))['data']['user']['name'];
    if (name === currentUser) {
      return true;
    } else {
      return false;
    }
  }

  getAllNotifications() {
    const url = 'https://api.cocoing.info/admin/notifications';
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.accessToken}`,
      }),
    };
    return this.http.get<any>(url, httpOptions).pipe(
      map((response) => response.data)
    )
  }
  /*
  async getAllNotificationsFromApi() {
    const url = 'https://api.cocoing.info/admin/notifications';
    const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };
    const response = await this.http.get<Response>(url, httpOptions).toPromise();
    return response;
  }
  */
  /**
   * 顯示取得資料失敗的錯誤訊息
   */
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Sorry, please try again.',
      buttons: [{ text: "Reload", handler: data => { this.ngOnInit(); } }],
    });

    alert.present();
  }

  navToAddPage() {
    this.navCtrl.navigateForward('/add');
  }

  navToUpdatePage(index) {
    this.navCtrl.navigateForward(`/update/${index.id}`);
  }

  navToDetailPage(index) {
    this.navCtrl.navigateForward(`/detail/${index.id}`);
  }

  async delete(index) {
    try {
      const response = await this.deleteNotificationFromApi(index.id);
      this.initialize();
    } catch (error) {
      console.error(error);
      catchError(this.handleError);
    }
  }

  async deleteNotificationFromApi(id) {
    const url = 'https://api.cocoing.info/admin/notifications';
    const body = {
      id: id
    }
    const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
        'X-HTTP-Method-Override': 'delete',
      }),
    };
    const response = await this.http.post<Response>(url, body, httpOptions).toPromise();
    return response;
  }

  async publish(index) {
    try {
      const response = await this.sendNotificationFromApi(index.id);
    } catch (error) {
      console.error(error);
      catchError(this.handleError);
    }
  }

  async sendNotificationFromApi(id) {
    const url = 'https://api.cocoing.info/admin/notifications/send';
    const body = {
      id: id
    };
    const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      })
    };
    return this.http.post<Response>(url, body, httpOptions).subscribe(data => {
      this.presentAlert();
    });
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Published',
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

  logout() {
    /*try {
      localStorage.removeItem('access_token');
      this.navCtrl.navigateForward('/login');
    } catch(error) {
      console.error(error);
    }*/
    const url = 'https://api.cocoing.info/v1/logout';
    const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
    };

    return this.http.delete<Response>(url, httpOptions).subscribe(data => {
      this.navCtrl.navigateForward('/login');
      localStorage.removeItem('access_token');
    });
  }

}
