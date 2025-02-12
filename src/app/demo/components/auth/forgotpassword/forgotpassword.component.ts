import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router'; // ✅ Import Router
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { resetPassword, confirmResetPassword } from '@aws-amplify/auth';

@Component({
    templateUrl: './forgotpassword.component.html',
})
export class ForgotPasswordComponent {
    @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
    @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;
    @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

    step: 'request' | 'confirm' = 'request';
    message: string = '';
    messageType: 'info' | 'error' | '' = ''; 

    constructor(private layoutService: LayoutService, private router: Router) {} 

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async requestReset() {
        const email = this.emailInput.nativeElement.value.trim();
        if (!email) {
            this.showMessage(`Please enter a valid email.`, "info");  
            return;
        }

        try {
            await resetPassword({ username: email });
            this.step = 'confirm';
            this.message = 'Verification code sent to your email.';
        } catch (error) {
            this.showMessage(`Error: ${error}`, "error");  
            const errorMessage = (error as { message?: string }).message || 'Something went wrong.';
            alert(`Error: ${errorMessage}`);
        }
    }

    async confirmReset() {
        const email = this.emailInput.nativeElement.value.trim();
        const code = this.codeInput.nativeElement.value.trim();
        const newPassword = this.passwordInput.nativeElement.value.trim();

        if (!code || !newPassword) {
            this.showMessage(`Please fill in all fields.`, "error");  
            return;
        }

        try {
            await confirmResetPassword({
                username: email,
                confirmationCode: code,
                newPassword: newPassword
            });            
            this.showMessage("Passowrd reset successfully. You can log in now.", "info");  
            this.router.navigate(['/auth/login']); // Redirect to login page after success
        } catch (error) {
            console.error('Error during password reset confirmation:', error);
            const errorMessage = (error as { message?: string }).message || 'Something went wrong.';
            this.showMessage(`Error: ${errorMessage}`, "error");  
        }
    }

    showMessage(text: string, type: 'info' | 'error') {
        this.message = text;
        this.messageType = type;
    }
}
