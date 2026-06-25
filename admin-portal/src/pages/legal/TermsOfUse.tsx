import { useSearchParams } from 'react-router-dom'

export default function TermsOfUse() {
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
              TERMS OF USE
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Last updated: 27 December 2025
            </p>
          </header>

          <section className="space-y-8 text-gray-700 leading-relaxed break-words whitespace-normal">
            <p>
              <span className="font-bold text-gray-900 ">A.</span> These terms
              of use (the &ldquo;Agreement&rdquo;) govern the use and access of
              the bEasy App and Website (as defined below) including any
              content, functionality and services offered on or through
              https://beasy.info/ or the bEasy App (hereinafter referred to as
              &ldquo;Service&rdquo;) by Suntel Technology Cambodia Co., Limited
              (hereinafter referred to as &ldquo;Suntel&rdquo;) and its
              affiliates/subsidiaries with its address at Flatiron by Meridian,
              FO-2312, FO-2313, FO-2314 Unit, Street 102, Phnom Penh City
              Center, Phum 1, Sangkat Srah Chak, Khan Daun Penh, Phnom Penh,
              Cambodia.
            </p>

            <p>
              <span className="font-bold text-gray-900 ">B.</span> These Terms
              of Use (hereinafter referred to as &ldquo;Terms&rdquo;) constitute
              a legal agreement governing the access or use of the Service,
              which is owned and operated by Suntel. These Terms are between
              you, an individual accessing or using the Service from within
              Cambodia (hereinafter referred to as &ldquo;you&rdquo;) and Suntel
              (referred to individually as &ldquo;Party&rdquo; or collectively
              as the &ldquo;Parties&rdquo;).{' '}
              <span className="font-bold">
                PLEASE READ THESE TERMS CAREFULLY BEFORE ACCESSING OR USING THE
                SERVICE.
              </span>{' '}
              In this Agreement, the words &ldquo;including&rdquo; and
              &ldquo;include&rdquo; mean &ldquo;including, but not limited
              to.&rdquo; If you are using the Service outside of Cambodia, these
              Terms may not be applicable to you.
            </p>

            <p>
              <span className="font-bold text-gray-900 ">C.</span> Your access
              and use of the Service constitutes your agreement to be bound by
              these Terms. If you do not agree to these Terms, you may not
              access or use the Service. These Terms expressly supersede prior
              agreements or arrangements with you with respect to the Service.
              Suntel may immediately terminate these Terms or Service with
              respect to you, or generally cease offering or deny access to the
              Service or any portion thereof, at any time.
            </p>

            <p className="border-b pb-8">
              Suntel may amend the Terms related to the Service from time to
              time. Amendments will be effective upon Suntel&apos;s posting of
              such updated Terms at this location or on the Service. Your
              continued access or use of the Service after such posting
              constitutes your consent to be bound by the Terms, as amended.
            </p>

            <p className="text-sm italic text-gray-500">
              Suntel&apos;s Privacy Policy located at{' '}
              <a
                href="https://suntel.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                https://suntel.io/privacy
              </a>{' '}
              applies to the use of the Service, and is made a part of these
              Terms by this reference, notwithstanding any contrary statements
              in the Privacy Policy.
            </p>

            {/* SECTION 1: THE SERVICES */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-1"
            >
              1. THE SERVICES
            </h2>

            <h3 className="text-xl font-semibold text-gray-800">License</h3>
            <p>
              Subject to your compliance with these Terms, Suntel grants you a
              limited, non-exclusive, non-sublicensable, revocable,
              non-transferable license to access and use the Service on your
              personal device solely for your personal, noncommercial use. You
              agree not to use the Service for any other purpose. Any rights not
              expressly granted herein are reserved by Suntel and the
              Suntel&apos;s licensors and Subsidiaries.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              Restrictions
            </h3>
            <div>
              <p>You may not:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  (i) remove any copyright, trademark or other proprietary
                  notices from any portion of the Service;
                </li>
                <li>
                  (ii) reproduce, modify, prepare derivative works based upon,
                  distribute, license, lease, sell, resell, transfer, publicly
                  display, publicly perform, transmit, stream, broadcast or
                  otherwise exploit the Service except as expressly permitted by
                  the Suntel;
                </li>
                <li>
                  (iii) decompile, reverse engineer or disassemble the Service
                  except as may be permitted by applicable law;
                </li>
                <li>
                  (iv) cause or launch any programs or scripts for the purpose
                  of scraping, indexing, surveying, or otherwise data mining any
                  portion of the Service or unduly burdening or hindering the
                  operation and/or functionality of any aspect of the Service;
                  or
                </li>
                <li>
                  (v) attempt to gain unauthorized access to or impair any
                  aspect of the Service or its related systems or networks.
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold text-gray-800">
              Third-Party Service and Content
            </h3>
            <p>
              The Service may be made available or accessed in connection with
              third-party services and content (including advertising) that
              Suntel does not control. You acknowledge that different terms of
              use and privacy policies may apply to your use of such third-party
              services and content. Suntel does not endorse such third party
              services and content and in no event shall Suntel be responsible
              or liable for any products or services of such third party
              providers. Additionally, Apple Inc. and Google, Inc. will be a
              third-party beneficiary to this contract if you access the Service
              using Apple iOS or Android-powered mobile devices, respectively.
              These third-party beneficiaries are not parties to this contract
              and are not responsible for the provision or support of the
              Service in any manner. Your access to the Service using these
              devices is subject to terms set forth in the applicable
              third-party beneficiary&apos;s terms of service.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">Ownership</h3>
            <p>
              The Service and all rights therein are and shall remain
              Suntel&apos;s property or the property of Suntel&apos;s licensors.
              Neither these Terms nor your use of the Service convey or grant to
              you any rights: (i) in or related to the Service except for the
              limited license granted above; or (ii) to use or reference in any
              manner Suntel&apos;s company names, logos, product and service
              names, trademarks or services marks or those of Suntel&apos;s
              licensor.
            </p>

            {/* SECTION 2: USAGE OF THE APPLICATION */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-2"
            >
              2. USAGE OF THE APPLICATION
            </h2>

            <h3 className="text-xl font-semibold text-gray-800">
              USER ACCOUNTS
            </h3>
            <p>
              In order to use most aspects of the Service, you must register for
              and maintain an active personal user Service account (hereinafter
              referred to as &ldquo;Account&rdquo;). You must be at least 18
              years of age, to obtain an Account. Account registration requires
              you to submit to Suntel certain personal information, such as your
              name, address, email address, mobile phone number and age, as well
              as your banking information. You agree to the collection,
              processing, disclosure and transfer of any personal information
              that you provide to Suntel under these Terms, and that you have
              read and understood and you agree to Suntel&apos;s privacy policy
              located at{' '}
              <a
                href="https://suntel.io/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-600 hover:text-indigo-800 underline"
              >
                https://suntel.io/privacy
              </a>
              . You agree to maintain accurate, complete, and updated
              information in your Account. Your failure to maintain accurate,
              complete, and updated Account information may result in your
              inability to access and use the Service or Suntel&apos;s
              termination of these Terms with you. You are responsible for all
              activity that occurs under your Account, and you agree to maintain
              the security and secrecy of your Account username and password at
              all times. Unless otherwise permitted by Suntel in writing, you
              may only possess one Account.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">
              USER REQUIREMENTS AND CONDUCT
            </h3>
            <p>
              The Service is not available for use by persons under the age of
              18. You may not authorize third parties to use your Account, and
              you may not assign or otherwise transfer your Account to any other
              person or entity. You agree to comply with all applicable laws
              when using the Service, and you may only use the Service for
              lawful purposes. In certain instances, Suntel may require you to
              provide proof of identity to access or use the Service, and you
              agree that you may be denied access or use of the Service if you
              refuse to provide proof of identity. Through the Service, you may
              elect to share certain third party personally identifiable
              information (PII) with Suntel, including, without limitation,
              first and last name, email address, mailing address, and phone
              number (each of the foregoing, &ldquo;Contact Information&rdquo;).
            </p>
            <p>
              You hereby represent and warrant that (i) you have, prior to the
              uploading of any third-party information, obtained the requisite
              consent required under applicable law directly from each
              individual of whom you are sharing Contact Information, including
              but not limited to, express consent to Suntel&apos;s collection,
              use and storage of such individual&apos;s personal information for
              the purpose of this Terms of Use, and express agreement to
              Suntel&apos;s Privacy Policy referred to above, (ii) you have any
              other rights, licenses, consents and releases required under
              applicable law to share Contact Information with Suntel,
              including, without limitation, consents required under the
              applicable data privacy law in Cambodia, (iii) you will not share
              Contact Information of any individuals less than 18 years of age,
              (iv) your sharing of Contact Information will not infringe,
              misappropriate, or violate a third party&apos;s proprietary
              rights, or rights of publicity or privacy, or obligations of
              confidentiality, or result in any violation of any applicable law
              or regulation, and (v) to the best of your knowledge, the Contact
              Information shall be accurate and not misleading. You understand
              and agree that Suntel may, in its sole discretion, terminate your
              access to the Service or withhold or cancel payment of any
              referral award amounts payable to you under these Terms in the
              event of (a) any actual or suspected fraudulent activity by you or
              in relation to your use of the Service, (b) any actual or
              suspected violation of applicable law by you or in relation to
              your use of the Service, or (c) any actual or suspected violation
              of these Terms. The Service is not intended for use while
              operating a vehicle.
            </p>

            {/* SECTION 3: PAYMENT */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-3"
            >
              3. PAYMENT
            </h2>
            <p>
              You may choose to pay for the services by cash and where
              available, by credit card and or debit card (hereinafter referred
              to as &ldquo;Card&rdquo;).
            </p>
            <p>
              In the event that you choose to pay for the services by Card, you
              will need to register a valid Card which belongs to you in
              accordance with the instructions within the Application. If the
              Card belongs to another person, such as your spouse, you hereby
              warrant and agree that you have obtained their permission to use
              the Card for the payment of the services.
            </p>
            <p>
              You agree that we may verify and authorize your Card details when
              you first register the Card with us as well as when you use the
              Service.
            </p>
            <p>
              You agree that we may issue a reasonable authorization hold, which
              is not an actual charge against your Card, in order to verify your
              payment method via your Card. The hold may appear in your
              statement as &ldquo;pending&rdquo;. The authorization hold is
              issued as a preventive measure against any unauthorized or
              fraudulent usage of your Card. In the event your payment by your
              Card is processed overseas, you will be liable for any additional
              charges in relation thereto.
            </p>
            <p>
              Once your service has been fulfilled, you are required to make
              payment in full to the third party service provider and your
              payment will be deducted automatically and is non-refundable. If
              you have any complaints in relation to the service provided, then
              that dispute must be taken up with the third party service
              provider directly.
            </p>
            <p>
              Suntel has the right to suspend the processing of any transaction
              where it reasonably believes that the transaction may be
              fraudulent, illegal or involves any criminal activity or where
              Suntel reasonably believes you to be in breach of the Terms of
              Use.
            </p>
            <p>
              You agree that you will cooperate in relation to any financial
              crime screening that is required and to assist Suntel in complying
              with any prevailing laws or regulations in place.
            </p>

            {/* SECTION 4: LIMITATION OF LIABILITY; DISCLAIMERS; INDEMNITY */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-4"
            >
              4. LIMITATION OF LIABILITY; DISCLAIMERS; INDEMNITY
            </h2>

            <h3 className="text-xl font-semibold text-gray-800">DISCLAIMER</h3>
            <p>
              <span className=" block mb-1">
                THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
                AVAILABLE.&rdquo; SUNTEL DISCLAIMS, TO THE MAXIMUM EXTENT
                PERMITTED BY APPLICABLE LAW, ALL REPRESENTATIONS AND WARRANTIES,
                EXPRESS, IMPLIED, OR STATUTORY, NOT EXPRESSLY SET OUT IN THESE
                TERMS, INCLUDING THE IMPLIED WARRANTIES OF MERCHANT ABILITY,
                FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. IN
                ADDITION, SUNTEL MAKES NO REPRESENTATION, WARRANTY, OR GUARANTEE
                THAT THE SERVICE WILL BE UNINTERRUPTED OR ERROR-FREE. YOU AGREE
                THAT YOU BEAR THE ENTIRE RISK ARISING OUT OF YOUR USE OF THE
                SERVICE. THIS DISCLAIMER DOES NOT ALTER YOUR RIGHTS AS A
                CONSUMER TO THE EXTENT NOT PERMITTED BY APPLICABLE LAW.
              </span>
            </p>

            <h3 className="text-xl font-extrabold  text-gray-800">
              LIMITATION OF LIABILITY
            </h3>
            <p>
              <span className=" block mb-1">
                SUNTEL SHALL NOT BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL,
                EXEMPLARY, PUNITIVE, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST
                PROFITS, LOST DATA, PERSONAL INJURY, OR PROPERTY DAMAGE RELATED
                TO, IN CONNECTION WITH, OR OTHERWISE RESULTING FROM ANY USE OF
                THE SERVICE, EVEN IF SUNTEL HAS BEEN ADVISED OF THE POSSIBILITY
                OF SUCH DAMAGES. SUNTEL SHALL NOT BE LIABLE FOR ANY DAMAGES,
                LIABILITY OR LOSSES ARISING OUT OF YOUR USE OF OR RELIANCE ON
                THE SERVICE OR YOUR INABILITY TO ACCESS OR USE THE SERVICE.
                SUNTEL SHALL NOT BE LIABLE FOR DELAY OR FAILURE IN PERFORMANCE
                RESULTING FROM CAUSES BEYOND SUNTEL&apos;S REASONABLE CONTROL.
                IN NO EVENT SHALL SUNTEL&apos;S TOTAL LIABILITY TO YOU IN
                CONNECTION WITH THE SERVICE FOR ALL DAMAGES, LOSSES AND CAUSES
                OF ACTION EXCEED 100 USD OR THE EQUIVALENT AMOUNT IN LOCAL
                CURRENCY.
              </span>
            </p>
            <p>
              THESE LIMITATIONS DO NOT PURPORT TO LIMIT LIABILITY THAT CANNOT BE
              EXCLUDED UNDER APPLICABLE LAW.
            </p>

            <h3 className="text-xl font-semibold text-gray-800">Indemnity</h3>
            <p>
              You agree to indemnify and hold Suntel and its officers,
              directors, employees and agents, harmless from any and all claims,
              demands, losses, liabilities, and expenses (including
              attorneys&apos; fees), arising out of or in connection with: (i)
              your use of the Service; (ii) your breach or violation of any of
              these Terms; (iii) your sharing of Contact Information with
              Suntel; (iv) Suntel&apos;s use of Contact Information or User
              Content; or (v) your violation of the rights of any third party.
            </p>

            {/* SECTION 5: OTHER PROVISIONS */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-5"
            >
              5. OTHER PROVISIONS
            </h2>
            <p>
              Suntel may give notice by means of a general notice on the
              Service, electronic mail to your email address in your account (if
              you have created an account), or by written communication sent by
              pre-paid post or courier to your address listed in your Account.
              Such notice shall be deemed to have been given upon the expiration
              of 48 hours after mailing or posting (if sent by pre-paid post or
              courier) or 12 hours after sending (if sent by email). You may
              give notice to Suntel, with such notice deemed given when received
              by Suntel, at any time by first class mail, pre-paid post or
              courier to Suntel, Flatiron by Meridian, FO-2312, FO-2313, FO-2314
              Unit, Street 102, Phnom Penh City Center, Phum 1, Sangkat Srah
              Chak, Khan Daun Penh, Phnom Penh, Cambodia.
            </p>
            <p>
              You may not assign these Terms without Suntel&apos;s prior written
              approval. Suntel may assign these Terms without your consent to:
              (i) a subsidiary or affiliate; (ii) an acquirer of Suntel&apos;s
              equity, business or assets; or (iii) a successor by merger. Any
              purported assignment in violation of this section shall be void.
              No joint venture, partnership, employment, or agency relationship
              exists between you or Suntel as a result of these Terms or use of
              the Service. If any provision of these Terms is held to be invalid
              or unenforceable, such provision shall be struck and the remaining
              provisions shall be enforced to the fullest extent under law. Our
              failure to enforce any right or provision in these Terms shall not
              constitute a waiver of such right or provision unless acknowledged
              and agreed to by Suntel in writing.
            </p>

            {/* SECTION 6: REFUND POLICY */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-6"
            >
              6. REFUND POLICY
            </h2>
            <p>
              Refund policy is applicable to all modes of payment at the time of
              purchase. Currently, by cash, Card, and bWallet credit. Refunds
              will be typically made in 12 to 24 hours of applicable
              cancellations. It may take more than 24 hours if any problem
              persists. Refunds will be credited via mode of payment when making
              the booking.
            </p>

            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-7"
            >
              7. CANCELLATION/RESCHEDULING
            </h2>
            <p>
              Once a booking is confirmed through our App, cancellations are
              strictly not permitted. We do not provide refunds, credits, or any
              other form of compensation in the event that you wish to cancel a
              booking.
            </p>
            <p>
              You may request to reschedule a confirmed booking subject to these
              Terms. You may reschedule your booking through the App up to
              twenty-four (24) hours prior to the scheduled service time. Each
              booking may only be rescheduled a maximum of two (2) times, and
              any new service date selected must fall within one (1) month from
              the original scheduled service date.
            </p>
            <p>
              If you wish to reschedule within twenty-four (24) hours of the
              scheduled service time, you are required to contact our Customer
              Service team. Any rescheduling within this period will be at our
              sole discretion, and will depend on service provider availability
              and any applicable charges that may be imposed. We do not
              guarantee that a rescheduling request within this timeframe will
              be accommodated.
            </p>
            <p>
              If you do not attend the scheduled service and do not reschedule
              the booking in accordance with this policy, the booking will be
              treated as a no-show. In such circumstances, all amounts paid will
              be forfeited and no refund, rescheduling, or credit will be
              provided.
            </p>
            <p>
              Your entitlement to reschedule a booking will lapse if you do not
              reschedule within one (1) month from the original scheduled
              service date, or if the booking has already been rescheduled two
              (2) times. In such cases, the booking will be deemed completed and
              no further rescheduling, refund, or credit will be granted. All
              rescheduling is strictly subject to the availability of our
              service providers, and we do not guarantee the availability of any
              specific date, time, or service provider.
            </p>

            {/* SECTION 7: LICENSED CLEANING COMPANIES */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-8"
            >
              8. LICENSED CLEANING COMPANIES
            </h2>
            <p>
              If you are a service provider for Suntel and the Service, you
              acknowledge and confirm that pursuant to the applicable cleaning
              laws and regulations in your jurisdiction (including on rental
              cleaning services), any person that you refer to through the
              Service must be a current employee and/or member of an entity
              which holds all applicable licenses to conduct cleaning business
              activities in your jurisdiction. Accordingly, any such person
              referred by you who is not already an employee of an entity that
              holds all applicable cleaning business licenses, will be referred
              to such an entity for processing and shall be subject to its terms
              and conditions of employment applicable from time-to-time.
              Further, you acknowledge and confirm that the Service is being
              provided by you to facilitate the recruitment of cleaners by an
              entity which holds cleaning licenses.
            </p>

            {/* SECTION 8: COMPLAINT RESOLUTION */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-9"
            >
              9. COMPLAINT RESOLUTION
            </h2>
            <p>
              Suntel will do its utmost best to ensure a smooth and satisfactory
              experience for You. If you are dissatisfied with a service or
              encounter an issue, you are required to submit a complaint within
              24 hours after completion of the service provided.
            </p>

            <h4 className="text-lg font-bold text-gray-900 mt-4 mb-2">
              SUBMITTING A COMPLAINT
            </h4>
            <p>
              Users may submit complaints or service related issues via In-App
              support and Electronic Mail (Email). You are required to provide
              your Contact Information for us to process the complaint. Any
              other information relating to the incident should be provided for
              better understanding. We aim to acknowledge the receipt of your
              complaint within 48 Hours and and provide a response or resolution
              within 7 business days, unless further investigation is required.
            </p>

            <h4 className="text-lg font-bold text-gray-900 mt-4 mb-2">
              SERVICE PROVIDER DISPUTES
            </h4>
            <p>
              Suntel acts solely as a facilitator connecting users with
              independent service providers. In the event of a complaint related
              to the quality, conduct, or performance of a service provider, We
              may forward the complaint to the relevant provider for a direct
              response. If appropriate, we may mediate the dispute to facilitate
              a resolution. Suntel does not guarantee refunds or corrective
              action but will assist in good faith.
            </p>

            <h4 className="text-lg font-bold text-gray-900 mt-4 mb-2">
              ESCALATION PROCESS
            </h4>
            <p>
              If you are not satisfied with the initial response, you may
              request that the matter be escalated to our Dispute Resolution
              Team for further review. You will be informed of any final
              decision and any available options, including requesting a partial
              refund, service rebooking, or further investigation.
            </p>

            {/* SECTION 9: DISPUTE RESOLUTION; GOVERNING LAW */}
            <h2
              className="text-2xl font-bold text-gray-900 pt-4"
              id="section-10"
            >
              10. DISPUTE RESOLUTION; GOVERNING LAW
            </h2>
            <p>
              Any disputes arising from the interpretation and performance of
              this Agreement, shall be first settled amicably through
              negotiation in good faith. In the event that parties fail to reach
              an agreement on the dispute, the parties agree to submit the
              dispute to be resolved by the relevant department in Cambodia
              which shall be conducted in accordance with the relevant law and
              its amendments of the Kingdom of Cambodia.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
