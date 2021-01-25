import React from 'react'
import styled from 'styled-components'

import { PageTitle } from '../content/page-title'
import { HSpace } from '@/components/content/h-space'
import { MaxWidthDiv } from '@/components/navigation/max-width-div'
import { RelativeContainer } from '@/components/navigation/relative-container'
import { StyledA } from '@/components/tags/styled-a'
import { StyledP } from '@/components/tags/styled-p'
import { useInstanceData } from '@/contexts/instance-context'
import { ErrorData } from '@/data-types'
import { makePrimaryButton } from '@/helper/css'
import { SentryGlobal } from '@/pages/_app'

export function ErrorPage({ code, message }: ErrorData) {
  const [path, setPath] = React.useState('')
  const [hasSerloBacklink, setHasSerloBacklink] = React.useState(false)
  const { strings } = useInstanceData()

  React.useEffect(() => {
    console.log(message)

    if (process.env.NEXT_PUBLIC_SENTRY_DSN !== undefined) {
      const windowWithSentry = (window as unknown) as Window & SentryGlobal
      windowWithSentry.Sentry?.addBreadcrumb({
        category: 'error message',
        message,
        level: windowWithSentry.Sentry?.Severity?.Info || 'info',
      })
      windowWithSentry.Sentry?.captureException(
        new Error(`${code}: ${message || 'without message'}`)
      )
    }

    setPath(window.location.pathname)

    const previousPage = sessionStorage.getItem('previousPathname')
    setHasSerloBacklink(previousPage ? previousPage.length > 0 : false)
  }, [code, message])

  const isProbablyTemporary = code > 500

  return (
    <RelativeContainer>
      <MaxWidthDiv>
        <PageTitle title={strings.errors.title} headTitle />
        <_StyledP>
          {strings.errors.defaultMessage}{' '}
          {!isProbablyTemporary && (
            <>
              <br />
              {strings.errors.permanent}
            </>
          )}
        </_StyledP>
        <_StyledP>{isProbablyTemporary && strings.errors.temporary}</_StyledP>
        <StyledP>{renderButtons()}</StyledP>
        <HSpace amount={70} />
        <StyledP>
          <b>Error: {code}</b>
        </StyledP>
        {process.env.NODE_ENV !== 'production' && (
          <StyledP>
            Details:{' '}
            <StyledA href={`/api/frontend${path}`}>
              /api/frontend
              {path}
            </StyledA>
          </StyledP>
        )}
        <HSpace amount={100} />
      </MaxWidthDiv>
    </RelativeContainer>
  )

  function renderButtons() {
    return (
      <>
        {isProbablyTemporary ? (
          renderSmartBacklink()
        ) : (
          <>
            {renderBacklink()}
            {renderHomeLink()}
          </>
        )}
        {isProbablyTemporary && (
          <Button onClick={() => window.location.reload()}>
            {strings.errors.refreshNow}
          </Button>
        )}
      </>
    )
  }

  function renderHomeLink() {
    //no csr here
    return (
      <Button as="a" href="/">
        {strings.errors.backToHome}
      </Button>
    )
  }

  function renderBacklink() {
    if (!hasSerloBacklink) return null
    return (
      <Button onClick={() => window.history.back()}>
        {strings.errors.backToPrevious}
      </Button>
    )
  }

  function renderSmartBacklink() {
    if (hasSerloBacklink) return renderBacklink()
    return renderHomeLink()
  }
}

const _StyledP = styled(StyledP)`
  font-size: 1.5rem;
`

const Button = styled.button`
  ${makePrimaryButton}
  margin-right: 16px;
  margin-top: 16px;
`
