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
                justify-content: flex-start;
                align-items: flex-start;
                min-height: 100vh;
              }
              .container {
                /* === CUSTOM LEBAR CARD DI SINI === */
                width: 600px;
                /* ================================= */
                
                position: relative;
                background: #d81e0e;
                padding: 20px 40px;
                border-radius: 10px;
                overflow: hidden;
              }
              /* 3 Garis putih diagonal sejajar di pojok kanan atas */
              .container::before {
                content: '';
                position: absolute;
                top: -8px;
                right: 32px;
                width: 2.5px;
                height: 70px;
                background: white;
                transform: rotate(45deg);
                box-shadow: 
                  -7px 7px 0 0 white,
                  -14px 14px 0 0 white;
              }
              .text {
                font-size: 30px;
                color: white;
                font-family: Arial, sans-serif;
                font-weight: 900;
                white-space: nowrap;
                text-align: center;
                position: relative;
                z-index: 1;
                text-transform: uppercase;
                letter-spacing: 1px;
                
                /* Batasi teks agar tidak keluar dari card */
                max-width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
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
