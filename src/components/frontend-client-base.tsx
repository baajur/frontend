import { useRouter } from 'next/router'
import React from 'react'
import { notify } from 'react-notify-toast'
import { ThemeProvider } from 'styled-components'

import { ConditonalWrap } from './conditional-wrap'
import { HeaderFooter } from './header-footer'
import { MaxWidthDiv } from './navigation/max-width-div'
import { NProgressRouter } from './navigation/n-progress-router'
import { RelativeContainer } from './navigation/relative-container'
import { ToastNotice } from './toast-notice'
import { useAuth } from '@/auth/use-auth'
import { EntityIdProvider } from '@/contexts/entity-id-context'
import { InstanceDataProvider } from '@/contexts/instance-context'
import { LoggedInComponentsProvider } from '@/contexts/logged-in-components'
import { LoggedInDataProvider } from '@/contexts/logged-in-data-context'
import { ToastNoticeProvider } from '@/contexts/toast-notice-context'
import { InstanceData, LoggedInData } from '@/data-types'
import { FontFix, PrintStylesheet } from '@/helper/css'
import type { getInstanceDataByLang } from '@/helper/feature-i18n'
import { frontendOrigin } from '@/helper/frontent-origin'
import { theme } from '@/theme'

export type FrontendClientBaseProps = React.PropsWithChildren<{
  noHeaderFooter?: boolean
  noContainers?: boolean
  showNav?: boolean
  entityId?: number
}>

export function FrontendClientBase({
  children,
  noHeaderFooter,
  noContainers,
  showNav,
  entityId,
}: FrontendClientBaseProps) {
  const { locale, asPath } = useRouter()
  const [instanceData] = React.useState<InstanceData>(() => {
    if (typeof window === 'undefined') {
      // load instance data for server side rendering
      // Note: using require to avoid webpack bundling it
      return require('@/helper/feature-i18n').getInstanceDataByLang(locale!)
    } else {
      // load instance data from client from document tag
      return JSON.parse(
        document.getElementById('__FRONTEND_CLIENT_INSTANCE_DATA__')
          ?.textContent ?? '{}'
      ) as ReturnType<typeof getInstanceDataByLang>
    }
  })

  //React.useEffect(storePageData, [initialProps])

  React.useEffect(() => {
    //tiny history
    sessionStorage.setItem(
      'previousPathname',
      sessionStorage.getItem('currentPathname') || ''
    )
    sessionStorage.setItem('currentPathname', window.location.pathname)
  })

  const auth = useAuth()
  const [loggedInData, setLoggedInData] = React.useState<LoggedInData | null>(
    getCachedLoggedInData()
  )
  const [loggedInComponents, setLoggedInComponents] = React.useState<any>(null)

  //console.log('Comps', loggedInComponents)

  React.useEffect(fetchLoggedInData, [
    auth,
    instanceData.lang,
    loggedInData,
    loggedInComponents,
  ])

  const toastNotice = notify.createShowQueue()

  const idCheck = /\/(\d+)(\/)?/.exec(asPath)
  const _entityId = entityId
    ? entityId
    : idCheck && idCheck[1]
    ? parseInt(idCheck[1])
    : null

  // dev
  //console.dir(initialProps)

  return (
    <ThemeProvider theme={theme}>
      <NProgressRouter>
        <FontFix />
        <PrintStylesheet warning={instanceData.strings.print.warning} />
        <InstanceDataProvider value={instanceData}>
          <LoggedInComponentsProvider value={loggedInComponents}>
            <LoggedInDataProvider value={loggedInData}>
              <EntityIdProvider value={_entityId}>
                <ToastNoticeProvider value={toastNotice}>
                  <ConditonalWrap
                    condition={!noHeaderFooter}
                    wrapper={(kids) => <HeaderFooter>{kids}</HeaderFooter>}
                  >
                    <ConditonalWrap
                      condition={!noContainers}
                      wrapper={(kids) => (
                        <RelativeContainer>
                          <MaxWidthDiv showNav={showNav}>
                            <main>{kids}</main>
                          </MaxWidthDiv>
                        </RelativeContainer>
                      )}
                    >
                      {/* should not be necessary…?*/}
                      {children as JSX.Element}
                    </ConditonalWrap>
                  </ConditonalWrap>
                  <ToastNotice />
                </ToastNoticeProvider>
              </EntityIdProvider>
            </LoggedInDataProvider>
          </LoggedInComponentsProvider>
        </InstanceDataProvider>
      </NProgressRouter>
    </ThemeProvider>
  )

  /*
  function storePageData() {
    try {
      const pageData = initialProps?.pageData
      if (pageData) {
        if (pageData.kind === 'single-entity' || pageData.kind === 'taxonomy') {
          if (pageData.cacheKey)
            sessionStorage.setItem(pageData.cacheKey, JSON.stringify(pageData))
        }
      }
    } catch (e) {
      //
    }
  }*/

  function getCachedLoggedInData() {
    if (
      typeof window === 'undefined' ||
      window.location.hostname === 'localhost'
    )
      return null
    const cacheValue = sessionStorage.getItem(
      `___loggedInData_${instanceData.lang}`
    )
    if (!cacheValue) return null
    return JSON.parse(cacheValue) as LoggedInData
  }

  function fetchLoggedInData() {
    if (auth.current) {
      Promise.all([
        !loggedInData
          ? fetch(
              frontendOrigin + '/api/locale/' + instanceData.lang
            ).then((res) => res.json())
          : false,
        !loggedInComponents ? import('@/helper/logged-in-stuff-chunk') : false,
      ])
        .then((values: any) => {
          if (values[0]) {
            sessionStorage.setItem(
              `___loggedInData_${instanceData.lang}`,
              JSON.stringify(values[0])
            )
            setLoggedInData(values[0])
          }
          if (values[1]) setLoggedInComponents(values[1].Components)
        })
        .catch(() => {})
    }
  }
}
