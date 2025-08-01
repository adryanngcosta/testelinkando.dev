'use client';

import { useDashboardController } from '../../controllers/DashboardController';
import { DashboardView } from '../../views/DashboardView';

export default function Dashboard() {
  const {
    user,
    links,
    originalUrl,
    isPrivate,
    password,
    expiresIn,
    loading,
    creating,
    setOriginalUrl,
    setIsPrivate,
    setPassword,
    setExpiresIn,
    handleCreateLink,
    handleDeleteLink,
    handleCopyLink,
    handleLogout
  } = useDashboardController();

  return (
    <DashboardView
      user={user}
      links={links}
      originalUrl={originalUrl}
      isPrivate={isPrivate}
      password={password}
      expiresIn={expiresIn}
      loading={loading}
      creating={creating}
      setOriginalUrl={setOriginalUrl}
      setIsPrivate={setIsPrivate}
      setPassword={setPassword}
      setExpiresIn={setExpiresIn}
      handleCreateLink={handleCreateLink}
      handleDeleteLink={handleDeleteLink}
      handleCopyLink={handleCopyLink}
      handleLogout={handleLogout}
    />
  );
}
