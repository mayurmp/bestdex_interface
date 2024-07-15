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
    margin-top: 3.125rem;
    padding: 2rem 2rem;
  }
`
const HeadingText = styled.p`
  font-weight: 700;
  margin-bottom: 1.875rem;
  font-size: 48px;
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
  margin-bottom: 30px;
  font-size: 21px;
`
const ListItem = styled.li`
  margin-bottom: 5px;
  font-weight: 400;
  font-size: 20px;
`
const ListSection = styled.ol`
  margin-bottom: 30px;
`

const ListSectionOl = styled.ol`
  list-style: lower-alpha;
`
const TextSpan = styled.span``

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

const Terms: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <>
      <RootContainer>
        <Heading>
          <Trans>Best DEX Terms of Service</Trans>
        </Heading>
        <Paragraph>
          <Trans>Last modified: June 9th 2023</Trans>
        </Paragraph>
        <Paragraph>
          <Trans>
            <TextSpan>
              These Terms of Service (the &quot;Agreement&quot;) explains the terms and conditions by which you may
              access and use &quot;
            </TextSpan>
            <a href="https://bestdex.com" target="_blank" rel="noreferrer">
              https://bestdex.com
            </a>
            <TextSpan>&quot; and any associated subdomains (referred to as the &quot;Website&quot;).</TextSpan>
          </Trans>
        </Paragraph>
        <Paragraph>
          <Trans>
            This agreement carefully outlines the rules and conditions that apply to your use of the website. By
            accessing or using the Website, you indicate that you have read, understood, and agreed to be bound by the
            terms of this Agreement in its entirety. If you do not agree with these terms, you are not authorized to
            access or use the Website and should refrain from doing so.
          </Trans>
        </Paragraph>
        <Paragraph>
          <Trans>
            This Agreement includes essential information that affects your rights, such as a provision for binding
            arbitration and a waiver of class action. These provisions dictate how disputes will be resolved. Therefore,
            you can only access and use the Website if you completely agree to all the terms outlined in this Agreement.
          </Trans>
        </Paragraph>
        <section>
          <SubHeading>
            <Trans>Introduction</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              BestDEX.com (The Website) provides access to a decentralized protocol on various public blockchains,
              including but not limited to Ethereum Chain, BNB, Polygon and SOL, allowing users to trade certain
              compatible digital assets such as “$BEST” (Best Wallets native Token), among other services. The website
              is one, but not the exclusive, means of accessing the Best DEX exchange.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              This Agreement governs the access and use of BestDEX.com (referred to as &quot;The Website&quot;) and its
              services. The Website facilitates access to a decentralized protocol functioning on multiple public
              blockchains, including Ethereum Chain, BNB, Polygon, and SOL. Users can utilize the Website to engage in
              trading activities involving various compatible digital assets, including the native token known as &quot;
              $BEST &quot; (Best Wallet’s and Best DEX’s native Token), alongside other related services. It is
              important to note that while the Website serves as a primary access point for the Best DEX’s protocol, it
              is not the exclusive method provided for users to access the aforementioned services.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              In order to access the Website, you must use non-custodial wallet software, which allows you to interact
              with public blockchains. It is important to note that your relationship with the non-custodial wallet
              provider is governed by their respective terms of service, which are separate from and not covered by this
              Agreement. Please be aware that wallets, unless using ‘Best Wallet’, are independent entities and are not
              operated, maintained, or affiliated with us. Consequently, we do not possess custody or control over the
              contents of your wallet and are unable to retrieve or transfer its contents. By connecting your wallet to
              our Website, you explicitly agree to be bound by this Agreement, as well as all terms referenced and
              incorporated herein.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Amendments to the Terms of Service</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              These Terms of Use are subject to periodic updates, and any modifications will be reflected on this page.
              It is strongly recommended that you regularly review this page to stay informed of any changes, as they
              carry legal implications and are binding upon you. You, the user, will be notified by updating the date at
              the top of the Agreement and making the document available on the website. Once a new version is
              published, it will immediately take effect, governing your use of our Platforms and establishing your
              contractual relationship with us. By continuing to utilize our Platforms, you acknowledge, accept, and
              consent to be bound by the terms of any updates or amendments made to these Terms of Use.
            </Trans>
          </Paragraph>
          <SubHeading>
            <Trans>Services provided through the Website</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>The Website provides a web or mobile-based means of accessing the Protocol</Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>The Website and the Protocol</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              The Website and the Protocol are distinct entities, with the Website serving as one of the available
              means, though not the exclusive means, for accessing the Protocol. The Protocol itself consists of three
              versions, identified as v1, v2, and v3. Each version comprises self-executing smart contracts that are
              open-source or source-available and deployed on various public blockchains, including BNB Chain, Polygon,
              and Ethereum. It is important to note that Best DEX, the operator of the Website, does not exercise
              control over any version of the Protocol on any blockchain network.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              By utilizing the Website, you acknowledge and understand that your transactions involving digital assets
              are not conducted by ‘Best DEX’, and that ‘Best DEX’ does not operate any liquidity pools on the Protocol
              or oversee trade execution on the Protocol. When traders pay fees for their trades, those fees are
              directed to liquidity providers associated with the Protocol. It is important to recognize that, in
              general, the Best DEX team does not function as a liquidity provider within the Protocol&quot;s liquidity
              pools, and the liquidity providers themselves are independent third parties. Initially, the Protocol was
              deployed on the BNB Chain blockchain and has subsequently been deployed on various other blockchain
              networks.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Eligibility</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              To access and use the Website, you must be able to enter into a legally binding contract with us.
              Therefore, declaring you have reached the age of majority as defined by the laws of your jurisdiction
              (e.g., 18 years old in the United States) and possess the complete right, authority, and power to enter
              into and comply with the terms and conditions outlined in this Agreement, both on your own behalf and on
              behalf of any company or legal entity for which you may access or use the Website.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Furthermore, you affirm that you are not (a) subject to economic or trade sanctions administered or
              enforced by any governmental authority or listed as a prohibited or restricted party (including, but not
              limited to, listings maintained by the Office of Foreign Assets Control of the U.S. Department of the
              Treasury), and (b) a citizen, resident, or organized within a jurisdiction or territory that is subjected
              to comprehensive country-wide, territory-wide, or regional economic sanctions imposed by the United
              States. Finally, you represent that your access and use of the Website will fully adhere to all applicable
              laws and regulations, and you will not employ or utilize the Website to engage in, promote, or facilitate
              any unlawful activities.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              A condition you must agree to when accessing or using the services of the Website is that you acknowledge,
              understand, and agree to the following.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>From time to time, the services may be inaccessible or inoperable for any reason, including:</Trans>
          </Paragraph>
          <ListSection>
            <ListItem>Equipment or technology or other infrastructure delay, inaccessibility, or malfunctions</ListItem>
            <ListItem>
              Periodic maintenance procedures or repairs that Best DEX may undertake from time to time
            </ListItem>
            <ListItem>Causes beyond BestDES’s control or that Best DEX could not reasonably foresee</ListItem>
            <ListItem>
              Disruptions and temporary or permanent unavailability of underlying blockchain infrastructure; or
            </ListItem>
            <ListItem>
              Unavailability of third-party services providers or external partners for any reason. Without any
              limitation of any other provision of these Terms, and as set forth below, Best DEX has no responsibility
              or liability for any losses or liability for any losses or other injuries resulting from any such event.
            </ListItem>
          </ListSection>
          <Paragraph>
            <Trans>
              The Services provided by Best DEX are subject to evolution, which means that Best DEX reserves the right
              to make changes, replace, or discontinue the Services, either temporarily or permanently, at our sole
              discretion.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              You acknowledge and agree that you bear full responsibility for your use of the Services, including all
              transfers of Digital Assets. Additionally, you are solely responsible for complying with any applicable
              tax obligations arising from your use of the Services.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Please note that Best DEX does not have control over, or assume liability for, the delivery, quality,
              safety, legality, or any other aspect of any Digital Assets transferred to or from a third party. We do
              not guarantee the completion of transactions or the authorization of the entities with whom you transact.
              In the event that you encounter any issues or problems with a transaction involving Digital Assets using
              the Services, you assume all associated risks and liabilities.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Intellectual Property Rights</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Best DEX retains exclusive ownership of all intellectual property and other rights associated with the
              Website and its contents. This includes, but is not limited to, software, text, images, trademarks,
              service marks, copyrights, patents, designs, and the overall &quot; look and feel &quot; of the Website.
              On the other hand, versions 1-3 of the Protocol are constructed entirely from open-source or
              source-available software that operates on public blockchains.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Further Rights</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              We reserve certain rights, which are not considered obligations on our part. These rights include the
              following:
            </Trans>
          </Paragraph>
          <ListSectionOl>
            <ListItem>
              <Trans>
                We have the authority to review, modify, filter, disable, delete, and remove any and all content and
                information from the Website.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                We may, at our discretion and with or without prior notice to you, modify, substitute, eliminate, or add
                to the Website.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                We may cooperate with law enforcement, court orders, government investigations, or third-party requests
                that require or direct us to disclose information or content provided by you.
              </Trans>
            </ListItem>
          </ListSectionOl>
          <Paragraph>
            <Trans>
              Please note that while we retain these rights, their exercise does not create an obligation for us to act
              in a specific manner.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Prohibited Activity</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              You agree not to engage in, or attempt to engage in, any of the following categories of prohibited
              activity in relation to your access and use of the Website:
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>Basic:</Trans>
          </Paragraph>
          <ListSection>
            <ListItem>
              <Trans>
                Unauthorized access: Users must not attempt to gain unauthorized access to the website, its systems, or
                any other user accounts.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Illegal activities: Users must not engage in any activity that is unlawful, fraudulent, or promotes
                illegal behavior.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Intellectual property infringement: Users must not infringe upon the intellectual property rights of
                others, including copyright, trademarks, patents, or trade secrets.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Spam and phishing: Users must not send unsolicited or deceptive communications, including spam, phishing
                attempts, or other fraudulent activities.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Malicious software: Users must not distribute viruses, malware, or any other harmful software or code
                that could damage or disrupt the website or its users.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Harassment and abuse: Users must not engage in any form of harassment, bullying, or abusive behavior
                towards other users, including hate speech, threats, or personal attacks.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Impersonation: Users must not impersonate another person, entity, or falsely represent their affiliation
                with a person or organization.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Data mining and scraping: Users must not engage in unauthorized data mining, scraping, or harvesting of
                information from the website or its users
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Violation of privacy: Users must respect the privacy of others and not engage in activities that violate
                the privacy rights of individuals, including the unauthorized collection or dissemination of personal
                information.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Violation of terms: Users must comply with all terms and conditions outlined in the website&lsquo;s
                Terms of Service and not engage in any activity that violates these terms.
              </Trans>
            </ListItem>
          </ListSection>
        </section>
        <section>
          <SubHeading>
            <Trans>Extended Prohibited Activity</Trans>
          </SubHeading>
          <ListSection>
            <ListItem>
              <Trans>
                Intellectual Property Infringement: Users are strictly prohibited from engaging in any activity that
                infringes upon or violates any copyright, trademark, service mark, patent, right of publicity, right of
                privacy, or other proprietary or intellectual property rights under the law.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Cyberattack: Users shall not participate in any activity that aims to interfere with or compromise the
                integrity, security, or proper functioning of any computer, server, network, personal device, or other
                information technology system. This includes, but is not limited to, the deployment of viruses and
                denial of service attacks.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Fraud and Misrepresentation: Users are prohibited from engaging in any activity that seeks to defraud us
                or any other person or entity. This includes providing false, inaccurate, or misleading information with
                the intent to unlawfully obtain the property of another
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Market Manipulation: Users shall not engage in any activity that violates any applicable laws, rules, or
                regulations concerning the integrity of trading markets. This includes, but is not limited to,
                manipulative tactics such as &quot;rug pulls,&quot; pumping and dumping, and wash trading.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Securities and Derivatives Violations: Users must not engage in any activity that violates any
                applicable laws, rules, or regulations concerning the trading of securities or derivatives. This
                includes, but is not limited to, the unregistered offering of securities and the offering of leveraged
                and margined commodity products to retail customers in the United States.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Sale of Stolen Property: Users shall not engage in the buying, selling, or transferring of stolen items,
                fraudulently obtained items, items taken without authorization, and/or any other illegally obtained
                items.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Data Mining or Scraping: Users are strictly prohibited from engaging in activity that involves data
                mining, robots, scraping, or similar methods of gathering or extracting content or information from the
                Website.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Objectionable Content: Users must refrain from engaging in any activity that involves soliciting
                information from anyone under the age of 18 or that is otherwise harmful, threatening, or offensive in
                nature.
              </Trans>
            </ListItem>
          </ListSection>
        </section>
        <section>
          <SubHeading>
            <Trans>Agency Registration</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              We are not registered with the U.S. Securities and Exchange Commission as a national securities exchange
              or in any other capacity. It is important for you to understand and acknowledge that we do not act as a
              broker for trading orders on your behalf. Furthermore, we do not facilitate the execution or settlement of
              your trades, as these transactions occur solely on public distributed blockchains such as Ethereum.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Therefore, cannot guarantee market-best pricing or best execution through the Website or our Smart Router
              feature, which routes trades across liquidity pools on the Protocol exclusively. Any references made on
              the Website to best &quot;price&quot; do not represent or warrant pricing availability through the
              Website, on the Protocol, or elsewhere.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Non-Solicitation; No Investment Advice</Trans>
          </SubHeading>
          <Paragraph>
            <>
              <Trans>You confirm agreement that you understand the following:</Trans>
              <ListSectionOl>
                <ListItem>
                  <Trans>
                    All trades you submit through the Website are considered unsolicited, meaning that they are
                    initiated solely by you.
                  </Trans>
                </ListItem>
                <ListItem>
                  <Trans>
                    You have not received any investment advice from us regarding any trades, including those placed
                    through our Smart Router API.
                  </Trans>
                </ListItem>
                <ListItem>
                  <Trans>We do not conduct a suitability review of any trades you submit.</Trans>
                </ListItem>
              </ListSectionOl>
            </>
          </Paragraph>
          {/* <Paragraph></Paragraph> */}
          <Paragraph>
            <Trans>
              We may provide information about tokens on the Website, sourced from third-party data partners, through
              features such as rarity scores, token explorer, or token lists. We may also provide warning labels for
              certain tokens. However, the provision of informational materials does not solicit trades in those tokens,
              nor are we attempting to induce you to make any purchases based on the information provided.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Please note that all information provided on the Website is for informational purposes only and should not
              be construed as investment advice or a recommendation that a particular token is a safe or sound
              investment. You should not take any action or refrain from taking any action based on the information
              contained in the Website. By providing token information for your convenience, we do not make any
              investment recommendations or express opinions on the merits of any transaction or opportunity.
              Ultimately, it is your sole responsibility to determine whether any investment, investment strategy, or
              related transaction is appropriate for you based on your personal investment objectives, financial
              circumstances, and risk tolerance.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Non-Custodial Nature and Absence of Fiduciary Duties</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              The Website operates as a non-custodial application, meaning that we never have custody, possession, or
              control over your digital assets at any point in time. It also implies that you bear sole responsibility
              for safeguarding the cryptographic private keys to your digital asset wallets. It is crucial that you
              refrain from sharing your wallet credentials or seed phrase with any third party. We hold no
              responsibility or liability to you concerning your use of a wallet and do not provide any representations
              or warranties regarding the compatibility of the Website with any specific wallet. Similarly, any
              associated wallet is solely your responsibility, and we are not liable for any actions or omissions on
              your part resulting from the compromise of your wallet.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              This Agreement does not aim to establish or impose any fiduciary duties upon us. To the maximum extent
              permitted by applicable law, you acknowledge and agree that we have no fiduciary duties or liabilities
              towards you or any other party. Any fiduciary duties or liabilities that may exist by law or equity are
              hereby unequivocally disclaimed, waived, and eliminated. Furthermore, you agree that the only duties and
              obligations we owe you are those expressly stated in this Agreement.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Jurisdictional Compliance and Tax Obligations</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              The availability and suitability of the Website may be subject to jurisdictional limitations. By accessing
              or using the Website, you explicitly acknowledge and agree that you bear complete and exclusive
              responsibility for ensuring strict compliance with all applicable laws and regulations that may pertain to
              your use of the Website.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              It is important to note that your utilization of the Website or the Protocol may give rise to various tax
              implications, including but not limited to income tax, capital gains tax, value-added tax (VAT), goods and
              services tax (GST), or sales tax, as dictated by the relevant jurisdictions. It is your sole obligation to
              diligently assess whether such taxes apply to any transactions you engage in or receive through the
              Website, and if determined applicable, to accurately report and remit the requisite taxes to the
              appropriate tax authority within the prescribed timeframes, ensuring full compliance with all applicable
              tax laws and regulations.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Risk</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              By accessing or utilizing the Services, you explicitly recognize and agree to the inherent risks
              associated with cryptographic systems and blockchain-based networks. These risks encompass the usage and
              intricacies of native Digital Assets, such as Ethereum (ETH), smart contract-based tokens (including
              fungible tokens and NFTs), and systems that interact with blockchain-based networks.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              It is important to note that Best DEX does not possess ownership or control over the underlying software
              upon which blockchain networks are formed. Generally, the software supporting blockchain networks,
              including the Ethereum blockchain, operates on an open-source basis, enabling anyone to utilize, copy,
              modify, and distribute it. Consequently, by utilizing the Services, you acknowledge and agree to the
              following:
            </Trans>
          </Paragraph>
          <ListSectionOl>
            <ListItem>
              <Trans>
                Best DEX assumes no responsibility for the operation of the blockchain-based software and the networks
                underpinning the Services.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                No guarantee is provided regarding the functionality, security, or availability of the aforementioned
                software and networks.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                The underlying blockchain-based networks are subject to abrupt changes in operating rules, commonly
                known as &quot;forks,&quot; which can significantly impact the provision of the Services.
              </Trans>
            </ListItem>
          </ListSectionOl>
          <Paragraph>
            <Trans>
              Blockchain networks rely on public and private key cryptography. It is solely your responsibility to
              secure your private key(s). Best DEX does not have access to your private key(s). Please be aware that
              losing control of your private key(s) will result in permanent and irreversible denial of access to
              Digital Assets on the Ethereum blockchain or other blockchain-based networks. Neither Best DEX nor any
              other individual or entity will be able to recover or safeguard your Digital Assets.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              In the event that your private key(s) are lost, you will be unable to transfer your Digital Assets to any
              other blockchain address or wallet. Consequently, you will be unable to realize any value or utility from
              the Digital Assets you may possess.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              You acknowledge and understand that the Services and your Digital Assets could be impacted by one or more
              regulatory inquiries or regulatory actions, which could impede or limit the ability of Best DEX to
              continue to make available our proprietary software and could impede or limit your ability to access or
              use the services.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              By accessing and utilizing the Website, you affirm that you possess the financial and technical
              sophistication necessary to comprehend the inherent risks associated with cryptographic and
              blockchain-based systems. You also declare that you possess a sufficient understanding of the usage and
              intricacies of digital assets, including ether (ETH), stablecoins, and other digital tokens following the
              Ethereum Token Standard (ERC-20), or any other digital tokens transacted on Best DEX.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>Specifically, you acknowledge the following:</Trans>
          </Paragraph>
          <ListSection>
            <ListItem>
              <Trans>
                Volatility and Risk Factors: You understand that markets for digital assets are nascent and highly
                volatile, driven by factors such as adoption, speculation, technology, security, and regulation. You are
                aware that anyone can create tokens, including fraudulent versions of existing tokens and tokens falsely
                claiming association with specific projects. You acknowledge the risk of mistakenly trading such tokens
                and accept the potential consequences. Additionally, you recognize that stablecoins may not deliver the
                stability they purport to provide, may lack full collateralization, and can be susceptible to panics and
                runs.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Irreversibility and Automation: You comprehend that smart contract transactions execute and settle
                automatically and that blockchain-based transactions, once confirmed, are irreversible. You accept the
                implications of these features.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Variable Costs and Speed: You acknowledge and accept that transacting with cryptographic and
                blockchain-based systems, such as Ethereum, entails variable costs and speed, which may experience
                significant fluctuations at any given time.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Expert Modes: You understand the risk associated with opting to trade in Expert Modes, which may result
                in substantial price slippage and increased costs.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Liquidity Provision Risks: If you act as a liquidity provider to the Protocol through the Website, you
                acknowledge that the value of your digital assets supplied to the Protocol may fluctuate, potentially
                resulting in partial or total loss due to price fluctuations of tokens within a trading pair or
                liquidity pool.
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                Cross-Chain Bridges: You are aware that we do not create, own, or operate cross-chain bridges, and we
                provide no representation or warranty regarding the safety or reliability of any cross-chain bridge,
                including its use for Best DEX governance.
              </Trans>
            </ListItem>
          </ListSection>
          <Paragraph>
            <Trans>
              In summary, you acknowledge that we bear no responsibility for the aforementioned variables or risks. We
              neither own nor control the Protocol and cannot be held liable for any losses you may incur while
              accessing or using the Website. Consequently, you assume full responsibility for all associated risks when
              utilizing the Website to interact with the Protocol.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Third-Party Resources and Promotions</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              The Website may feature references or links to third-party resources, including information, materials,
              products, or services that are beyond our ownership or control. Additionally, third parties may offer
              promotions relating to your access and utilization of the Website. It is important to note that we do not
              endorse, monitor, approve, warrant, or assume any responsibility for such resources or promotions. When
              you access or engage with any of these resources or promotions, you do so at your own risk, and you
              acknowledge that this Agreement does not govern your interactions or relationships with third parties. You
              explicitly release us from any liability arising from your use of these resources or participation in any
              associated promotions.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Release of Claims</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              By accessing and using the Website, you acknowledge and agree to assume all risks associated with your
              use. You also expressly waive and release us from any and all liability, claims, causes of action, or
              damages arising from or related to your use of the Website. If you are a California resident, you
              specifically waive the benefits and protections of California Civil Code § 1542, which states that a
              general release does not extend to claims that the releasing party is not aware of or suspects to exist at
              the time of executing the release and that, if known, would have materially affected their decision to
              release the party.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Indemnity</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              You agree to indemnify, defend, and hold us and our officers, directors, employees, contractors, agents,
              affiliates, and subsidiaries harmless from and against any claims, damages, obligations, losses,
              liabilities, costs, and expenses arising from:
            </Trans>
          </Paragraph>
          <ListSectionOl>
            <ListItem>
              <Trans>your access and use of the Website;</Trans>
            </ListItem>
            <ListItem>
              <Trans>
                your violation of any provision of this Agreement, the rights of any third party, or any applicable law,
                rule, or regulation; and
              </Trans>
            </ListItem>
            <ListItem>
              <Trans>
                any other party&lsquo;s access and use of the Website with your assistance or through any device or
                account owned or controlled by you.
              </Trans>
            </ListItem>
          </ListSectionOl>
        </section>
        <section>
          <SubHeading>
            <Trans>No Warranties</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              The Website is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis. TO THE FULLEST EXTENT
              PERMITTED BY LAW, WE DISCLAIM ANY REPRESENTATIONS AND WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, OR
              STATUTORY, INCLUDING (BUT NOT LIMITED TO) THE WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR
              PURPOSE.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              You acknowledge and agree that your use of the Website and the Protocol is at your own risk. We do not
              make any representations or warranties regarding the continuous, uninterrupted, timely, or secure access
              to the Website. The information contained in the Website may not always be accurate, reliable, complete,
              or current. We do not guarantee that the Website will be free from errors, defects, viruses, or other
              harmful elements. Any advice, information, or statements provided by us should not be considered as
              creating any warranty regarding the Website. We do not endorse, guarantee, or assume responsibility for
              any advertisements, offers, or statements made by third parties regarding the Website.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Similarly, the Protocol is provided &quot;AS IS,&quot; and you use it at your own risk. Although we were
              involved in the initial code for the Protocol, we do not own or control it. The Protocol operates
              autonomously through smart contracts deployed on various blockchains, and any upgrades or modifications
              are typically managed by holders of the CAKE token. No developer or entity involved in creating the
              Protocol will be liable for any claims or damages associated with your use of the Protocol, including
              direct, indirect, incidental, special, exemplary, punitive, or consequential damages, or loss of profits,
              cryptocurrencies, tokens, or any other valuable assets. We do not endorse, guarantee, or assume
              responsibility for any advertisements, offers, or statements made by third parties regarding the Website
              or the Protocol.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Dispute Resolution and Arbitration</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              PLEASE READ THE FOLLOWING SECTION CAREFULLY BECAUSE IT MAY SIGNIFICANTLY IMPACT YOUR LEGAL RIGHTS,
              INCLUDING YOUR RIGHT TO BRING A LAWSUIT AGAINST BEST DEX IN ANY COURT OR GOVERNING AUTHORITY. EXCEPT AS
              EXPRESSLY PROVIDED BELOW THIS SECTION REQUIRES YOU TO SUBMIT ANY DISPUTE, CLAIM, OR DISAGREEMENT (EACH A
              “DISPUTE”) ARISING OUT OF THESE TERMS OR THE SERVICES, INCLUDING ANY DISPUTE THAT AROSE BEFORE THE
              EFFECTIVE DATES OF THESE TERMS, TO BINDING INDIVIDUAL ARBITRATION. THIS SECTION EXTENDS TO DISPUTE THAT
              AROSE OR INVOLVE FACTS OCCURRING BEFORE THE EXISTENCE OF THIS OR ANY PRIOR VERSIONS OF THE TERMS AS WELL
              AS DISPUTES THAT MAY ARISE AFTER THE TERMINATION OF THE TERMS.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              <TextSpan>
                We will use our best efforts to resolve any potential disputes through informa, good faith negotiations.
                If a potential dispute arises, you must contact us by sending an email to&nbsp;
              </TextSpan>
              <a href="Disputes@BestDEX.com" target={'_blank'}>
                Disputes@BestDEX.com
              </a>
              <TextSpan>&nbsp;</TextSpan>
              <TextSpan>
                so that we can attempt to resolve it without resorting to formal dispute resolution. If we are not able
                to reach an informal resolution within sixty days of our response to your email, we both agree to
                resolve the potential dispute according to the process set forth below.
              </TextSpan>
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Any claim or controversy arising from the Website, this Agreement, or any other acts or omissions that you
              believe make us liable (referred to as a &quot;Dispute&quot;) will be resolved through arbitration under
              the Arbitration Rules of the Bulgarian International Arbitration Centre. You acknowledge that you are
              required to settle all Disputes through binding arbitration. The arbitration will be confidential and
              conducted before a single arbitrator chosen in accordance with the Centre&apos;s rules. Unless mutually
              agreed otherwise, the arbitration will take place in Bulgaria. The arbitrator is not allowed to
              consolidate your claims with those of any other party, unless we agree otherwise. The resulting award can
              be entered as a judgment in any court with jurisdiction.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Class Action and Jury Trial Waiver</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              You must bring any and all Disputes against us in your individual capacity and not as part of a class
              action, collective action, private attorney general action, or any other representative proceeding. This
              applies to class arbitration as well. Both you and we agree to waive the right to a trial by jury.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Governing Law</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              The interpretation and enforcement of these Terms, and any Dispute related to these Terms or the Services,
              will be governed by and construed and enforced under the laws of Bulgaria, as applicable, without regard
              to conflict of law rules or principles (In any state of Bulgaria or other jurisdiction) that would cause
              the application of the laws of any other jurisdiction. You agree that we may initiate a proceeding related
              to the enforcement or validity of our intellectual property rights in any court having jurisdiction. For
              any other proceeding that is not subject to arbitration under these Terms, the state and federal courts
              located in Bulgaria will have exclusive jurisdiction. You waive any objection to change the venue in any
              such courts.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Entire Agreement</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              These terms represent the entire agreement between you and us regarding the subject matter discussed. They
              supersede any prior written or oral agreements, communications, or understandings relating to the subject
              matter.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>Gas Fees</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Blockchain transactions require the payment of transaction fees, known as Gas Fees, to the relevant
              network. Unless otherwise specified in another offer by Best DEX, you are solely responsible for paying
              the Gas Fees for any transaction you initiate.
            </Trans>
          </Paragraph>
        </section>
        <section>
          <SubHeading>
            <Trans>General information</Trans>
          </SubHeading>
          <Paragraph>
            <Trans>
              Please refer to our privacy and cookies policy, which is incorporated herein by reference and available on
              the Website for information on how we collect, use, sharee and otherwise process information about you.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              You agree to receive all communications, agreements, documents, receipts, notices, and disclosures
              electronically in connection with these Terms or any Services. We may provide these communications by
              posting them on the Site, emailing them to the email address you provide, or sending them via Telegram to
              the username you provide.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              If any provision of these Terms is found to be invalid or unenforceable, it will not affect the validity
              or enforceability of the other provisions, which will remain in full force and effect. We will not be
              responsible or liable for any failure or delay in performing any other services or for any loss or damage
              you may incur due to circumstances or events beyond our control. This includes events like floods, extreme
              weather conditions, earthquakes, acts of God, fires, wars, insurrections, riots, labor disputes,
              accidents, government actions, communication failures, power outages, or equipment or software
              malfunctions.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              Unless otherwise provided or required by the context, the headings of sections are for convenience only
              and will not limit or interpret the sections. Whenever the words &quot;include,&quot;
              &quot;includes,&quot; or &quot;including&quot; are used in these Terms, they are deemed to be followed by
              the words &quot;without limitation.&quot; The use of &quot;or&quot; is not intended to be exclusive.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              These Terms constitute the entire agreement between you and Best DEX, superseding any prior or
              contemporaneous understandings between the parties regarding the Services. In case of any conflict between
              these Terms and any other agreement you may have with us, these Terms will prevail unless the other
              agreement specifically identifies these Terms and states that it supersedes them.
            </Trans>
          </Paragraph>
          <Paragraph>
            <Trans>
              You agree that, except as expressly provided in this Agreement, there are no third-party beneficiaries to
              the Agreement other than the Indemnified Parties.
            </Trans>
          </Paragraph>
        </section>
      </RootContainer>
      <Footer></Footer>
    </>
  )
}

export default Terms
