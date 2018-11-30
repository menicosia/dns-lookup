# dns-lookup
DNS lookups as an API

### Deploy

**Deploy to Cloud Foundry**

```sh
cd dns-lookup
cf push
```

You need only one deployment per CF Foundation. All users can share the same instance of the app.

**Local operation**

For development and debugging purposes, you can deploy locally, too. This won't have access to BOSH DNS's servers, however.

```sh
node ./server.js
curl 'http://localhost:8080/json/resolve?host=www.yahoo.com'
```

### Web UI and API

**API**

- The service offers one endpoint, `resolve` which takes a single argument, `host`. See examples for usage.

**Web UI**

![dns lookup screenshot](dns-lookup-webUI.png]

### Usage

```sh
cf create-service ...
cf create-service-key SERVICE-INSTANCE KEY-NAME
cf service-key SERVICE-INSTANCE KEY-NAME | tail +2 | jq .hostname
curl 'http://dns-lookup.APP-DOMAIN/resolve?host=HOSTNAME'
```

Where:
- SERVICE-INSTANCE: The name of the service you'd like to connect to
- KEY-NAME: A service key which will contain the credentials needed
- APP-DOMAIN: Your cloud foundry DNS domain component
- HOSTNAME: The hostname component of the service key's credentials
