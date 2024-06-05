const express = require("express");
const multer  = require('multer');
const { StatusCodes } = require("http-status-codes");

const upload = multer({ storage: multer.memoryStorage() });

// Importing the functions from the DynamoDB SDK
const {
  putDynamoDBItem,
  getDynamoDBItem,
  deleteDynamoDBItem,
  updateDynamoDBItem,
} = require("../aws/dynamodb");

// Importing the functions from the S3 SDK
const {
  uploadS3File,
  ListS3Files,
  getS3File,
  deleteS3File,
  uploadS3SignedUrl,
  downloadS3SignedUrl
} = require("../aws/s3");

const api = express.Router();

api.post("/cargarRecibo", async (request, response) => {
  try {
    //Imprime el body de la peticion
    console.info("BODY", request.body);

    // Esta funcion obtiene un elemento de DynamoDB utilizando id_contrato
    const dynamoDBItem = await getDynamoDBItem(request.body.id_contrato);

    response
    //Envia un JSON con el elemento obtenido
      .status(StatusCodes.OK)
      .json({ data:dynamoDBItem });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});


api.put("/crearRecibo", async (request, response) => {
  try {
    //Imprime el body de la peticion utilizando...
    console.info("BODY", request.body);

    // Insertar un elemento de DynamoDB utilizando datos de la peticion
    await putDynamoDBItem(request.body.id_contrato, request.body.cedula, request.body.direccion, request.body.municipio, request.body.nombre);

    response
    //Envia un JSON con el elemento insertado
      .status(StatusCodes.OK)
      .json({ msg:"Recibo creado exitosamente"});
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});


api.delete("/deleteRecibo", async (request, response) => {
  try {
    //Imprime el body de la peticion utilizando..
    console.info("BODY", request.body);

    // Llama a la funcion para eliminar un elemento de DynamoDB
    await deleteDynamoDBItem(request.body.id_contrato);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Recibo eliminado exitosamente" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});



api.put("/updateRecibo", async (request, response) => {
  try {
    const { id_contrato, cedula, direccion, municipio, nombre } = request.body;

    // Actualiza el elemento en DynamoDB
    await updateDynamoDBItem(id_contrato, cedula, direccion, municipio, nombre);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Recibo actualizado exitosamente" });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

api.post("/generarRecibo", async (request, response) => {
  try {
    console.info("BODY", request.body);

    const { fileName } = request.body;
    const presignedUrl = await uploadS3SignedUrl(fileName);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Hello from path3", presignedUrl });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});



api.post("/descargarRecibo", async (request, response) => {
  try {
    console.info("BODY", request.body);

    const { fileName } = request.body;
    const presignedUrl = await downloadS3SignedUrl(fileName);

    response
      .status(StatusCodes.OK)
      .json({ msg: "Hello from path3", presignedUrl });
  } catch (error) {
    console.error("Error", error);
    response
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Internal Server Error" });
  }
});

module.exports = api;
