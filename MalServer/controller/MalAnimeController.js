

module.exports.me = async (req, res) => {
    const token = req.cookies.mal_access_token;

    if (!token) return res.status(401).json({ error: "Not logged in" });

    try {
    const response = await fetch("https://api.myanimelist.net/v2/users/@me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: "Failed to fetch user info", details: err });
  }
}

module.exports.myAnimeList = async (req, res) => {
    const {status} = req.params
    const token = req.cookies.mal_access_token;

    if (!token) return res.status(401).json({ error: "Not logged in" });

    try {
    const response = await fetch(`https://api.myanimelist.net/v2/users/@me/animelist?status=${status}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await response.json();
    console.log(data)
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user info", details: err });
  }
}