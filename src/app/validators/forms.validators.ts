import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function matchPasswordsValidator(passwordKey: string, confirmPasswordKey: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordKey);
    const confirmPassword = group.get(confirmPasswordKey);
    
    if (!password || !confirmPassword) return null;

    const error = password.value === confirmPassword.value ? null : { passwordsDoNotMatch: true };

    confirmPassword.setErrors(error ? { ...(confirmPassword.errors ?? {}), ...error } : null);

    return error;
  };
}