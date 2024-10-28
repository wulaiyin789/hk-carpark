import Head from 'next/head'

interface Props {
  statusCode?: number
}

const Custom404: React.FC<Props> = ({ statusCode = 404 }) => {
  return (
    <html>
      <body>
        <Head>
          <title>{statusCode === 404 ? '404 - Page Not Found' : 'Error'} - HK Carpark</title>
        </Head>

        <main className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h1 className="text-6xl font-bold text-center mb-4 text-gray-800">
                {statusCode === 404 ? '404' : 'Error'}
              </h1>
              <p className="text-xl text-center text-gray-600 mb-6">Oops! Page not found.</p>
              <a href="/" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Go back to homepage
              </a>
            </div>
          </div>
        </main>
      </body>
    </html>
  )
}

export default Custom404
