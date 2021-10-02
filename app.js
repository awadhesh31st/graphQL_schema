const express = require("express")
const graphQLHTTP = require("express-graphql")
const app = express()

const schema = require("./schema/schema")


app.use("/graphQL", graphQLHTTP.graphqlHTTP({
    schema,
    graphiql: true
}))


app.listen(4000, () => {
    console.log("server started !!")
})