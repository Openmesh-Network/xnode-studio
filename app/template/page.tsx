import { number } from 'yup'

import Template from '@/components/Template'

type TemplatePageProps = {
  params: {
    id: string
  }
}
export default function TemplatePage({ params }: TemplatePageProps) {
  const pId = number().cast(params.id)
  return <Template id={pId} />
}
