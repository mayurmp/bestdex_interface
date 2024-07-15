import { FC, ReactElement, useEffect } from 'react'
import styled from 'styled-components/macro'
import { ThemedText } from 'theme'
import { Trans } from '@lingui/macro'
import Footer from 'components/Footer/Footer'

const RootContainer = styled.div`
  text-align: left;
  margin-top: 6.25rem;
  width: 100%;
  padding: 2rem 12rem;
  max-width: 87.5rem;
  @media screen and (max-width: 1100px) {
    padding: 2rem 6rem;
  }
  @media screen and (max-width: 600px) {
    margin-top: 3.125rem;
    padding: 2rem 2rem;
  }
`
const HeadingText = styled.p`
  font-weight: 700;
  margin-bottom: 1.875rem;
  font-size: 3rem;
  @media screen and (max-width: 600px) {
    font-size: 2rem;
  }
`
const ParagraphText = styled.p`
  margin-bottom: 30px;
  font-weight: 400;
  font-size: 20px;
`
const SubHeadingText = styled.p`
  font-weight: 700;
  margin-bottom: 1.875rem;
  font-size: 21px;
`

//
const TextUl = styled.ul`
  list-style-type: none;
`
const TextLi = styled.li`
  margin-bottom: 1.875rem;
`
const TextFirstSpan = styled.span`
  font-weight: 700;
`
const TextUlDash = styled.ul`
  list-style-type: none;

  & > li:before {
    content: ' -';
    margin-right: 10px;
    text-indent: -1.25rem;
  }
`
const TextLiDash = styled.li`
  text-indent: -1.25rem;
  margin-bottom: 1.875rem;
`
//

// const achorTag = styled.span`
//   word-wrap: break-word;
// `

const Heading: FC<{ children: string | ReactElement }> = ({ children }: { children: string | ReactElement }) => {
  return (
    <ThemedText.Black>
      <HeadingText>{children}</HeadingText>
    </ThemedText.Black>
  )
}

const SubHeading: FC<{ children: string | ReactElement }> = ({ children }: { children: string | ReactElement }) => {
  return (
    <ThemedText.Black>
      <SubHeadingText>{children}</SubHeadingText>
    </ThemedText.Black>
  )
}

const Paragraph: FC<{ children: ReactElement | string }> = ({ children }: { children: ReactElement | string }) => {
  return (
    <ThemedText.Black>
      <ParagraphText>{children}</ParagraphText>
    </ThemedText.Black>
  )
}

