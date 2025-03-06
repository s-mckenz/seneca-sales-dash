import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { HomeComponent } from './demo/components/dashboards/home/home.component';
import { AuthGuard } from './demo/components/auth/auth.guard';


const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        canActivate: [AuthGuard],  
        children: [
            { path: '', component: HomeComponent }, 
            { path: 'dashboard', loadChildren: () => import('./demo/components/dashboards/dashboards.module').then(m => m.DashboardsModule) },
        ]
    },

    // Lazy-loaded modules
    { path: 'auth', loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    
    // Wildcard route (404)
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
