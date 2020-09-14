import { default as NextLink } from 'next/link'
import React from 'react'

import { StyledA } from '../tags/styled-a'
import { ExternalLink } from './external-link'
import { useInstanceData } from '@/contexts/instance-context'

export interface LinkProps {
  href?: string
  children: React.ReactNode
  className?: string
  noExternalIcon?: boolean
  title?: string
  noCSR?: boolean
}

//TODO: Should come from cloudflare worker https://github.com/serlo/frontend/issues/328
const legacyLinks = [
  '/privacy',
  '/datenschutz',
  '/imprint',
  '/terms',
  '/disable-frontend',
  '/enable-frontend',
  '/beitreten',
  '/discussions',
  // '/entity/unrevised',
  // '/auth/login',
  // '/auth/logout',
  // '/api/auth/login',
  // '/api/auth/logout',
  //'/user/public',
  //'/user/settings',
  // '/auth/password/change',
  // '/event/history/user/me',
  // '/event/history',
]

function isLegacyLink(_href: string) {
  // compat: this is a special frontend route
  if (_href == '/user/notifications') return false
  return (
    legacyLinks.indexOf(_href) > -1 ||
    _href.startsWith('/user/') ||
    _href.startsWith('/auth/') ||
    _href.startsWith('/event/history') ||
    _href.startsWith('/api/auth') ||
    _href.startsWith('/entity/') ||
    _href.startsWith('/discussions') ||
    _href.indexOf('.serlo.org') > -1 //e.g. community.serlo.org or different language
  )
}

export function Link({
  href,
  children,
  className,
  noExternalIcon,
  title,
  noCSR,
}: LinkProps) {
  const { lang } = useInstanceData()

  if (!href || href === undefined || href === '')
    return (
      <a className={className} title={title}>
        {children}
      </a>
    )

  const isAbsolute = href.indexOf('//') > -1
  const isExternal = isAbsolute && !href.includes('.serlo.org')
  const isAnchor = href.startsWith('#') || href.startsWith('/#')
  const isMailto = href.startsWith('mailto:')

  if (isExternal || noCSR || isAnchor || isMailto) return renderLink(href)

  //at this point only internal links should be left

  const internalLink = normalizeSerloLink(href)

  if (!isLegacyLink(internalLink)) return renderClientSide(internalLink)

  //fallback
  return renderLink(href)

  function normalizeSerloLink(_href: string) {
    return _href.startsWith(`https://${lang}.serlo.org/`)
      ? _href.replace(`https://${lang}.serlo.org`, '')
      : _href.startsWith('/')
      ? _href
      : '/' + _href
  }

  function renderClientSide(_href: string) {
    return (
      <NextLink href="/[[...slug]]" as={decodeURIComponent(_href)}>
        {renderLink(_href)}
      </NextLink>
    )
  }

  function renderLink(_href: string) {
    return (
      <StyledA
        href={_href}
        className={className}
        title={title}
        rel={isExternal ? 'nofollow noopener' : undefined}
      >
        {children}
        {isExternal && !noExternalIcon && <ExternalLink />}
      </StyledA>
    )
  }
}