const Policy: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  console.log('pathname', window.location.pathname)

  return (
    <>
      <RootContainer>
        <Heading>
          <Trans>Best DEX Privacy Policy</Trans>
        </Heading>
        <Paragraph>
          <Trans>Last updated June 12th 2023</Trans>
        </Paragraph>
        <section>
          <SubHeading>
            <Trans>Application of this Policy</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Best Dex (&quot;Best DEX &quot;, &quot;we&quot;, or &quot;us&quot;) committed to protecting the privacy of
              our customers/users, and we take our data protection responsibilities with the utmost seriousness.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              This Policy Notice describes how Best DEX collects and processes personal information through the Best DEX
              websites and applications that are referenced in this Privacy Notice.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              This Privacy Policy describes how Best DEX and its affiliates may collect, use and disclose information,
              and your choices regarding this information.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Please read this Policy carefully and contact us with questions at&nbsp;
              <a href="mailto: Support@BestDEX.com">Support@BestDEX.com</a> .
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              This Policy applies to the Sites and the Services (in each case, as defined in the Terms of Service). If
              you do not agree with the terms of this Policy do not access or use the Services provided by Best DEX.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>What We Collect</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>When you interact with our Services, we may collect:</Trans>
          </Paragraph>
          <Paragraph>
            <TextUl>
              <TextLi>
                <TextFirstSpan>Contact Details, </TextFirstSpan>
                <Trans>
                  personal identification such as fTextUll name, electronic mail address, physical location, and country
                  information.
                </Trans>
              </TextLi>
              <TextLi>
                <TextFirstSpan>Financial Particulars, </TextFirstSpan>
                <Trans>
                  including Ethereum network address, details of cryptocurrency wallet, transaction history, trading
                  data, and associated fees paid. Transaction Records, relevant information to transactions conducted on
                  our Services, such as transaction type, amount, and timestamp.
                </Trans>
              </TextLi>
              <TextLi>
                <TextFirstSpan>Correspondence Records, </TextFirstSpan>
                <Trans>
                  feedback, responses to questionnaires and surveys, as well as information provided to our support
                  teams via our assistance chat or social media messaging platforms.
                </Trans>
              </TextLi>
              <TextLi>
                <TextFirstSpan>Online Identifiers, </TextFirstSpan>
                <Trans>
                  such as usernames, geolocation or tracking specifics, browser fingerprint, operating system, browser
                  name and version, and IP addresses. Usage and Diagnostic Data, including conversion events, user
                  preferences, crash logs, device specifics, and other data collected through cookies and similar
                  technologies
                </Trans>
              </TextLi>
              <TextLi>
                <TextFirstSpan>Information Obtained from Third Parties. </TextFirstSpan>
                <Trans>
                  We may acquire information about you from external sources as required or permitted by applicable law,
                  which may include publicly available databases. We may combine this information with the data obtained
                  from this Site to comply with legal obligations and mitigate the usage of our Services in connection
                  with fraudulent or illicit activities.
                </Trans>
              </TextLi>
              <TextLi>
                <TextFirstSpan>Information from Cookies and Comparable Tracking Technologies. </TextFirstSpan>
                <Trans>
                  We, or duly authorised third parties, may employ cookies, web beacons, and related technologies to
                  record your preferences, track the usage of our Sites (including mobile applications), and gather
                  information regarding the utilisation of the Services, as well as our interactions with you. This
                  information may comprise internet protocol (IP) addresses, browser type, internet service provider
                  (ISP), referring/exit pages, operating system, device specifics, date or time stamps, clickstream
                  data, and details regarding your engagement with our communications. We may combine this automatically
                  collected log information with other data collected about you. You have the option to configure your
                  web browser to decline cookies or receive alerts when cookies are being sent. Please note that by
                  doing so, certain sections of our Services may not function optimally.
                </Trans>
              </TextLi>
            </TextUl>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>How We Use Information</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              We use your information in accordance with your instructions, including any applicable terms in the Terms
              of Service, and as required by applicable law. We may also use the information we collect for:
            </Trans>
          </Paragraph>
          <Paragraph>
            <TextUlDash>
              <TextLiDash>
                <Trans>
                  Operation and Enhancement: To operate, maintain, enhance, and provide all features of the site. This
                  includes fulfilling user requests for services and information, responding to comments and inquiries,
                  offering user support, and processing and delivering entries and rewards in connection with occasional
                  promotions.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Usage Analysis and Improvements: To comprehend and analyse user usage patterns and preferences, in
                  order to improve the site and develop current and future products, services, features, and
                  functionality.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Communication: To contact you for administrative purposes, including customer service interactions,
                  sending communications such as updates on promotions, policies, and products and services provided by
                  us or by third parties
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Provision of Services and Features: To provide, personalise, maintain, and enhance our products and
                  services. This encompasses activities such as operating, maintaining, customising, measuring, and
                  improving our Services, creating and updating user accounts, processing transactions, sending
                  information (such as confirmations, notices, updates, security alerts, and support and administrative
                  messages), and generating de-identified or aggregated data.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Security and Integrity: To help maintain the safety, security, and integrity of both you and our
                  Services. This involves protecting against fraudulent, unauthorised, or illegal activity; monitoring
                  and verifying identity or service access; combating spam, malware, or security risks; performing
                  internal operations necessary for service provision and troubleshooting; enforcing agreements with
                  third parties; addressing violations of our Terms of Service or agreements for other products or
                  services; and complying with applicable security laws and regulations.{' '}
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Legal Compliance: We may verify your identity by comparing the personal information you provide
                  against third-party databases and public records. We may also use the collected information to
                  investigate or address claims or disputes related to the use of our Services, or as permitted by
                  applicable law or requested by regulators, government entities, or official inquiries.
                </Trans>
              </TextLiDash>
            </TextUlDash>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>How We Share and Disclose Information</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>We may share your information in the following circumstances: </Trans>
          </Paragraph>
          <Paragraph>
            <TextUlDash>
              <TextLiDash>
                <Trans>
                  With Your Consent. For example, you may let us share personal information with others for their own
                  marketing uses. Those uses will be subject to their privacy policies.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  To Comply with Our Legal Obligations. We may share your information: (a) to cooperate with government
                  investigations; (b) when we are compelled to do so by a subpoena, court order, or similar legal
                  procedure; (c) when we believe in good faith that the disclosure of personal information is necessary
                  to prevent harm to another person; (d) to report suspected illegal activity; or (e) to investigate
                  violations of our Terms of Use, agreements for other products or services, or any other applicable
                  policies.
                  {/* &nbsp; <a href="https://dydx.exchange/terms?&&" target="_blank" rel="noreferrer">
                    Terms of Use
                  </a> */}
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  With Service Providers or Other Third Parties. We may share your information with service providers or
                  other third parties who help facilitate business and compliance operations, such as marketing and
                  technology services
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  During a Change to Our Business. If we engage in a merger, acquisition, bankruptcy, dissolution,
                  reorganisation, sale of some or all of our assets or stock, financing, public offering of securities,
                  acquisition of all or a portion of our business, a similar transaction or proceeding, or steps in
                  contemplation of such activities, some or all of your information may be shared or transferred,
                  subject to standard confidentiality arrangements.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Aggregated or De-identified Data. We may share aggregated or anonymized data with other persons for
                  their own uses.
                </Trans>
              </TextLiDash>
            </TextUlDash>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Security</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              We prioritise the security and privacy of your information in our systems, safeguarding your data. We have
              implemented appropriate security measures to prevent accidental loss, unauthorised access, alteration, or
              disclosure. We take precautions to protect the security of your personal information during transmission
              and storage by utilising encryption protocols and software. Furthermore, we maintain physical, electronic,
              and procedural safeguards in relation to the collection, storage, and disclosure of your personal
              information. Access to your personal information is restricted to employees, agents, contractors, and
              other third parties who have a legitimate business need to access such information.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              As part of our security procedures, we may request verification of your identity to protect you from
              unauthorised access to your account. We strongly recommend using a unique password for your account with
              us that is not used for any other online accounts. Additionally, we advise signing off when you have
              finished using a shared computer to further protect your information. You are responsible for all activity
              on the Best DEX protocol relating to any of your network addresses or cryptocurrency wallets.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Age Restrictions</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Best DEX does not allow anyone under the age of 18 to use BextDEX Services and does not knowingly collect
              personal information from children under 18.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Changes Policy</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              We reserve the right to modify this Policy at any time. In the event of any changes to the Policy, users
              will be notified via email. While our intention is to provide advance notice prior to implementing any
              changes, there may be circumstances where immediate changes are necessary and advance notice may not be
              feasible.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Opting Out</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Like many other online companies, we utilise services provided by Google and other companies that employ
              tracking technologies. These technologies, such as cookies and web beacons, collect information directly
              from your device regarding your browsing activities, interactions with websites, and the device you use to
              connect to the internet. We would like to provide you with options to opt out of having your online
              activity and device data collected through these services, and we have summarised these options below:
            </Trans>
          </Paragraph>
          <Paragraph>
            <TextUlDash>
              <TextLiDash>
                <Trans>
                  Blocking cookies in your browser: Most browsers offer the ability to remove or reject cookies,
                  including those used for interest-based advertising. You can adjust your browser settings to
                  accomplish this. Please note that many browsers accept cookies by default until you modify the
                  settings. For more detailed information about cookies, including how to view the cookies set on your
                  device and how to manage and delete them, you can visit &nbsp;
                  <a href="https://www.allaboutcookies.org/" target="_blank" rel="noreferrer">
                    www.allaboutcookies.org
                  </a>
                  .
                </Trans>
              </TextLiDash>

              <TextLiDash>
                <Trans>
                  Blocking advertising ID use in your mobile settings: Your mobile device settings may include options
                  to limit the use of the advertising ID associated with your device for interest-based advertising
                  purposes.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Using privacy plug-ins or browsers: Privacy-oriented browsers like Brave or browser plugins such as
                  Privacy Badger, Ghostery, or uBlock Origin can be employed to block our websites from setting cookies
                  used for interest-based advertising. You can configure these tools to block third-party cookies or
                  trackers.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Platform opt-outs: Certain advertising partners, such as Google, provide opt-out features that enable
                  you to decline the use of your information for interest-based advertising. You can visit the Google
                  Ads Settings page (
                  <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
                    https://adssettings.google.com
                  </a>
                  ) to exercise this option.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Advertising industry opt-out tools: Industry initiatives like the Digital Advertising Alliance (
                  <a href="http://optout.aboutads.info" target="_blank" rel="noreferrer">
                    http://optout.aboutads.info
                  </a>
                  ) and the Network Advertising Initiative (
                  <a href="http://optout.networkadvertising.org/" target="_blank" rel="noreferrer">
                    http://optout.networkadvertising.org/
                  </a>
                  ) offer opt-out mechanisms that allow you to limit the use of your information for interest-based
                  advertising by participating companies. Please note that these opt-out mechanisms are specific to the
                  device or browser on which they are activated, so you will need to opt out on each browser and device
                  you use
                </Trans>
              </TextLiDash>
            </TextUlDash>
          </Paragraph>
          <Paragraph>
            <Trans>
              Please be aware that opting out of these tracking technologies and advertising practices may impact your
              online experience and the functionality of certain websites or services.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>User Rights</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Subject to applicable law, as outlined below, you have a number of rights in relation to your privacy and
              the protection of your personal information. You have the right to request access to, correct, and delete
              your personal information, and to ask for data portability. You may also object to our processing of your
              personal information or ask that we restrict the processing of your personal information in certain
              instances. In addition, when you consent to our processing of your personal information for a specified
              purpose, you may withdraw your consent at any time. These rights may be limited in some situations - for
              example, where we can demonstrate we have a legal requirement to process your personal information.
            </Trans>
          </Paragraph>
          <Paragraph>
            <TextUlDash>
              <TextLiDash>
                <Trans>
                  Right to access: you have the right to obtain confirmation that your personal information are
                  processed and to obtain a copy of it as well as certain information related to its processing;{' '}
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Right to rectify: you can request the rectification of your personal information which are inaccurate,
                  and also add to it. You can also change your personal information in your Account at any time.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>Right to delete: you can, in some cases, have your personal information deleted;</Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Right to object: you can object, for reasons relating to your particular situation, to the processing
                  of your personal information. For instance, you have the right to object where we rely on legitimate
                  interest or where we process your data for direct marketing purposes;
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Right to restrict processing: You have the right, in certain cases, to temporarily restrict the
                  processing of your personal information by us, provided there are valid grounds for doing so. We may
                  continue to process your personal information if it is necessary for the defence of legal claims, or
                  for any other exceptions permitted by applicable law;
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Right to portability: in some cases, you can ask to receive your personal information which you have
                  provided to us in a structured, commonly used and machine-readable format, or, when this is possible,
                  that we communicate your personal information on your behalf directly to another data controller;
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Right to withdraw your consent: for processing requiring your consent, you have the right to withdraw
                  your consent at any time. Exercising this right does not affect the lawfulness of the processing based
                  on the consent given before the withdrawal of the latter;
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Right to lodge a complaint with the relevant data protection authority: We hope that we can satisfy
                  any queries you may have about the way in which we process your personal information. However, if you
                  have unresolved concerns, you also have the right to complain to the Irish Data Protection Commission
                  or the data protection authority in the location in which you live, work or believe a data protection
                  breach has occurred.
                </Trans>
              </TextLiDash>
            </TextUlDash>
          </Paragraph>
          <Paragraph>
            <Trans>
              If you have any questions or objection as to how we collect and process your personal information, please
              contact us through Support@BestDEX.com
            </Trans>
          </Paragraph>
        </section>

        <section>
          <SubHeading>
            <Trans>Notice to European Union Residents (&quot;GDPR Notice&quot;)</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              In accordance with the General Data Protection Regulation (the &quot;GDPR&quot;), we are providing this
              GDPR Notice to European Union (&quot;EU&quot;) residents to explain how we collect, use and share their
              personal data (as defined in the GDPR), and the rights and choices we offer EU residents regarding our
              handling of their personal information.
            </Trans>
          </Paragraph>
          <Paragraph>
            As an EU resident, you have various rights in connection with the processing of your personal data as
            follows:
          </Paragraph>
          <Paragraph>
            <TextUlDash>
              <TextLiDash>
                <Trans>
                  You have the right to information about your personal data processed by us and to the following
                  information: (a) the processing purposes; (b) the categories of personal data being processed; (c) the
                  recipients or categories of recipients to whom the personal data have been or are being disclosed, in
                  particular recipients in third countries or international organizations; (d) if possible, the planned
                  duration for which the personal data will be stored or, if this is not possible, the criteria for
                  determining this duration; (e) the existence of a right to rectification or deletion of your personal
                  data, to restricting the processing of your personal data or to objecting to such processing; (f) the
                  existence of a right of appeal to a supervisory authority; (g) if the personal data is not collected
                  from you, all available information about the origin of the data; (h) the existence of automated
                  decision-making and, at least in these cases, meaningful information on the logic involved and the
                  scope and intended impact of such processing on the data subject; and (i) in the case of the transfer
                  of personal data to a third country or an international organization, on the appropriate safeguards in
                  relation to the transfer
                </Trans>
              </TextLiDash>

              <TextLiDash>
                <Trans>
                  You have the right to immediately request the rectification of inaccurate personal data concerning you
                  and, taking into account the purposes of the processing, the completion of incomplete personal data,
                  by means of providing a supplementary statement.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  You have the right to request the immediate erasure of personal data concerning you and we are obliged
                  to delete this data immediately if one of the following reasons applies: (i) the personal data are no
                  longer necessary for the purposes for which they were collected or otherwise processed; (ii) you
                  revoke your consent on which the processing was based under Article 6(1)(a) or Article 9(2)(a) of the
                  GDPR and there is no other legal basis for the processing; (iii) you object to the processing pursuant
                  to Article 21(1) of the GDPR and there are no overriding legitimate grounds for processing or you
                  object to the processing pursuant to Article 21(2) of the GDPR; (iv) your personal data has been
                  processed unlawfully; (v) the deletion of your personal data is necessary to fulfil a legal obligation
                  under EU law or the law of the member states to which we are subject; (vi) the personal data have been
                  collected in relation to information society services provided in accordance with Article 8(1) of the
                  GDPR. If we have made personal data public and are obliged to erase personal data in accordance with
                  Article 17(1) of the GDPR, we will take appropriate measures, including technical measures, taking
                  into account the available technology and the implementation costs, to inform controllers who process
                  the personal data you have requested the erasure by such controllers of any links to or copies or
                  replications of, such personal data.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  The rights in the foregoing paragraph do not apply to the extent that processing is necessary (A) to
                  exercise the right of freedom of expression and information; (B) to fulfil a legal obligation required
                  for processing under EU law or the law of the member states to which we are subject; or (C) to assert,
                  exercise or defend legal claims.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  You have the right to request us to restrict processing if one of the following conditions is met: (1)
                  the accuracy of the personal data is contested by you, for a period of time that enables us to verify
                  the accuracy of the personal data; (2) the processing is unlawful and you oppose to delete the
                  personal data and instead requests the restriction of the use of your personal data; (3) we no longer
                  need your personal data for the purposes of processing, but you do need it to assert, exercise or
                  defend legal claims; or (4) you have objected to the processing pursuant to Article 21(1) of the GDPR
                  pending the verification whether the legitimate interests of our company override your legitimate
                  interests.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  You have the right to receive the personal data concerning you that you have provided to us in a
                  structured, commonly used and machine-readable format and you have the right to transmit this data to
                  another controller without hindrance, provided that the processing is based on a consent pursuant to
                  Article 6(1)(a) or Article 9(2)(a) of the GDPR or on a contract pursuant to Article 6(1)(b) of the
                  GDPR and the processing is carried out by automated means. When exercising your right to data
                  portability, you have the right to have your personal data transferred directly by us to another
                  controller, to the extent that such transfer is technically feasible.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  You have the right to object at any time, for reasons arising from your particular situation, to the
                  processing of personal data concerning you which is based on Article 6(1)(e) or (f) of the GDPR,
                  including profiling based on these provisions. We will no longer process your personal data unless we
                  can demonstrate compelling legitimate reasons for the processing that override your interests, rights
                  and freedoms or the processing serves to assert, exercise or defend legal claims.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  You have the right to revoke your consent to the processing of your personal data at any time. The
                  revocation of consent does not affect the legality of the processing carried out on the basis of the
                  consent until revocation.
                </Trans>
              </TextLiDash>
            </TextUlDash>
          </Paragraph>
          <Paragraph>
            <Trans>
              If you would like to exercise your rights related to information, correction, deletion, or restriction of
              processing, object to data processing, or withdraw your consent to data processing, please contact us by
              sending an email to support@BestDEX.com. If you believe that the processing of your personal data violates
              the General Data Protection Regulation (GDPR), you have the right to lodge a complaint with a supervisory
              authority. This can be done in the member state where you usually reside, work, or where the alleged
              infringement took place.
            </Trans>
          </Paragraph>
        </section>

        <section>
          <SubHeading>
            <Trans>How Long Best DEX Keeps User Personal Data</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              We retain your personal information to facilitate your ongoing use of Best DEX&#39;s Services for the
              duration necessary to fulfil the relevant purposes outlined in this Privacy Notice, as well as to comply
              with applicable laws, such as tax and accounting obligations, Anti-Money Laundering regulations, dispute
              resolution, and legal claims. The specific retention periods may vary depending on the jurisdiction. Here
              is an overview of our typical retention periods for different categories of personal information:
            </Trans>
          </Paragraph>
          <Paragraph>
            <TextUlDash>
              <TextLiDash>
                <Trans>
                  Personal Identifiable Information for legal compliance: Information collected to meet our legal
                  obligations under financial or anti-money laundering laws may be retained even after you close your
                  account for the duration required by such laws.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Contact Information for marketing purposes: Your contact information, such as your name, email
                  address, and telephone number, will be retained for marketing purposes until you either unsubscribe or
                  we delete your account. Following that, your details will be added to an unsubscribed list to ensure
                  we do not send you any inadvertent marketing communications
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Content posted on our website: Any content you post on our website, including support desk comments,
                  photographs, videos, blog posts, and other content, may be retained after you close your account for
                  audit and crime prevention purposes.
                </Trans>
              </TextLiDash>
              <TextLiDash>
                <Trans>
                  Information collected via cookies and analytics tools: Information collected through cookies, web page
                  counters, and other analytics tools will be retained for a period of up to one year from the date of
                  collecting the relevant cookie.
                </Trans>
              </TextLiDash>
            </TextUlDash>
          </Paragraph>
          <Paragraph>
            <Trans>
              Please note that these retention periods are provided as general guidelines, and there may be exceptional
              circumstances where a longer retention period is necessary or where we are required to retain your
              information for a shorter period as mandated by law.
            </Trans>
          </Paragraph>
        </section>

        <section>
          <SubHeading>
            <Trans>Contact Us</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Please contact us if you have any questions about this Policy, any other Policies found on our Site, or if
              you are seeking to exercise any of your statutory rights. We will respond within a reasonable timeframe.
              You can contact us through <a href="mailto: Support@BestDEX.com">Support@BestDEX.com</a>&nbsp; or through
              any of our social media platforms.
            </Trans>
          </Paragraph>
        </section>
      </RootContainer>

      <Footer></Footer>
    </>
  )
}

export default Policy
