export interface Photos {
    deleteImage (key: string): Promise<Boolean>
    uploadImage (image: string): Promise<string>
}