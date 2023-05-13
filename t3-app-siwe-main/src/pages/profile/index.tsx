import Image from "next/image";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { renderDataURI } from "@codingwithmanny/blockies";
import { useAccount, useConnect, useDisconnect, useSignMessage, useNetwork } from "wagmi";
import { InjectedConnector } from 'wagmi/connectors/injected';
import Footer from "~/components/footer";
import Header from "~/components/ui/header";
import { Card } from "@tremor/react";

export default function UserPage() {
 
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

  const user = {
    name: 'John Doe',
    username: '@johndoe',
    email: 'john.doe@example.com',
    location: 'San Francisco, CA',
    avatar: 'https://source.unsplash.com/random/100x100',
  };

  return (
    <>
    <Header/>
    <main className="grow">
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <Card className="relative px-4 py-10 sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex items-center space-x-5">
              {sessionData?.user?.id ? <Image width={"80"} height={"80"} alt={`${sessionData.user.id}`} className="mx-auto my-4 border-8 border-white/30" src={`${renderDataURI({ seed: sessionData.user.id, size: 10, scale: 8 })}`} /> : null}
              <div className="pt-6 text-center sm:pt-0 sm:text-left sm:flex-grow">
                <h1 className="text-3xl font-bold text-gray-900">
                  {user.name}
                </h1>
                <p className="text-xl text-gray-600">{user.username}</p>
              </div>
            </div>
            <div className="mt-8 space-y-6">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
              <p className="text-sm text-gray-600">Location:</p>
              <p className="text-lg font-semibold text-gray-900">{user.location}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
    </main>
    <Footer />
    </>
  );
}
