import { Component,ViewChild,OnInit,OnDestroy } from '@angular/core';
import { NavController,Events,NavParams,Tabs } from 'ionic-angular';

import { HomePage } from '../home/home';
import { ListPage } from '../list/list';
import { Login } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit,OnDestroy{
@ViewChild(Tabs) tabs: Tabs;	
  tab1 = HomePage;
  tab2 = ListPage;
  //tabids:string;
	  

 //mySelectedIndex: number;


  constructor(public navCtrl:NavController,public navParams: NavParams, public events: Events) {
	  
	
	
  }
ngOnInit(){

				
	
}

ngOnDestroy(){
	//this.events.unsubscribe("count");
	console.log('Leave');
}

  

}