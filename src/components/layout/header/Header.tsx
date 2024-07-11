// BYIMAAN
'use client'
import React from 'react';
import { NavigationMenuDemo } from './Features';
import { useSession } from 'next-auth/react';


function Header() {
  const session = useSession()
  return (
    <header className="py-3 w-full flex justify-between">
        <NavigationMenuDemo />
    </header>
  )
}

export default Header