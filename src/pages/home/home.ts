import { Component,ViewChild,OnInit,OnDestroy,  trigger,
  state,
  style,
  animate,
  transition,keyframes  } from '@angular/core';
import { NavController,Slides,Events, NavParams,Tabs, AlertController, ToastController } from 'ionic-angular';
//import { SuperTabsModule } from 'ionic2-super-tabs';
import { SignupPage } from '../signup/signup';
import { ListPage } from '../list/list';
import { AddBookPage } from '../add-book/add-book';
import {FirebaseListObservable,AngularFireDatabase} from 'angularfire2/database';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('bounce', [
      state('bouncing', style({
        transform: 'translate3d(0,0,0)'
      })),
      transition('* => *', [
        animate('300ms ease-in', keyframes([
          style({transform: 'translate3d(0,0,0)', offset: 0}),
          style({transform: 'translate3d(0,-10px,0)', offset: 0.5}),
          style({transform: 'translate3d(0,0,0)', offset: 1})
        ]))
      ])
    ])
  ]
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
  bounceState: String = 'noBounce';
  
  constructor(public authData: AuthServiceProvider, private ToastCtrl: ToastController, private alertCtrl: AlertController, public navCtrl: NavController,private db: AngularFireDatabase, private events:Events, public navParams: NavParams) {

}
ngOnInit(){
	
	this.booklists = [];
	this.tabs = this.navCtrl.parent;	
	this.events.subscribe("Filter",ids=>{
		
			console.log(this.isButton);
			console.log(ids);
			this.isButton[ids] = false;
			console.log(this.isButton);
		
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
	this.BooksOrder = this.authData.BooksOrder();
	this.isButton = this.authData.isButton;
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
	let val = event.target.value;
	var books = JSON.parse(JSON.stringify(this.books));
	
	books = this.books.filter((item) => {
		return (item.Title.toLowerCase().indexOf(val.toLowerCase()) > -1);
	})

	this.booklists = [];
	this.slides.forEach(type => {
		this.booklists[type.id] = []
	})

  	var book_number = books.length;
	for(var i = 0; i < book_number; i++) {
		if(books[i].Type == this.slides[0].id) {
			this.booklists[this.slides[0].id].push(books[i]);
		}
		else if(books[i].Type == this.slides[1].id) {
			this.booklists[this.slides[1].id].push(books[i]);
		}
		else {
			this.booklists[this.slides[2].id].push(books[i]);
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
	  this.bounceState = (this.bounceState == 'bouncing') ? 'noBounce' : 'bouncing'; 

	  console.log();
	  var data = {
		  Title: Title,
		  key: key,
		  Price: price,
		  sold: 1,
		  Inv: inv,
		  Quanlity: parseInt(quan)
	  }
		this.authData.BooksPush(data);
  
	}
	
	sua(Title, key, price, point, soluong){
		//this.authData.alertText(0,"");
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
					placeholder:'Điểm: '+point
				},
				{
					name:'sl',
					type:'number',
					placeholder:'Số lượng: 0'
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
						if(data.ten==""){data.ten=Title;};
						if(data.gia==""){data.gia=price;};
						if(data.diem==""){data.diem=point;}
						if(data.sl==""){data.sl=0};
						var d= new Date();
						var s =  d.toLocaleDateString()+ ' ' +  d.toLocaleTimeString();
						var t=soluong+parseInt(data.sl);
						this.db.list('Inventory/BOOKS/').update(key,{
							DateINP: s,
							Title: data.ten,
							Point: data.diem,
							PersonINP: this.authData.fetchUser()["displayName"],
							Price: data.gia,
							Quanlity: t
						});
						this.st="Thành công!";
						this.presentToast();
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