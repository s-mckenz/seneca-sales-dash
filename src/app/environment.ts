export const environment = {
  production: false,
  aws: {
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_0WHyPNNRN',
        userPoolClientId: '5a1ps41nb3n59uv611lljf8dp2',
      },
      loginWith: {
        oauth: {
          redirectSignIn: [
            "http://localhost:4200/",
            "https://poll-scheduler.s4hospitality.net/",
          ],
          redirectSignOut: [
            "http://localhost:4200/",
            "https://poll-scheduler.s4hospitality.net/",
          ],
          domain: 'us-east-13xtcoxgfe.auth.us-east-1.amazoncognito.com', 
          scope: ['openid', 'email', 'profile', 'aws.cognito.signin.user.admin'], 
          clientId: '5a1ps41nb3n59uv611lljf8dp2', // Explicitly added this as some Amplify versions require it
          responseType: 'code', 
        },
    }
    }
  },
  graphqlWsUri: 'wss://rds-cloud-staging.hasura.app/v1/graphql', //'wss://rds-cloud.hasura.app/v1/graphql',
  graphqlUri: 'https://rds-cloud-staging.hasura.app/v1/graphql', //'https://rds-cloud.hasura.app/v1/graphql',
  authorizationToken: 'tAOkaxydbwpbuaqYnmApQl6d6WDxHxFKehW1RNx3ZTcUCMfsFxb7HeJ46G1lKY2b', //'Y263c8aP946LCNodCNDkdEi3AyZD0HGACw3QUwqQ59nnsk9Lk815zDAjLg1LvIha',
  googleClientId:'61605134382-dl0ff5to325c2gtt9hf9tbpv4639u12j.apps.googleusercontent.com',
  cognitoUrl: 'us-east-13xtcoxgfe.auth.us-east-1.amazoncognito.com',
  enqueueApiJobUrl: 'https://lzxjbtqmi9.execute-api.us-east-1.amazonaws.com/dev/enqueue-job',
  retryApiJobUrl: 'https://lzxjbtqmi9.execute-api.us-east-1.amazonaws.com/dev/RetryFailedJobs',
};



