import './globals.css'

export const metadata = {
  title: 'AutoReel - Faceless Video Generator',
  description: 'Generate faceless videos instantly with AI',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
