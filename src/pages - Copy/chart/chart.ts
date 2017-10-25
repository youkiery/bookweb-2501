import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';


/**
 * Generated class for the StatisticPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chart',
  templateUrl: 'chart.html',
})
export class ChartPage {
  statistic:string;
  
  startTime:any;
  endTime:any;
  currTime:any;

  item:any;
  books:any;

  data:any;
  cash:number;
  import:number;
  export:number;

  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
    };
    public barChartLabels:string[] =[];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;
    
    public barChartData:any[] = [{data: [], label: 'Tổng chi'}, {data: [], label: 'Tổng thu'}];
    private type = ['other', 'earpipe', 'book'];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private ToastCtrl: ToastController) {
    var number = this.navParams.get('number');
    var data = this.navParams.get('data');

    console.log(data, this.barChartData );
    var a = [];
    var b = [];

    for(var i = 0; i < number; i++) {
      if(number == 3) {
        this.barChartLabels[i] = this.type[i];
      }
      else {
        this.barChartLabels[i] = (i + 1).toString();
      }
      a.push(data[number - i - 1][1]);
      b.push(data[number - i - 1][2]);
    }
    this.barChartData[0].data = a;
    this.barChartData[1].data = b;
    console.log(this.barChartData, this.barChartLabels)
  }
}
