import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-hosted-login',
  templateUrl: './hosted-login.component.html',
  styleUrls: ['./hosted-login.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
  ],
})
export class HostedLoginComponent {
  message: string = '';
  messageType: 'info' | 'error' | '' = '';

  email: string = ''; 
  acceptedDomains: string[] = ['rdspos.com', 'seneca.com']; // List of allowed domains

  constructor(private oidcSecurityService: OidcSecurityService) {}

  signInWithGoogle(): void {
    if (!this.email) {
      this.showMessage('Please enter your email before signing in.', 'info');
      return;
    }

    const emailDomain = this.email.split('@')[1];

    if (!this.acceptedDomains.includes(emailDomain)) {
      this.showMessage('Sign-ups are restricted to approved domains.', 'error');
      return;
    }

    this.showMessage("Redirecting to Google sign-in...", "info");
    this.oidcSecurityService.authorize();
  }

  showMessage(text: string, type: 'info' | 'error') {
    this.message = text;
    this.messageType = type;
}
}