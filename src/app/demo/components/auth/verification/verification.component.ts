import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { confirmSignUp, resendSignUpCode } from "aws-amplify/auth";
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    templateUrl: './verification.component.html',
})
export class VerificationComponent implements OnInit {
    message: string = '';
    messageType: 'info' | 'error' | '' = ''; 

    email: string = '';
    code: string = ''; 

    val1: string = '';
    val2: string = '';
    val3: string = '';
    val4: string = '';
    val5: string = '';
    val6: string = '';
    

    constructor(private layoutService: LayoutService, private route: ActivatedRoute, private router: Router) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    ngOnInit() {
        this.route.queryParams.subscribe(params => {
            this.email = params['email'] || 'unknown@example.com'; // Get email from URL params
        });
    }

    // Automatically focus the next input field
    onDigitInput(event: any) {
        let element;
        if (event.code !== 'Backspace') {
            if (event.code.includes('Numpad') || event.code.includes('Digit')) {
                element = event.srcElement.nextElementSibling;
            }
        } else {
            element = event.srcElement.previousElementSibling;
        }
        if (element) element.focus();
    }
    
    onPaste(event: ClipboardEvent) {
        event.preventDefault();
        const pastedText = event.clipboardData?.getData('text') || '';
    
        // Remove non-numeric characters and truncate to 6 digits
        const cleanText = pastedText.replace(/\D/g, '').slice(0, 6);
    
        if (!cleanText) return;
    
        // Assign each character to the corresponding input
        const inputs = document.querySelectorAll<HTMLInputElement>('input[pInputText]');
        cleanText.split('').forEach((char, index) => {
            if (inputs[index]) {
                inputs[index].value = char;
            }
        });
    
        // Focus the last input that was filled
        if (inputs[cleanText.length - 1]) {
            inputs[cleanText.length - 1].focus();
        }
    }
    

    validateCode(): boolean {
        if (!/^\d{6}$/.test(this.code)) {
            this.showMessage("Please enter a valid 6-digit numeric code.", "error");            
            return false;
        }
        return true;
    }

    async onConfirmSignUp(d1: string, d2: string, d3: string, d4: string, d5: string, d6: string) {
        this.code = `${d1}${d2}${d3}${d4}${d5}${d6}`;

        if (!this.validateCode()) return; 

        try {
            const { isSignUpComplete, nextStep } = await confirmSignUp({
                username: this.email,
                confirmationCode: this.code
            });

            if (isSignUpComplete) {
                console.log("User confirmed successfully!");
                
                this.router.navigate(['/auth/login']);
            } else {
                console.warn("Sign-up not fully complete. Next step:", nextStep);
            }
        } catch (error: any) {
            console.error("Error confirming sign-up:", error);
            this.showMessage(error.message || "Failed to confirm sign-up. Please try again.", "error");  
        }
    }

    async onResendCode() {
        try {
            await resendSignUpCode({ username: this.email });
            this.showMessage("A new verification code has been sent to your email.", "info");              
        } catch (error: any) {
            console.error("Error resending code:", error);
            this.showMessage(error.message || "Failed to resend code. Please try again.", "error");  
        }
    }

    showMessage(text: string, type: 'info' | 'error') {
        this.message = text;
        this.messageType = type;
    }
}
