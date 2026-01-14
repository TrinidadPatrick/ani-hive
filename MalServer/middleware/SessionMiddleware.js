const { UserRefreshToken } = require("../Models/UserRefreshTokenSchema.js");
const { Session } = require("../Models/UserSessionSchema.js");
const { createSession, refresh } = require("../service/MalAuthService.js");

const ENVIRONMENT = process.env.ENVIRONMENT

module.exports.sessionMiddleware = async (req, res, next) => {
    const session_id = req.cookies.session_id;

    // If no session from FE then logout
    if (!session_id) return res.status(401).json({ error: "Not logged in" });

   try {
        // finf session from db
        const session = await Session.findOne({
            session_id: session_id
        })
        
        // If session expired or not found logout the user
        if (!session || session.expires_at < Date.now()) {
            res.clearCookie("session_id", {
                httpOnly: true,
                secure: ENVIRONMENT !== "LOCAL",
                sameSite: ENVIRONMENT === "LOCAL" ? "strict" : "None",
            })
            // Only delete session if its expired
            if(session) await session.deleteOne()
            return res.status(401).json({ message: "Session expired" });
        }
        
        // If access token is expired then set access token to null
        if(session.access_token_expires_at < Date.now()){
            session.access_token = null
            req.session = session
            return next()
        }

        // Add another 1 hr to expiration active
        session.expires_at = Date.now() + 24 * 60 * 60 * 1000 //24 hrs
        await session.save();

        req.session = session
        next()
   } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Internal server error" });
   }
}