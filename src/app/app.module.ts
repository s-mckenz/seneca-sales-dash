// app.module.ts
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { GraphQLModule } from './graphql.module';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from './environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [ 
    AppRoutingModule,
    AppLayoutModule,
    GraphQLModule,
    AuthModule.forRoot({
      config: {
        authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_3XtCoxGfE',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,        
        clientId: '65dh7s98c0bnqmi046klgj4h3c',
        scope: 'email openid',
        responseType: 'code'
      },
    }),
  ],
  providers: [
    { provide: LocationStrategy, useClass: PathLocationStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
