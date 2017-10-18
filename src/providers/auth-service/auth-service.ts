import { Injectable, } from '@angular/core';
import { Platform, Events,AlertController,ToastController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';
import firebase from 'firebase/app';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
public fireAuth: any;
public userData: any;
public Books = [];
public isButton:any = {};
customer:any;
  constructor(public afAuth: AngularFireAuth, public platform: Platform, public events:Events,private alertCtrl: AlertController, private toastCtrl: ToastController,private fb:Facebook) {

  }
loginUser(newEmail: string, newPassword: string): firebase.Promise<any> {
  return this.afAuth.auth.signInWithEmailAndPassword(newEmail, newPassword);
}
signupUser(newEmail: string, newPassword: string): firebase.Promise<any> {
		
  return this.afAuth.auth.createUserWithEmailAndPassword(newEmail, newPassword);
}
Verify(): firebase.Promise<any>{
	var user = firebase.auth().currentUser;
	return user.sendEmailVerification();
}
updateProfile(data:any): firebase.Promise<any>{
  var user = firebase.auth().currentUser;
        return user.updateProfile(data);
}
alertText(type:number, text:string){
        if (type == 0) {
            var alert = this.alertCtrl.create({
                message: text,
                buttons: [
                    {
                        text: "Đồng ý",
                        role: 'Hủy'
                    }
                ]
            });
            alert.present();
        }
        else {
            var toast = this.toastCtrl.create({
                message: text,
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    }
BooksOrder() {
        return this.Books;
    };
BooksPush(data) {
        this.Books.push(data);
};
refDBOnce(url) {
        return (firebase.database().ref(url).once('value'));
    };
insertDBFB(user) {
        var check=0;
		//console.log(user.uid);
        firebase.database().ref('/userProfile/' + user.uid).once('value').then(snapshot => {
            check = snapshot.val().active;
			console.log(check);
        });
        console.log(check);
        if (check != 0) {
            var provider = "";
            user.providerData.forEach(profile => {
                provider = profile.providerId;
            });
            firebase.database().ref('/userProfile').child(user.uid).set({
                email: user.email,
                displayName: user.displayName,
                photoURL: user.photoURL,
                phoneNumber: user.phoneNumber,
                provider: provider,
                active: 0
            });
        }
    };
insertDBFree(url, data) {
        firebase.database().ref(url).push().set(data);
    };

fetchUser():any{
	return firebase.auth().currentUser;
}
logoutUser(): firebase.Promise<any> {
  return this.afAuth.auth.signOut();
}
resetPassword(email: string): firebase.Promise<any> {
  return this.afAuth.auth.sendPasswordResetEmail(email);
}

loginFB() {
   console.log(this.platform.is('cordova'));
        if (this.platform.is('android') || this.platform.is('ios')) {
            return this.fb.login(['email'])
                .then(response => {
                var facebookCredential = firebase.auth.FacebookAuthProvider
                    .credential(response.authResponse.accessToken);
                firebase.auth().signInWithCredential(facebookCredential)
                    .then(function (success) {
                    this.events.publish('profile', this.fetchUser());
                    this.insertDBFB(this.fetchUser());
                });
            }).catch(error => {
				this.alertText(0,"Lỗi không xác định \n" + error["code"]);
                
            });
        }
        else {
            var provider = new firebase.auth.FacebookAuthProvider();
            firebase.auth().signInWithPopup(provider).then(result => {
                var token = result.credential.accessToken;
                var user = result.user;
                this.insertDBFB(user);
                this.events.publish('profile', user);
            }).catch(error => {
				this.alertText(0,"Lỗi không xác định \n" + error["code"]);

            });
            //var user = result.user;
            /*var check = 0;
            console.log(user.uid);
            firebase.database().ref('/userProfile/' + user.uid).once('value').then(snapshot=> {
            console.log(snapshot);
            
          });
            
              var provider = "";
            user.providerData.forEach(profile => {
             provider = profile.providerId;
            
            });
          
              firebase.database().ref('/userProfile').child(user.uid).set({
                  email: user.email,
                  displayName: user.displayName,
                  photoURL: "https://static.skillshare.com/uploads/project/87595/cover_800_a51afd0019278955aa95db109e0a7f30.png",
                  phoneNumber: user.phoneNumber,
                  provider: provider,
                  active:0
                  });
                  */
        }
    };


}
