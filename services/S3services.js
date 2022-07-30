const AWS = require('aws-sdk');

exports.uploadToS3 = (data, filename) => {
    const BUCKET_NAME = 'expense-tracker-2';
    const IAM_USER_KEY = 'AKIAV3POSGEYU42KRT57';
    const IAM_USER_SECRET = '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';

    let s3bucket = new AWS.S3({
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET,
    })

    var params = {
        Bucket: BUCKET_NAME,
        Key: filename,
        Body: data,
        ACL: 'public-read'
    }

    return new Promise((resolve, reject) => {
        s3bucket.upload(params, (err, s3response) => {
            if(err) {
                console.log('Something went wrong', err);
                reject(err);
            } else {
                console.log('success', s3response);
                resolve(s3response.Location);
            }
        })
    })
}