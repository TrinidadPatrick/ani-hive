const crypto = require('crypto');
const { Session } = require('../Models/UserSessionSchema.js');
const { UserRefreshToken } = require('../Models/UserRefreshTokenSchema.js');

const ENVIRONMENT = process.env.ENVIRONMENT

const generateSessionId = (length = 64) => {
    return crypto.randomBytes(length).toString('hex');
}

const createSession = async (user_id, access_token, access_token_expires_at) => {
    if(!user_id || !access_token || !access_token_expires_at) return null
    // Create session expire within 2 hr inactive
    const session_id = generateSessionId()
    const expires_at = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2hrs;
    
    try {
        // Create session in db
        await Session.create({
            session_id,
            user_id: user_id,
            access_token,
            access_token_expires_at,
            expires_at: expires_at
        })

        return session_id
    } catch (error) {
        console.log(error)
        return null
    }
}

module.exports.createSession = createSession


module.exports.refresh = async (session, res) => {
    // Only run if theres sesssion
    if(session && session.user_id){
        try {
            // Find the user refresh token using session user id
            const {refresh_token : old_refresh_token} = await UserRefreshToken.findOne({
                user_id: session.user_id
            })

            // If not found then log user out
            if(!old_refresh_token) return res.status(401).json({ error: "Unauthorized"}); 

            // If found then generate new access token
            const response = await fetch("https://myanimelist.net/v1/oauth2/token", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded"},
            body: new URLSearchParams({
                grant_type: "refresh_token",
                refresh_token: old_refresh_token,
                client_id: process.env.MAL_CLIENT_ID,
                client_secret: process.env.MAL_CLIENT_SECRET,
            }),
            });

            const data = await response.json();
            
            const { access_token, refresh_token, expires_in } = data;

            // Meaning refresh token is invalid or expired then delte refresh and session and logout
            if(!access_token){ 
                await UserRefreshToken.deleteOne({user_id : session.user_id})
                await Session.deleteOne({user_id : session.user_id})
                return res.status(401).json({ error: "Unauthorized"}); 
            };

            const expiresInSeconds = expires_in;
            const expiresInMs = expiresInSeconds * 1000;
            const now = Date.now();
            const access_token_expires_at = new Date(now + expiresInMs);

            // Update old refresh token with new
            await UserRefreshToken.updateOne({user_id: session.user_id},
                {$set: {user_id: session.user_id, refresh_token}},
                {upsert: true}
            )
            
            // create session id and store in DB agin
            const session_id = await createSession(session.user_id, access_token, access_token_expires_at)
            
            // Meaning access_token is invalid so relogin
            if(!session_id) return res.status(401).json({ error: "Unauthorized"});

            // Refresh is valid so got new session_id
            res.cookie("session_id", session_id, {
                httpOnly: true,
                secure: ENVIRONMENT === "LOCAL" ? false : true,
                sameSite: ENVIRONMENT === "LOCAL" ? "strict" : "None",
                maxAge: 121 * 60 * 1000, //2hrs and 1 minute
            })

            // delete old session since its redundantt nwo
            await Session.deleteOne({session_id: session.session_id})

            return access_token


        } catch (error) {
            console.log(error)
            return error
        }
    }else{
        return null
    }
}