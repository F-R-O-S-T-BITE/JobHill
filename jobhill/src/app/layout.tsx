import './globals.css';
import ClientLayout from '@/components/ClientLayout';
import { QueryProvider } from '@/providers/QueryProvider';

export const metadata = {
  title: 'Jobhill',
  description: 'Helping you find your next opportunity',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </QueryProvider>
      </body>
    </html>
  )
}