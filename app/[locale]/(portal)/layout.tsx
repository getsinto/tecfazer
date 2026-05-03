// Portal route group layout — renders children WITHOUT Navbar/Footer/ChatWidget
// The portal has its own sidebar navigation
export default function PortalGroupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
