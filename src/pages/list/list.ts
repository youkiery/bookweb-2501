import { Component,OnInit,OnDestroy,OnChanges } from '@angular/core';
import { NavController, NavParams,Events,PopoverController } from 'ionic-angular';
import {FirebaseListObservable,AngularFireDatabase} from 'angularfire2/database';
import { AddCustomerPage } from '../add-customer/add-customer';
import { BillPage } from '../bill/bill';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';



@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage implements OnInit,OnDestroy,OnChanges{
  customersObs: FirebaseListObservable<any>;
  customers: Array<any>=[];
  cusname: string = "Khách";
  DataS: Array<any>=[];
  checkFind : boolean = false;
  onIn:number;
  Subs: any;
  hidden:boolean;
  myInput:any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase, public events:Events,public authData: AuthServiceProvider, public popCtrl:PopoverController) {
	
  }
  ngOnInit(){
    this.onIn = 0;
	  this.events.subscribe("Filter",dt=>{
		  this.DataS = this.authData.BooksOrder();
	  });
	this.customersObs = this.db.list('Inventory/CUSTOMER/');
	this.Subs = this.customersObs.subscribe(data=>{
		this.customers = data;
		
		
	})

  }
  ngOnDestroy(){
	 this.Subs.unsubscribe(); 
	  
  }
  ngOnChanges(){

	

  }
onBlur(ev){
	//console.log(ev);
	this.onIn = 0;
	this.hidden = !this.hidden;
	this.myInput = "";
	this.Subs = this.customersObs.subscribe(data=>{
		this.customers = data;
		
	})
	
} 
onFocus(ev){
	//console.log(ev);
	this.hidden = !this.hidden;
	this.checkFind = true;
}
onInput(event){
	this.onIn = 1;
	this.Subs = this.customersObs.subscribe(data=>{
		this.customers = data;
		
	})

	//console.log(event);
	let val = event.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.customers = this.customers.filter((item) => {
        return (item.Name.toLowerCase().indexOf(val.toLowerCase()) > -1);
		//console.log(item);
      })
    }
	//console.log(this.books);
	
}
  
ionViewDidEnter(){

	this.DataS = this.authData.BooksOrder();
	console.log(this.DataS);
  }
pushCus(){
	  this.navCtrl.push(AddCustomerPage);
  }
SelectCus(ev,key,cname){
	  if(this.DataS.length > 0){ 
	 // console.log(this.recData);
	  
	  this.cusname = cname  ;
	  this.checkFind = false;
	  }
	  
	 
  }
BuyConfirm(){
	if(this.cusname === "Khách"){
		this.authData.alertText(0,"Vui lòng chọn Khách Hàng!");
	}
	else{
    let popover = this.popCtrl.create(BillPage);

    popover.present();
  
	}
}  
CQuanlity(val,index){
	  if(val === "sub"){
		  if(this.authData.BooksOrder()[index].sold >0){
			  this.authData.BooksOrder()[index].sold-=1;
			  if(this.authData.BooksOrder()[index].sold ===0){
				this.events.publish("Filter",this.authData.BooksOrder()[index].key);
			  this.authData.BooksOrder().splice(index,1);
			  
			  }
		  }
		if(this.authData.BooksOrder().length===0){  this.events.publish("Filter",1)};
	  }
	  else{
		  var q = this.authData.BooksOrder()[index].sold;
		  console.log(this.authData.BooksOrder()[index].Inv + q,this.authData.BooksOrder()[index].Quanlity);
		  if((this.authData.BooksOrder()[index].Inv + q)  === parseInt(this.authData.BooksOrder()[index].Quanlity)){
			  this.authData.alertText(1,"Trong kho đã hết sách này");
		  }  
		  else{
		  this.authData.BooksOrder()[index].sold+=1;
		  }
	  }
  }
	  
  

}
