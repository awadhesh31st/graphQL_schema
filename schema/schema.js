const graphQL = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLID, GraphQLString } = graphQL

const Books = [
    { id: "1", name: "apple", genre: "tech", authorId: "1" },
    { id: "2", name: "samsung", genre: "tech", authorId: "2" },
    { id: "3", name: "nokia", genre: "tech", authorId: "1" }
]

const Authors = [
    { id: "1", name: "awadhesh", age: "27" },
    { id: "2", name: "kumar", age: "26" }
]

const BookType = new GraphQLObjectType({
    name: "Book",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        genre: { type: GraphQLString },
        authorId: { type: GraphQLID },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                return Authors.find(index => index.id === parent.authorId)
            }
        }
    })
})

const AuthorType = new GraphQLObjectType({
    name: "Author",
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLString },
        book: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Books.filter(index => index.authorId === parent.id)
            }
        }
    })
})

const RootQueryType = new GraphQLObjectType({
    name: "RootQuery",
    fields: {
        author: {
            type: AuthorType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Authors.find(index => index.id === args.id)
            }
        },
        book: {
            type: BookType,
            args: { id: { type: GraphQLID } },
            resolve(parent, args) {
                return Books.find(index => index.id === args.id)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
})