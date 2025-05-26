import React from "react";

export default function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" {...props} xmlns="http://www.w3.org/2000/svg">
      <rect x="6" y="6" width="36" height="36" rx="8" fill="#6C63FF"/>
      <rect x="14" y="14" width="20" height="20" rx="4" fill="white"/>
      <path d="M20 28C20 25.7909 21.7909 24 24 24C26.2091 24 28 25.7909 28 28" stroke="#6C63FF" strokeWidth="2"/>
      <circle cx="24" cy="21" r="2" fill="#6C63FF"/>
      <rect x="6" y="6" width="36" height="36" rx="8" stroke="#6C63FF" strokeWidth="2"/>
    </svg>
  );
} 