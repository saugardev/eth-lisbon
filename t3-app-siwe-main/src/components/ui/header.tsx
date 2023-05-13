'use client'

import { useState, useEffect } from 'react'

import Logo from './logo'
import MobileMenu from './mobile-menu'

import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useSignMessage, useNetwork } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';
import Link from 'next/link';

export default function Header() {

  const [top, setTop] = useState<boolean>(true)

  // detect whether user has scrolled the page down by 10px
  const scrollHandler = () => {
    window.pageYOffset > 10 ? setTop(false) : setTop(true)
  }  

  useEffect(() => {
    scrollHandler()
    window.addEventListener('scroll', scrollHandler)
    return () => window.removeEventListener('scroll', scrollHandler)
  }, [top])

  return (
    <header className={`fixed w-full z-30 md:bg-opacity-90 transition duration-300 ease-in-out ${!top ? 'bg-white backdrop-blur-sm shadow-lg' : ''}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Site branding */}
          <div className="shrink-0 mr-4">
            <Logo />
          </div>

          {/* Desktop navigation */}
          <nav className="hidden md:flex md:grow">
            {/* Desktop sign in links */}
            <ul className="flex grow justify-end flex-wrap items-center">
              <li>
                <AuthShowcase></AuthShowcase>
              </li>
            </ul>

          </nav>

          <MobileMenu />

        </div>
      </div>
    </header>
  )
}


// Auth Component
// ========================================================
const AuthShowcase: React.FC = () => {
  // Hooks
  const { data: sessionData } = useSession();
  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined },
  );
  // State
  const [showConnection, setShowConnection] = useState(false);

  // Wagmi Hooks
  const { signMessageAsync } = useSignMessage();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  // Functions
  /**
   * Attempts SIWE and establish session
   */
  const onClickSignIn = async () => {
    if (!isConnected) {
      connect();
    }
    try {
      const message = new SiweMessage({
        domain: window.location.host,
        address: address,
        statement: "Sign in with Ethereum to the app.",
        uri: window.location.origin,
        version: "1",
        chainId: chain?.id,
        // nonce is used from CSRF token
        nonce: await getCsrfToken(),
      })
      const signature = await signMessageAsync({
        message: message.prepareMessage(),
      })
      await signIn("credentials", {
        message: JSON.stringify(message),
        redirect: false,
        signature,
      });
    } catch (error) {
      window.alert(error);
    }
  };

  /**
   * Sign user out
   */
  const onClickSignOut = async () => {
    await signOut();
  };

  // Hooks
  /**
   * Handles hydration issue
   * only show after the window has finished loading
   */
  useEffect(() => {
    setShowConnection(true);
  }, []);

  // Render
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {sessionData
        ? <div className='flex items-center gap-5'>
          <li>
            <Link rel="stylesheet" href="/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link rel="stylesheet" href="/profile">Profile</Link>
          </li>
          <div className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3 cursor-pointer">
            <li className='flex items-center' onClick={onClickSignOut as () => void}>
              <span>Log out</span>
              <svg className="w-4 h-3 fill-current text-gray-400 shrink-0 ml-2 -mr-1" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.707 5.293L7 .586 5.586 2l3 3H0v2h8.586l-3 3L7 11.414l4.707-4.707a1 1 0 000-1.414z" fillRule="nonzero" />
              </svg>
            </li>
          </div>
        </div> 
        : <div>
          <div className="btn-sm text-gray-200 bg-gray-900 hover:bg-gray-800 ml-3 cursor-pointer"
            onClick={onClickSignIn as () => void}>
            <span>Connect Wallet</span>
          </div>
        </div>
      }
    </div>
  );
};