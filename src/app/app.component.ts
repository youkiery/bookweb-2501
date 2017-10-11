import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events,AlertController,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { Login } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { StatisticPage } from '../pages/statistic/statistic';
import { AngularFireAuth } from 'angularfire2/auth';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import firebase from 'firebase/app';



@Component({
  templateUrl: 'app.html'
})
export class MyApp {
@ViewChild(Nav) nav: Nav;

rootPage: any;
pages: Array<{title: string, component: any,count:number}>;
avatar:any;	
username:any;


  constructor(public platform: Platform, public statusBar: StatusBar, public events: Events,public splashScreen: SplashScreen,private afAuth: AngularFireAuth,private AuthSevice: AuthServiceProvider, private alertCtrl: AlertController,public menu:MenuController) {
    this.initializeApp();
	
 
const authObserver = afAuth.authState.subscribe( user => {
      if (user) {
		  console.log(user.uid);
		  	 firebase.database().ref('/userProfile/' + user.uid).once('value').then(snapshot => {
	//console.log(snapshot.val());
	if(snapshot.val().active === 1){
   this.username=user["displayName"];
	  this.avatar = user["photoURL"];
        this.nav.setRoot(TabsPage);
		this.menu.enable(true);
	}
	else{
		this.logout();
	}
			 })
	
	    authObserver.unsubscribe();
      } else {
       	this.logout();
        authObserver.unsubscribe();
      }
});


    this.pages = [
      { title: 'TRANG CHỦ', component: TabsPage,count:0 },
      { title: 'THỐNG KÊ', component: StatisticPage,count:0 },
    ];

    events.subscribe('profile', user=>{
	 firebase.database().ref('/userProfile/' + user.uid).once('value').then(snapshot => {
	if(snapshot.val().active === 1){
   this.username=user["displayName"];
	  this.avatar = user["photoURL"];
        this.nav.setRoot(TabsPage);
		 this.menu.enable(true);
	}
	else{
	   this.logout();
		this.AuthSevice.alertText(0,"Tài khoản này vẫn chưa được kích hoạt.\nVui lòng liên hệ với Quản Lý để kích hoạt!");
		
	}
	 })
   
  });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario

//console.log(this.count);	
  this.nav.setRoot(page.component);
  this.menu.close();
	
	
  
  
  }
  logout(){
	  this.AuthSevice.logoutUser();
	   this.nav.setRoot(Login);
	   	  this.menu.enable(false);

	   
  }


  
}
