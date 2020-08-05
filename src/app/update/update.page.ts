import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { NavController } from '@ionic/angular';
import { catchError } from 'rxjs/operators'; 
import { element } from 'protractor';

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
    private notificationService: NotificationService,
    private navCtrl: NavController
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.initialize();
  }

  async initialize() {
    try {
      const response = await this.notificationService.getAllNotificationsFromApi();
      
      this.target = response;
      this.target = this.target["data"];

      console.log(this.id);

      this.target.forEach(element => {
        if(element["id"] === Number(this.id)) {
          this.target = element;
        }
      });
      console.log(this.target);

      this.title = this.target.title;
      this.description = this.target.description;
    } catch (error) {
      console.error(error);
    }
  }

  async submit() {
    try {
      const response = await this.notificationService.updateNotificationFromApi(this.id, this.title, this.description);
    } catch(error) {
      console.error(error);
      catchError(this.notificationService.handleError);
    }
  }
  
}
