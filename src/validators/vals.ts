import { FormControl } from '@angular/forms';
import { AbstractControl } from '@angular/forms';
export class EmailValidator {

  static isValid(control: FormControl){
    const re = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/.test(control.value);

    if (re){
      return null;
    }

    return {
      "invalidEmail": true
    };

  }
  
}
export class RequiredCheckboxValidator {
      
      static validateCheckbox(control: AbstractControl) {

        if (!control.value) {
          return {'validateCheckbox': true};
        }
        else {
          return null;
        } 
      }
    }
export class PhoneNumberRegex {
      
      static isValid(control: FormControl) {
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(control.value);
   if (re){
      return null;
    }

    return {
      "invalidphoneNumber": true
    }; 
      }
    }	