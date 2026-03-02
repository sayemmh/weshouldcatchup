import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://weshouldcatchup.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "We Should Catch Up — Talk to the people you've been meaning to call",
  description:
    'An iOS app that connects you with friends the moment you\'re both free. No calendars. No scheduling. Just tap "I\'m free" and the app finds someone in your queue who\'s free too.',
  openGraph: {
    title: "We Should Catch Up",
    description:
      'You keep saying "we should catch up sometime." This app actually makes it happen — with friends, mentors, or anyone in your network. Tap "I\'m free" and talk.',
    type: "website",
    url: SITE_URL,
    siteName: "We Should Catch Up",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "We Should Catch Up",
    description:
      'You keep saying "we should catch up sometime." This app actually makes it happen — with friends, mentors, or anyone in your network. Tap "I\'m free" and talk.',
    creator: "@weshouldcatchup",
  },
  other: {
    // iMessage / Apple rich links
    "apple-mobile-web-app-title": "We Should Catch Up",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,500&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💬</text></svg>"
        />
      </head>
      <body className="bg-cream text-warm-charcoal font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
