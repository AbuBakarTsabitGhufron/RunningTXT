const fs = require('fs');
const path = require('path');

// Directory where the MP3 files and XSPF file are located
const musicDirectory = './';  // Current directory (since both .xspf and MP3 are in the same folder)

// Fetch all MP3 files in the directory
const files = fs.readdirSync(musicDirectory).filter(file => file.endsWith('.mp3'));

// Start building the XSPF content
let xspfContent = `<?xml version="1.0" encoding="UTF-8" ?>
<playlist version="1" xmlns="http://xspf.org/ns/0/">
    <title>Gending Pengiring Playlist</title>
    <trackList>`;

// Add each MP3 file to the playlist
files.forEach(file => {
    let filePath = path.join(musicDirectory, file);  // Full path to the MP3 file
    let fileName = path.basename(file, '.mp3'); // Get file name without extension

    // Add track to the playlist using relative path
    xspfContent += `
        <track>
            <location>./${file}</location>
            <title>${fileName}</title>
        </track>`;
});

// End the XSPF playlist
xspfContent += `
    </trackList>
</playlist>`;

// Write the XSPF content to a file (lagu.xspf)
fs.writeFileSync(path.join(musicDirectory, 'lagu.xspf'), xspfContent);

console.log('XSPF playlist generated: lagu.xspf');
