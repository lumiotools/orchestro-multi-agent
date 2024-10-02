"use client";

import React from "react";
import { Sidebar } from "./(components)/sidebar";
import { Header } from "./(components)/header";
import { ThemeProvider } from "./(components)/theme-provider";

export default function Layout({ children, setCurrentPage }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen bg-background">
        <Sidebar setCurrentPage={setCurrentPage} />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-auto p-6">{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
