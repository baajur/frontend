import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import styled from 'styled-components'

import { Link } from '../content/link'
import { HeadTags } from '../head-tags'
import { PrinciplesGraphic } from '../landing/principles-graphic'
import { StyledP } from '../tags/styled-p'
import ParticipateSVG from '@/assets-webkit/img/footer-participate.svg'
import { useInstanceData } from '@/contexts/instance-context'
import { InstanceLandingData } from '@/data-types'
import { makeDefaultButton, makeResponsivePadding } from '@/helper/css'

export interface LandingInternationalProps {
  data: InstanceLandingData
}

export function LandingInternational({ data }: LandingInternationalProps) {
  const landingStrings = data.strings
  const { strings } = useInstanceData()

  return (
    <>
      <HeadTags data={{ title: strings.header.slogan }} />

      <Section>
        <LandingP>{landingStrings.vision}</LandingP>
        <Button href="/serlo">
          {landingStrings.learnMore}{' '}
          <FontAwesomeIcon icon={faArrowCircleRight} size="1x" />
        </Button>
      </Section>

      <PrinciplesSection>
        <PrinciplesGraphic strings={landingStrings} />
      </PrinciplesSection>

      <Section>
        <StyledH2>{landingStrings.wikiTitle}</StyledH2>
        <LandingP>{landingStrings.wikiText}</LandingP>
      </Section>

      <ImageSection />

      <Section>
        <StyledH2>{landingStrings.movementTitle}</StyledH2>
        <IconStyle>
          <ParticipateSVG />
        </IconStyle>
        <FlexCol>
          <LandingP>{landingStrings.callForAuthors}</LandingP>
          <Button href="/community">
            {landingStrings.communityLink}{' '}
            <FontAwesomeIcon icon={faArrowCircleRight} size="1x" />
          </Button>
        </FlexCol>
        <FlexCol>
          <LandingP>{landingStrings.callForOther}</LandingP>
          <Button href="/get-involved">
            {landingStrings.getInvolved}{' '}
            <FontAwesomeIcon icon={faArrowCircleRight} size="1x" />
          </Button>
        </FlexCol>
      </Section>
    </>
  )
}

const LandingP = styled(StyledP)`
  margin-left: 0;
`

const Section = styled.section`
  margin-top: 60px;
  margin-bottom: 60px;
  ${makeResponsivePadding}

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    max-width: 900px;
    margin-left: auto;
    margin-right: auto;
  }
`

const Col = styled.div`
  margin-top: 40px;

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    margin-top: 0;
    margin-right: 30px;
    flex: 1;

    & > p {
      min-height: 80px;
    }

    &:last-child {
      margin-right: 0;
    }
  }

  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    margin-right: 50px;
  }
`

const ImageSection = styled.section`
  background-size: contain;
  background-repeat: no-repeat;
  padding-top: 43.75%;

  background-image: url('https://packages.serlo.org/serlo-org-client@13.0.4/home_img_launch_sm.570e34cd.jpg');

  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    background-image: url('https://packages.serlo.org/serlo-org-client@13.0.4/home_img_launch_md.333b0782.jpg');
  }

  @media (min-width: ${(props) => props.theme.breakpoints.md}) {
    background-image: url('https://packages.serlo.org/serlo-org-client@13.0.4/home_img_launch_lg.b46ea2e2.jpg');
  }
`

const StyledH2 = styled.h2`
  font-size: 1.66rem;
  color: ${(props) => props.theme.colors.brand};
  border: 0;
  @media (min-width: ${(props) => props.theme.breakpoints.sm}) {
    width: 100%;
  }
`

const Button = styled(Link)`
  ${makeDefaultButton}
  font-size: 1.125rem;
  text-decoration: none !important;
  margin-left: -3px;
  font-weight: bold;
  padding-top: 3px;
  padding-top: 3px;
  background-color: ${(props) => props.theme.colors.lightBlueBackground};
`

const PrinciplesSection = styled.section`
  background-color: ${(props) => props.theme.colors.brand};
  text-align: center;
  ${makeResponsivePadding}
  padding-top: 70px;
  padding-bottom: 70px;

  & > svg {
    height: 450px;
    width: 100%;
    font-family: inherit;
  }
`

const IconStyle = styled.div`
  & > path,
  & .st0 {
    fill: ${(props) => props.theme.colors.brandGreen};
  }
  width: 100px;
  margin-right: 30px;
  @media (min-width: ${(props) => props.theme.breakpoints.lg}) {
    margin-right: 50px;
    width: 120px;
  }
`

const FlexCol = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  ${Button} {
    margin-top: auto;
  }

  margin-bottom: 60px;
`
