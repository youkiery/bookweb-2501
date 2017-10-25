import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';
import {FirebaseListObservable, AngularFireDatabase} from 'angularfire2/database';
import  firebase  from 'firebase/app';

import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

/**
 * Generated class for the UploadImagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-upload-image',
  templateUrl: 'upload-image.html',
})
export class UploadImagePage {
  file:any;
  preview:any = 'assets/images/1A.jpg';
  url:any;
  image:any;
  downloadURL: string;
  constructor(public navCtrl: NavController, public navParams: NavParams,public db: AngularFireDatabase, public ev:Events, private authData: AuthServiceProvider) {
    this.url = navParams.get('url');
		this.db.list('/Inventory/Image/').forEach(item => {
      this.file = item;
      console.log(this.file)
    })
  }

  chose(preview) {
    console.log(preview);
    this.ev.publish('chose', preview);
    this.navCtrl.pop();
  }

  uploadFile() {
      if(this.file != undefined) {
        var storageRef = firebase.storage().ref();
        var uploadTask = storageRef.child(this.preview).put(this.file[0]);
        
        uploadTask.on('state_changed', function(snapshot){
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          if(progress === 100){
            this.downloadURL = uploadTask.snapshot.downloadURL 
                console.log(this.downloadURL);
                        }
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED:
              console.log('Upload is paused');
              break;
            case firebase.storage.TaskState.RUNNING:
              console.log('Upload is running');
              break;
          }
        }, function(error) {

        }, function() {
     //   var  downloadURL = uploadTask.snapshot.downloadURL;
        });
        
    }
  }
  
  
	getFile() {
		this.file = (<HTMLInputElement>document.getElementById('file')).files;
		this.preview = this.file[0].name;
		console.log(this.file[0])
		console.log(this.preview);
		
		var reader = new FileReader();
	 	reader.onload = function(e) {
			let target: any = e.target;
			let content: string = target.result;
			(<HTMLInputElement>document.getElementById('blah')).src = content;
	  	}
	  	reader.readAsDataURL(this.file[0]);
  }
  
  ionViewDidLoad() {
    console.log('ionViewDidLoad UploadImagePage');
  }

}
