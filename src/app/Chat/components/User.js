"use client"; // Ensure this is a Client Component

import { useUser } from '@clerk/nextjs';

export default function UserDetails() {
  const { user } = useUser();

  if (!user) return 

  return <div>Hey {user?.firstName}</div>;
}
