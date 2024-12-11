import AWS from 'aws-sdk';
import * as fs from 'fs';
import * as path from 'path';

// AWS credentials should be supplied here


// Initialize AWS S3 client
const s3 = new AWS.S3({
    // accessKeyId: ACCESS_KEY_ID,
    // secretAccessKey: SECRET_ACCESS_KEY,
    region: 'us-east-2', // Specify your region here
});

// Function to generate a pre-signed URL for downloading a file from S3
export const downloadFile = async (bucketName: string, fileKey: string, downloadPath: string) => {
    try {
        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Expires: 60, // Expiration time in seconds
        };

        // Generate a pre-signed URL for download
        const url = await s3.getSignedUrlPromise('getObject', params);

        // Download the file using the pre-signed URL
        const response = await fetch(url);
        const buffer = await response.buffer();

        // Write the file to disk
        fs.writeFileSync(downloadPath, buffer);
        console.log(`File downloaded successfully to ${downloadPath}`);
    } catch (error) {
        console.error('Error downloading file:', error);
    }
};

// Function to generate a pre-signed URL for uploading a file to S3
export const uploadFile = async (bucketName: string, filePath: string, fileKey: string) => {
    try {
        const fileStream = fs.createReadStream(filePath);
        const params = {
            Bucket: bucketName,
            Key: fileKey,
            Body: fileStream,
            ContentType: 'application/octet-stream', // Adjust content type if necessary
            Expires: 60, // Expiration time in seconds
        };

        // Generate a pre-signed URL for upload
        const url = await s3.getSignedUrlPromise('putObject', params);

        console.log(`Pre-signed URL for uploading: ${url}`);

        // Use this URL to upload the file (use any HTTP library, e.g., fetch, axios)
        const response = await fetch(url, {
            method: 'PUT',
            body: fileStream,
        });

        if (response.ok) {
            console.log('File uploaded successfully');
        } else {
            console.error('Error uploading file:', response.statusText);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

// Function to list files in an S3 bucket and generate pre-signed URLs for them
export const listFiles = async function (bucketName: string) {
    try {
        const params = {
            Bucket: bucketName,
        };

        // List objects in the S3 bucket
        const data = await s3.listObjectsV2(params).promise();
        console.log('Files in the bucket:', data.Contents);
        if (data.Contents) {
            // for (const file of data.Contents) {
            //     const fileKey = file.Key!;
            //     const urlParams = {
            //         Bucket: bucketName,
            //         Key: fileKey,
            //         Expires: 60, // Expiration time in seconds
            //     };

            //     // Generate a pre-signed URL for each file in the list
            //     const presignedUrl = await s3.getSignedUrlPromise('getObject', urlParams);
            //     yield { fileKey, presignedUrl };  // Yield the pre-signed URL
            // }
            return await data.Contents.map(async (file) => {
                const fileKey = file.Key!;
                const urlParams = {
                    Bucket: bucketName,
                    Key: fileKey,
                    Expires: 60, // Expiration time in seconds
                };

                // Generate a pre-signed URL for each file in the list
                const presignedUrl = await s3.getSignedUrlPromise('getObject', urlParams);
                return { fileKey, presignedUrl };  // Yield the pre-signed URL
            }
            )
        } else {
            console.log('No files found in the bucket.');
        }
    } catch (error) {
        console.error('Error listing files:', error);
    }
};
