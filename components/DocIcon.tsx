
import React from 'react';
import { DocType } from '../types';

interface DocIconProps {
  type: DocType;
  className?: string;
}

const DocIcon: React.FC<DocIconProps> = ({ type, className = "w-6 h-6" }) => {
  // Assigning specific colors and more detailed paths for each document type
  switch (type) {
    case DocType.INSTRUCCION:
      return (
        <svg className={`${className} text-emerald-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Instrucción de Trabajo</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 10h.01M9 14h.01M9 18h.01" />
        </svg>
      );
    case DocType.FDS:
      return (
        <svg className={`${className} text-rose-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Ficha de Seguridad (FDS)</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 8v4m0 4h.01" />
        </svg>
      );
    case DocType.FT:
      return (
        <svg className={`${className} text-sky-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Ficha Técnica (FT)</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a2 2 0 00-1.96 1.414l-.718 2.154a2 2 0 01-1.9 1.365H9.282a2 2 0 01-1.9-1.365l-.718-2.154a2 2 0 00-1.96-1.414l-2.387.477a2 2 0 00-1.022.547l-1.33 1.33A2 2 0 010 17.586V14a2 2 0 012-2h20a2 2 0 012 2v3.586a2 2 0 01-.586 1.414l-1.33-1.33z" opacity="0.1" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    case DocType.MANUAL:
      return (
        <svg className={`${className} text-amber-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <title>Manual de Máquina</title>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l2 2-2 2" />
        </svg>
      );
    default:
      return (
        <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
  }
};

export default DocIcon;
