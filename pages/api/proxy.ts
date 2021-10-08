// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type {NextApiRequest, NextApiResponse} from 'next'
import axios from "axios";
import Config from "./_config";

// Github GraphQLへのアクセスプロキシ
const handler = async (
    proxyRequest: NextApiRequest,
    proxyResponse: NextApiResponse
) => {
  const response = await axios.request({
    url: 'https://api.github.com/graphql',
    method: 'POST',
    data: proxyRequest.body,
    headers: {
      'Authorization': `Bearer ${Config.apiToken}`
    }
  })

  console.log({
    request: proxyRequest.body,
    response: JSON.stringify(response.data)
  })

  proxyResponse.status(200).json(response.data)
}

export default handler
