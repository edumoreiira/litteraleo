import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { JwtUserRoles } from "app/models/user.interface";
import { AuthService } from "app/services/auth/auth.service";

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  // 
  const requiredRoles = route.data['roles'] as JwtUserRoles[] | undefined;

  if (!requiredRoles || requiredRoles.length === 0) {
    return true; // No roles required, allow access
  }

  const hasPermission = requiredRoles.includes(authService.$role());

  if (hasPermission) {
    return true;
  }

  return router.createUrlTree(['/'])
  
  
}