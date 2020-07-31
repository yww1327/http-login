import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  email = '';
  password = '';

  constructor(private navController: NavController) {}

  submit() {
    if (this.email === 'jonz94@jonz94.dev' && this.password === '12345678') {
      this.navController.navigateForward('/tabs');
    }
  }
}
