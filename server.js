const express = require('express');
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const shortenURL = require('./helper/shorten');
const ShortenedUrl = require('./models/shortenedURL');

const app = express();


app.use(
	'/graphql',
	graphqlHTTP({
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
			urlShortener: async args => {
				const url = args.url;
				//check for existing URL record
				// const record = await ShortenedUrl.findOne({ longURL: url })

				return ShortenedUrl.findOne({ longURL: url })
					.then(record => {
						console.log(record);
						if (record) {
							return record;
						} else {
							const shortenedUrl = shortenURL(url);
							const newUrlRecord = new ShortenedUrl({
								longURL: url,
								shortURL: shortenedUrl
							});
							return newUrlRecord.save();
						}
					})
					.catch(error => {
						console.log(error);
					});
			}
		},
		graphiql: true
	})
);

app.get('/:id', async (req, res, next) => {
	const URL = await ShortenedUrl.findOne({
		shortURL: `localhost:4500/${req.params.id}`
	});
  console.log(URL,req.params.id);
  //if a record exists, redirect to the long URL, else, redirect to the home page
  if(URL){
    //format URL to be absolute if not already
    res.redirect((/http/).test(URL.longURL) ? URL.longURL : `http://${URL.longURL}`)
  }else{
    res.redirect("http://localhost:4500/")
  }
});


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
