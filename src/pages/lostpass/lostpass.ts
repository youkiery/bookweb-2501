import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { EmailValidator } from '../../validators/vals';

/**
 * Generated class for the LostpassPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-lostpass',
  templateUrl: 'lostpass.html',
})
export class LostpassPage {
	public resetPasswordForm:FormGroup;

  constructor(public authData: AuthServiceProvider, public formBuilder: FormBuilder,  public nav: NavController, public alertCtrl: AlertController) {
	    this.resetPasswordForm = formBuilder.group({
    email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
  })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LostpassPage');
  }
  resetPassword(){
    if (!this.resetPasswordForm.valid){
      console.log(this.resetPasswordForm.value);
    } else {
      this.authData.resetPassword(this.resetPasswordForm.value.email)
      .then((user) => {
        let alert = this.alertCtrl.create({
          message: "Sunriser vừa gửi Email cho bạn!",
          buttons: [
            {
              text: "Đồng ý",
              role: 'Hủy',
              handler: () => {
                this.nav.pop();
              }
            }
          ]
        });
        alert.present();
      }, (error) => {
        var errorMessage: string = error.message;
        let errorAlert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [
            {
              text: "Đồng ý",
              role: 'Hủy'
            }
          ]
        });
        errorAlert.present();
      });
    }
  }

}
