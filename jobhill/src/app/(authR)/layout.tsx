import HeaderWrapper from '@/components/HeaderWrapper';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <HeaderWrapper />
      <main>{children}</main>
    </>
  );
}