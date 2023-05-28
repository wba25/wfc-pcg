const imageUpload = async (base64, path) => {
  // You can either "yarn add aws-sdk" or "npm i aws-sdk"
  const AWS = require("aws-sdk");

  // Configure AWS with your access and secret key.
  const {
    S3_BUCKET_ACCESS_KEY_ID,
    S3_BUCKET_ACCESS_KEY_SECRET,
    S3_BUCKET_REGION,
    S3_BUCKET_NAME,
  } = process.env;

  // Configure AWS to use promise
  AWS.config.setPromisesDependency(require("bluebird"));
  AWS.config.update({
    accessKeyId: S3_BUCKET_ACCESS_KEY_ID,
    secretAccessKey: S3_BUCKET_ACCESS_KEY_SECRET,
    region: S3_BUCKET_REGION,
  });

  // Create an s3 instance
  const s3 = new AWS.S3();

  // Ensure that you POST a base64 data to your server.
  // Let's assume the variable "base64" is one.
  const base64Data = new Buffer.from(
    base64.replace(/^data:image\/\w+;base64,/, ""),
    "base64"
  );

  // Getting the file type, ie: jpeg, png or gif
  const type = "png";

  // With this setup, each time your user uploads an image, will be overwritten.
  // To prevent this, use a different Key each time.
  // This won't be needed if they're uploading their avatar, hence the filename, userAvatar.js.
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: `${path}.${type}`, // type is not required
    Body: base64Data,
    ACL: "public-read",
    ContentEncoding: "base64", // required
    ContentType: `image/${type}`, // required. Notice the back ticks
  };

  // The upload() is used instead of putObject() as we'd need the location url and assign that to our user profile/database
  // see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property
  let location = "";
  let key = "";
  const { Location, Key } = await s3.upload(params).promise();
  location = Location;
  key = Key;

  return location;
};

module.exports = {
  syncFiles: async (path, tiles) => {
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      for (let j = 0; j < tile["assets"].length; j++) {
        let location = await imageUpload(tile["assets"][j], `${path}${tile["name"]} ${j}`);
        if (!location) throw new Error("Error uploading image");
        tile["assets"][j] = location;
      }
    }
    return tiles;
  },
};
