import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotificationService } from 'src/app/notification.service';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  target = null;
  id = ''
  title = '';
  description = '';

  constructor(
    private notificationService: NotificationService,
    private route: ActivatedRoute,
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

  navToUpdatePage() {
    this.navCtrl.navigateForward(`/update/${this.id}`);
  }



}
