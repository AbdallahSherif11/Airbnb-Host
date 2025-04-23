import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes)
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);


export function getPrerenderParams(request: Request) {
    const routes = ['updatehouse/1', 'updatehouse/2', 'houses/1', 'houses/2', 'chat/1'];
    return routes.map(route => ({ route }));
  }