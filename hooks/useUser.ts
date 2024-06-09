import { useEffect, useState, useContext } from 'react';
import { AccountContext } from '@/contexts/AccountContext'
import { UserProps } from '@/contexts/AccountContext'
import axios from 'axios'
import nookies, { parseCookies } from 'nookies'

export function useUser(): UserProps | null {
  const { user, setUser } = useContext(AccountContext)
  const [localUser, setLocalUser] = useState<UserProps | null>(user);

  useEffect(() => {
    if (!user) {
      // Check cookies for session token and ask backend for user details if it exists.

      const cookies = parseCookies()
      const sessionToken = cookies.userSessionToken

      if (sessionToken) {
        const fetchUser = async () => {
          const config = {
            method: 'post' as 'post',
            url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/getCurrentUser`,
            headers: {
              'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
              'x-parse-session-token': sessionToken,
            },
          }

          try {
            console.log('app-id: ', `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`)
            console.log('sessionToken: ', sessionToken)
            const res = await axios(config);

            if (res.data) {
              console.log("Got user: ", res.data)
              setUser(res.data)
              setLocalUser(res.data)
            }
          } catch (err) {
            console.error("Couldnt fetch user: ", err)
          }
        }

        fetchUser()
      }
    } else {
      setLocalUser(user)
    }
  }, [user, setUser])

  return localUser;
}
