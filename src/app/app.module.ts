import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpModule } from '@angular/http';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Login } from '../pages/login/login';
import {SignupPage} from '../pages/signup/signup';
import {LostpassPage} from '../pages/lostpass/lostpass';
import { AngularFireModule} from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule, FirebaseListObservable } from 'angularfire2/database';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Facebook } from '@ionic-native/facebook'
import { SuperTabsModule } from 'ionic2-super-tabs';
import { AddBookPage } from '../pages/add-book/add-book';
import { AddCustomerPage } from '../pages/add-customer/add-customer';
import { TabsPage } from '../pages/tabs/tabs';
import { StatisticPage } from '../pages/statistic/statistic';
import { ChartPage } from '../pages/chart/chart';
import { DetailPage } from '../pages/detail/detail';
  import { BillPage } from '../pages/bill/bill';
  import { UploadImagePage } from '../pages/upload-image/upload-image';
import { ImagePicker } from '@ionic-native/image-picker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {ChartsModule} from 'ng2-charts';
import 'chart.js';

export const config = {
    apiKey: "AIzaSyCqi62CXXif5_9VDLEsctQZx0pb-BCtrow",
    authDomain: "bookstore-9b0eb.firebaseapp.com",
    databaseURL: "https://bookstore-9b0eb.firebaseio.com",
    projectId: "bookstore-9b0eb",
    storageBucket: "bookstore-9b0eb.appspot.com",
    messagingSenderId: "540078932192"
  };
 
 
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    Login,
	SignupPage,
	LostpassPage,
	AddBookPage,
	TabsPage,
	AddCustomerPage,
	BillPage,
  StatisticPage,
  ChartPage,
  DetailPage,
  UploadImagePage
  ],
  imports: [

		 ChartsModule,
    BrowserModule,
	HttpModule,
	AngularFireDatabaseModule,
	BrowserAnimationsModule,
	AngularFireModule.initializeApp(config),
    IonicModule.forRoot(MyApp,{
	  backButtonText: 'Quay lai',
      backButtonIcon: 'ios-arrow-back',
	  tabsPlacement: 'bottom'
	}),
     SuperTabsModule.forRoot(),
	AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    Login,
	SignupPage,
	LostpassPage,
	AddBookPage,
	TabsPage,
	AddCustomerPage,
	BillPage,
  StatisticPage,
  ChartPage,
  DetailPage,
  UploadImagePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
	ImagePicker,
	Facebook,
	{provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider
  ]
})
export class AppModule {}
