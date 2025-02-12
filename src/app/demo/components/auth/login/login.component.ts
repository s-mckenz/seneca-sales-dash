import { Component, OnInit } from '@angular/core';
import { signIn, fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    email: string = '';
    password: string = '';
    rememberMe: boolean = false;
    errorMessage: string = '';

    constructor(private layoutService: LayoutService, private router: Router) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async ngOnInit() {
        await this.checkIfLoggedIn(); 
    }


    async checkIfLoggedIn() {
        try {
            const session = await fetchAuthSession(); // ✅ Check if there is a valid session
            if (session) {
                console.log('User session is active.');
                const user = await getCurrentUser(); // ✅ Fetch user only if session is valid
                console.log('User already signed in:', user);
                this.router.navigate(['/dashboard']);
            }
        } catch (error) {
            console.log('No active session, user must sign in.');
        }
    }
    

    async onLogin() {
        try {
            const { isSignedIn } = await signIn({ username: this.email, password: this.password });

            if (isSignedIn) {
                console.log('Login successful');
                this.router.navigate(['/dashboard']); // ✅ Redirect after login
            }
        } catch (error: any) {
            console.error('Error signing in:', error);
            this.errorMessage = error.message || 'Login failed. Please try again.';
        }
    }
}
