const { UserRefreshToken } = require("../Models/UserRefreshTokenSchema")

const ENVIRONMENT = process.env.ENVIRONMENT

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
        
        console.log("User info fetching")
        const user = await fetch("https://api.myanimelist.net/v2/users/@me", {
            headers: { Authorization: `Bearer ${access_token}` },
        });

        const user_data = await user.json();
        
        if(user_data){
            await UserRefreshToken.create({
                user_id: user_data.id,
                refresh_token: refresh_token
            })
        }

        console.log("User refresh stored in DB")

        res.cookie("mal_access_token", access_token, {
            httpOnly: true,
            secure: ENVIRONMENT === "LOCAL" ? false : true,
            sameSite: ENVIRONMENT === "LOCAL" ? "strict" : "NONE",
            maxAge: expires_in * 1000,
        })

        res.status(200).json({message: "Login successfull"})

    } catch (error) {
        console.log(error)
        return res.status(500).json({message: error})
    }
}

module.exports.logout = async (req, res) => {
    const {user_id} = req.body
    
    if(user_id){
        try {
        res.clearCookie("mal_access_token", {
            httpOnly: true,
            secure: ENVIRONMENT === "LOCAL" ? false : true,
            sameSite: ENVIRONMENT === "LOCAL" ? "strict" : "NONE",
        })

        await UserRefreshToken.deleteOne({user_id})

        res.status(200).json({message: "Logout successfull"})
        } catch (error) {
            console.log(error)
            return res.status(500).json({message: error})
        }
    }
}