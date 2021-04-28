/**
 * This file contains all the utility functions to manage files on an aws s3 bucket 
 */

import { S3 as s3 } from 'aws-sdk';
import * as fileType from 'file-type';  //detect the file type of a Buffer/Uint8Array/ArrayBuffer
import { v4 as uuid } from 'uuid';

const S3OBJ = new s3();

export const S3 = {

    /**
     * Uses S3.uploadFile to upload an image to an aws S3 bucket
     * @param  {string} image: code of image (generally base64)
     * @param  {string} mime: mime of the image (type)
     * @param  {string} bucketName: bucket where to push the image
     * @returns Promise
     */

    async uploadImage (image: string, bucketName: string): Promise<string> {

        if (!image) {
            throw Error('image not found');
        }
        const IMG_MIME = ['image/jpeg', 'image/png', 'image/jpg'];
        const IMG_EXT = ['jpeg', 'png', 'jpg']
        let imageData: string = image;
        if (image.substr(0, 7) === 'base64,') {
            imageData = image.substr(7, image.length);
        }

        const BUFFER = Buffer.from(imageData, 'base64');
        const FILEINFO = await fileType.fromBuffer(BUFFER);

        if (!(IMG_MIME.includes(FILEINFO.mime)) || !(IMG_EXT.includes(FILEINFO.ext))) {
            throw Error("img mime or ext doesn't match jpg, jpeg or png. Got: " + FILEINFO.mime + " " + FILEINFO.ext);
        }
        const NAME = uuid(); //create a Universal Unique ID to name the img with
        const KEY = `${NAME}.${FILEINFO.ext}`;  //create a unique name for the file
        const URL = `https://${bucketName}.s3-${process.env.REGION}.amazonaws.com/${KEY}`;
        //upload to s3
        await this.uploadFile(bucketName, BUFFER, KEY, FILEINFO.mime); // TODO: error handling

        return URL;
    },

    /**
   * @param  {string} bucket: bucket name where to push file
   * @param  {Buffer} data: data file that must be pushed to S3
   * @param  {string} key: key of the file
   * @param  {string} contentType: extension of the file, mime type
   * @param  {string='public-read'} ACL: Access Control List: file permissions 
   * @returns Promise
   */
    async uploadFile (
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

        return await S3OBJ
            .upload(PARAMS)
            .promise()
            .then((data) => {
                return data;
            })
            .catch((err) => {
                throw Error("Error in S3 upload for bucket " + bucket + ": " + err);
            });
    },

    /**
   * @param  {string} bucket: bucket name where to delete file
   * @param  {string} key: key of file
   * @returns Promise
   */
    async deleteFile (bucket: string, key: string): Promise<s3.DeleteObjectOutput> {
        const PARAMS: s3.DeleteObjectRequest = {
            Key: key,
            Bucket: bucket,
        };

        return await S3OBJ
            .deleteObject(PARAMS)
            .promise()
            .then((data) => {
                return data;
            })
            .catch((err) => {
                throw Error("Error in S3 delete for bucket " + bucket + " :" + err);
            });
    },
};