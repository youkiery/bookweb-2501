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
  item:any;
  day:any;
  month:any;
  year:any;
  time:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase) {
	var time = Date.now();
	this.item = [];
	this.sub = this.db.list('/statistic/').subscribe(item => {
	  this.item = item;
	  item.forEach(date => {
      var x = date.DateINP;
      var y = Date.parse(x);
      var z = new Date(y);
	    console.log(z.getDate());
	  })
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

