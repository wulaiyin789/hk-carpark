import Link from 'next/link'
import { Button } from '../../components/ui/Button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4">{'404 - Carpark Not Found'}</h1>
      <p className="text-xl mb-8">{"Sorry, the carpark you're looking for doesn't exist."}</p>
      <Link href="/">
        <Button>Back to Home</Button>
      </Link>
    </div>
  )
}
