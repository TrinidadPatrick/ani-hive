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
        const response = await fetch("https://api.myanimelist.net/v2/users/@me?fields=anime_statistics", {
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
    const offset = req.query.offset
    const session = req.session
    if(session){

      const access_token = session.access_token ? session.access_token : await refresh(session, res)
      try {
        const response = await fetch(`https://api.myanimelist.net/v2/users/@me/animelist?status=${status}&limit=1000&sort=list_updated_at&nsfw=true&offset=${offset}
          &fields=list_status,num_episodes,start_date,end_date,genres,studios,media_type`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if(!response.ok) return res.status(400).json({message: "Bad request"})
        const data = await response.json();
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch anime list", details: err });
      }
    }
}

module.exports.checkIsSaved = async (req, res) => {
    const {id} = req.params
    const session = req.session
    if(session){

      const access_token = session.access_token ? session.access_token : await refresh(session, res)
      try {
        const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}?fields=my_list_status`, {
          headers: { Authorization: `Bearer ${access_token}` },
        });
        if(!response.ok) return res.status(400).json({message: "Bad request"})
        const data = await response.json();
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: "Failed to fetch user info", details: err });
      }
    }
}

module.exports.updateAnime = async (req, res) => {
    const {id,num_watched_episodes,status,score} = req.body
    const session = req.session
    if(session){
      console.log({id,num_watched_episodes,status})
      const access_token = session.access_token ? session.access_token : await refresh(session, res)

      try {
        const response = await fetch(`https://api.myanimelist.net/v2/anime/${id}/my_list_status`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${access_token}` },
          body: new URLSearchParams({
                status,
                num_watched_episodes,
                score
                }),
        });

        if(!response.ok) return res.status(400).json({message: "Bad request"})

        const data = await response.json();
        res.status(200).json(data);
      } catch (err) {
        console.log(err)
        res.status(500).json({ error: "Failed to update anime info", details: err });
      }
    }
}