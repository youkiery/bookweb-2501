import { Component,ViewChild,OnInit,OnDestroy,  trigger,
  state,
  style,
  animate,
  transition,keyframes  } from '@angular/core';
import { NavController,Slides,Events, NavParams,Tabs, AlertController, ToastController, PopoverController } from 'ionic-angular';
//import { SuperTabsModule } from 'ionic2-super-tabs';
import { SignupPage } from '../signup/signup';
import { ListPage } from '../list/list';
import { AddBookPage } from '../add-book/add-book';
import {FirebaseListObservable,AngularFireDatabase} from 'angularfire2/database';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';


import { AddCustomerPage } from '../add-customer/add-customer';
import { BillPage } from '../bill/bill';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  animations: [
    trigger('bounce', [
      state('bouncing', style({
        transform: 'translate3d(0,0,0)',
		color:'yellow',
		textWeight: 'bold',
		fontSize: '1.3em'
		
		
      })),
	  state('noBounce', style({
		  color:'yellow',
		  textWeight: 'bold',
		fontSize: '1.3em'
		 
	  })),
      transition('* => *', [
	    
        animate('300ms ease-in-out', keyframes([
          style({transform: 'translate3d(0,0,0)', offset: 0}),
          style({transform: 'translate3d(0,-10px,0)', offset: 0.5}),
          style({transform: 'translate3d(0,0,0)', offset: 1}),
		  
		  
        ]))
	   
  ])
  ])]
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
  myInput:any;
  isButton: any = {};
  st:string;
  booklists: any;
  bounceState: String = 'Bounce';
  customersObs: FirebaseListObservable<any>;
  customers: Array<any>=[];
  cusname: string = "Khách";
  DataS: Array<any>=[];
  checkFind : boolean;
 sumBooks: number = 0;

  constructor(public authData: AuthServiceProvider, private ToastCtrl: ToastController, private alertCtrl: AlertController, public navCtrl: NavController,private db: AngularFireDatabase, private events:Events, public navParams: NavParams, public popCtrl:PopoverController) {

}
ngOnInit(){
	this.booklists = [];
	this.tabs = this.navCtrl.parent;	
	this.events.subscribe("FilterFix",ids=>{
		
			//console.log(this.isButton);
			//console.log(ids);
			this.isButton[ids] = false;
			this.DataS = this.authData.BooksOrder();
			//console.log(this.isButton);
		
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

	this.events.subscribe("Filter",dt=>{
    	 this.authData.Books = [];
	  this.authData.isButton = {};
	  this.authData.sumBooks = 0;
	  this.authData.customer = {};
	this.isButton = this.authData.isButton;
	this.sumBooks = this.authData.sumBooks;
	this.DataS = this.authData.BooksOrder();
		this.cusname = "Khách";
		this.bounceState = "Bounce";


	});
this.customersObs = this.db.list('Inventory/CUSTOMER/');
this.Subs = this.customersObs.subscribe(data=>{
	this.customers = data;
	
	
})
	
}
ionViewDidEnter(){
	//this.BooksOrder = this.authData.BooksOrder();
	this.isButton = this.authData.isButton;
	
	this.DataS = this.authData.BooksOrder();
	console.log(this.DataS);
}
ngOnDestroy(){
	console.log('OK');
	this.Subs.unsubscribe();


	
}
BooksTotal(){
		this.sumBooks = this.authData.sumBooks;
		for(var i = 0;i<this.authData.BooksOrder().length;i++){
			this.sumBooks+=parseInt(this.authData.BooksOrder()[i].sold)*parseInt(this.authData.BooksOrder()[i].Price);
		}
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
} 
onFocus(ev){
	
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
  orderBook(Title,key,price,inv,quan, Bought, Point, View){
	 this.isButton[key] = true;
		this.checkDiv = true;
		console.log(View);
	  //this.bounceState = (this.bounceState == 'bouncing') ? 'noBounce' : 'bouncing'; 

	
	  var data = {
		  Title: Title,
		  key: key,
		  Price: price,
		  sold: 1,
		  Inv: inv,
		  Quanlity: parseInt(quan),
		  Bought: Bought,
		  Point: Point
	  }
		this.authData.BooksPush(data);
		this.db.list('/Inventory/BOOKS/').update(key, {
			View: View + 1
		})
		this.BooksTotal();
		//console.log(this.authData.BooksOrder());
		
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
					placeholder:'Thêm số lượng: 0'
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
						var s = d.toLocaleDateString()+ ' ' +  d.toLocaleTimeString();
						var sl = parseInt(data.sl);
						this.db.list('Inventory/BOOKS/').update(key,{
							DateINP: s,
							Title: data.ten,
							Point: data.diem,
							PersonINP: this.authData.fetchUser()["displayName"],
							Price: data.gia,
							Quanlity: soluong + sl
						});
						this.db.list('Inventory/BOOKS/'+key+'/log/').push(JSON.stringify({
							DateINP: s,
							PersonINP: this.authData.fetchUser()["displayName"],
							Quanlity: sl
						}));
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

	
onBlur2(ev){
	this.myInput2 = "";
	//this.checkFind = !(this.checkFind);
	this.Subs = this.customersObs.subscribe(data=>{
		this.customers = data;
		
	})
	
} 
onFocus2(ev){
	//this.checkFind = !(this.checkFind);
	
}
onInput2(event){
	this.Subs = this.customersObs.subscribe(data=>{
		this.customers = data;
		
	})

	let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.customers = this.customers.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
	
}

pushCus(){
	  this.navCtrl.push(AddCustomerPage);
  }
SelectCus(ev,key,cname, point){
	  if(this.DataS.length > 0){ 
	   this.cusname = cname;
	  setTimeout(()=>{	 this.bounceState = (this.bounceState == 'bouncing') ? 'noBounce' : 'bouncing';
},100);
	  //this.checkFind = false;
	  this.authData.customer = {
			key: key,
			point: point
	  }
	  }
  }
BuyConfirm(){
	if(this.cusname === "Khách"){
		this.authData.alertText(0,"Vui lòng chọn Khách Hàng!");
	}
	else{
		let popover = this.popCtrl.create(BillPage);
		console.log(this.authData.BooksOrder())

    popover.present();
  
	}
}  
CQuanlity(val,index){
	  if(val === "sub"){
		  if(this.authData.BooksOrder()[index].sold >0){
			  this.authData.BooksOrder()[index].sold-=1;
			  if(this.authData.BooksOrder()[index].sold ===0){
				this.events.publish("FilterFix",this.authData.BooksOrder()[index].key);
			  this.authData.BooksOrder().splice(index,1);
			  
			  }
		  }
		if(this.authData.BooksOrder().length===0){  this.events.publish("FilterFix",1)};
	  }
	  else{
		  var q = this.authData.BooksOrder()[index].sold;
		  console.log(this.authData.BooksOrder()[index].Inv + q,this.authData.BooksOrder()[index].Quanlity);
		  if((this.authData.BooksOrder()[index].Inv + q)  === parseInt(this.authData.BooksOrder()[index].Quanlity)){
			  this.authData.alertText(1,"Trong kho đã hết sách này");
		  }  
		  else{
		  this.authData.BooksOrder()[index].sold+=1;
		  }
	  }
	  			this.BooksTotal();

	}

	  
}