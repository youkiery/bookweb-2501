import { Component,OnInit,OnDestroy } from '@angular/core';
<<<<<<< HEAD
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ImagePicker } from '@ionic-native/image-picker';

=======
import { IonicPage, NavController, NavParams,AlertController,ToastController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ImagePicker } from '@ionic-native/image-picker';
import {FirebaseListObservable, AngularFireDatabase} from 'angularfire2/database';
>>>>>>> Huyen1

/**
 * Generated class for the AddBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage{
<<<<<<< HEAD
	Type:string;
	Title:string;
	Price:number;
	Quanlity:number;

  constructor(public navCtrl: NavController, public navParams: NavParams,public authData: AuthServiceProvider,private imagePicker: ImagePicker)  {

=======
	Type:any;
	Title:string;
	Price:number;
	Quanlity:number;
	Diem:number;
	loi:any;
	booksObs: FirebaseListObservable<any>;
	books: Array<any>;
	Subs: any;

  constructor(private db: AngularFireDatabase,private ToastCtrl: ToastController,private alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,public authData: AuthServiceProvider,private imagePicker: ImagePicker)  {
		this.loi='';
		
>>>>>>> Huyen1
  }

  ionViewDidLoad() {
	this.imagePicker.getPictures({maximumImagesCount:1}).then((results) => {
  for (var i = 0; i < results.length; i++) {
      console.log('Image URI: ' + results[i]);
  }
}, (err) => { });    }
  pushB(){
<<<<<<< HEAD
	  var data = {
		  Type: this.Type,
		  Title: this.Title,
		  Price: this.Price,
		  Quanlity: this.Quanlity,
		  Inv: 0,
		  PersonINP: this.authData.fetchUser()["uid"],
		  DateINP: new Date().toLocaleDateString() + " " +  new Date().toLocaleTimeString()	
	  }
	  this.authData.insertDBFree("Inventory/BOOKS/",data);
	  console.log("Thành Công");
  }
  //ngOnInit(){}
  //ngonDestroy(){}

=======
		var kt=1;
		if(this.Type==null){
			this.loi="Chưa chọn nhóm!";
			kt=0;
			this.error(this.loi);
		
		}else if(this.Title==null){
			this.loi="vui lòng không để trống tên!";
			kt=0;
			this.error(this.loi);
			
		}else if(this.Price==null){
			this.loi="vui lòng điền giá!";
			kt=0;
			this.error(this.loi);
			
		}else if(this.Quanlity==null){
			this.loi="vui lòng điền số lượng!";
			kt=0;
			this.error(this.loi);
	
		}else
		
		if(kt==1){
			var ok=1;
			this.booksObs = this.db.list('Inventory/BOOKS/');
			this.Subs = this.booksObs.subscribe(item =>{
				this.books = item;
			});
			
			this.books.forEach(element => {
				var a=element["Title"].toLowerCase();
				var b=this.Title.toLowerCase();
				if(a==b){
					ok=0;
					this.loi="Sản phẩm này đã có! vui lòng xem lại";
					this.error(this.loi);
					this.Title=null;
					this.Type=null;
					this.Price=null;
					this.Quanlity=null;
					this.Diem=null;
				}
				//console.log(element);
			});
			if(ok==1)
			{
				if(this.Diem==null){
					this.Diem=0;
				}
				var data = {		
					Type: this.Type,
					Title: this.Title,
					Price: this.Price,
					Quanlity: this.Quanlity,
					Diem: this.Diem,
					Inv: 0,
					PersonINP: this.authData.fetchUser()["displayName"],
					DateINP: new Date().toLocaleDateString() + " " +  new Date().toLocaleTimeString()	
				}
				this.authData.insertDBFree("Inventory/BOOKS/",data);
				console.log("Thành Công");
				this.presentToast();
				this.Title=null;
				this.Type=null;
				this.Price=null;
				this.Quanlity=null;
				this.Diem=null;
			}
			
		}
	  
  }
  //ngOnInit(){}
	//ngonDestroy(){}
	presentToast() {
		const toast = this.ToastCtrl.create({
			message: 'User '+this.authData.fetchUser()["uid"]+' thêm thành công',
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
>>>>>>> Huyen1
}
