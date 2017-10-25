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
  g:number[] = [0,0,0];
  dTotal:any[] = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
  dItem:any[] = [[],[],[]];
  date:any;
  time:any;
  books:any;

  private type = ['book', 'earpipe', 'other'];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    var dItem = this.navParams.get('data');
    this.date = this.navParams.get('date');
    this.time = this.navParams.get('time');
    this.books = this.navParams.get('book');
	  this.dTotal = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];

    console.log(dItem)
	  dItem.forEach(item => {
      if(item.key !== undefined) {
        var dIndex = this.type.indexOf(this.books[item.key].Type);

        if(item.type == "import") {
          var change = this.books[item.key].Bill * item.number;
            this.g[0] -= change;
            this.g[1] += change;
            this.dTotal[dIndex][0] -= change;
            this.dTotal[dIndex][1] += change;
          }
        else if(item.type == "sold") {
          var change = this.books[item.key].Price * item.number;
            this.g[0] += change;
            this.g[2] += change;
            this.dTotal[dIndex][0] += change;
            this.dTotal[dIndex][2] += change;
          }
            this.dItem[dIndex].push(item)
        }
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DetailPage');
  }

}
