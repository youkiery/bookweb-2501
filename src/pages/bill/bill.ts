import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,ViewController,Events } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import {FirebaseListObservable,AngularFireDatabase} from 'angularfire2/database';
import * as $ from 'jquery';



/**
 * Generated class for the BillPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-bill',
  templateUrl: 'bill.html',
})
export class BillPage {
BillBook: Array<any> = [];
TotalBill: number=0;
datenow: any = new Date().toLocaleDateString();
IDBill: number = Math.floor((Math.random() * 10000) + 1);

  constructor(public navCtrl: NavController, public navParams: NavParams, public authData: AuthServiceProvider,public navView: ViewController,public event:Events, public db: AngularFireDatabase ) {
	  
  }

  ionViewDidEnter() {
   // console.log('ionViewDidLoad BillPage');
   this.BillBook = this.authData.Books;
   for(var i =0 ; i< this.BillBook.length;i++){
	  this.TotalBill += parseInt(this.BillBook[i].Price)*this.BillBook[i].sold;
   }


  

  }
  FullOrder(){
	var d= new Date();
    var s =  d.toLocaleDateString()+ ' ' +  d.toLocaleTimeString();
	
	console.log(this.authData.BooksOrder())
	for(var i=0;i<this.authData.BooksOrder().length;i++){
		  var q = this.authData.BooksOrder()[i].Inv + this.authData.BooksOrder()[i].sold ; 
		  this.db.list('Inventory/BOOKS/').update(this.authData.BooksOrder()[i].key,{Inv: q });
		  this.db.list('statistic/').push({
			  key: this.authData.BooksOrder()[i].key,
			  number: this.authData.BooksOrder()[i].sold,
			  DateINP: s,
			  PersonINP: this.authData.fetchUser()["displayName"],
			  type: "sold"
		  })
	  }
	  this.authData.Books = [];
	 
	  this.event.publish("Filter",1);
	  this.authData.isButton = [];
	  this.authData.isButton = {};
	  this.navView.dismiss();
 }

}
