import { Component, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { resolve } from 'dns';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email = '';
  password = '';


  constructor(
    private navController: NavController,
    private alertController: AlertController,
    private http: HttpClient
  ) { }

  ngOnInit() {
    if (JSON.parse(localStorage.getItem('access_token'))) {
      if (JSON.parse(localStorage.getItem('access_token'))['authentication'] === true) {
        try {
          this.logInByAccessTokenFromApi();
        }
        catch (error) {
          console.error(error);
        }
      }
    }
  }

  submit() {
    this.logInFromApi();
  }

  async logInFromApi() {
    const response = await new Promise((resolve, reject) => {
      const url = 'https://api.cocoing.info/v1/login';
      const body = {
        email: this.email,
        password: this.password
      }
      this.http.post<Response>(url, body).subscribe(
        // successful callback
        (res) => {
          resolve(res);
        },
        // failed callback
        (err) => {
          console.error(err);
          this.presentLoginFailedAlert();
          reject(err);
        }
      );
    });
    // write local storage
    try {
      localStorage.setItem('access_token', JSON.stringify({ authentication: true, data: response['data'] }));
      this.navController.navigateForward('/tabs');
      console.log('success');
    } catch (error) {
      console.error(error);
    }
  }

  async logInByAccessTokenFromApi() {
    const response = new Promise((resolve, reject) => {
      const url = 'https://api.cocoing.info/v1/login';
      const accessToken = JSON.parse(localStorage.getItem('access_token'))['data']['token']['access_token'];
      const httpOptions = {
        headers: new HttpHeaders({
          Authorization: `Bearer ${accessToken}`,
        })
      };
      this.http.get<Response>(url, httpOptions).subscribe(
        (res) => {
          this.navController.navigateForward('/tabs');
          resolve(res);
        },
        (err) => {
          console.log('Unauthenticated');
          if (localStorage.getItem('access_token')) {
            localStorage.removeItem('access_token');
          }
          reject(err);
        }
      )
    })
  }

  async presentLoginFailedAlert() {
    const alert = await this.alertController.create({
      header: 'Wrong email or password',
      message: 'please try again',
      buttons: ['OK'],
    });

    alert.present();
  }
}
