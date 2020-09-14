import Document, {
  Html,
  Head,
  Main,
  NextScript,
  DocumentContext,
} from 'next/document'
import { ServerStyleSheet } from 'styled-components'

import { GoogleAnalytics } from '@/components/scripts/google-analytics'

const bodyStyles = {
  margin: 0,
  fontFamily: 'Karmilla, sans-serif',
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html
        lang={
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          (this.props.__NEXT_DATA__.props.pageProps?.instanceData
            ?.lang as string) ?? 'de'
        }
      >
        <Head>
          <link rel="preconnect" href="//www.google-analytics.com" />
          <meta property="og:site_name" content="Serlo" />
          <meta property="og:type" content="website" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/_assets/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/_assets/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/_assets/favicon-16x16.png"
          />
          <link rel="manifest" href="/_assets/site.webmanifest?v=1" />
          <link
            rel="mask-icon"
            href="/_assets/safari-pinned-tab.svg"
            color="#007cbf"
          />
          <link rel="shortcut icon" href="/_assets/favicon.ico" />
          <meta name="msapplication-TileColor" content="#007cbf" />
          <meta
            name="msapplication-config"
            content="/_assets/browserconfig.xml"
          />
          <meta name="theme-color" content="#007cbf"></meta>
          <link
            href="/_assets/opensearch.de.xml"
            rel="search"
            type="application/opensearchdescription+xml"
            title="Serlo (de)"
          />
          {process.env.NEXT_PUBLIC_SENTRY_DSN !== undefined && (
            <script
              src={`https://js.sentry-cdn.com/${process.env.NEXT_PUBLIC_SENTRY_DSN.substring(
                8,
                40
              )}.min.js`}
              crossOrigin="anonymous"
            ></script>
          )}
        </Head>
        <body style={bodyStyles}>
          <Main />
          <NextScript />
          <GoogleAnalytics />
          <script async defer src="https://sa.serlo.org/latest.js" />
          <noscript>
            <img src="https://sa.serlo.org/noscript.gif" alt="" />
          </noscript>
        </body>
      </Html>
    )
  }
}
