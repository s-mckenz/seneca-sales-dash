import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HostedLoginComponent } from './../hosted-login/hosted-login.component';


@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: HostedLoginComponent }
    ])],
    exports: [RouterModule]
})
export class LoginRoutingModule { }
