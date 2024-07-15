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
  max-width: 1400px;
  @media screen and (max-width: 1100px) {
    padding: 2rem 6rem;
  }
  @media screen and (max-width: 600px) {
    margin-top: 50px;
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
  margin-bottom: 1.875rem;
  font-weight: 400;
  font-size: 20px;
`
const SubHeadingText = styled.p`
  font-weight: 700;
  margin-bottom: 1.875rem;
  font-size: 21px;
`

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

const Cookies: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <RootContainer>
        <Heading>
          <Trans>Cookies Policy</Trans>
        </Heading>
        <Paragraph>
          <Trans>Last revised: June 2023</Trans>
        </Paragraph>
        <section>
          <SubHeading>
            <Trans>About this Policy</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Our Privacy and Terms of Service Policies explain our principles when it comes to the collection,
              processing, and storage of your personal information. This policy explains the use of cookies in more
              details, such as what cookies are and how they are used. However, to get a full picture of how we handle
              your privacy this policy should be read together with our Privacy and Terms of Service Policies.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>What are cookies?</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Cookies are text files, containing small amounts of information, which are downloaded to your browsing
              device, such as your computer, mobile device or smartphone, when you visit our website or use our
              services. Cookies can be recognised by the website that downloaded them — or other websites that use the
              same cookies. This helps websites know if the browsing device has visited them before.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              We use two types of cookies: persistent cookies and session cookies. A persistent cookie lasts beyond the
              current session and is used for many purposes, such as recognizing you as an existing user, so it&#39;s
              easier to return to us and interact with our services. Since a persistent cookie stays in your browser, it
              will be read by us when you return to one of our sites or visit a third-party site that uses our services.
              Session cookies last only as long as the session (usually the current visit to a website or a browser
              session).
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Do I need to accept cookies?</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              No, you do not need to accept cookies. But, please be advised that if you do not accept cookies the
              service might be difficult or impossible to use.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              You can adjust settings on your browser so that you will be notified when you receive a cookie. Please
              refer to your browser documentation to check if cookies have been enabled on your computer or to request
              not to receive cookies. As cookies allow you to take advantage of some of the Website&#39;s essential
              features, we recommend that you accept cookies. For instance, if you block or otherwise reject our
              cookies, you will not be able to use any products or services on the website that may require you to log
              in.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>What are the cookies used for?</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Functional Cookies Functional cookies are essential to provide our services as we want to provide them.
              They are used to remember your preferences on our website and to provide an enhanced and personalised
              experience. The information collected by these cookies is usually anonymised, so we cannot identify you
              personally. Functional cookies do not track your internet usage or gather information that could be used
              for selling advertising. These cookies are usually session cookies that will expire when you close your
              browsing session, but some are also persistent cookies.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Essential or &#39; Strictly Necessary &#39; Cookies</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              These cookies are essential to provide our services. Without these cookies, parts of our website will not
              function. These cookies do not track where you have been on the internet and do remember preferences
              beyond your current visit and do not gather information about you that could be used for marketing
              purposes. These cookies are usually session cookies which will expire when you close your browsing
              session.
            </Trans>
          </Paragraph>
        </section>

        <section>
          <SubHeading>
            <Trans>Analytical Performance Cookies</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Analytical performance cookies are used to monitor the performance of our website and services, for
              example, to determine the number of page views and the number of unique users a website has. Web analytics
              services may be designed and operated by third parties. The information provided by these cookies allows
              us to analyse patterns of user behaviour and we use that information to enhance user experience or
              identify areas of the website which may require maintenance. The information is anonymous, cannot be used
              to identify you, does not contain personal information and is only used for statistical purposes
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Advertising Cookies</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              These cookies remember that you have visited a website and use that information to provide you with
              content or advertising which is tailored to your interests. They are also used to limit the number of
              times you see an advertisement as well as help measure the effectiveness of the advertising campaign. The
              information collected by these cookies may be shared with trusted third-party partners such as
              advertisers.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              We may update this Cookie Policy from time to time for operational, legal or regulatory reasons.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>If you have any questions regarding our policy on cookies please contact support@bestdex.com</Trans>
          </Paragraph>
        </section>
      </RootContainer>

      <Footer></Footer>
    </>
  )
}

export default Cookies
