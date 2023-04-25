const Jimp = require("jimp");

const syncFile = async (base64String, uri) => {
    const base64Image = base64String.split(';base64,').pop();
    const buffer = Buffer.from(base64Image, "base64");
    Jimp.read(buffer, (err, res) => {
        if (err) throw new Error(err);
        res.quality(5).write(uri);
    });
};


module.exports = {
    syncFolder: async (path, tiles) => {
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            for (let j = 0; j < tile['assets'].length; j++) {
                await syncFile(tile['assets'][j], `${path}/${tile['name']} ${j}.png`);
            }
        }
    },
}