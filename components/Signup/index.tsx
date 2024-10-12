import { UserProps } from '@/contexts/AccountContext'
import axios from 'axios'
import Loading from 'components/Loading'
import { getWeb3Login } from 'utils/auth'
import { useAccount } from 'wagmi'

import { useUser } from '@/hooks/useUser'
import { toast } from '@/components/ui/use-toast'

const Signup = () => {
  const [user, isUserLoading, setUser] = useUser()

  const { address, isConnected } = useAccount()

  const tryLogin = async () => {
    console.log('Login initiated!')
    try {
      const res = await getWeb3Login(address)
      if (res) {
        setUser(res)
      }
    } catch (err) {
      console.log('Error during login with Web3', err)
      toast({ title: err, variant: 'destructive' })
      return
    }
    console.log('Login over, refreshing.')
    window.location.reload() // Might not be the correct way to do this
  }

  async function loginUser(data: any) {
    const config = {
      method: 'post' as 'post',
      url: `${process.env.NEXT_PUBLIC_API_BACKEND_BASE_URL}/openmesh-experts/functions/loginOpenRD`,
      headers: {
        'x-parse-application-id': `${process.env.NEXT_PUBLIC_API_BACKEND_KEY}`,
      },
      data,
    }

    try {
      let res = await axios(config)
      setUser(res.data as UserProps)
      return res.data
    } catch (err) {
      toast({ title: `Erorr logging in: ${err}`, variant: 'destructive' })
      return null
    }
  }

  return (
    <>
      <div className="flex flex-row">
        {isUserLoading && <Loading />}
        {!isUserLoading &&
          (user ? (
            <div>
              {/* XXX: Show some account info? Possibly make into component later. */}
              <p>
                {' '}
                Logged in{' '}
                {address
                  ? `${address.substring(0, 7)}...${address.substring(address.length - 5)}`
                  : ''}
              </p>

              {/* XXX: Add better sign out button. */}

              <button
                className="mt-5 inline-flex h-10 min-w-56 items-center justify-center whitespace-nowrap rounded-md border border-primary bg-primary/95 px-4 text-sm font-semibold text-white transition-colors hover:bg-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                onClick={() => {
                  setUser(null)
                }}
              >
                Log out
              </button>
            </div>
          ) : (
            <div className="w-full">
              <div className="mx-auto w-fit">
                <h3 className="text-2xl font-semibold">
                  Connect your wallet to continue
                </h3>

                <div className="mt-5" />

                <w3m-button />
                {isConnected && (
                  <div>
                    {
                      <button
                        className="cursor-pointer items-center rounded-[5px] border border-blue-500 bg-blue-500 px-[25px] py-[8px] text-[13px] font-bold !leading-[19px] text-white hover:bg-[#064DD2] lg:text-[16px]"
                        onClick={() => tryLogin()}
                      >
                        {' '}
                        Verify wallet{' '}
                      </button>
                    }
                  </div>
                )}
              </div>
            </div>
          ))}
      </div>
    </>
  )
}

export default Signup
