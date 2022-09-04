const AWS = require('aws-sdk');

// intialize instance of s3 object
const s3bucket = new AWS.S3({
    region: process.env.BUCKET_REGION,
    accessKeyId: process.env.IAM_USER_KEY,
    secretAccessKey: process.env.IAM_USER_SECRET,
})

exports.uploadToS3 = (data, filename) => {
    const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: filename,
            Body: data,
            ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if(err) {
                console.log(err);
                reject(err);
            } else {
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })
}
