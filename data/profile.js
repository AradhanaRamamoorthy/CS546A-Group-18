import {users} from '../config/mongoCollections.js';

let exportedMethods = {
    async updateUserProfile(email, firstName, bio, interests, lastName) {
        try {
            const usersCollection = await users();
            // Prepare the update object, updating only the fields that were provided
            const updateData = {};
    
            
            if (firstName) updateData.firstName = firstName;
            if (lastName) updateData.lastName = lastName;
            if (bio) updateData.bio = bio;
            if (interests) updateData.interests = interests;
            console.log(updateData);
            // Update the user document in MongoDB
            const result = await usersCollection.updateOne(
                { email: email }, 
                { $set: updateData }
            );
            // If no document was modified, throw an error
            if (result.modifiedCount === 0) {
                throw new Error('No data updated, user may not exist or no changes made.');
            }
            // Return the updated user document
            return await usersCollection.findOne({ email: email });
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    },

    async completeProfile(email, bio, interests) {
        try {
            const usersCollection = await users();
            const updateData = {};
            if (bio) updateData.bio = bio;
            if (interests) updateData.interests = interests;
            const result = await usersCollection.findOneAndUpdate(
                { email: email }, 
                { $set: updateData }
            );
            if (result.modifiedCount === 0) {
                throw new Error('No data updated, user may not exist or no changes made.');
            }
            return await usersCollection.findOne({ email: email });
        } catch (error) {
            console.error("Error updating user profile:", error);
            throw error;
        }
    }
}

export default exportedMethods;