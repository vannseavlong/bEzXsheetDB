import { useSearchParams } from 'react-router-dom'

export default function PrivacyPolicy() {
  const [searchParams] = useSearchParams()
  const isEmbed = searchParams.get('embed') === 'true'

  return (
    <div>
      <div
        className={`min-h-screen bg-white flex justify-center py-12 ${
          isEmbed ? 'px-0' : 'px-4'
        } sm:px-6 lg:px-8 font-sans`}
      >
        <div className="w-full max-w-4xl p-8 lg:p-12 min-w-0 break-words">
          <header className="border-b pb-6 mb-8">
            <h1 className="text-4xl font-extrabold text-beasy-gradient tracking-tight mb-2">
              PRIVACY POLICY
            </h1>
          </header>

          <section className="space-y-8 text-gray-700 leading-relaxed break-words whitespace-normal">
            <p>
              bEasy and bPartner are engineered by Suntel Technology Co., Ltd.
              Please refer to{' '}
              <a
                href="https://suntel.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                https://suntel.io/privacy
              </a>{' '}
              for bEasy&apos;s Privacy Policy.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
