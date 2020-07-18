import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function ComparaSenha(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    if (formGroup.controls[controlName].value !== '') {
      const control = formGroup.controls[controlName];
      const matchingControl = formGroup.controls[matchingControlName];

      if (matchingControl.errors && !matchingControl.errors.mustMatch) {
        // return if another validator has already found an error on the matchingControl
        return;
      }

      // set error on matchingControl if validation fails
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ validarSenhas: true });
      } else {
        matchingControl.setErrors(null);
      }
    }
  };
}
