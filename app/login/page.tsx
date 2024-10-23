import { z } from 'zod'

import LoginProcess from './process'

type LoginPageProps = {
  searchParams: {
    redirect?: string
  }
}

export default function Login({ searchParams }: LoginPageProps) {
  const redirect = z.string().optional().parse(searchParams.redirect)

  return (
    <section className="container my-20">
      <LoginProcess redirect={redirect} />
    </section>
  )
}
