import MobileNav from './components/MobileNav'
import Sidebar from './components/Sidebar'
import Searchbar from './components/Searchbar'
import './globals.css'
import { Providers } from './redux/provider'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import MusicPlayerWrap from './components/MusicPlayerWrap'
import { SpeedInsights } from '@vercel/speed-insights/next'
export const metadata = {
  title: 'Tunewave: Listen the music in your way 🎶',
  description:
    'Welcome to Tunewave: your go-to music hub! Discover pop hits, indie gems, and timeless classics in one place. 🎶 #MusicMagic',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <meta
          name="google-site-verification"
          content="QibisYWcAxZwed8-_w-2OVseaL58KAxSe7Jb2A6wXLQ"
        />
        <div className="relative flex">
          {/* Sidebar */}
          <div className="fixed top-0 left-0 h-full">
            <Sidebar />
          </div>
          {/* Main Content */}
          <div className="flex-1 flex flex-col md:pl-64">
            {' '}
            {/* Add padding-left to avoid content overlap */}
            <Searchbar />
            <div className="flex-1   px-6 h-[calc(100vh-72px)] overflow-y-scroll hide-scrollbar flex xl:flex-row flex-col-reverse">
              <div className="flex-1 h-fit pb-10">
                <Providers>
                  {children}
                  <SpeedInsights />
                  <div className="fixed bottom-0 left-0 w-full h-30  bg-gray-500">
                    <MusicPlayerWrap />
                    <div className="md:hidden">
                      <MobileNav />
                    </div>
                  </div>
                  <ToastContainer />
                </Providers>
              </div>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
