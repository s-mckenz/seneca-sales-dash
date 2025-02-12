  export const environment = {
    production: false,
    aws: {
      Auth: {
        Cognito: {
          userPoolId: 'us-east-1_0WHyPNNRN',
          userPoolClientId: '5a1ps41nb3n59uv611lljf8dp2',
        }
      }
    },
    graphqlWsUri: 'wss://rds-cloud.hasura.app/v1/graphql',
    graphqlUri: 'https://rds-cloud.hasura.app/v1/graphql',
    authorizationToken: 'Y263c8aP946LCNodCNDkdEi3AyZD0HGACw3QUwqQ59nnsk9Lk815zDAjLg1LvIha',     
  };
  