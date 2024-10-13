import { useContext, useEffect, useState } from 'react'
import { AccountContext, type UserProps } from '@/contexts/AccountContext'
import axios from 'axios'
import nookies, { parseCookies } from 'nookies'

export function useUser(): [
  UserProps | null,
  boolean,
  (user: UserProps | null) => void,
] {
  const { user, setUser } = useContext(AccountContext)
  const [localUser, setLocalUser] = useState<UserProps | null>(user)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const setUserGlobal = (user: UserProps | null) => {
    setLocalUser(user)
    setUser(user)

    setIsLoading(true)

    if (user) {
      nookies.set(null, 'userSessionToken', user.sessionToken, {
        maxAge: 10 * 24 * 60 * 60,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Strict',
      })
    } else {
      nookies.destroy(null, 'userSessionToken')
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (!user) {
      // Check cookies for session token and ask backend for user details if it exists.

      const cookies = parseCookies()
      const sessionToken = cookies.userSessionToken

      if (sessionToken) {
        const fetchUser = async () => {
          setIsLoading(true)
          console.log('Fetching user')

          const config = {
            method: 'post' as 'post',
            url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/getCurrentUser`,
            headers: {
              'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
              'x-parse-session-token': sessionToken,
            },
          }

          try {
            console.log(
              'app-id: ',
              `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`
            )
            console.log('sessionToken: ', sessionToken)
            const res = await axios(config)

            if (res.data) {
              console.log('Got user: ', res.data)
              setUser(res.data)
              setLocalUser(res.data)
              setIsLoading(false)
            }
          } catch (err) {
            console.error('Couldnt fetch user: ', err)
            setIsLoading(false)
          }
        }

        console.log('Running async fetch')
        fetchUser()
      } else {
        setIsLoading(false)
      }
    } else {
      setLocalUser(user)
      setIsLoading(false)
      console.log('Found user')
    }
  }, [setUser, user])

  return [localUser, isLoading, setUserGlobal]
}
