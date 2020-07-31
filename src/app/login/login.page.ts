import { Component } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(
    private navController: NavController,
    private alertController: AlertController,
  ) {}

  submit() {
    if (this.email === 'jonz94@jonz94.dev' && this.password === '12345678') {
      this.navController.navigateForward('/tabs');
    } else {
      this.presentLoginFailedAlert();
    }
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
