const { MongoClient, ServerApiVersion } = require('mongodb');
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // connecting to my mongoDB to save the params to update app
  const uri = `mongodb+srv://mikeysnakes:${process.env.MONGODB_PASS}@cluster0.qxordfu.mongodb.net/?retryWrites=true&w=majority`;
  const client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
  const collection = client.db('dynamicdb').collection('apis');
  // User will send an object with a string with the number of params and optionally the param names
  const params = req.body.paramNames.split(',') || [];
  const paramNum = parseInt(req.body.paramNum) || 0;

  // accounting for cases where param names aren't given or less than the number of params are given
  if (params.length !== paramNum) {
    for (let i = (params.length - 1); i < paramNum; i++) {
      params.push(`param${params.length}`)
    }
  }

  const result = await collection.insertOne({
    params,
    paramNum,
    createdAt: new Date()
  });

  await client.close();

  res.status(200).json(result);
  // console.log(req.body);

  res.status(200).json(result)
}