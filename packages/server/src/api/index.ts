import { ApolloServer } from 'apollo-server'
import { typeDefs } from '../schema'
import resolvers from '../resolver'

const server = new ApolloServer({
  typeDefs,
  resolvers
})

export default server
