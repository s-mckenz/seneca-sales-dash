import { split } from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { getMainDefinition } from '@apollo/client/utilities';

import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import { InMemoryCache } from '@apollo/client/core';
import { WebSocketLink } from '@apollo/client/link/ws';
import { HttpHeaders } from '@angular/common/http';
import { environment } from './environment';


@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const token = localStorage.getItem('token');

        const http = httpLink.create({
          uri: environment.graphqlUri, // todo: store as env vars
          headers: new HttpHeaders().set('X-Hasura-Admin-Secret', environment.authorizationToken), 
        });

        const ws = new WebSocketLink({
          uri: environment.graphqlWsUri,
          options: {
            reconnect: true,
            connectionParams: {
              headers: {
                Authorization: token ? `Bearer ${token}` : '',
              },
            },
            lazy: true, // Only connect when a subscription is initiated
            inactivityTimeout: 60000, // Disconnect if no active subscriptions for 60 seconds
          },
        });

        const link = split(
          ({ query }) => {
            const definition = getMainDefinition(query);
            return (
              definition.kind === 'OperationDefinition' &&
              definition.operation === 'subscription'
            );
          },
          ws,
          http,
        );

        return {
          link,
          cache: new InMemoryCache(),
        };
      },
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
