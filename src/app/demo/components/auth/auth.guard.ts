import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import { Observable, of } from 'rxjs';
import { map, tap, delay, switchMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private oidcSecurityService: OidcSecurityService, private router: Router) {}

    canActivate(): Observable<boolean> {
        console.log("AuthGuard: Checking authentication status...");

        return this.oidcSecurityService.checkAuth().pipe(
            tap(({ isAuthenticated, userData }) => {
                console.log(`AuthGuard: Authenticated = ${isAuthenticated}`);
                
                if (isAuthenticated) {
                    console.log('AuthGuard: User Data:', userData);
                    console.log('AuthGuard: User Email:', userData?.email || 'Email not available');
                }
            }),

            // Introduce a brief delay for logging clarity
            switchMap(({ isAuthenticated }) => of(isAuthenticated).pipe(delay(1000))),

            map(isAuthenticated => {
                if (!isAuthenticated) {
                    console.log("AuthGuard: User is NOT authenticated. Redirecting to /auth/login...");
                    this.router.navigate(['/auth/login']);
                    return false;
                }

                console.log("AuthGuard: User is authenticated. Access granted.");
                return true;
            })
        );
    }
}
