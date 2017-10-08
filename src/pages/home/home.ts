import { Component,ViewChild,OnInit,OnDestroy,  trigger,
  state,
  style,
  animate,
  transition,keyframes  } from '@angular/core';
import { NavController,Slides,Events, NavParams,Tabs } from 'ionic-angular';

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
  bounceState: String = 'noBounce';
  
  
  constructor(public navCtrl: NavController,private db: AngularFireDatabase, private events:Events, public navParams: NavParams, private authdata: AuthServiceProvider) {

}
ngOnInit(){
	
	this.tabs = this.navCtrl.parent;	
	this.selectedSegment = 'book';
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
	this.booksObs = this.db.list('Inventory/BOOKS/');
	this.Subs = this.booksObs.subscribe(item =>{
		this.books = item;
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
	      this.bounceState = (this.bounceState == 'bouncing') ? 'noBounce' : 'bouncing'; 
//this.bounceState = 'noBounce'; 		  

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
   
}