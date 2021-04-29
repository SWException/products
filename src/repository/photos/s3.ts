/**
 * This file contains all the utility functions to manage files on an aws s3 bucket 
 */

import { S3 as s3 } from 'aws-sdk';
import * as fileType from 'file-type';  //detect the file type of a Buffer/Uint8Array/ArrayBuffer
import { v4 as uuid } from 'uuid';
import { Photos } from './photos';

export class S3 implements Photos {
    private static readonly S3OBJ = new s3();
    private static readonly BUCKETNAME = process.env.PRODUCT_IMG_BUCKET;

    /**
     * Uses S3.uploadFile to upload an image to an aws S3 bucket
     * @param  {string} image: code of image (generally base64)
     * @param  {string} mime: mime of the image (type)
     * @returns Promise
     */

    public async uploadImage (image: string): Promise<string> {

        if (!image) {
            throw Error('image not found');
        }
        const IMGMIME = ['image/jpeg', 'image/png', 'image/jpg'];
        const IMGEXT = ['jpeg', 'png', 'jpg']
        let imageData: string;
        if (image.substr(0, 7) === 'base64,') {
            imageData = image.substr(7, image.length);
        }

        const BUFFER = Buffer.from(imageData, 'base64');
        const FILEINFO = await fileType.fromBuffer(BUFFER);
        console.log(FILEINFO.mime, FILEINFO.ext)

        if (!(FILEINFO.mime in IMGMIME)) {
            throw Error("img mime doesn't match jpg, jpeg or png");
        }
        const NAME = uuid(); //create a Universal Unique ID to name the img with
        const KEY = `${NAME}.${FILEINFO.ext}`;  //create a unique name for the file
        const URL = `https://${S3.BUCKETNAME}.s3-${process.env.REGION}.amazonaws.com/${KEY}`;
        //upload to s3
        await this.uploadFile(S3.BUCKETNAME, BUFFER, KEY, FILEINFO.mime);//TODO: error handling

        return URL;
    }

    /**
   * @param  {string} key: key of file
   * @returns Promise
   */
    async deleteImage (key: string): Promise<boolean> {
        const PARAMS: s3.DeleteObjectRequest = {
            Key: key,
            Bucket: S3.BUCKETNAME,
        };

        return await S3.S3OBJ
            .deleteObject(PARAMS)
            .promise()
            .then((data) => {
                console.log(data);
                return true;
            })
            .catch((err) => {
                console.log(err.message);
                throw Error("Error in S3 delete for bucket " + S3.BUCKETNAME + " :" + err);
            });
    }

    //private 

        /**
   * @param  {Buffer} data: data file that must be pushed to S3
   * @param  {string} key: key of the file
   * @param  {string} contentType: extension of the file, mime type
   * @param  {string='public-read'} ACL: Access Control List: file permissions 
   * @returns Promise
   */
         private async uploadFile (
            bucket: string,
            data: Buffer,
            key: string,
            contentType: string,
            ACL = 'public-read'
        ): Promise<s3.ManagedUpload.SendData> {
            const PARAMS: s3.PutObjectRequest = {
                Body: data,
                Key: key,
                ContentType: contentType,
                Bucket: bucket,
                ACL: ACL,
            };
    
            return await S3.S3OBJ
                .upload(PARAMS)
                .promise()
                .then((data) => {
                    return data;
                })
                .catch((err) => {
                    throw Error("Error in S3 upload for bucket" + S3.BUCKETNAME + ": " + err);
                });
        }
};