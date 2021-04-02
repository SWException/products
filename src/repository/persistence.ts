export interface persistence {
    getIndexPartition(TableName: string,
        index: string, partitionKey: string,
        partitionValue: string, sort: string):
        Promise<AWS.DynamoDB.DocumentClient.AttributeMap>;
    
    write (TableName: string, data: { [key: string]: never }): Promise<boolean>;  
    
    update (TableName: string, id: string, data: JSON): Promise<boolean>;

    getScan (TableName: string): Promise<AWS.DynamoDB.DocumentClient.AttributeMap>;

    delete (TableName: string, id: string): Promise<boolean>;
}