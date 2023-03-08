import { MongoClient } from 'mongodb';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const uri = process.env.MONGODB_URI;
  const client = await new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const collection = client.db('dynamicapi').collection('params');

  console.log(await collection.find({}).toArray());

  res.status(200).json({params: await collection.find({}).sort({order: 1}).toArray()})
}
