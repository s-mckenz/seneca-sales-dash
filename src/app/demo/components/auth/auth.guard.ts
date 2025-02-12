import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { getCurrentUser } from 'aws-amplify/auth';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private router: Router) {}

    async canActivate(): Promise<boolean> {
        try {
            await getCurrentUser(); // Check if user is authenticated
            return true;
        } catch (error) {
            console.warn("User not authenticated, redirecting to login...");
            this.router.navigate(['/auth/login']);
            return false;
        }
    }
}
