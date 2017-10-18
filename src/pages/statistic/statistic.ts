import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';

import { ChartPage } from '../chart/chart'
import { DetailPage } from '../detail/detail'



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
  statistic:string = 'month';
  
  books:any;
  
  minTime:any;
  maxTime:any;
  startTime:any;
  endTime:any;

  now:any;
  currTime:any;

  allItem:any;
  currItem:any;

  data:any;
  cash:number;
  import:number;
  export:number;

  private type = ['book', 'earpipe', 'other'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private ToastCtrl: ToastController) {

    this.now = new Date(Date.now());
    this.currTime = new Date(this.now);
    
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
        for(var i = 0; i < l; i++) {
		      if(this.books[item[i].key] !== undefined) {
            var x = item[i].DateINP;
            var y = Date.parse(x);
            this.allItem[i].DateINP = new Date(y);
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
        this.changeTime();
	    })
    })
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
	  this.cash = 0;
	  this.import = 0;
    this.export = 0;

    this.data = [];
    var i;

    if(this.statistic == 'month') {
      this.startTime = new Date(this.currTime.getFullYear(), this.currTime.getMonth(), 1);
      this.endTime =  new Date(this.currTime.getFullYear(), new Date(new Date(this.currTime).setMonth(this.currTime.getMonth() + 1)).getMonth(), 1);

      var daynum = new Date((new Date(this.endTime).setDate(0))).getDate();
      for(i = 1; i <= daynum; i ++) {
        this.data[i] = new Array(3).fill(0);
      }
    }
    else if(this.statistic == 'year') {
      this.startTime = new Date(this.currTime.getFullYear(), 1);
      this.endTime =  new Date(new Date(new Date(this.currTime).setFullYear((this.currTime.getFullYear() + 1))).getFullYear(), 1);
      
      for(i = 1; i <= 12; i ++) {
        this.data[i] = new Array(3).fill(0);
      }
    }

    
    console.log(this.startTime, this.endTime)
    
    this.currItem = this.allItem.filter((item) => {
      if(this.books[item.key] != undefined) {
        return (item.DateINP >= this.startTime && item.DateINP <= this.endTime);
      }
    })

	  this.currItem.forEach(item => {
      if(item.key !== undefined) {
        var change = this.books[item.key].Price * item.number
        if(this.statistic == 'month') {
          this.data[item.DateINP.getDate()][this.type.indexOf(this.books[item.key].Type)] += change;
        }
        else if(this.statistic == 'year') {
          console.log(item.DateINP.getMonth() + 1)
          this.data[item.DateINP.getMonth() + 1][this.type.indexOf(this.books[item.key].Type)] += change;
        }
	  	  if(item.type == "import") {
          this.cash -= change;
          this.import += change;
	  	  }
	  	  else if(item.type == "sold") {
	  	  	this.cash += this.books[item.key].Price * item.number;
          this.export += change;
	  	  }
      }
    })
    this.data.splice(0, 1)
    console.log(this.data)
  }

  getChart() {
    let navCtrl = this.navCtrl.push(ChartPage, {
      'type': this.statistic,
      'time': this.currTime,
      'item': this.currItem,
      'book': this.books,
      'cash': this.cash,
      'import': this.import,
      'export': this.export
    });
  }
  detail(key) {
    let navCtrl = this.navCtrl.push(DetailPage, {
      'type': this.statistic,
      'time': this.currTime,
      'key': key + 1,
      'item': this.currItem,
      'book': this.books,
    });
  }
  
  changeTab() {
  	this.currTime = new Date(this.now);
    this.changeTime();
  }
  
  notice() {
    const toast = this.ToastCtrl.create({
      message: 'Quá hạn!',
      duration: 3000,
      position: 'top'
    });
    toast.present();
  }
  

  ionViewDidLoad() {    
  }
}
