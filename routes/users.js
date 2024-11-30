import {Router} from 'express';
const router = Router();
import userDataFunctions from '../data/Users.js';
import {users} from '../config/mongoCollections.js';
import { allInterests } from "../config/mongoCollections.js";
import { interestData } from '../data/index.js';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import {ObjectId} from 'mongodb';

router
    .route('/signup')
    .get(async (req, res) => {
        try {
            res.render('./users/signup', {
                layout: 'login',
                title: 'Signup'
            }); 
        } catch (e) {
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) =>{
        const {firstName, lastName, email, password, confirmPassword} = req.body;
        try{
            if (!firstName || !lastName || !email || !password || !confirmPassword) {
                // res.render('./users/signup', {
                //     layout: 'login',
                //     title: 'Signup',
                //     hasError: true,
                //     error: "All fields are required."
                // });
                return res.status(400).json({ error: 'All fields are required.' });
            }

            if (password !== confirmPassword) {
                // res.render('./users/signup', {
                //     layout: 'login',
                //     title: 'Signup',
                //     hasError: true,
                //     error: "Passwords are not matching."
                // });
                return res.status(400).json({ error: 'Passwords are not matching.' });
            } 
            const usersCollection = await users();
            const existingUser = await usersCollection.findOne({ email: email.trim() });
            
            if(existingUser){
                // res.render('./users/signup', {
                //     layout: 'login',
                //     title: 'Signup',
                //     hasError: true,
                //     error: "User already exists with same email."
                // });
                return res.status(400).json({ error: 'User already exists with same email.' });
            }

            else{
                await userDataFunctions.addUser(firstName, lastName, email, password);
                res.render('./users/login', {
                    layout: 'login',
                    title: 'Login'
                }); 
            }
        } catch (e) {
            res.status(500).json({error: e});
        }
    });

router
    .route('/')
    .get(async (req, res) => {
        try {
            res.render('./users/login', {
                layout: 'login',
                title: 'Login'
            }); 
        } catch (e) {
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const {email, password} = req.body;
        const usersCollection = await users();
        const user = await usersCollection.findOne({ email: email.trim() });
        try {
            if(!email || !password ){
                return res.status(400).json({ error: 'Both email and password are required.' });
            }
            if (!user) {
                // return res.render('./users/login', {
                //     layout: 'login',
                //     title: 'Login',
                //     hasError: true,
                //     error: "Invalid email or password"
                // });
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            const isPasswordValid = await bcrypt.compare(password.trim(), user.password);
            if (!isPasswordValid) {
                // return res.render('./users/login', {
                //     layout: 'login',
                //     title: 'Login',
                //     hasError: true,
                //     error: "Invalid email or password"
                // });
                return res.status(401).json({ error: 'Invalid email or password.' });
            }

            if (user.recentVisit === null) {
                // await usersCollection.updateOne(
                //     { _id: user._id },
                //     { $set: { recentVisit: new Date() } }
                // );
                // req.session.user = { id: user._id, email: user.email };
                // const interestCollection = await allInterests();
                // const interests = await interestCollection.find({}).toArray();
                // const interestNames = interests.map(interest => ({
                //     interestName: interest.interestName
                // }));

                // return res.render('./users/home', {
                //     layout: 'main',
                //     title: 'Home'
                //     //interests: interestNames
                // });
                //return res.status(200).json({ redirect: '/profile-setup' });
                return res.status(200).json({ redirect: '/moods/moodpage' });
            } else {
                return res.status(200).json({ redirect: '/moods/moodpage' });
            }
             //Set the session for the successful login:
        //   req.session.user = { id: user._id, email: user.email };
        //   return res.status(200).json({ redirect: '/moods/moodpage' });
        } catch (e) {
            res.status(500).json({ error: e });
        }
    });

router 
    .route('/profile-setup')
    // .get(async (req, res) => {
    //     try {
    //         const interestsCollection = await allInterests(); 
    //         const interests = await interestsCollection.find({}).toArray();
    //         res.render('./users/home', {
    //           layout: 'main',
    //           title: 'Complete Your Profile',
    //           allInterests: interests
    //         });
    //       } catch (error) {
    //         console.error(error);
    //         res.status(500).send('Internal Server Error');
    //       }
    // })
    // .post(async (req, res) => {
    //     try {
    //         const { bio, interests } = req.body;
    //         const userId = req.user._id; 
    //         const userCollection = await users();
        
    //         if (!interests || interests.length < 1 || interests.length > 4) {
    //           return res.status(400).json({ error: 'You must select between 1 and 4 interests.' });
    //         }
        
    //         const updatedUser = {
    //           bio: bio?.trim() || '', 
    //           interests: Array.isArray(interests) ? interests : [interests], 
    //         };
        
    //         // // Handle file upload if provided
    //         // if (req.file) {
    //         //   updatedUser.profilePicture = `/uploads/${req.file.filename}`;
    //         // }
        
    //         // Update the user in the database
    //         const result = await userCollection.updateOne(
    //           { _id: userId },
    //           { $set: updatedUser }
    //         );
        
    //         if (result.modifiedCount === 0) {
    //           throw new Error('Failed to update profile.');
    //         }
        
    //         res.status(200).json({ message: 'Profile updated successfully.' });
    //       } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error: error.message });
    //       }
    // })
    //     if (user.recentVisit === null) {
    //         // await usersCollection.updateOne(
    //         //     { _id: user._id },
    //         //     { $set: { recentVisit: new Date() } }
    //         // );
    //         // req.session.user = { id: user._id, email: user.email };
    //         const interestCollection = await allInterests()
    //         const interests = await interestCollection.find({}).toArray();

    //         const interestNames = interests.map(interest => ({
    //             interestName: interest.interestName 
    //         }));
    //         return res.render('./users/home', {
    //             layout: 'main',
    //             title: 'Home',
    //             interests: interestNames
    //         }); 
    //     } else{
    //         res.redirect('/moodQuestionnaire')
    //     }
    // })
    // .put(async (req, res) => {
    //     const { bio, userInterests } = req.body;
    //     try {
    //         if (!userInterests || userInterests.length === 0) {
    //             return res.status(400).send("Please select at least one interest.");
    //         }

    //         const selectedInterests = Array.isArray(userInterests) ? userInterests : [userInterests];
    //         if (selectedInterests.length > 5) {
    //             return res.status(400).send("You can only select a maximum of 5 interests.");
    //         }

    //         let updateData = {
    //             bio: bio || "",
    //             userInterests: selectedInterests
    //         };

    //         const usersCollection = await users();
    //         await usersCollection.updateOne(
    //             { _id: req.session.user.id },
    //             { $set: updateData }
    //         );

    //         res.render('./users/moodQuestionnaire', {
    //             layout: 'main',
    //             title: 'Mood Questionnaire'
    //         });

    //     } catch (error) {
    //         res.status(500).json({ error: error.message });
    //     }
    // });

//Added in a new Route for the Mood Questionaire Page under moods.js file
/*router 
    .route('/moodQuestionnaire')
    .get(async (req, res) => {
        try {
            res.render('./users/moodQuestionnaire', {
                layout: 'main',
                title: 'Mood Questionnaire'
            });
        } catch(e){
            res.status(500).json({ error: e.message });
        }
    })*/
    // .post(async (req, res) => {
    //     const { email, password } = req.body;
    //     try {
    //         const usersCollection = await users();
    //         const user = await usersCollection.findOne({ email: email.trim() });
    //         if (!user || user.password !== password.trim()) {
    //             return res.status(400).redirect('/login');
    //         }
    //         //req.session.user = { id: user._id, email: user.email }; // set session data
    //         if (user.recentVisit === null) {
    //             // await usersCollection.updateOne(
    //             //     { _id: user._id },
    //             //     { $set: { recentVisit: new Date() } }
    //             // );
    //             // req.session.user = { id: user._id, email: user.email };
    //             res.render('./users/moodQuestionnaire', {
    //                 layout: 'main',
    //                 title: 'Mood Questionnaire'
    //             });
    //         } else{
    //             await usersCollection.updateOne(
    //                 { _id: user._id },
    //                 { $set: { recentVisit: new Date() } }
    //             );
    //             req.session.user = { id: user._id, email: user.email };
    //             res.render('./users/moodQuestionnaire', {
    //                 layout: 'main',
    //                 title: 'Mood Questionnaire'
    //             });
    //         }
    //     } catch (error) {
    //         res.status(500).send('An error occurred during login');
    //     }
    // });

router
    .route('/profile')
    .get(async (req, res) => {
        try {
            res.render('./users/profile', {
                layout: 'main',
                title: 'Profile'
            });
        } catch (e) {
            res.status(500).json({error: e});
        }
    });

router  
    .route('/reset')
    .get(async (req, res) => {
        try {
            res.render('./users/reset', {
                layout: 'main',
                title: 'Forgot password'
                });
        } catch (e) {
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const {email} = req.body;
        const usersCollection = await users();
        const user = await usersCollection.findOne({ email: email.trim() });
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = Date.now() + 30 * 60 * 1000;

        try{
            if(!user){
                res.status(404).json({error: 'User not found'});
            }
            await usersCollection.updateOne(
                { email: email.trim() },
                { $set: { resetToken: resetToken, 
                    resetTokenExpiry: resetTokenExpiry } }
            );

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'moodhaven16@gmail.com',
                    pass: 'kuhjoufxcbpvbfve'
                }
            })

            const resetLink = `http://localhost:3000/reset-password?token=${resetToken}`;
            const mailOptions = {
                from: 'moodhaven16@gmail.com',
                to: email.trim(),
                subject: 'Reset Password',
                text: `Please click on the link to reset your password: ${resetLink}. The link expires in 30 minutes`
            };
            await transporter.sendMail(mailOptions);
            res.render('./users/response', {
                layout: 'main',
                title: 'Forgot password',
                msg: 'Password reset link sent successfully to your email'
            });
        } catch (e){
            res.status(500).json({error: e});
        }
    });

router 
    .route('/reset-password')
    .get(async (req, res) => {
        const {token} = req.query;
        const usersCollection = await users();

        try{
            const user = await usersCollection.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() },
            });
            if(!user){
                res.status(400).json({error: 'Invalid or expired token'});
            }

            res.render('./users/reset-password', {
                title: 'Reset Password',
                layout: 'main', 
                token
            })
        } catch(e){
            res.status(500).json({error: e});
        }
    })
    .post(async (req, res) => {
        const {token, password, confirmPassword} = req.body;
        const usersCollection = await users();
        try{
            if (password !== confirmPassword) {
                res.render('./users/reset-password', {
                    layout: 'main',
                    title: 'Reset Password',
                    hasError: true,
                    error: "Passwords don't match"
                });
            }

            const user = await usersCollection.findOne({
                resetToken: token,
                resetTokenExpiry: { $gt: Date.now() },
            });

            if(!user){
                res.status(400).json({error: 'Invalid or expired token'});
            }

            const hashedPassword = await bcrypt.hash(password.trim(), 10);
            await usersCollection.updateOne(
                {_id: new ObjectId(user._id)},
                {
                    $set: { password: hashedPassword, },
                    $unset: { resetToken: "", resetTokenExpiry: "" },
                }
            );
            res.status(200).render('./users/response', {
                layout: 'main',
                title: 'Reset Password',
                hasResponse: true,
                msg: 'Password reset successfully'
            })
        } catch(e){
            res.status(500).json({error: e});
        }
    })

export default router;  
