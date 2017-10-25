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
  statistic:string = 'day';
  
  books:any = [];
  
  minTime:any;
  maxTime:any;
  startTime:any;
  endTime:any;

  currTime:any;

  allItem:any;
  currItem:any = [];

  data:any = [];
  cash:number[] = [0,0,0];
  import:number[] = [0,0,0];
  export:number[] = [0,0,0];
  currRp:any[] = [[],[],[]];

  g:{} = {'day': [0,0,0], 'month': [0,0,0], 'year': [0,0,0]};
  dTotal:any[] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  mTotal:any[] = new Array(31).fill([0,0,0]);
  yTotal:any[] = new Array(12).fill([0,0,0]);

  daynum:number = 0;

  dItem:any[] = [[],[],[]];
  mItem:any[] = [];
  yItem:any[] = [];

  dStart:any;
  dEnd:any;
  mStart:any;
  mEnd:any;
  yStart:any;
  yEnd:any;
  d1:any[] = [];
  d2:any[] = [0,0,0];

  private type = ['book', 'earpipe', 'other'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private ToastCtrl: ToastController) {
    this.currTime = new Date();
    
    this.subSt = this.db.list('/statistic/').subscribe(item => {
      this.allItem = [];
      this.allItem = JSON.parse(JSON.stringify(item));
      var min = 0, max = 0;
      
	    this.subBo = this.db.list('/Inventory/BOOKS/').forEach(books_item => {
	      this.books = [];
	      books_item.forEach(book => {
	    	this.books[book.$key] = book;
	      })
        var l = item.length;
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
		      }
        }
        this.minTime = new Date(min);
        this.maxTime = new Date(max);
        this.changeTime();
	    })
    })
  }
  
  prvDay() {
    if(this.minTime < this.currTime) {
        this.currTime.setDate(this.currTime.getDate() - 1);
        this.changeTime();
    } 
    else {
      this.notice();
    }
  }
  
  nextDay() {
    if(this.maxTime > this.currTime) {
        this.currTime.setDate(this.currTime.getDate() + 1);
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
    this.dStart = new Date(this.currTime.getFullYear(), this.currTime.getMonth(),  this.currTime.getDate(), 0);
    this.dEnd = new Date(this.currTime.getFullYear(), this.currTime.getMonth(),  this.currTime.getDate() + 1, 0);
    
    this.mStart = new Date(this.currTime.getFullYear(), this.currTime.getMonth(), 1);
    this.mEnd =  new Date(this.currTime.getFullYear(), this.currTime.getMonth() + 1, 1);
    
    this.yStart = new Date(this.currTime.getFullYear(), 1);
    this.yEnd =  new Date(this.currTime.getFullYear() + 1, 1);

    this.g = {'day': [0,0,0], 'month': [0,0,0], 'year': [0,0,0]};
    
    this.currRp = [[],[],[]];
    
	  this.dTotal = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    this.yTotal = [];

    this.d1 = [];
    this.d2 = [0,0,0];

    this.mItem = new Array(12).fill([]);
    this.dItem = [[],[],[]];

    this.daynum = new Date(this.currTime.getFullYear(), this.currTime.getMonth() + 1, 0).getDate();
    this.mTotal = [];
    for(var i = 0; i < 31; i++) {
      this.mTotal[i] = [0,0,0];
      this.mItem[i] = [];
    }
    for(var i = 0; i < 12; i++) {
      this.yTotal[i] = [0,0,0];
    }

    this.yItem = this.allItem.filter((item) => {
      if(this.books[item.key] != undefined) {
        return (item.DateINP >= this.yStart && item.DateINP <= this.yEnd);
      }
    })

    console.log(this.mTotal, this.mStart, this.mEnd, this.daynum)

	  this.yItem.forEach(item => {
      if(item.key !== undefined) {
        var yIndex = 12 - item.DateINP.getMonth();
        var mIndex = this.daynum - item.DateINP.getDate();
        var dIndex = this.type.indexOf(this.books[item.key].Type);
        var m = 0;
        var d = 0;

        if(item.DateINP >= this.mStart && item.DateINP <= this.mEnd) {
          m = 1;
        }

        if(item.DateINP >= this.dStart && item.DateINP <= this.dEnd) {
          d = 1;
        }

        if(item.type == "import") {
          var change = this.books[item.key].Bill * item.number;
          this.g['year'][0] -= change;
          this.g['year'][1] += change;
          this.yTotal[yIndex][0] -= change;
          this.yTotal[yIndex][1] += change;
          if(m) {
            this.g['month'][0] -= change;
            this.g['month'][1] += change;
            this.mTotal[mIndex][0] -= change;
            this.mTotal[mIndex][1] += change;
            this.mItem[mIndex].push(item);
          }
          if(d) {
            this.g['day'][0] -= change;
            this.g['day'][1] += change;
            this.dTotal[dIndex][0] -= change;
            this.dTotal[dIndex][1] += change;
            this.d1.push(item);
            this.d2[dIndex] += item.number;
            this.dItem[dIndex].push(item);
          }
        }
        else if(item.type == "sold") {
          var change = this.books[item.key].Price * item.number;
          this.g['year'][0] += change;
          this.g['year'][2] += change;
          this.yTotal[yIndex][0] += change;
          this.yTotal[yIndex][2] += change;
          if(m) {
            this.g['month'][0] += change;
            this.g['month'][2] += change;
            this.mTotal[mIndex][0] += change;
            this.mTotal[mIndex][2] += change;
            this.mItem[mIndex].push(item);
          }
          if(d) {
            this.g['day'][0] += change;
            this.g['day'][2] += change;
            this.dTotal[dIndex][0] += change;
            this.dTotal[dIndex][2] += change;
            this.d1.push(item);
            this.d2[dIndex] += item.number;
            this.dItem[dIndex].push(item);
          }
        }
      }
    })
    console.log(this.yTotal, this.yItem[2]);
  }

  getThisDate(date, index) {
    this.navCtrl.push(DetailPage, {
      'date': date,
      'time': this.currTime,
      'data': this.mItem[index],
      'book': this.books
    })
  }

  gotoMonth(index) {
    this.currTime.setMonth(12 - index - 1);
    this.statistic = 'month';
  }

  getChart() {
      switch (this.statistic) {
        case 'day':
          this.navCtrl.push(ChartPage, {
            number: 3,
            data: this.dTotal
          });
          break;
        case 'month':
          this.navCtrl.push(ChartPage, {
            number: this.daynum,
            data: this.mTotal
          });
          break;
        case 'year':
          this.navCtrl.push(ChartPage, {
            number: 12,
            data: this.yTotal
          });
          break;
      }
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
    this.currTime = new Date();
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
