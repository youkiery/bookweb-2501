import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController,Loading,Events } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { HomePage } from '../home/home';
import { Login } from '../login/login';
import { EmailValidator } from '../../validators/vals';
import { PhoneNumberRegex } from '../../validators/vals';
import { RequiredCheckboxValidator } from '../../validators/vals';
import firebase from 'firebase';

/**
 * Generated class for the SignupPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {
  public signupForm:FormGroup;
  public loading:Loading;
  constructor(public nav: NavController, public authData: AuthServiceProvider, public formBuilder: FormBuilder, public loadingCtrl: LoadingController,public alertCtrl: AlertController,public events: Events) {
	  this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
	  displayName: ['', Validators.compose([Validators.minLength(3), Validators.required])],
	  phoneNumber: ['', Validators.minLength(9)],
	  terms: [null,Validators.compose([Validators.required, RequiredCheckboxValidator.validateCheckbox])]
    });
  }
  signupUser(){
    if (!this.signupForm.valid){
      console.log(this.signupForm.value);
    } else {
      this.authData.signupUser(this.signupForm.value.email, this.signupForm.value.password)
      .then(newUser => {
	var provider = "";
  newUser.providerData.forEach(profile => {
   provider = profile.providerId;
  
  });
		firebase.database().ref('/userProfile').child(newUser.uid).set({ 
		email: this.signupForm.value.email,
		displayName: this.signupForm.value.displayName,
		photoURL: "https://static.skillshare.com/uploads/project/87595/cover_800_a51afd0019278955aa95db109e0a7f30.png",
		phoneNumber: this.signupForm.value.phoneNumber,
		provider: provider,
		active:0
		});
		 //this.authData.Verify();
		 var data = {
			displayName: this.signupForm.value.displayName,
			photoURL: "https://static.skillshare.com/uploads/project/87595/cover_800_a51afd0019278955aa95db109e0a7f30.png",
		   
		 }
		 
		 this.authData.updateProfile(data);
		 let alert = this.alertCtrl.create({
              message: "Đăng ký tài khoản thành công!",
              buttons: [
                {
                  text: "Đồng ý",
                  role: 'Hủy bỏ',
				  handler:()=>{
					   this.nav.setRoot(Login);
				  }
                }
              ]
            });
          alert.present();	
		 
       
      }, (error) => {
        this.loading.dismiss().then( () => {
          var errorMessage: string = error.message;
            let alert = this.alertCtrl.create({
              message: errorMessage,
              buttons: [
                {
                  text: "Đồng ý",
                  role: 'Hủy bỏ'
                }
              ]
            });
          alert.present();
        });
      });

      this.loading = this.loadingCtrl.create({
        dismissOnPageChange: true,
		content: 'Đang xử lý...'
      });
      this.loading.present();
    }
  }


}
