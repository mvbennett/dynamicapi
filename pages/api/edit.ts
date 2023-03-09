import { IntegerType, MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // connecting to my mongoDB to save the params to update app
  const uri = process.env.MONGODB_URI;
  const client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const collection = client.db('dynamicapi').collection('params');
  const existingParams = await collection.find({}).toArray();
  // User will send an object with a string with the number of params and optionally the param names
  const params = req.body.paramNames?.split(',') || [];
  const paramNum = parseInt(req.body.paramNum) || 0;

  let result;
  if (paramNum < existingParams.length) {
    // will delete from existing params by reverse order
    console.log('if clause triggered');

    result = await collection.deleteMany({order: {$gt: paramNum}});
    console.log(result);

  } else if (paramNum > existingParams.length) {
    // will add to existing params using names if applicable
    result = 'param num is greater';
  } else {
    result = existingParams;
  }

  // accounting for cases where param names aren't given or less than the number of params are given
  // if (params.length !== paramNum) {
  //   if (params[0] === '') params[0] = 'param1';

  //   for (let i = (params.length); i < paramNum; i++) {
  //     params.push(`param${params.length + 1}`)
  //   }
  // }

  // const result = await params.map((param: string, index: number) => {
  //   collection.insertOne({
  //     order: index + 1,
  //     param,
  //     createdAt: new Date()
  //   })
  // });

  await client.close();

  res.status(200).json(result)
}
