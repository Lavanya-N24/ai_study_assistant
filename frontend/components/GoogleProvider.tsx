"use client";

import { GoogleOAuthProvider } from '@react-oauth/google';

export default function GoogleProvider({ children }: { children: React.ReactNode }) {
  // Provided Google Client ID
  const clientId = "676388448609-lto4m0lnise1t9vono8j9a3f1cl2nsm5.apps.googleusercontent.com";
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
