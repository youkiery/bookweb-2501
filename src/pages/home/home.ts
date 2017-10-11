import { Component,ViewChild,OnInit,OnDestroy  } from '@angular/core';
import { NavController,Slides,Events, NavParams,Tabs, AlertController, ToastController } from 'ionic-angular';
//import { SuperTabsModule } from 'ionic2-super-tabs';
import { SignupPage } from '../signup/signup';
import { ListPage } from '../list/list';
import { AddBookPage } from '../add-book/add-book';
import {FirebaseListObservable,AngularFireDatabase} from 'angularfire2/database';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit,OnDestroy {

  @ViewChild('mySlider') slider: Slides;
  selectedSegment: string;
  slides: Array<any>;
  booksObs: FirebaseListObservable<any>;
  books: Array<any>;
  checkDiv: boolean = false;	
 // ids:any;
  BooksOrder: Array<any>=[];
  tabs: Tabs;
  Subs: any;
  hidden: boolean;
  myInput:any;
  isButton: any = {};
  st:string;
  booklists: any;
  
  constructor(public authData: AuthServiceProvider, private ToastCtrl: ToastController, private alertCtrl: AlertController, public navCtrl: NavController,private db: AngularFireDatabase, private events:Events, public navParams: NavParams, private authdata: AuthServiceProvider) {

}
ngOnInit(){
	
	this.booklists = [];
	this.tabs = this.navCtrl.parent;	
	this.events.subscribe("Filter",ids=>{
		if(ids ===1){
		this.isButton = {};
		}
		else{
			console.log(this.isButton);
			console.log(ids);
			this.isButton[ids] = false;
			console.log(this.isButton);
		}
		})
	this.slides = [
      {
        id: "book",
        title: "BOOK"
      },
      {
        id: "earpipe",
        title: "EAR PIPE"
      },
	  {
		  id:"other",
		  title:"OTHER"
	  }
    ];
	this.selectedSegment = this.slides[0].id;
	this.booksObs = this.db.list('Inventory/BOOKS/');
	this.Subs = this.booksObs.subscribe(item =>{
		this.books = item;
		this.booklists = [];
		this.slides.forEach(type => {
			this.booklists[type.id] = []
		})
		var book_number = item.length;
		for(var i = 0; i < book_number; i++) {
			if(item[i].Type == this.slides[0].id) {
				this.booklists[this.slides[0].id].push(item[i]);
			}
			else if(item[i].Type == this.slides[1].id) {
				this.booklists[this.slides[1].id].push(item[i]);
			}
			else {
				this.booklists[this.slides[2].id].push(item[i]);
			}
		}
	})

}
ionViewDidEnter(){
	this.BooksOrder = this.authdata.BooksOrder();
}
ngOnDestroy(){
	console.log('OK');
	this.Subs.unsubscribe();
	
}
 onSegmentChanged(segmentButton) {
    console.log("Segment changed to", segmentButton.value);
	
    const selectedIndex = this.slides.findIndex((slide) => {
      return slide.id === segmentButton.value;
    });
	//console.log(selectedIndex);
    this.slider.slideTo(selectedIndex);
	
  }
  
  onSlideChanged(slider) {
	
	if(slider.getActiveIndex() < this.slides.length){
const currentSlide = this.slides[slider.getActiveIndex()];
    this.selectedSegment = currentSlide.id;
	
		console.log(this.booklists[this.selectedSegment])
	}
	  
	
	
  }  
onBlur(ev){
	this.hidden = !this.hidden;
} 
onFocus(ev){
	this.hidden = !this.hidden;
	
}
onInput(event){
	//console.log(event);
	this.Subs = this.booksObs.subscribe(item =>{
		
		this.books = item;
	})
	
	let val = event.target.value;

    if (val && val.trim() != '') {
      this.books = this.books.filter((item) => {
        return (item.Title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
	  	var book_number = this.books.length;
		for(var i = 0; i < book_number; i++) {
			if(item[i].Type == this.slides[0].id) {
				this.booklists[this.slides[0].id].push(item[i]);
			}
			else if(item[i].Type == this.slides[1].id) {
				this.booklists[this.slides[1].id].push(item[i]);
			}
			else {
				this.booklists[this.slides[2].id].push(item[i]);
			}
		}
	
    }
	
}

  pushBook(){
	  this.navCtrl.push(AddBookPage);
  }
  pushOrder(){
	  this.tabs.select(1);
  }
  ButtonTap(key): any{
	  return this.isButton[key];
	 	 		
  }
  orderBook(Title,key,price,inv,quan){
	 this.isButton[key] = true;
	  this.checkDiv = true;
	  console.log();
	  var data = {
		  Title: Title,
		  key: key,
		  Price: price,
		  sold: 1,
		  Inv: inv,
		  Quanlity: parseInt(quan)
	  }
		this.authdata.BooksPush(data);
  
	}
	
	sua(Title, key, price, Diem){
		let alert = this.alertCtrl.create({
			title:'Sửa thông tin',
			inputs:[
				{
					name:'ten',
					placeholder:'Tên: '+Title
				},
				{
					name:'gia',
					type: 'number',
					placeholder:'Giá: '+price
				},
				{
					name:'diem',
					type: 'number',
					placeholder:'Điểm: '+Diem
				}
			],
			buttons:[
				{
          text: 'Hủy',
          role: 'cancel',
          handler: data => {}
				},
				{
					text: 'Chấp nhận',
          handler: data => {
						if(data.ten==null){data.ten=Title;};
						if(data.gia==null){data.gia=price;};
						if(data.diem==null){data.diem=Diem;}
						var d= new Date();
            var s =  d.toLocaleDateString()+ ' ' +  d.toLocaleTimeString();
						this.db.list('Inventory/BOOKS/').update(key,{
							DateINP: s,
							Title: data.ten,
							Diem: data.diem,
							PersonINP: this.authdata.fetchUser()["displayName"],
							Price: data.gia
						});
						this.st="Sửa thành công!";
						this.presentToast();
					}
				}
			]
		});
		alert.present();
	}
  nhap(Title,key,soluong){
		let alert = this.alertCtrl.create({
			title:'Nhập số lượng',
			message:'Sách '+Title,
			inputs:[
				{
					name:'sl',
					type:'number',
					placeholder:'0'
				}
			],
			buttons:[
				{
          text: 'Hủy',
          role: 'cancel',
          handler: data => {}
				},
				{
					text: 'Chấp nhận',
          handler: data => {
						if(data.sl!=null){
							var d= new Date();
							var s =  d.toLocaleDateString()+ ' ' +  d.toLocaleTimeString();
							var t=soluong+parseInt(data.sl);
							
							this.db.list('Inventory/BOOKS/').update(key,{
								DateINP: s,
								PersonINP: this.authdata.fetchUser()["displayName"],
								Quanlity: t
							});
							this.st="Nhập thành công!";
							this.presentToast();
						}else{};
						
					}
				}
			]
		});
		alert.present();
	} 
	presentToast() {
		const toast = this.ToastCtrl.create({
			message: 'User '+this.authData.fetchUser()["displayName"]+' '+this.st,
			duration: 3000,
			position: 'top'
		});
		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}
}