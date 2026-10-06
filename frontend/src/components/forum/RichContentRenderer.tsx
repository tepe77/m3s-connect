"use client";

import React from "react";
import Image from "next/image";

interface RichContentRendererProps {
  content: string;
}

export function RichContentRenderer({ content }: RichContentRendererProps) {
  if (!content) return null;

  // Split by double newline or single newline to process blocks
  const paragraphs = content.split("\n\n");

  const getYouTubeId = (url: string): string | null => {
    try {
      const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
      );
      return match ? match[1] : null;
    } catch {
      return null;
    }
  };

  const renderInline = (text: string): React.ReactNode => {
    // 1. Check for markdown image: ![alt](url)
    const imageMatch = text.match(/!\[(.*?)\]\((.*?)\)/);
    if (imageMatch) {
      const alt = imageMatch[1] || "Gambar Forum";
      const src = imageMatch[2];
      const parts = text.split(imageMatch[0]);

      return (
        <span key={text} className="block space-y-2 my-3">
          {parts[0] && renderInline(parts[0])}
          <span className="block relative overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 max-w-xl">
            {src.startsWith("data:") || src.startsWith("/") ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={src}
                alt={alt}
                className="w-full h-auto max-h-[460px] object-cover rounded-2xl"
              />
            ) : (
              <div className="relative w-full h-64 sm:h-80">
                <Image
                  src={src}
                  alt={alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover rounded-2xl"
                />
              </div>
            )}
            {alt && alt !== "Gambar Forum" && (
              <span className="block px-3 py-1.5 text-[11px] font-medium text-[#64748B] bg-white border-t border-slate-100 text-center">
                {alt}
              </span>
            )}
          </span>
          {parts[1] && renderInline(parts[1])}
        </span>
      );
    }

    // 2. Check for video embed: [video: url]
    const videoMatch = text.match(/\[video:\s*(.*?)\]/i);
    if (videoMatch) {
      const videoUrl = videoMatch[1].trim();
      const ytId = getYouTubeId(videoUrl);
      const isDirectVideo = videoUrl.endsWith(".mp4") || videoUrl.endsWith(".webm");
      const parts = text.split(videoMatch[0]);

      return (
        <span key={text} className="block space-y-2 my-3">
          {parts[0] && renderInline(parts[0])}
          <span className="block max-w-xl rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 shadow-xs">
            {ytId ? (
              <div className="relative aspect-video w-full">
                <iframe
                  src={`https://www.youtube.com/embed/${ytId}`}
                  title="YouTube video player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                />
              </div>
            ) : isDirectVideo ? (
              <video
                src={videoUrl}
                controls
                className="w-full max-h-[380px] rounded-2xl"
              >
                Browser Anda tidak mendukung video HTML5.
              </video>
            ) : (
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 text-xs text-white flex items-center gap-2 hover:underline"
              >
                <svg className="w-5 h-5 text-red-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                </svg>
                <span>Buka Tautan Video: {videoUrl}</span>
              </a>
            )}
          </span>
          {parts[1] && renderInline(parts[1])}
        </span>
      );
    }

    // 3. Check for markdown link: [text](url)
    const linkMatch = text.match(/\[(.*?)\]\((.*?)\)/);
    if (linkMatch) {
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      const parts = text.split(linkMatch[0]);
      return (
        <React.Fragment key={text}>
          {parts[0] && renderInline(parts[0])}
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0D9488] font-bold underline hover:text-[#0f766e] inline-flex items-center gap-1 mx-0.5"
          >
            <span>{linkText}</span>
            <svg className="w-3 h-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          {parts[1] && renderInline(parts[1])}
        </React.Fragment>
      );
    }

    // 4. Format bold **text**
    const boldMatch = text.match(/\*\*(.*?)\*\*/);
    if (boldMatch) {
      const boldText = boldMatch[1];
      const parts = text.split(boldMatch[0]);
      return (
        <React.Fragment key={text}>
          {parts[0] && renderInline(parts[0])}
          <strong className="font-extrabold text-[#0F172A]">{boldText}</strong>
          {parts[1] && renderInline(parts[1])}
        </React.Fragment>
      );
    }

    // 5. Format inline code `code`
    const codeMatch = text.match(/`([^`]+)`/);
    if (codeMatch) {
      const codeText = codeMatch[1];
      const parts = text.split(codeMatch[0]);
      return (
        <React.Fragment key={text}>
          {parts[0] && renderInline(parts[0])}
          <code className="px-1.5 py-0.5 rounded-md bg-slate-100 text-[#0F172A] font-mono text-[11px] border border-slate-200">
            {codeText}
          </code>
          {parts[1] && renderInline(parts[1])}
        </React.Fragment>
      );
    }

    return text;
  };

  return (
    <div className="space-y-3 text-xs sm:text-sm text-[#334155] leading-relaxed">
      {paragraphs.map((para, pIdx) => {
        const trimmed = para.trim();
        if (!trimmed) return null;

        // Blockquote
        if (trimmed.startsWith("> ")) {
          const quoteText = trimmed.replace(/^>\s*/, "");
          return (
            <blockquote
              key={pIdx}
              className="pl-4 py-2 border-l-4 border-[#0D9488] bg-slate-50/80 rounded-r-2xl italic text-[#475569] my-2"
            >
              {renderInline(quoteText)}
            </blockquote>
          );
        }

        // Heading 3
        if (trimmed.startsWith("### ")) {
          return (
            <h4
              key={pIdx}
              className="text-sm sm:text-base font-extrabold text-[#0F172A] mt-4 mb-1"
            >
              {trimmed.replace(/^###\s*/, "")}
            </h4>
          );
        }

        // List block
        if (trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\.\s/.test(trimmed)) {
          const lines = trimmed.split("\n");
          return (
            <ul key={pIdx} className="space-y-1.5 pl-5 list-disc marker:text-[#0D9488] my-2">
              {lines.map((line, lIdx) => {
                const itemContent = line.replace(/^[-*]\s*|^\d+\.\s*/, "");
                return (
                  <li key={lIdx} className="leading-relaxed">
                    {renderInline(itemContent)}
                  </li>
                );
              })}
            </ul>
          );
        }

        // Normal paragraph with newline breaks
        const lines = para.split("\n");
        return (
          <p key={pIdx} className="leading-relaxed">
            {lines.map((line, lIdx) => (
              <React.Fragment key={lIdx}>
                {renderInline(line)}
                {lIdx < lines.length - 1 && <br />}
              </React.Fragment>
            ))}
          </p>
        );
      })}
    </div>
  );
}
