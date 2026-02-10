// auth VLC (sesuaikan kalau pakai password)
const VLC_AUTH = {
  username: "",
  password: "dentri"
};

const VLC_STATUS_URL = "http://localhost:8081/requests/status.json";

const getAuthHeader = () => {
  const token = Buffer.from(`${VLC_AUTH.username}:${VLC_AUTH.password}`).toString("base64");
  return `Basic ${token}`;
};

const fetchVlcStatus = async () => {
  const response = await fetch(VLC_STATUS_URL, {
    headers: {
      Authorization: getAuthHeader()
    }
  });

  if (!response.ok) {
    throw new Error(`VLC status error: ${response.status}`);
  }

  return response.json();
};

const buildRunningText = (filename) => {
  return filename
    .replace(".stream", "")
    .replace(".mp3", "")
    .replace("_ ", " ")
    .replace("mp4:", "")
    .replace(".mp4", "")
    .replace(/([A-Z])/g, " $1")
    .trim();
};

const getFilename = (data) => {
  return data?.information?.category?.meta?.filename || "";
};

module.exports = (app) => {
  app.get("/api/musicName", async (req, res) => {
    try {
      const data = await fetchVlcStatus();
      const filename = getFilename(data);
      if (!filename) {
        res.send("");
        return;
      }

      const runningText = buildRunningText(filename);
      res.send(runningText);
    } catch (error) {
      res.send("");
    }
  });

  app.get("/musicName", async (req, res) => {
    try {
      const data = await fetchVlcStatus();
      const filename = getFilename(data);
      if (!filename) {
        res.send("No media playing or data not available");
        return;
      }

      const runningText = buildRunningText(filename);

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
                position: relative;
                white-space: nowrap;
                overflow: hidden;
                font-size: 40px;
                color: white;
                font-family: Arial Black, sans-serif;
                font-weight: bold;
              }
              .marquee__text {
                display: inline-block;
                white-space: nowrap;
                animation: scroll 70s linear infinite;
                will-change: transform;
              }
              @keyframes scroll {
                from { transform: translateX(100%); }
                to { transform: translateX(-100%); }
              }
            </style>
          </head>
          <body>
            <div class="marquee"><span class="marquee__text">${runningText}</span></div>

            <script>
              let lastText = ${JSON.stringify(runningText)};
              setInterval(async () => {
                try {
                  const response = await fetch('/api/musicName');
                  const text = await response.text();
                  if (text && text !== lastText) {
                    lastText = text;
                    const el = document.querySelector('.marquee__text');
                    if (el) el.textContent = text;
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
      res.status(500).send("Gagal ambil data VLC");
    }
  });
};