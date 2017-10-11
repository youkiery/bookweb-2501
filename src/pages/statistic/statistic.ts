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
  }
  onInit() {
/*
  var date = new Date();
	this.time = date.now();
	console.log(this.time, this.time.toLocaleString());
	this.item = [];
	this.sub = this.db.list('/statistic/').subscribe(item => {
	  this.item = item;
	})
*/  }
  onDestroy() {
    this.sub.unsubscribe();
  }

  ionViewDidLoad() {
    
  }
}

