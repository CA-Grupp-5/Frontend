import React, { useState } from 'react';
import AuthForm, { AuthMode } from './AuthForm';

export default function LoginScreen() {
  const [mode, setMode] = useState<AuthMode>('login');

  return <AuthForm mode={mode} onModeChange={setMode} />;
}
