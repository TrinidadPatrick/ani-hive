const { UserRefreshToken } = require("../Models/UserRefreshTokenSchema.js");
const { Session } = require("../Models/UserSessionSchema.js");
const { refresh } = require("../service/MalAuthService.js");

const ENVIRONMENT = process.env.ENVIRONMENT


module.exports.me = async (req, res) => {
    //If session is not expired but access token may or may not be expired
    const session = req.session

    try {
      if(session){

        let access_token = session.access_token ? session.access_token : await refresh(session, res)
        
        // get user profile using old unexpired access token or new access token
        const response = await fetch("https://api.myanimelist.net/v2/users/@me", {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if(response.status === 401) return res.status(401).json({ error: "Unauthorized" });

        const data = await response.json();

        return res.status(200).json(data);
      }

      return res.status(401).json({ error: "Unauthorized" });

    } catch (err) {
      console.log(err)
      res.status(500).json({ error: "Failed to fetch user info", details: err });
    }
}

module.exports.myAnimeList = async (req, res) => {
    const {status} = req.params
    const session = req.session

    if(session){

      const access_token = session.access_token ? session.access_token : await refresh(session, res)
      try {
        const response = await fetch(`https://api.myanimelist.net/v2/users/@me/animelist?status=${status}&limit=1000&sort=list_updated_at&nsfw=true`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });

        const data = await response.json();
        console.log(data)
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch user info", details: err });
      }
    }
}