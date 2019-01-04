/* handler.js */
const {
	graphql,
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLNonNull,
} = require('graphql');

// This method just inserts the user's first name into the greeting message.
const getGreeting = (firstName) => `Hello, ${firstName}.`;

// Here we define the query used for the schema.
const query = new GraphQLObjectType({
	name: 'RootQueryType', // an arbitrary name
	fields: {
		// the query has a field called 'greeting'
		greeting: {
			// the greeting message is a string
			type: GraphQLString,
			// we need to know the user's name to greet them
			args: {
				firstName: {
					name: 'firstName',
					type: new GraphQLNonNull(GraphQLString),
				},
			},
			// resolve to a greeting message
			resolve: (parent, { firstName }) => getGreeting(firstName),
		},
	},
});

// Here we declare the schema and resolvers for the query.
const schema = new GraphQLSchema({
	query,
});

// TODO: Refactor the schema out of the handler
//     BEFORE `$ serverless deploy`

// We want to make a GET request with ?query=<graphql query>
// The event properties are specific to AWS. Other providers will differ.
module.exports.query = (event, context, callback) =>
	graphql(schema, event.queryStringParameters.query).then(
		(result) =>
			callback(null, { statusCode: 200, body: JSON.stringify(result) }),
		(err) => callback(err)
	);
