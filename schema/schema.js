const graphQL = require("graphql")
const { GraphQLObjectType, GraphQLSchema, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLString, GraphQLInt } = graphQL

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
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve(parent, args) {
                return Authors
            }
        },
        books: {
            type: new GraphQLList(BookType),
            resolve(parent, args) {
                return Books
            }
        }
    }
})

const RootMutationType = new GraphQLObjectType({
    name: "RootMutation",
    fields: {
        addBook: {
            type: new GraphQLList(BookType),
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                genre: { type: GraphQLString },
                authorId: { type: GraphQLInt }
            },
            resolve(parent, args) {
                let tempBooks = Books
                let authorIds = []
                Authors.forEach(index => authorIds.push(index.id))
                let autherId = Math.floor(Math.random() * authorIds.length)
                let totalBook = tempBooks.length + 1
                let obj = {
                    id: totalBook,
                    name: args.name,
                    genre: args.genre,
                    authorId: authorIds[autherId]
                }
                tempBooks.push(obj)
                return tempBooks
            }
        },
        addAuthor: {
            type: new GraphQLList(AuthorType),
            args: {
                id: { type: GraphQLID },
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: GraphQLInt }
            },
            resolve(parent, args) {
                let tempAuthors = Authors
                let totalAuthor = tempAuthors.length + 1
                let obj = {
                    id: totalAuthor,
                    name: args.name,
                    age: args.age
                }
                tempAuthors.push(obj)
                return tempAuthors
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})