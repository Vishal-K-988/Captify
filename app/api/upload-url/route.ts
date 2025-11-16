import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3 = new S3Client({
    region : process.env.AWS_REGION,
     credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// we will return the pre-signed URL 
export async function POST (req: Request) {
    try {
        const {fileName , fileType } = await req.json();

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME , 
            Key : fileName , 
            ContentType : "video/mp4" 
        });

        // this is the PUT pre-signed url 
        const preSignedURL = await getSignedUrl(s3, command, {
            // expires in 30min 
            expiresIn: 1800
        })
        // to interact with assembly ai ; we need a get pre-signed url 
        const getCommand = new GetObjectCommand({
             Bucket: process.env.AWS_BUCKET_NAME , 
            Key : fileName , 
        })

        const getPreSignedUrl =await getSignedUrl(s3 , getCommand, {
            expiresIn: 1800
        } )

       
            return Response.json({
                uploadURL : preSignedURL,
                fileURL : `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${fileName}`,
                getURL : getPreSignedUrl
            })
        


        // continue from here ! 
    }
    catch(error ) {
        console.log ("Error from /api/upload-url : " , error ) ;
        return new Response("Error generating the URL : " , {
            status : 500 
        })
    }
}

