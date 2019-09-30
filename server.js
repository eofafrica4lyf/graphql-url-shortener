const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const shortenURL = require('./helper/shorten')
const ShortenedUrl = require('./models/shortenedURL')

const app = express();

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`

  type RootQuery{
    allUrls: [String!]
  }

  type URL {
    _id: ID!
    shortURL: String!
    longURL: String!
  }

  type RootMutation{
    urlShortener(url: String!): URL
  }

  schema{
    query: RootQuery
    mutation: RootMutation
  }
  `),
  rootValue: {
    urlShortener: (args) => {
      const url = args.url;
      const shortenedUrl = shortenURL(url);
      const newUrlRecord = new ShortenedUrl({
        longURL: url,
        shortURL: shortenedUrl
      })
      return newUrlRecord.save().then((result) =>{
        return result;
      }).catch((error)=>{
        console.log(error);
      });
    }
  },
  graphiql: true
}))

const port = process.env.PORT || 4500;


mongoose
	.connect('mongodb://localhost/urlShortener', {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
	.then(() => {
		app.listen(port, () => {
			console.log(`Server is running on port ${port}`);
		});
	})
	.catch(error => {
		console.log(error);
	});
