"use client";
import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: ReactNode;
}

const AdminAuthWrapper: React.FC<Props> = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");
    if (!loggedIn) router.push("/admin"); // redirect to login
    else setLoading(false);
  }, [router]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return <>{children}</>;
};

export default AdminAuthWrapper;
