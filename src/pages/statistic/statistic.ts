import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database'


/**
 * Generated class for the StatisticPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-statistic',
  templateUrl: 'statistic.html',
})
export class StatisticPage {
  subSt:any;
  subBo:any;
  statistic:string = 'date';
  
  books:any;
  increase:number;
  
  minTime:any;
  maxTime:any;

  today:any;
  currTime:any;

  allItem:any;
  currItem:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private ToastCtrl: ToastController) {
    var x = new Date();
    x.setHours(0);
    x.setMinutes(0);
    x.setSeconds(0);
    this.today = new Date(x);
    this.currTime = new Date(x);
	this.books = [];
    
	
    this.subSt = this.db.list('/statistic/').subscribe(item => {
      this.allItem = [];
      this.allItem = item;
      var l = item.length;
      var min = 0, max = 0;
    
	  this.subBo = this.db.list('/Inventory/BOOKS/').forEach(books_item => {
	    this.books = [];
	    books_item.forEach(book => {
	  	this.books[book.$key] = book;
	  	this.books[book.$key].total = 0;
	    })
	    console.log(this.books);
        for(var i = 0; i < l; i++) {
		  console.log(this.books[item[i].key])
		  if(this.books[item[i].key] !== undefined) {
            var x = item[i].DateINP;
            var y = Date.parse(x);
            
            this.allItem[i].DateINP = x;
            
            if(max < y) {
              max = y;
            }
            if(min == 0) {
              min = y;
            }
            else if(min > y) {
              min = y;
            }
		    
		    this.books[item[i].key].total += item[i].number;
		  }
        }
        this.minTime = new Date(min);
        this.maxTime = new Date(max);
	    console.log(this.minTime, this.maxTime)
        this.changeTime();
	    })
      })
    }
  
  nextDate() {
    if(this.maxTime > this.currTime) {
        this.currTime.setDate(this.currTime.getDate() + 1);
        this.changeTime();
    } 
    else {
      this.notice();
    }
  }
  
  prvDate() {
    if(this.minTime < this.currTime) {
        this.currTime.setDate(this.currTime.getDate() - 1);
        this.changeTime();
    } 
    else {
      this.notice();
    }
  }
  
  nextMonth() {
    if(this.maxTime > this.currTime) {
        this.currTime.setMonth(this.currTime.getMonth() + 1);
        this.changeTime();
    } 
    else {
      this.notice();
    }
  }
  
  prvMonth() {
    if(this.minTime < this.currTime) {
        this.currTime.setMonth(this.currTime.getMonth() - 1);
        this.changeTime();
    } 
    else {
      this.notice();
    }
  }
  
  nextYear() {
    if(this.maxTime > this.currTime) {
        this.currTime.setFullYear(this.currTime.getFullYear() + 1);
        this.changeTime();
    } 
    else {
      this.notice();
    }
  }
  
  prvYear() {
    if(this.minTime < this.currTime) {
        this.currTime.setFullYear(this.currTime.getFullYear() - 1);
        this.changeTime();
    } 
    else {
      this.notice();
    }
  }
  
  changeTime() {
	this.increase = 0;
    var x = new Date(this.currTime);
    var y = new Date(this.currTime);
    
    switch(this.statistic) {
      case 'date':
        y.setDate(y.getDate() + 1);
		break;
      
      case 'month':
        x.setDate(1);
        y.setDate(1);
        y.setMonth(y.getMonth() + 1);
		break;
      
      case 'year':
        x.setDate(1);
        y.setDate(1);
        x.setMonth(1);
        y.setMonth(1);
        y.setFullYear(y.getFullYear() + 1);
		break;
    }
  
    this.currItem = this.allItem.filter((item) => {
	  if(this.books[item.key] != undefined) {
        var time = new Date(item.DateINP);
        return (time >= x && time <= y);
	  }
    })
	
	this.currItem.forEach(item => {
		if(item.type == "import" && item.key !== undefined) {
			this.increase -= this.books[item.key].Price * item.number;
		}
		if(item.type == "sold" && item.key !== undefined) {
			this.increase += this.books[item.key].Price * item.number;
		}
	})
	
  }
  
  changeTab() {
	this.currTime = new Date(this.today);
    this.changeTime();
  }
  
  notice() {
    const toast = this.ToastCtrl.create({
      message: 'Quá hạn!',
      duration: 3000,
      position: 'top'
    });
    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });
    toast.present();
  }

  ionViewDidLoad() {
    
  }
}

