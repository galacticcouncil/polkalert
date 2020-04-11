# /packages/server

Polkalert server aggregates data from substrate based networks, to provide alerting functionality to validators.  
It is a Node.js app written in typescript which stores data in PostgreSQL database and offers GraphQL API.

You can interact with it using our Polkalert client or programatically thorugh GraphQL.  
If you want to run it, navigate to the root folder of the project and follow the instructions in README.md.

To interact with GraphQL you don't need to run client. 
You can navigate directly to ``http://localhost:4000/graphql`` to run GraphQL Playground,
interact with the server and browse documentation when running the server,
or write your own application using any GraphQL client.

To make Polkalert send notifications,
you will need to setup email server settings,
register a webhook or subscribe to messages throught GraphQL subscription.
If you want to receive notifications about validator,
you also need to provide validator's stash address.

You can also get history of messages through GraphQL query.
