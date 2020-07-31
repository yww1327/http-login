import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page implements OnInit {
  rawResponse = null;

  // Step 2. 在 constructor 裡面注入 HttpClient
  constructor(
    private http: HttpClient,
    private alertController: AlertController,
  ) {}

  // Step 3. 撰寫呼叫 api 的程式碼
  ngOnInit() {
    this.initialize();
  }

  async initialize() {
    try {
      // 在元件初始化的時候，透過後端 api 取得資料
      const response = await this.getAllNotificationsFromApi();

      console.log(response);

      // Step 5. 將資料顯示到畫面上
      this.rawResponse = response;
    } catch (error) {
      // Step 4. 過程中如果發生錯誤，需要另外進行的錯誤處理
      console.error(error);

      this.presentErrorAlert();
    }
  }

  /**
   * 從後端 api 取得所有 notification 的資料
   *
   * 並且將後端回應的原始資料直接顯示在畫面上
   */
  async getAllNotificationsFromApi() {
    const url = 'https://api.next.cocoing.info/admin/notifications';

    // 這邊只是因為偷懶用了 any，還是要養成好習慣不要隨便用 any XDrz
    // 將後端拿到的資料儲存在 local 變數中
    const response = await this.http.get<any>(url).toPromise();

    return response;
  }

  /**
   * 顯示取得資料失敗的錯誤訊息
   */
  async presentErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Sorry, please try again later.',
      buttons: ['OK'],
    });

    alert.present();
  }
}
