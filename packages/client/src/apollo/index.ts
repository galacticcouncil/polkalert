import ApolloClient from 'apollo-boost'
import config from 'config/config'

const client = new ApolloClient({
  uri: 'http://127.0.0.1:' + config.serverPort + '/graphql'
})

export default client
