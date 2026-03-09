import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="id">
      <Head>
        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2D5016" />
        <meta name="mobile-web-app-capable" content="yes" />

        {/* iOS PWA */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="FluentEdge" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />

        {/* OG */}
        <meta property="og:title" content="FluentEdge — English untuk Profesional Batam" />
        <meta property="og:description" content="Program English 6 bulan terstruktur. 60 menit sehari. Gratis." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://fluentedge-three.vercel.app" />
        <meta name="twitter:card" content="summary" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
