// Imports
// ========================================================
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getCsrfToken, signIn, signOut, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { renderDataURI } from "@codingwithmanny/blockies";
// SIWE Integration
import { SiweMessage } from "siwe";
import { useAccount, useConnect, useDisconnect, useSignMessage, useNetwork } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';
import Hero from "~/components/hero";
import Features from "~/components/features";
import FeaturesBlocks from "~/components/features-blocks";
import Testimonials from "~/components/testimonials";
import Newsletter from "~/components/newsletter";

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
        ? <div className="mb-4 text-center">
          {sessionData ? <div className="mb-4">
            <label className="block text-white/80 mb-2">Logged in as</label>
            {sessionData?.user?.id ? <Image width={"80"} height={"80"} alt={`${sessionData.user.id}`} className="mx-auto my-4 border-8 border-white/30" src={`${renderDataURI({ seed: sessionData.user.id, size: 10, scale: 8 })}`} /> : null}
            <code className="block p-4 text-white bg-black/20 rounded">{JSON.stringify(sessionData)}</code>
          </div> : null}
          {secretMessage ? <p className="mb-4">
            <label className="block text-white/80 mb-2">Secret Message</label>
            <code className="block p-4 text-white bg-black/20 rounded">{secretMessage}</code>
          </p> : null}

          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={onClickSignOut as () => void}
          >
            Sign Out
          </button>
        </div>
        : showConnection
          ? <div className="mb-4">
            {isConnected
              ? <button
                className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
                onClick={onClickSignIn as () => void}
              >
                Sign In
              </button>
              : null
            }
          </div>
          : null
      }
      {showConnection
        ? <div className="text-center">
          {address
            ? <p className="mb-4">
              <code className="block p-4 text-white bg-black/20 rounded">{address}</code>
            </p>
            : null
          }
          <button
            className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
            onClick={() => !isConnected ? connect() : disconnect()}
          >
            {!isConnected ? 'Connect Wallet' : 'Disconnect'}
          </button>
        </div>
        : null}
    </div>
  );
};

// Page Component
// ========================================================
const Home: NextPage = () => {
  // Requests
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  // Render
  return (
    <>
      <Head>
        <title>Create T3 App SIWE</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Hero />
      <Features />
      <FeaturesBlocks />
      <Testimonials />
      <Newsletter />
    </>
  );
};

// Exports
// ========================================================
export default Home;
