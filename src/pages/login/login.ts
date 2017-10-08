import { Component} from '@angular/core';
import { NavController,AlertController,Events,ModalController,LoadingController, 
  Loading, Platform} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { EmailValidator } from '../../validators/vals';
import { HomePage } from '../home/home';
import {SignupPage} from '../signup/signup';
import {LostpassPage} from '../lostpass/lostpass';


import {Http} from '@angular/http';
import 'rxjs/add/operator/map';


@Component({
  selector: 'page-Login',
  templateUrl: 'login.html'
})
export class Login {

  logindata=[{}];
 
  public loginForm:FormGroup;
  public loading:Loading;
  constructor(private modalCtrl: ModalController,public navCtrl: NavController, public http: Http,private alertCtrl: AlertController,public events: Events,public authData: AuthServiceProvider,public formBuilder: FormBuilder, public loadingCtrl: LoadingController, private platform: Platform) {
	        this.loginForm = formBuilder.group({
        email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
        password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
      });

  }
Register(){
  //let profileModal = this.modalCtrl.create(SignupPage);
//profileModal.present();
   this.navCtrl.push(SignupPage);
}
LPass(){
  //let profileModal = this.modalCtrl.create(LostpassPage);
//profileModal.present();
  this.navCtrl.push(LostpassPage);
}
loginUser(){
  if (!this.loginForm.valid){
    console.log(this.loginForm.value);
  } else {
    this.authData.loginUser(this.loginForm.value.email, this.loginForm.value.password)
    .then( result => {
		//var user = result["user"]; 
  
	 this.events.publish('profile',this.authData.fetchUser());
    }, error => {
		var ECode = error["code"];
		var EMessage = "Lỗi không xác định ["+ ECode + "]";
		if(ECode == "auth/user-not-found" || ECode == "auth/wrong-password"){
			EMessage = "Email hoặc mật khẩu không đúng!";
		}
		
      this.loading.dismiss().then( () => {
		  
        let alert = this.alertCtrl.create({
          message: EMessage,
          buttons: [
            {
              text: "Đồng ý",
              role: 'Hủy'
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
UloginFB(){

   
	 this.authData.loginFB();

	 
	
	
        
//	console.log(this.platform);
	//this.fb.login(['public_profile', 'user_friends', 'email'])
  //.then((res: FacebookLoginResponse) => {alert.present();})
  //.catch(e => {console.log('Error logging into Facebook', e)});
/*	this.authData.loginFB().then(result => {
  if (result["credential"]) {
    var token = result["credential"].accessToken;
  }
  var user = result["user"];
}).catch(error=> {

  var errorMessage = error.message;
    this.loading.dismiss().then( () => {
		  
        let alert = this.alertCtrl.create({
          message: errorMessage,
          buttons: [
            {
              text: "Đồng ý",
              role: 'Hủy'
            }
          ]
        });
        alert.present();
      });
    

    this.loading = this.loadingCtrl.create({
      dismissOnPageChange: true,
	  content: 'Đang xử lý...'
    });
    this.loading.present();

});
*/
}




}