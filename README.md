# Pancheros Sales Portal

Pancheros Sales Portal is an Angular-based application that allows users to:

- **Select Sites**: Choose one or more sites using a dynamic multi-select dropdown (powered by PrimeNG).
- **Set Date Ranges**: Pick start and end dates using date pickers.
- **Export Sales Data**: Trigger an export that sends sales data (via an API request) to the configured email address.
- **View Selections**: See a live, responsive sidebar summary of the selected sites.
- **Authenticate via AWS Cognito**: Leverage AWS Cognito for user authentication, allowing secure user registration and login.

The app is built using Angular and PrimeNG components and is deployed using AWS Amplify from the GitHub master branch.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Development](#development)
- [Production Build](#production-build)
- [Deployment with AWS Amplify](#deployment-with-aws-amplify)
- [AWS Cognito Authentication](#aws-cognito-authentication)
- [Usage](#usage)

## Features

### Multi-Select Site Dropdown
- Uses PrimeNG's `p-multiSelect` to allow users to select one or more sales sites.

### Date Range Selection
- Uses `p-calendar` to pick start and end dates.

### Sales Export Button
- Triggers a POST request to export sales orders. The request payload dynamically handles whether all sites or only a subset are selected.

### Responsive Sidebar
- Displays the list of selected sites and can be toggled open/closed.

### AWS Amplify Deployment
- Automatically deploys from the GitHub master branch using AWS Amplify's continuous deployment.

### AWS Cognito Authentication
- Uses AWS Cognito to handle user registration, login, and authentication seamlessly within the Angular app.

## Prerequisites

- Node.js (v12 or later)
- Angular CLI (install globally with `npm install -g @angular/cli`)
- Git
- An AWS Amplify account (for deployment)
- An AWS Cognito setup for authentication

## Installation

### Clone the Repository:
```sh
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### Install Dependencies:
```sh
npm install
```

## Development

To run the application locally in development mode, use:
```sh
ng serve
```
Then, open your browser and navigate to [http://localhost:4200](http://localhost:4200).

## Production Build

To create an optimized production build of the application:
```sh
ng build --prod
```
The compiled files will be placed in the `dist/your-app-name` directory.

## Deployment with AWS Amplify

### Log In to AWS Amplify Console:
- Navigate to [AWS Amplify Console](https://console.aws.amazon.com/amplify/home) and sign in.

### Create a New App:
- Click on **New app** and then **Host web app**.

### Connect to GitHub:
- Choose GitHub as your repository provider.
- Authorize AWS Amplify to access your GitHub account.
- Select your repository and choose the master branch.

### Configure Build Settings:
AWS Amplify should auto-detect that this is an Angular project. If needed, you can create an `amplify.yml` file in the root of your repository with the following content:
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build --prod
  artifacts:
    baseDirectory: dist/your-app-name
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```
Replace `your-app-name` with the correct output directory of your Angular build.

### Deploy:
- Save your configuration and click **Save and Deploy**.
- AWS Amplify will automatically build and deploy your application.
- Once deployed, you’ll receive a live URL where your app is hosted.

### Environment Variables (Optional):
If your app requires any environment variables (e.g., API endpoints, secrets), add them in the Amplify Console under **App settings > Environment variables**.

## AWS Cognito Authentication

### Create a User Pool:
- Visit the [AWS Cognito Console](https://console.aws.amazon.com/cognito/).
- Click **Create user pool** and configure your sign-in method (e.g., email or username), password policies, and MFA (if needed).
- Create an **App client** (ensure you do not generate a secret) and note the **User Pool ID** and **App Client ID**.

### Configure the Application:
In your `src/environments/environment.ts` file, add your Cognito settings:
```javascript
export const environment = {
  production: false,
  cognito: {
    userPoolId: '<your-user-pool-id>',
    userPoolWebClientId: '<your-app-client-id>',
    region: 'us-east-1'
  }
};
```

### Initialize AWS Amplify with Cognito:
In your `main.ts` file, configure Amplify using the Cognito settings:
```typescript
import { Amplify } from 'aws-amplify';
import { environment } from './environments/environment';

Amplify.configure({
  Auth: {
    region: environment.cognito.region,
    userPoolId: environment.cognito.userPoolId,
    userPoolWebClientId: environment.cognito.userPoolWebClientId,
  }
});
```
Once configured, your application supports user registration, sign in, and secure authentication via AWS Cognito.

## Usage

### Site Selection:
- Use the multi-select dropdown to choose one or more sales sites. The sidebar dynamically displays the selected sites.

### Date Selection:
- Pick start and end dates from the date pickers.

### Export Sales Data:
- Click the **Generate Sales Export** button to trigger an export. The app validates your input and makes an API call to export sales orders.

### Authentication:
- Users can sign up and log in via AWS Cognito. Once authenticated, user-specific data and attributes can be managed securely.
- A presignup lambda has been created to restrict domains to only @rdspos.com and @pancheros.com. The lambda is called: [cognitoPreSignUpPancherosDomainRestrict](https://us-east-1.console.aws.amazon.com/lambda/home?region=us-east-1#/functions/cognitoPreSignUpPancherosDomainRestrict?newFunction=true&tab=code)

### Notifications:
- Messages will display to notify you of successful exports or any errors encountered during the process.
