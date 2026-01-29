import { ReactNode } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SkipToContent from "./SkipToContent";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <SkipToContent />
      <Navbar />
      <main id="main-content" className="flex-1 pt-20" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
