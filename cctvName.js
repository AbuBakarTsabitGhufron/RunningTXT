const axios = require("axios");

// auth VLC (sesuaikan kalau pakai password)
const VLC_AUTH = {
  username: "",
  password: "dentri"
};

// Flag to control whether running text is enabled or not
const ENABLE_RUNNING_TEXT = false;  // Set to `true` to enable, `false` to disable

let currentText = "";  // Store the current running text

module.exports = (app) => {

  app.get("/", (req, res) => {
    res.redirect("/running-text");
  });

  app.get("/test", (req, res) => {
    res.send("Server OK - akses /running-text untuk running text");
  });

  app.get("/api/running-text", async (req, res) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/requests/status.json",
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
        .replace(".mp4", "")
        .replace("mp4:", "")
        .replace("mp4:Transisi", "")
        .replace("_", " ")
        .replace(/([A-Z])/g, " $1")
        .trim();

      if (runningText !== currentText) {
        currentText = runningText;
      }

      res.send(currentText);

    } catch (error) {
      console.log("Error fetching VLC data:", error.message);
      res.send("");
    }
  });

  app.get("/cctvName", async (req, res) => {
    try {
      const response = await axios.get(
        "http://localhost:8080/requests/status.json",
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
                padding: 20px;
                background: transparent;
                display: flex;
                align-items: center;
                min-height: 100vh;
              }
              .container {
                background: white;
                padding: 20px 40px;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
              }
              .text {
                font-size: 40px;
                color: black;
                font-family: Arial, sans-serif;
                font-weight: bold;
                white-space: nowrap;
                text-align: left;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="text" id="streamText">${currentText}</div>
            </div>

            <script>
              async function updateRunningText() {
                try {
                  const response = await fetch('/api/running-text');
                  const text = await response.text();
                  if (text) {
                    document.getElementById('streamText').textContent = text;
                  }
                } catch (error) {
                  console.log('Error updating text:', error);
                }
              }

              setInterval(updateRunningText, 2000);
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
