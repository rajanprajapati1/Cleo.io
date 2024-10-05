"use client"
import React from 'react'
import {Bot ,User} from 'lucide-react';
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'
import UserDetails from './User' 

const Header =() => {

  return (
       <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-8 w-8 text-blue-500 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Cleo.io</h1>
            </div>
          <div className="user flex item-center justify-center font-semibold font-mono gap-2 ">
            <UserDetails/>
               <SignedOut >
            <User/>
         <SignInButton />
       </SignedOut>
       <SignedIn>
         <UserButton />
       </SignedIn>
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header
