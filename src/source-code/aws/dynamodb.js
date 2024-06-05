const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { 
  DynamoDBDocument, 
  GetCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");

const { AWS_REGION, CEOTable } = require("../utils/constants");

const dynamodbClient = new DynamoDB({ region: AWS_REGION });
const dynamodb = DynamoDBDocument.from(dynamodbClient);

const getAllUsers = async () => {
  const params = {
    TableName: CEOTable,
  };

  try {
    const response = await dynamodb.scan(params);
    const items = response.Items;
    return items;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const getDynamoDBItem = async (id_contrato) => {
  const params = {
    TableName: CEOTable,
    Key: {
      id_contrato,
    },
  };
  console.info("GET PARAMS", params);

  try {
    const command = new GetCommand(params);
    const response = await dynamodb.send(command);

    if (response.Item) {
      return response.Item;
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const putDynamoDBItem = async (id_contrato, cedula, direccion,municipio,nombre) => {
  const params = {
    TableName: CEOTable,
    Item: {
      id_contrato,
      cedula:cedula,
      direccion:direccion,
      municipio:municipio,
      nombre:nombre,
    },
  };
  console.info("PUT PARAMS", params);

  try {
    const command = new PutCommand(params);
    await dynamodb.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}


const deleteDynamoDBItem = async (id_contrato) => {
  const params = {
    TableName: CEOTable,
    Key: {
      id_contrato,
    },
  };
  console.info("DELETE PARAMS", params);

  try {
    const command = new DeleteCommand(params);
    await dynamodb.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

const updateDynamoDBItem = async (id_contrato, cedula, direccion, municipio, nombre) => {
  const params = {
    TableName: CEOTable,
    Key: {
      id_contrato,
    },
    UpdateExpression: "SET cedula = :cedula, direccion = :direccion, municipio = :municipio, nombre = :nombre",
    ExpressionAttributeValues: {
      ":cedula": cedula,
      ":direccion": direccion,
      ":municipio": municipio,
      ":nombre": nombre,
    },
    ReturnValues: "UPDATED_NEW",
  };
  console.info("UPDATE PARAMS", params);

  try {
    const command = new UpdateCommand(params);
    await dynamodb.send(command);
  } catch (error) {
    console.error(error);
    throw error;
  }
}

module.exports = {
  getDynamoDBItem,
  putDynamoDBItem,
  deleteDynamoDBItem,
  updateDynamoDBItem,
};
