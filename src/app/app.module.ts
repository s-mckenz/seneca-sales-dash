// app.module.ts
import { NgModule } from '@angular/core';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { GraphQLModule } from './graphql.module';
import { AuthModule } from 'angular-auth-oidc-client';
import { environment } from './environment';
import { en } from '@fullcalendar/core/internal-common';

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
        authority: environment.cognitoAuthority,
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,        
        clientId: '5a1ps41nb3n59uv611lljf8dp2',
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
