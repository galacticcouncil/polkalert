import { ApolloServer, PubSub } from 'apollo-server-express'
import { typeDefs } from '../schema'
import resolvers from '../resolver'

export const server = new ApolloServer({
  typeDefs,
  resolvers
})

export const pubsub = new PubSub()

export default { server, pubsub }
