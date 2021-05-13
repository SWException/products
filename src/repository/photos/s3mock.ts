import { Photos } from "./photos";

export class S3Mock implements Photos {
    public async deleteImage(key: string): Promise<Boolean> {
        return key? true: false;
    }
    public async uploadImage(image: string): Promise<string> {
        return image? "www.pippo.it/pippo.com/img.jpg": null;
    }
    
}