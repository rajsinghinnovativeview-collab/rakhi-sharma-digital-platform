import type { Metadata } from 'next';
import LoginForm from './LoginForm';

export const metadata: Metadata = {
  title: 'Sign In | NevTan Mail',
  description: 'Sign in to your NevTan Mail business account.',
  alternates: { canonical: '/login' },
  openGraph: {
    title: 'Sign In | NevTan Mail',
    description: 'Secure business webmail access.',
    url: '/login',
    siteName: 'NevTan Mail',
    type: 'website',
  },
  robots: { index: false, follow: true }, // login pages are usually not indexed
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebPage',
      '@id': 'https://mail.nevtan.com/login#webpage',
      url: 'https://mail.nevtan.com/login',
      name: 'Sign In | NevTan Mail',
      isPartOf: { '@id': 'https://mail.nevtan.com/#website' },
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://mail.nevtan.com/' },
        { '@type': 'ListItem', position: 2, name: 'Sign In', item: 'https://mail.nevtan.com/login' },
      ],
    },
    {
      '@type': 'Organization',
      '@id': 'https://mail.nevtan.com/#organization',
      name: 'NevTan',
      url: 'https://mail.nevtan.com',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://mail.nevtan.com/#website',
      url: 'https://mail.nevtan.com',
      name: 'NevTan Mail',
      publisher: { '@id': 'https://mail.nevtan.com/#organization' },
    },
  ],
};

export default function LoginPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LoginForm />
    </>
  );
}
