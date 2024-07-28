import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
const typeDefs = `
  type Book {
    title: String
    author: String
  }

  type Hero {
    name: String
    age: Int
  }

  type Movie {
    title: String
    heroes: [Hero]
    author: String
  }

  type Query {
    books: [Book]
    allMovies: [Movie]
    movies(heroAge: Int): [Movie]
  }

  type Mutation {
    addHeroToMovie(movieTitle: String!, hero: HeroInput!): Movie
    updateHeroInMovie(movieTitle: String!, currentHeroName: String!, newHero: HeroInput!): Movie
    updateMovie(
      currentTitle: String!
      newTitle: String
      newAuthor: String
      newHeroes: [HeroInput]
    ): Movie
    updateMovietitle(currentTitle: String!, newTitle: String!): Movie
  }
  
  input HeroInput {
    name: String!
    age: Int!
  }
`;
const books = [
    {
        title: 'The Awakening',
        author: 'Kate Chopin',
    },
    {
        title: 'City of Glass',
        author: 'Paul Auster',
    },
    {
        title: 'Twilight',
        author: 'Stephanie Meyer',
    },
    {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
    },
];
const movies = [
    {
        title: 'Star Wars',
        heroes: [
            {
                name: 'Luke Skywalker',
                age: 25,
            },
        ],
        author: 'George Lucas',
    },
    {
        title: 'Asoka',
        heroes: [
            {
                name: 'Ahsoka Tano',
                age: 17,
            },
        ],
        author: 'George Lucas',
    },
    {
        title: 'Mandalorian',
        heroes: [
            {
                name: 'Din Djarin',
                age: 36,
            },
        ],
        author: 'George Lucas',
    },
    {
        title: 'Spider-Man',
        heroes: [
            {
                name: 'Peter Parker',
                age: 17,
            },
        ],
        author: 'Sam Raimi',
    },
    {
        title: 'The Notebook',
        heroes: [
            {
                name: 'Noah Calhoun',
                age: 17,
            },
        ],
        author: 'Nicholas Sparks',
    },
    {
        title: 'Shrek',
        heroes: [
            {
                name: 'Princess Fiona',
                age: 30,
            },
        ],
        author: 'William Steig',
    },
];
const resolvers = {
    Query: {
        books: () => books,
        allMovies: () => movies,
        movies: (_, args) => {
            if (args.heroAge !== undefined) {
                return movies.filter(movie => movie.heroes.some(hero => hero.age === args.heroAge));
            }
            return movies;
        },
    },
    Mutation: {
        addHeroToMovie: (_, { movieTitle, hero }) => {
            const movieIndex = movies.findIndex(movie => movie.title === movieTitle);
            if (movieIndex === -1) {
                throw new Error("Movie not found");
            }
            // Initialize heroes array if it doesn't exist
            if (!movies[movieIndex].heroes) {
                movies[movieIndex].heroes = [];
            }
            // Check if the hero already exists in the movie
            const existingHeroIndex = movies[movieIndex].heroes.findIndex(h => h.name === hero.name);
            if (existingHeroIndex !== -1) {
                // Hero already exists, update the existing hero's details
                movies[movieIndex].heroes[existingHeroIndex] = hero;
            }
            else {
                // Add new hero
                movies[movieIndex].heroes.push(hero);
            }
            return movies[movieIndex];
        },
        updateHeroInMovie: (_, { movieTitle, currentHeroName, newHero }) => {
            const movieIndex = movies.findIndex(movie => movie.title === movieTitle);
            if (movieIndex === -1) {
                console.log("Movie not found:", movieTitle);
                throw new Error("Movie not found");
            }
            const heroIndex = movies[movieIndex].heroes.findIndex(h => h.name === currentHeroName);
            if (heroIndex === -1) {
                console.log("Hero not found in movie:", currentHeroName, "in", movieTitle);
                console.log("Existing heroes in the movie:", movies[movieIndex].heroes);
                throw new Error("Hero not found");
            }
            // Update the hero's details
            movies[movieIndex].heroes[heroIndex] = newHero;
            return movies[movieIndex];
        },
        updateMovietitle: (_, { currentTitle, newTitle }) => {
            const movieIndex = movies.findIndex(movie => movie.title === currentTitle);
            if (movieIndex === -1) {
                throw new Error("Movie not found");
            }
            movies[movieIndex].title = newTitle;
            return movies[movieIndex];
        },
    },
};
const server = new ApolloServer({
    typeDefs,
    resolvers,
});
startStandaloneServer(server, {
    listen: { port: 4000 },
}).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
