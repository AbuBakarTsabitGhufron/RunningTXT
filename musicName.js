const axios = require("axios");

// auth VLC (sesuaikan kalau pakai password)
const VLC_AUTH = {
  username: "",
  password: "dentri"
};

module.exports = (app) => {

  app.get("/", (req, res) => {
    res.redirect("/musicName");
  });

  app.get("/test", (req, res) => {
    res.send("Server OK - akses /running-text untuk running text");
  });

  app.get("/api/musicName", async (req, res) => {
    try {
      const response = await axios.get(
        "http://localhost:8081/requests/status.json",
        { auth: VLC_AUTH }
      );

      if (!response.data.information ||
          !response.data.information.category ||
          !response.data.information.category.meta ||
          !response.data.information.category.meta.filename) {
        res.send("");
        return;
      }

      let filename = response.data.information.category.meta.filename;

      let runningText = filename
        .replace(".stream", "")
        .replace(".mp3", "")
        .replace(/([A-Z])/g, " $1")
        .trim();

      res.send(runningText);

    } catch (error) {
      res.send("");
    }
  });

  app.get("/musicName", async (req, res) => {
    try {
      const response = await axios.get(
        "http://localhost:8081/requests/status.json",
        { auth: VLC_AUTH }
      );

      if (!response.data.information ||
          !response.data.information.category ||
          !response.data.information.category.meta ||
          !response.data.information.category.meta.filename) {
        res.send("No media playing or data not available");
        return;
      }

      let filename = response.data.information.category.meta.filename;

      let runningText = filename
        .replace(".stream", "")
        .replace(/([A-Z])/g, " $1")
        .trim();

      res.send(`
        <html>
          <head>
            <style>
              body {
                margin: 0;
                background: black;
                overflow: hidden;
              }
              .marquee {
                white-space: nowrap;
                animation: scroll 70s linear infinite;
                font-size: 40px;
                color: white;
                font-family: Arial Black, sans-serif;
                font-weight: bold;
              }
              @keyframes scroll {
                from { transform: translateX(100%); }
                to { transform: translateX(-100%); }
              }
            </style>
          </head>
          <body>
            <div class="marquee">${runningText}</div>

            <script>
              setInterval(async () => {
                try {
                  const response = await fetch('/api/musicName');
                  const text = await response.text();
                  if (text) {
                    document.querySelector('.marquee').textContent = text;
                  }
                } catch (error) {
                  console.log('Error updating text:', error);
                }
              }, 2000);
            </script>
          </body>
        </html>
      `);

    } catch (error) {
      console.log("Error fetching VLC data:", error.message);
      res.send("Gagal ambil data VLC");
    }
  });

}; // end module.exports