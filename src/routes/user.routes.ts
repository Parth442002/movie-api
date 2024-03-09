import express,{ Response,Request } from 'express';
require("dotenv").config();
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import UserModel,{UserDocument} from '../models/userModel';
import { verifyToken } from '../middleware/auth';
import redis from '../config/redis';
const router = express.Router();



//Get All Users
router.get('/all', async (req: Request, res: Response) => {
  try {
    const cached_users = await redis.get('users'); //Checking in redis cache
    console.log(cached_users)
    if(cached_users){
      return res.status(200).send(JSON.parse(cached_users));
    }
    const users: UserDocument[] = await UserModel.find();
    await redis.set('movies', JSON.stringify(users), 'EX', 60 * 10); //Expire in 10 minutes
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).send({ error: 'Internal Server Error' });
  }
});

//Get Logged In User
router.get("/", verifyToken, async (req: Request, res: Response) => {
  try {
    // Retrieve the user model using the id stored in req.user.id
    const user: UserDocument | null = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).send("User not found");
    }
    // Send the user model in the response
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//User Register Route
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password, username, is_admin } = req.body;
    //Fields which are necessary for User Creation
    if (!(phoneNumber && password && username)) {
      res.status(400).send("Input Data missing");
      return;
    }
    const oldUser = await UserModel.findOne({ phoneNumber });
    if (oldUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }
    //Creating a new User now
    const encryptedPassword = await bcrypt.hash(password, 10);
    const userData={
      phoneNumber: phoneNumber,
      profileUrl: req.body?.profileUrl,
      username: username,
      password: encryptedPassword,
      is_admin: is_admin === undefined ? false : is_admin, // Set is_admin to false if not provided
    };
    const user = await UserModel.create(userData);
    const token = jwt.sign(
      { id: user._id, phoneNumber: user.phoneNumber },
      "token",
      {
        expiresIn: "24h",
      }
    );
    user.token = token;
    await user.save(); // Save the updated user with the token
    return res.status(201).json(user);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
});

//User Login Route
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { phoneNumber, password } = req.body;
    //Check if input is valid
    if (!(phoneNumber && password)) {
      return res.status(400).send("All input is required");
    }
    const user = await UserModel.findOne({ phoneNumber });
    //If user is valid
    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { id: user._id, phoneNumber: user.phoneNumber },
        "token",
        {
          expiresIn: "24h",
        }
      );
      user.token = token;
      await user.save(); // Save the updated user with the token
      return res.status(201).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
});



export default router;
