import { Component, onInit, onDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
export class StatisticPage implements onInit, onDestroy {
  sub:any;
  statistic:string = 'day';
  day:any;
  month:any;
  year:any;

  today:any;
  currTime:any;

  allItem:any;
  currItem:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase) {
    var x = new Date();
    x.setHours(0);
    x.setMinutes(0);
    x.setSeconds(0);
	  this.today = new Date(x);
    this.currTime =new Date(x);
    this.allItem = [];

	  this.sub = this.db.list('/statistic/').subscribe(item => {
      this.allItem = item;
      var l = item.length;
      for(var i = 0; i < l; i++) {
        var x = item[i].DateINP;
        var y = Date.parse(x);
        this.allItem[i].DateINP = y;
      }
      this.changeDate();
	  })
  }
  nextDate() {
    this.currTime.setDate(this.currTime.getDate() + 1);
    this.changeDate();
  }
  prvDate() {
    this.currTime.setDate(this.currTime.getDate() - 1);
    this.changeDate();
  }
  changeDate() {
    var x = new Date(this.currTime);
    var y = new Date(this.currTime);
    y.setDate(y.getDate() + 1);
    this.currItem = this.allItem.filter((item) => {
      var time = new Date(item.DateINP);
		  return (time >= x && time <= y);
    })
  }
  onInit() {
  }
  onDestroy() {
    this.sub.unsubscribe();
  }

  ionViewDidLoad() {
    
  }
}

