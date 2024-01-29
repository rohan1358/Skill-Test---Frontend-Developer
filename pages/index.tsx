import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

function Home() {
  const router = useRouter();
  useEffect(() => {
    router.push("/1/0");
  }, []);
  return <div>Home</div>;
}

export default Home;
