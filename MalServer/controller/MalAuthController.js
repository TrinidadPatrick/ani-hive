const { UserRefreshToken } = require("../Models/UserRefreshTokenSchema")
const { Session } = require("../Models/UserSessionSchema.js");
const { createSession } = require("../service/MalAuthService.js");

const ENVIRONMENT = process.env.ENVIRONMENT

// Handle MAL login
module.exports.token = async (req, res) => {
    const {code, codeVerifier} = req.body

    try {
        const response = await fetch("https://myanimelist.net/v1/oauth2/token", 
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    client_id: process.env.MAL_CLIENT_ID,
                    client_secret: process.env.MAL_CLIENT_SECRET,
                    grant_type: "authorization_code",
                    code,
                    redirect_uri: `${process.env.CLIENT_BASE_URL}/auth/mal/callback`,
                    code_verifier: codeVerifier,
                }),
            }
        )
        const result = await response.json()
        const { access_token, refresh_token, expires_in } = result;

        const expiresInSeconds = expires_in;
        const expiresInMs = expiresInSeconds * 1000;
        const now = Date.now();
        const access_token_expires_at = new Date(now + expiresInMs);
        
        console.log("User info fetching")
        const user = await fetch("https://api.myanimelist.net/v2/users/@me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user_data = await user.json();
        
        if(user_data){
            // Create user refresh and access token in db
            await UserRefreshToken.updateOne({user_id: user_data.id},
                {$set: {user_id: user_data.id, refresh_token}},
                {upsert: true}
            )

            const session_id = await createSession(user_data.id, access_token, access_token_expires_at)
            console.log(code, codeVerifier)
            console.log("User refresh stored in DB")

            res.cookie("session_id", session_id, {
                httpOnly: true,
                secure: ENVIRONMENT === "LOCAL" ? false : true,
                sameSite: ENVIRONMENT === "LOCAL" ? "strict" : "None",
                maxAge: 24 * 60 * 60 * 1000 //24 hrs
            })

            return res.status(200).json({message: "Login successfull"})
        }

        return res.status(404).json({message: "User not found"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error})
    }
}

module.exports.logout = async (req, res) => {
    const session_id = req.cookies.session_id;

    if(!session_id) return res.status(401).json({message: "Unauthorized"})
    
        try {
        res.clearCookie("session_id", {
            httpOnly: true,
            secure: ENVIRONMENT !== "LOCAL",
            sameSite: ENVIRONMENT === "LOCAL" ? "strict" : "None",
        })

        const session = await Session.findOne({
            session_id: session_id
        })

        if(!session) return res.status(404).json({message: "Session not found"})

        await session.deleteOne()

        res.status(200).json({message: "Logout successfull"})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: error})
        }
}