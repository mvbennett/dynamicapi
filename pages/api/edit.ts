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
    result = await collection.deleteMany({order: {$gt: paramNum}});
  } else if (paramNum > existingParams.length && (params[0] === '' || params[0] === null)) {
    // will add to existing params using names if applicable
    const paramObjects: any = [];
    for (let i = existingParams.length; i < paramNum; i++) {
      let newParam = params[i - existingParams.length] || `param${i}`;
      paramObjects.push({
        order: i,
        newParam,
        createdAt: new Date()
      })
    }
    result = await collection.insertMany(paramObjects);
  } else {
    result = {message: 'no change to param amount so params kept the same', params: existingParams};
  }

  await client.close();

  res.status(200).json(result)
}
