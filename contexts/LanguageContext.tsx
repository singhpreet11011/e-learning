"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { LanguageCode, SUPPORTED_LANGUAGES } from "@/lib/translation";
import { translateOnClient, batchTranslateOnClient } from "@/lib/translation";

interface LanguageContextType {
  primaryLanguage: LanguageCode | null;
  secondaryLanguage: LanguageCode | null;
  setPrimaryLanguage: (lang: LanguageCode | null) => void;
  setSecondaryLanguage: (lang: LanguageCode | null) => void;
  translateText: (text: string) => Promise<{ primary?: string; secondary?: string }>;
  translateBatch: (texts: string[]) => Promise<{ primary?: string[]; secondary?: string[] }>;
  isTranslating: boolean;
  savePreferences: () => Promise<void>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const [primaryLanguage, setPrimaryLanguage] = useState<LanguageCode | null>(null);
  const [secondaryLanguage, setSecondaryLanguage] = useState<LanguageCode | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);

  // Load user's language preferences
  useEffect(() => {
    if (isLoaded && user?.id) {
      fetch("/api/user/language-preferences")
        .then((res) => res.json())
        .then((data) => {
          if (data.primaryLanguage) {
            setPrimaryLanguage(data.primaryLanguage as LanguageCode);
          }
          if (data.secondaryLanguage) {
            setSecondaryLanguage(data.secondaryLanguage as LanguageCode);
          }
        })
        .catch(console.error);
    } else if (isLoaded && !user) {
      // Load from localStorage for non-authenticated users
      const stored = localStorage.getItem("languagePreferences");
      if (stored) {
        const { primary, secondary } = JSON.parse(stored);
        setPrimaryLanguage(primary);
        setSecondaryLanguage(secondary);
      }
    }
  }, [user, isLoaded]);

  const savePreferences = async () => {
    const preferences = {
      primaryLanguage,
      secondaryLanguage,
    };

    if (user?.id) {
      // Save to database for authenticated users
      try {
        await fetch("/api/user/language-preferences", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(preferences),
        });
      } catch (error) {
        console.error("Failed to save language preferences:", error);
      }
    } else {
      // Save to localStorage for non-authenticated users
      localStorage.setItem(
        "languagePreferences",
        JSON.stringify({ primary: primaryLanguage, secondary: secondaryLanguage })
      );
    }
  };

  const translateText = async (text: string) => {
    if (!text) return {};
    
    setIsTranslating(true);
    const result: { primary?: string; secondary?: string } = {};

    try {
      const promises = [];
      
      if (primaryLanguage && primaryLanguage !== 'en') {
        promises.push(
          translateOnClient(text, primaryLanguage, 'en').then(translated => {
            result.primary = translated;
          })
        );
      }
      
      if (secondaryLanguage && secondaryLanguage !== 'en') {
        promises.push(
          translateOnClient(text, secondaryLanguage, 'en').then(translated => {
            result.secondary = translated;
          })
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }

    return result;
  };

  const translateBatch = async (texts: string[]) => {
    if (!texts.length) return {};
    
    setIsTranslating(true);
    const result: { primary?: string[]; secondary?: string[] } = {};

    try {
      const promises = [];
      
      if (primaryLanguage && primaryLanguage !== 'en') {
        promises.push(
          batchTranslateOnClient(texts, primaryLanguage, 'en').then(translated => {
            result.primary = translated;
          })
        );
      }
      
      if (secondaryLanguage && secondaryLanguage !== 'en') {
        promises.push(
          batchTranslateOnClient(texts, secondaryLanguage, 'en').then(translated => {
            result.secondary = translated;
          })
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error("Batch translation error:", error);
    } finally {
      setIsTranslating(false);
    }

    return result;
  };

  return (
    <LanguageContext.Provider
      value={{
        primaryLanguage,
        secondaryLanguage,
        setPrimaryLanguage,
        setSecondaryLanguage,
        translateText,
        translateBatch,
        isTranslating,
        savePreferences,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};