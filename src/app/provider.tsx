'use client';
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useCallback } from 'react'

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser()

  const isNewUser = useCallback(async () => {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!user || !email) return;

    // Logic: Check if we already synced this user in the current session
    // This prevents redundant API calls on every re-render/navigation
    const isSynced = sessionStorage.getItem('user_synced');
    if (isSynced === email) return;

    try {
      const response = await fetch('/api/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: {
            fullName: user.fullName,
            emailAddress: email,
            imageUrl: user.imageUrl,
          },
        }),
      });

      if (response.ok) {
        // Mark as synced so we don't call this again until the tab is closed/reloaded
        sessionStorage.setItem('user_synced', email);
      } else {
        console.error("Failed to sync user to database");
      }
    } catch (error) {
      console.error("User Provider Error:", error);
    }
  }, [user]);

  useEffect(() => {
    isNewUser();
  }, [isNewUser]); // Removed 'user' from here because it's already in useCallback dependencies

  return (
    <div>{children}</div>
  )
}

export default Provider;