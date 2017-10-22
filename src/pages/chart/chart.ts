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
    
    public barChartData:any[] = [
    {data: [], label: 'Tổng chi'},
    {data: [], label: 'Doanh thu'}
    ];

  constructor(public navCtrl: NavController, public navParams: NavParams, private db: AngularFireDatabase, private ToastCtrl: ToastController) {

	  this.item = navParams.get('item');
	  this.books = navParams.get('book');
	  this.statistic = navParams.get('type');
    this.currTime = navParams.get('time');
    this.cash = navParams.get('cash');
    this.import = navParams.get('import');
    this.export = navParams.get('export');

    console.log(this.cash)

    this.data = [];
    this.barChartLabels = [];
    if(this.statistic == 'month') {
      this.startTime = new Date(this.currTime.getFullYear(), this.currTime.getMonth(), 1);
      this.endTime =  new Date(this.currTime.getFullYear(), new Date(new Date(this.currTime).setMonth(this.currTime.getMonth() + 1)).getMonth(), 1);

      var daynum = new Date((new Date(this.endTime).setDate(0))).getDate();
      this.data.import = new Array(daynum).fill(0);
      this.data.sold = new Array(daynum).fill(0);
      
      for(var i = 1; i <= daynum; i++) {
        this.barChartLabels.push(i.toString());
      }
      
	    this.item.forEach(item => {
        if(item.key !== undefined) {
          var change = this.books[item.key].Price * item.number
	    	  if(item.type == "import") {
            this.data.import[item.DateINP.getDate() - 1] += change;
	    	  }
	    	  else if(item.type == "sold") {
            this.data.sold[item.DateINP.getDate() - 1] += change;
	    	  }
        }
      })
    }
    else if(this.statistic == 'year') {
      this.startTime = new Date(this.currTime.getFullYear(), 1);
      this.endTime =  new Date(new Date(new Date(this.currTime).setFullYear((this.currTime.getFullYear() + 1))).getFullYear(), 1);
      
      var yearnum = this.endTime.getFullYear() - this.startTime.getFullYear() + 1;
      this.data.import = new Array(yearnum).fill(0);
      this.data.sold = new Array(yearnum).fill(0);

      for(i = this.startTime.getFullYear(); i <= this.endTime.getFullYear(); i++) {
        this.barChartLabels.push(i.toString());
      }
      console.log(this.startTime, this.endTime)
      
	    this.item.forEach(item => {
        if(item.key !== undefined) {
          var change = this.books[item.key].Price * item.number
	    	  if(item.type == "import") {
           this.data.import[item.DateINP.getFullYear() - this.startTime.getFullYear()] += change;
	    	  }
	   	  else if(item.type == "sold") {
           this.data.sold[item.DateINP.getFullYear() - this.startTime.getFullYear()] += change;
	    	  }
       }
      })
    }
    

    
    this.barChartData = [
      {
        data: this.data.import,
        label: 'Tổng chi'
      },
      {
        data: this.data.sold,
        label: 'Doanh thu'
      }
    ];
    
  }
}
