import { Component,ViewChild,OnInit,OnDestroy } from '@angular/core';
import { NavController,Events,NavParams,Tabs } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

import { HomePage } from '../home/home';
import { StatisticPage } from '../statistic/statistic';
import { Login } from '../login/login';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage implements OnInit,OnDestroy{
@ViewChild(Tabs) tabs: Tabs;	
  tab1 = HomePage;
  tab2 = StatisticPage;
  //tabids:string;
	  

 //mySelectedIndex: number;


  constructor(public navCtrl:NavController,public navParams: NavParams, public events: Events,private AuthSevice: AuthServiceProvider) {
	  
	
	
  }
ngOnInit(){

				
	
}

ngOnDestroy(){
	//this.events.unsubscribe("count");
	console.log('Leave');
}

  
logout(){
  this.AuthSevice.logoutUser();
  this.navCtrl.setRoot(Login);
}

}