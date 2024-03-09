require('dotenv').config();
import express, { Express, Request, Response } from "express";
import cors from "cors"


//Local Imports
import connect from "./config/database";
import AuthRoutes from "./routes/user.routes"
import MovieRoutes from "./routes/movie.routes";
import { verifyToken } from "./middleware/auth";
import MovieModel from "./models/movieModel";
import { createUsers,createMovies } from "./bulk_create";
import redis from "./config/redis";

//Config Files
const port:Number = Number(process.env.PORT)||3000;
const app: Express = express();
app.use(express.json());
app.use(cors());

//HomePage of Api
app.get("",async(req:Request,res:Response)=>{
  try {
    return res.status(200).send({message:"Welcome to Movie Api, Please use /auth, /movies and /search?q={query} routes to access the data."})
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
})

//Search Functionality
app.get('/search', verifyToken, async (req: Request, res: Response) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Missing search query' });
    }

    // Check if the search query result is cached
    const cachedResult = await redis.get(`search:${q}`);
    if (cachedResult) {
      console.log("Cached result found!");
      return res.status(200).json(JSON.parse(cachedResult));
    }

    // If not cached, fetch from MongoDB
    const movies = await MovieModel.find({ $text: { $search: String(q) } });

    // Cache the result with a TTL of 1 hour (3600 seconds)
    await redis.set(`search:${q}`, JSON.stringify(movies), 'EX', 60*30); // Expires in 30 minutes

    return res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.use("/auth",AuthRoutes);
app.use("/movies",MovieRoutes);


const startServer = async () => {
  try {
    await connect();
    await createUsers();
    await createMovies();
    app.listen(port, () => {
      console.log(`now listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();

export {app}