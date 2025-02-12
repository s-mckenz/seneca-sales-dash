import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    // Redirect empty path to auth/login
    { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

    // This is your dashboard route which will be loaded once the user is authenticated (TODO: add auth guards)
    {
        path: 'dashboard',  // note: changed from '' to 'dashboard'
        loadChildren: () => import('./demo/components/dashboards/dashboards.module').then(m => m.DashboardsModule)
    },

    // Lazy load the auth module.  The AuthModule should import AuthRoutingModule.
    { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },
    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
