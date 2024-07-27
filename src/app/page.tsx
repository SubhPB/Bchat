// Byimaan

import { auth } from "@/lib/auth";

export default async  function Home() {
  const session = await auth()
  return (
    <main className="w-full min-h-full flex flex-col justify-center overflow-x-hidden font-bold">
      <div className="w-full text-7xl pl-2">
        <h1 className="text-zinc-600 lg:text-[10rem] leading-none">LANDING</h1>
        <h2 className="lg:pl-32 text-zinc-600 lg:text-[10rem] leading-none">PAGE</h2> 
        <code className="w-full p-5 text-sm bg-gray-300 rounded-2xl">{JSON.stringify(session)}</code>
      </div>
    </main>
  );
};
