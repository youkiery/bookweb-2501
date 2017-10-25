import { Component,OnInit,OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController,ToastController, Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ImagePicker } from '@ionic-native/image-picker';
import {FirebaseListObservable, AngularFireDatabase} from 'angularfire2/database';
import  firebase  from 'firebase/app';

import {UploadImagePage} from '../upload-image/upload-image'

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
	Type:any;
	Title:string;
	Price:number;
	Quanlity:number;
	Point:number;
	Bill:number;
	loi:any;
	booksObs: FirebaseListObservable<any>;
	books: Array<any>;
	Subs: any;
	exp:string ="";
	file:any;
	preview:any = '';
	url:any = 'assets/images/1A.jpg';

  constructor(private db: AngularFireDatabase,private ToastCtrl: ToastController,private alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,public authData: AuthServiceProvider,private imagePicker: ImagePicker, public ev:Events)  {
	this.loi='';
		
  	this.ev.subscribe('chose', data => {
		this.url = data.toString();
	})
  }

  ionViewDidLoad() {
	this.imagePicker.getPictures({maximumImagesCount:1}).then((results) => {
  for (var i = 0; i < results.length; i++) {
      this.exp = results[i];
  }
}, (err) => { });    }
  pushB(){
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
			this.loi="vui lòng điền giá bán!";
			kt=0;
			this.error(this.loi);

		}else if(this.Bill==null){
			this.loi="vui lòng điền giá nhập!";
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
					this.Point=null;
				}
				//console.log(element);
			});
			if(ok==1)
			{
				if(this.Point==null){
					this.Point=0;
				}
				
				if(typeof(this.Price) == 'string') {
					this.Price = parseInt(this.Price);
				}
				if(typeof(this.Bill) == 'string') {
					this.Bill = parseInt(this.Bill);
				}
				if(typeof(this.Quanlity) == 'string') {	
					this.Quanlity = parseInt(this.Quanlity);	
				}
				if(typeof(this.Point) == 'string') {	
					this.Point = parseInt(this.Point);
				}
				var data = {		
					Type: this.Type,
					Title: this.Title,
					Price: this.Price,
					Bill: this.Bill,
					Quanlity: this.Quanlity,
					Point: this.Point,
					Inv: 0,
					PersonINP: this.authData.fetchUser()["displayName"],
					DateINP: new Date().toLocaleDateString() + " " +  new Date().toLocaleTimeString(),
					Image: this.url,
					View:0,
					Bought:0
				}
				this.authData.insertDBFree("Inventory/BOOKS/",data);
				this.db.list('/statistic/').push({
					key: this.books[this.books.length - 1].$key,
					number: this.Quanlity,
					DateINP: new Date().toLocaleDateString() + " " +  new Date().toLocaleTimeString(),
					PersonINP: this.authData.fetchUser()["displayName"],
					type: "import"
				})

					//var uploadTask = storageRef.child(this.preview).put(this.file[0]);
					if(this.file != undefined) {
						var storageRef = firebase.storage().ref();
						//var uploadTask = storageRef.child(this.preview).put(this.file[0]);
						var uploadTask = storageRef.child(this.preview);
						uploadTask.put(this.file[0]).then((snapshot) => {
							console.log(this.url);
							this.db.list('Inventory/BOOKS/').update(this.books[this.books.length - 1].$key, {
								Image: snapshot.downloadURL
							});
						})
					}
				
				(<HTMLInputElement>document.getElementById('blah')).src = "assets/images/1A.jpg";
				
				console.log("Thành Công");
				this.presentToast();
				this.Title=null;
				this.Type=null;
				this.Price=null;
				this.Quanlity=null;
				this.Bill=null;
				this.Point=null;
			}
			
		}
	  
  }
  getFile() {
	this.file = (<HTMLInputElement>document.getElementById('file')).files;
	this.preview = this.file[0].name;
	console.log(this.file[0])
	console.log(this.preview);
	
	var reader = new FileReader();
	 reader.onload = function(e) {
		let target: any = e.target;
		let content: string = target.result;
		(<HTMLInputElement>document.getElementById('blah')).src = content;
	  }
	  reader.readAsDataURL(this.file[0]);

	}

  //ngOnInit(){}
	//ngonDestroy(){}
	library() {
		this.navCtrl.push(UploadImagePage, {
			'url': this.url
		})
	}
	presentToast() {
		const toast = this.ToastCtrl.create({
			message: 'User '+this.authData.fetchUser()["displayName"]+' thêm thành công',
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
