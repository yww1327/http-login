import { Component, OnInit } from '@angular/core';
import { NotificationService } from 'src/app/notification.service';
import { NavController } from '@ionic/angular';
import { catchError } from 'rxjs/operators'; 

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {

  title = "";
  description = "";

  constructor(
    private notificationService: NotificationService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
  }

  async submit() {
    try {
      const response = await this.notificationService.creatNewNotificationFromApi(this.title, this.description);
    } catch(error) {
      console.error(error);
      catchError(this.notificationService.handleError);
    }
  }

}
