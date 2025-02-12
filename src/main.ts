import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { Amplify } from 'aws-amplify';
import { environment } from './app/environment';

Amplify.configure(environment.aws);


platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .catch((err) => console.error(err));
