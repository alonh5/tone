const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');
const player = require('play-sound')(opts = {}); // Initialize the player
const yargs = require('yargs');



// Configure AWS SDK with your credentials and region
// AWS.config.update({
//     region: 'us-east-1',  // Replace with your S3 bucket region
//     credentials: new AWS.Credentials({
//         accessKeyId: 'your-access-key', // Replace with your AWS access key
//         secretAccessKey: 'your-secret-key' // Replace with your AWS secret key
//     })
// });

const s3 = new AWS.S3();
const tempFilePath = path.join(__dirname, 'temp.mp3');

// Function to list all the MP3 files in the S3 bucket
async function listFiles(bucketName) {
    const params = {
        Bucket: bucketName
    };

    try {
        const data = await s3.listObjectsV2(params).promise();
        const mp3Files = data.Contents.filter((file) => file.Key.endsWith('.mp3') || file.Key.endsWith('.mp4'));
        mp3Files.forEach((file) => {
            console.log(file.Key);
        });
    } catch (err) {
        console.error('Error accessing S3:', err);
    }
}
// Function to download the MP3 file from S3 and save it locally
async function downloadFile(bucketName, mp3FileName) {
    const params = {
        Bucket: bucketName,
        Key: mp3FileName
    };

    try {
        // Create a write stream to save the file locally
        const fileStream = fs.createWriteStream(tempFilePath);

        // Use S3 to get the object
        const s3Object = s3.getObject(params);
        const readStream = s3Object.createReadStream();

        // Pipe the read stream to the local file
        readStream.pipe(fileStream);

        // Wait for the file to finish downloading
        fileStream.on('finish', () => {
            console.log('File downloaded, playing audio...');
            playAudio();
        });

        // Handle errors during the download
        fileStream.on('error', (err) => {
            console.error('Error downloading the file:', err);
        });
    } catch (err) {
        console.error('Error accessing S3:', err);
    }
}

// Function to play the downloaded MP3 file
function playAudio() {
    player.play(tempFilePath, function (err) {
        if (err) {
            console.error('Error playing audio:', err);
        } else {
            console.log('Audio is playing...');
        }
    });
}

function run() {
    // Set up yargs for command-line arguments
    const argv = yargs
        .command('$0 <command> <bucket>', 'List or play MP3 from S3', (yargs) => {
            yargs
                .positional('command', {
                    describe: 'list or play',
                    type: 'string',
                })
                .positional('bucket', {
                    describe: 'The S3 bucket name',
                    type: 'string',
                })
        })
        .option('file', {
            alias: 'f',
            description: 'The MP3 file name',
            type: 'string',
        })
        .help()
        .alias('help', 'h')
        .argv;

    if (argv.command === 'list') {
        listFiles(argv.bucket);
    }
    else if (argv.command === 'play') {
        const bucketName = argv.bucket;
        const mp3FileName = argv.file;
        downloadFile(bucketName, mp3FileName);
    }
}

run();
//downloadFile('tone-sw', 'hackathon-nights-at-starkware.mp3');
