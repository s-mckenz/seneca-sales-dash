import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Router } from '@angular/router';
import { signUp } from "aws-amplify/auth";

// CLI to create custom attribute: 
// aws cognito-idp add-custom-attributes --user-pool-id us-east-1_p82n11FBH --custom-attributes Name=license_key,AttributeDataType=String,Mutable=true


@Component({
    selector: 'app-register',
    templateUrl: './register.component.html'
})
export class RegisterComponent {
    username: string = '';
    password: string = '';
    email: string = '';
    licenseKey: string = ''; 
    isLicenseKeyHidden: boolean = true;

    constructor(private layoutService: LayoutService, private router: Router) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async onRegister() {
        try {
            const { isSignUpComplete, userId, nextStep } = await signUp({
                username: this.email, // Cognito requires a unique username
                password: this.password,
                options: {
                    userAttributes: {
                        email: this.email,
                        'custom:license_key': this.licenseKey //custom attribute
                    },
                    autoSignIn: true 
                },
            });

            console.log('Sign-up successful:', userId);
            console.log('Next step:', nextStep);

            // Navigate to the verification page and pass the email
            this.router.navigate(['/auth/verification'], { queryParams: { email: this.email } });
        } catch (error) {
            console.error('Error during sign-up:', error);
            
            const errorMessage = (error as { message?: string }).message || 'An unknown error occurred';
            alert(`Error: ${errorMessage}`);
        }        
    }
}
