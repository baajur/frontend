import { NextApiRequest, NextApiResponse } from 'next'

import {
  getAuthorizationCode,
  getClientCredentials,
  scope,
} from '@/auth/oauth2'

async function refreshToken(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.status(405)
    res.end()
    return
  }

  const oauth2ClientCredentials = getClientCredentials()
  const oauth2AuthorizationCode = getAuthorizationCode()

  if (oauth2ClientCredentials === null || oauth2AuthorizationCode === null) {
    return fail('Auth not configured correctly')
  }

  try {
    const accessToken = oauth2ClientCredentials.createToken(
      JSON.parse(req.cookies['auth-token'])
    )
    const token = await accessToken.refresh({
      scope,
    })
    res.setHeader(
      'Set-Cookie',
      `auth-token=${JSON.stringify(
        token.token
      )}; Path=/; SameSite=Lax; Max-Age=2592000;`
    )
    res.end()
  } catch (e) {
    console.log(e)
    res.setHeader(
      'Set-Cookie',
      `auth-token=; Path=/; Expires=${new Date(0).toUTCString()};`
    )
    fail('Token not valid')
  }

  function fail(message: string) {
    res.status(500)
    res.send(message)
  }
}

export default refreshToken
