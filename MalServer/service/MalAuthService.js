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
    const expires_at = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24hrs;
    
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

const waitTimer = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve()
        }, 500)
    })
}


module.exports.refresh = async (session, res) => {
    // Only run if theres sesssion
    if(session && session.user_id){

        // Check if refresh_token is refreshing
        //if its not then this is the leader
        const user_refresh =  await UserRefreshToken.findOne({
                user_id: session.user_id
        })

        if(user_refresh.is_refreshing){
            let attempts = 0;
            const maxAttempts = 10;

            while(attempts <= maxAttempts){
                const latestSession = await Session.findOne({user_id:session.user_id}).lean()

                // Meaning not expired now
                if (latestSession.access_token_expires_at > Date.now()) {
                    console.log("Still waiting")
                    return latestSession.access_token;
                }

                await waitTimer();
                attempts++;
            }
        }

        try {
            // If this is the leader then set it to true
            user_refresh.is_refreshing = true
            await user_refresh.save();
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
            // Meaning access_token is i    nvalid so relogin
            if(!session_id) return res.status(401).json({ error: "Unauthorized"});

            // Refresh is valid so got new session_id
            res.cookie("session_id", session_id, {
                httpOnly: true,
                secure: ENVIRONMENT === "LOCAL" ? false : true,
                sameSite: ENVIRONMENT === "LOCAL" ? "strict" : "None",
                maxAge: 24 * 60 * 60 * 1000 //24 hrs
            })

            // delete old session since its redundantt nwo
            setTimeout(async () => {
                try {
                    console.log("Hmmmm");
                    console.log(session);
                    
                    const result = await Session.deleteOne({ session_id: session.session_id });
                    
                    console.log("Delete result:", result);
                } catch (err) {
                    console.error("Delayed delete failed:", err);
                }
            }, 10000);

            return access_token


        } catch (error) {
            console.log(error)
            return error
        } finally {
            user_refresh.is_refreshing = false
            await user_refresh.save();
        }
    }else{
        return null
    }
}