import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the AddCustomerPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-customer',
  templateUrl: 'add-customer.html',
})
export class AddCustomerPage {
	Name:string;
	Birthday: any;
	Address:string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthServiceProvider) {
	  this.Birthday = new Date(2017,1,1);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AddCustomerPage');
  }
  pushCus(){
	  var data={
		  Name: this.Name,
		  DOB: this.Birthday,
		  Address: this.Address,
		  PersonINP: this.authData.fetchUser()["uid"],
		  DateINP: new Date().toLocaleDateString() + " " +  new Date().toLocaleTimeString(),
		  Point: 0 	
	  }
	 this.authData.insertDBFree("Inventory/CUSTOMER/",data);
	 console.log("Thành Công!");

  }

}
