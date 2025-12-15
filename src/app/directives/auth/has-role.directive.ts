import { Directive, effect, inject, input, TemplateRef, ViewContainerRef } from "@angular/core";
import { JwtUserRoles } from "app/models/user.interface";
import { AuthService } from "app/services/auth/auth.service";

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective {
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);
  private authService = inject(AuthService);
  requiredRoles = input.required<JwtUserRoles[]>({ alias: 'appHasRole' });

  constructor() {
    effect(() => {
      const userRole = this.authService.$role();

      this.viewContainerRef.clear();
      if(this.requiredRoles().includes(userRole)){ // if user has role, it injects the template into viewcontainer
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    })
  }

  
}