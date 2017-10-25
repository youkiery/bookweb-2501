import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LostpassPage } from './lostpass';

@NgModule({
  declarations: [
    LostpassPage,
  ],
  imports: [
    IonicPageModule.forChild(LostpassPage),
  ],
  exports: [
    LostpassPage
  ]
})
export class LostpassPageModule {}
