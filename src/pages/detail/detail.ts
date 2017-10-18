import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the DetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-detail',
  templateUrl: 'detail.html',
})
export class DetailPage {

  statistic:any;
  item:any;
  books:any;
  currItem:any;
  time:any;
  key:any;

  endTime:any;
  startTime:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {

	  this.item = navParams.get('item');
	  this.books = navParams.get('book');
	  this.statistic = navParams.get('type');
    this.time = navParams.get('time');
    this.key = navParams.get('key');
    console.log(this.item);
    console.log(this.books);
    console.log(this.statistic);
    console.log(this.time);
    console.log(this.key);
    
    if(this.statistic == 'month') {
      this.startTime = new Date(this.time.getFullYear(), this.time.getMonth(), this.key);
      this.endTime =  new Date(new Date(this.startTime).setDate(this.startTime.getDate() + 1));
    }
    else if(this.statistic == 'year') {
      this.startTime = new Date(this.time.getFullYear(), this.key - 1, 1);
      this.endTime =  new Date(new Date(this.startTime).setMonth(this.startTime.getMonth() + 1));
    }

    console.log(this.startTime, this.endTime, this.key)

    this.currItem = [];

    this.currItem = this.item.filter((item) => {
      if(this.books[item.key] != undefined) {
        return (item.DateINP >= this.startTime && item.DateINP <= this.endTime);
      }
    })

    console.log(this.currItem)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
