export interface Persistence {
    
    getIndexPartition(TableName: string,
        index: string, partitionKey: string,
        partitionValue: string, sort: string):
        Promise<AWS.DynamoDB.DocumentClient.AttributeMap>;
    
    write (TableName: string, data: JSON): Promise<boolean>;  
    
    update (TableName: string, id: string, data: JSON): Promise<boolean>;

    getScan (TableName: string): Promise<AWS.DynamoDB.DocumentClient.AttributeMap>;

    delete (TableName: string, id: string): Promise<boolean>;

    changeStock(TableName: string, id: string, quantity: number): Promise<boolean>;

}