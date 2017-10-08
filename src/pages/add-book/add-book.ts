import { Component,OnInit,OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { ImagePicker } from '@ionic-native/image-picker';


/**
 * Generated class for the AddBookPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add-book',
  templateUrl: 'add-book.html',
})
export class AddBookPage{
	Type:string;
	Title:string;
	Price:number;
	Quanlity:number;

  constructor(public navCtrl: NavController, public navParams: NavParams,public authData: AuthServiceProvider,private imagePicker: ImagePicker)  {

  }

  ionViewDidLoad() {
	this.imagePicker.getPictures({maximumImagesCount:1}).then((results) => {
  for (var i = 0; i < results.length; i++) {
      console.log('Image URI: ' + results[i]);
  }
}, (err) => { });    }
  pushB(){
	  var data = {
		  Type: this.Type,
		  Title: this.Title,
		  Price: this.Price,
		  Quanlity: this.Quanlity,
		  Inv: 0,
		  PersonINP: this.authData.fetchUser()["uid"],
		  DateINP: new Date().toLocaleDateString() + " " +  new Date().toLocaleTimeString()	
	  }
	  this.authData.insertDBFree("Inventory/BOOKS/",data);
	  console.log("Thành Công");
  }
  //ngOnInit(){}
  //ngonDestroy(){}

}
