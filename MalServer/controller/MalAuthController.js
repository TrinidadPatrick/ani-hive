
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
                    redirect_uri: "http://localhost:5173/auth/mal/callback",
                    code_verifier: codeVerifier,
                }),
            }
        )
        const result = await response.json()
        const { access_token, refresh_token, expires_in } = result;

        res.cookie("mal_access_token", access_token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            // maxAge: expires_in * 1000,
        })

        res.cookie("mal_refresh_token", refresh_token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        })

        res.status(200).json({message: "Login successfull"})

    } catch (error) {
        return res.status(500).json({message: error})
    }
}