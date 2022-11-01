# VELOCE INTEGRATION SEED

## PREREQUSITES:

- node 16+
- npm 7+
- sfdx-cli 7+

## QUICK START:

Create global variable NEXUS_NPM_AUTH with Veloce Nexus authorization token and install dependencies:

```
NEXUS_NPM_AUTH={{token}}
npm i
```

Authorize an org using `sfdx` command

```
sfdx force:auth:web:login -r https://test.salesforce.com -a org
```

Install `veloce-sfdx-v3` plugin

```
sfdx plugins:install veloce-sfdx-v3
```

Start the app:

```
npm run start
```

## HOW TO

### Get UI definitions from org:

```
sfdx veloce:source:pull -m config-ui:MyProductModel
```

### Authorize

Authorize Salesforce org with credentials from LastPass:

```bass
npm run auth
```

By default it will authorize `studio-dev` org, but any other org can be specified this way:

```bash
npm run auth -- -u studio-qa
```

This will create `local/auth.json` file with token and proxy configuration.

### Dev token

There are two options for providing Dev session token:

1. Add `window.DEV_TOKEN` (in apps/host/src/index.html) with said token
2. Add `devToken` property to the `local/auth.json` file

### Start DEMO configuration application:

1. Push Demo product model to the target Salesforce org:

```
sfdx veloce:source:push -m model:Demo
```

2. Start host application (including angular Demo module):

```
npm run start:demo
```

3. Open `http://localhost:4202` in the browser and run Demo model configuration UI.
