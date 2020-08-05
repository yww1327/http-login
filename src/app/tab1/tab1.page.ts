import { Component, OnInit, SimpleChange } from '@angular/core';
import { AlertController, ViewWillEnter } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { NotificationService } from 'src/app/notification.service';
import { catchError, mergeMap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  rawResponse = null;
  notifications = null;

  // Step 2. 在 constructor 裡面注入 HttpClient
  constructor(
    private alertController: AlertController,
    private navCtrl: NavController,
    private notificationService: NotificationService,
    private route: ActivatedRoute
  ) {
    route.params.subscribe(val => this.initialize());
  }

  // Step 3. 撰寫呼叫 api 的程式碼
  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    try {
      // 在元件初始化的時候，透過後端 api 取得資料
      const response = await this.notificationService.getAllNotificationsFromApi();
      // Step 5. 將資料顯示到畫面上
      this.rawResponse = response;
      this.notifications = this.rawResponse["data"];
    } catch (error) {
      // Step 4. 過程中如果發生錯誤，需要另外進行的錯誤處理
      console.error(error);
      this.presentErrorAlert();
    }
  }

  /**
   * 顯示取得資料失敗的錯誤訊息
   */
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Sorry, please try again.',
      buttons: [{ text: "Reload", handler: data => { this.ngOnInit(); }}],
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
      const response = await this.notificationService.deleteNotificationFromApi(index.id);
      window.location.reload();
    } catch(error) {
      console.error(error);
      catchError(this.notificationService.handleError);
    }
  }

}
