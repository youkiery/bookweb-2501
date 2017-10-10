import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {FirebaseListObservable, AngularFireDatabase} from 'angularfire2/database';
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
	loi:string;
	customerObs: FirebaseListObservable<any>;
	customer: Array<any>;
	Subs: any;

  constructor(private db: AngularFireDatabase,private ToastCtrl: ToastController,private alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams, public authData: AuthServiceProvider) {
		this.Birthday = new Date(2017,1,1);
		this.loi='';
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad AddCustomerPage');
  }
  pushCus(){
		var kt=1;
		if(this.Name==null){
			this.loi='Vui lòng điền tên khách hàng!';
			this.error(this.loi);
			kt=0;
		}else if(this.Address==null){
			this.loi='Chưa có địa chỉ!';
			this.error(this.loi);
			kt=0;
		}else if(kt==1){
			var ok=1;
			this.customerObs=this.db.list('Inventory/CUSTOMER/');
			this.Subs=this.customerObs.subscribe(item =>{this.customer=item;});
			this.customer.forEach(element => {
				var a=element["Name"].toLowerCase();
				var b=this.Name.toLowerCase();
				if(a==b){
					ok=0;
					this.loi='Khách hàng đã có! Vui lòng xem lại.'
					this.error(this.loi);
					this.Name=null;
					this.Address=null;
					this.Birthday = new Date(2017,1,1);
					
				}
			});
			var data={
				Name: this.Name,
				DOB: this.Birthday,
				Address: this.Address,
				PersonINP: this.authData.fetchUser()["displayName"],
				DateINP: new Date().toLocaleDateString() + " " +  new Date().toLocaleTimeString(),
				Point: 0 	
			}
		 this.authData.insertDBFree("Inventory/CUSTOMER/",data);
		 console.log("Thành Công!");
		 this.presentToast();
			this.Name=null;
			this.Address=null;
			this.Birthday = new Date(2017,1,1);
		}
	  
	}
	presentToast() {
		const toast = this.ToastCtrl.create({
			message: 'User '+this.authData.fetchUser()["displayName"]+' thêm thành công khách hàng',
			duration: 3000,
			position: 'top'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}
	error(string){
		if(string!=''){
			let alert = this.alertCtrl.create({
				title:'Thông báo!',
				message:string,
				buttons:[
					{
						text: 'OK',
						role: 'cancel',
						handler: data => {}
					}
				]
			});
			alert.present();
		}
		
	}
}
