import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { formatDate, DatePipe } from '@angular/common';

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
  creator = '';
  created_at = null;
  editor = '';
  edited_at = null;

  constructor(
    private route: ActivatedRoute,
    private navCtrl: NavController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.paramMap.get('id');
    this.initialize();
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
      console.log(this.target);
      this.title = this.target.title;
      this.description = this.target.description;

      this.creator = this.target.creator["name"];
      this.created_at = this.target.created_at;

      var temp = '';
      temp += this.created_at.slice(0,4);
      temp += '/';
      temp += this.created_at.slice(5,7);
      temp += '/';
      temp += this.created_at.slice(8,10);

      this.created_at = temp;

      this.editor = this.target.last_edited_by_user["name"];
      this.edited_at = this.target.updated_at;

      temp = '';
      temp += this.created_at.slice(0,4);
      temp += '/';
      temp += this.created_at.slice(5,7);
      temp += '/';
      temp += this.created_at.slice(8,10);

      this.edited_at = temp;
    } catch (error) {
      console.error(error);
    }
  }

  navToUpdatePage() {
    this.navCtrl.navigateForward(`/update/${this.id}`);
  }

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

}
