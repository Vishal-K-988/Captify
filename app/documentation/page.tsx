"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BookOpen, Code, Settings, Zap, Video, Download, FileText, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { ComicText } from "@/components/ui/comic-text";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
        <div className="border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            {/* <BookOpen className="h-8 w-8 text-primary" /> */}
            <div>
             <ComicText>Captify Documentation</ComicText>
              <p className="text-muted-foreground mt-1">Complete guide to video captioning application</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-5xl">
        {/* Table of Contents */}
        <div className="mb-12 p-6 rounded-lg border bg-muted/50">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Table of Contents
          </h2>
          <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {[
              "Project Overview",
              "Features",
              "Tech Stack",
              "Installation & Setup",
              "Environment Variables",
              "Project Structure",
              "Usage Guide",
              "API Endpoints",
              "Caption Styles",
              "Configuration",
              "Troubleshooting",
              "Future Improvements",
            ].map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase().replace(/\s+/g, "-").replace(/&/g, "")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2"
              >
                <span className="text-primary">{index + 1}.</span> {item}
              </a>
            ))}
          </nav>
        </div>

        {/* Project Overview */}
        <section id="project-overview" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Project Overview</h2>
          </div>
          <Separator className="mb-6" />
          <div className="prose prose-slate dark:prose-invert max-w-none">
            <p className="text-lg text-muted-foreground mb-4">
              <strong>Captify</strong> is a modern web application that automatically generates and overlays captions on video files. 
              It uses AssemblyAI for speech-to-text transcription and Remotion for video rendering with customizable caption styles.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {[
                { icon: Video, title: "Automatic Transcription", desc: "Uses AssemblyAI API for accurate speech-to-text conversion" },
                { icon: FileText, title: "Multiple Caption Styles", desc: "4 predefined caption styles (TikTok, Bottom-Centered, Top-Bar, Karaoke)" },
                { icon: Code, title: "Hinglish Support", desc: "Renders mixed Hindi (Devanagari) and English text correctly" },
                { icon: Download, title: "Video Rendering", desc: "Client-side rendering with canvas overlay and audio capture" },
              ].map((feature, i) => (
                <div key={i} className="p-4 rounded-lg border bg-card">
                  <feature.icon className="h-5 w-5 text-primary mb-2" />
                  <h4 className="font-semibold mb-1">{feature.title}</h4>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Features</h2>
          </div>
          <Separator className="mb-6" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="video-upload">
              <AccordionTrigger>Video Upload</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Upload MP4 files from local device</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Secure upload to AWS S3 using presigned URLs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Support for various video formats</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="auto-captioning">
              <AccordionTrigger>Auto-Captioning</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>One-click transcription using AssemblyAI</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Word-level timing information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Speaker labels support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Language detection with code-switching support</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="caption-styles">
              <AccordionTrigger>Caption Style Presets</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-semibold mb-2">TikTok Style</h4>
                    <p className="text-sm text-muted-foreground">Bottom-centered with bold text, transparent background</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-semibold mb-2">Standard Subtitles</h4>
                    <p className="text-sm text-muted-foreground">Bottom-centered with white text and shadow</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-semibold mb-2">News Bar</h4>
                    <p className="text-sm text-muted-foreground">Semi-transparent bar at the top</p>
                  </div>
                  <div className="p-4 rounded-lg border bg-card">
                    <h4 className="font-semibold mb-2">Karaoke Highlight</h4>
                    <p className="text-sm text-muted-foreground">Words highlight as they are spoken</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hinglish">
              <AccordionTrigger>Hinglish Support</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Proper rendering of mixed Hindi (Devanagari script) and English</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Uses Noto Sans and Noto Sans Devanagari fonts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-primary mt-1 shrink-0" />
                    <span>Correct text alignment and encoding</span>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Tech Stack */}
        <section id="tech-stack" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Tech Stack</h2>
          </div>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Frontend</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Next.js 16.0.3 - React framework with App Router
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  React 19.2.0 - UI library
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  TypeScript 5 - Type safety
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Tailwind CSS 4 - Styling
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Zustand 5.0.8 - State management
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Remotion 4.0.375 - Video rendering library
                </li>
              </ul>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Backend</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Next.js API Routes - Server-side endpoints
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  AWS SDK v3 - S3 integration
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  AssemblyAI 4.19.0 - Speech-to-text API
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Installation & Setup */}
        <section id="installation--setup" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Installation & Setup</h2>
          </div>
          <Separator className="mb-6" />
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Prerequisites</h3>
              <ul className="space-y-2 text-muted-foreground ml-4">
                <li className="list-disc">Node.js 18+ and npm/yarn/pnpm</li>
                <li className="list-disc">AWS S3 bucket with appropriate permissions</li>
                <li className="list-disc">AssemblyAI API key</li>
                <li className="list-disc">FFmpeg (for server-side rendering, optional)</li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4">Installation Steps</h3>
              <div className="space-y-4">
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">1. Clone the repository</h4>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    <code>git clone &lt;repository-url&gt;{'\n'}cd catfy</code>
                  </pre>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">2. Install dependencies</h4>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    <code>npm install</code>
                  </pre>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">3. Set up environment variables</h4>
                  <p className="text-sm text-muted-foreground mb-2">Create a `.env.local` file in the root directory:</p>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    <code>{`AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET_NAME=your_bucket_name
ASSEMBLYAI_API_KEY=your_assemblyai_api_key`}</code>
                  </pre>
                </div>
                <div className="p-4 rounded-lg border bg-card">
                  <h4 className="font-semibold mb-2">4. Run the development server</h4>
                  <pre className="bg-muted p-3 rounded-md text-sm overflow-x-auto">
                    <code>npm run dev</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Environment Variables */}
        <section id="environment-variables" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Environment Variables</h2>
          </div>
          <Separator className="mb-6" />
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4 font-semibold">Variable</th>
                  <th className="text-left p-4 font-semibold">Description</th>
                  <th className="text-left p-4 font-semibold">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">AWS_ACCESS_KEY_ID</td>
                  <td className="p-4 text-muted-foreground">AWS access key for S3</td>
                  <td className="p-4 font-mono text-sm text-muted-foreground">....</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">AWS_SECRET_ACCESS_KEY</td>
                  <td className="p-4 text-muted-foreground">AWS secret key for S3</td>
                  <td className="p-4 font-mono text-sm text-muted-foreground">... </td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">AWS_REGION</td>
                  <td className="p-4 text-muted-foreground">AWS region for S3 bucket</td>
                  <td className="p-4 font-mono text-sm text-muted-foreground">ap-northeast-3</td>
                </tr>
                <tr className="border-b">
                  <td className="p-4 font-mono text-sm">AWS_S3_BUCKET_NAME</td>
                  <td className="p-4 text-muted-foreground">S3 bucket name</td>
                  <td className="p-4 font-mono text-sm text-muted-foreground">assembly-ai-bucket</td>
                </tr>
                <tr>
                  <td className="p-4 font-mono text-sm">ASSEMBLYAI_API_KEY</td>
                  <td className="p-4 text-muted-foreground">AssemblyAI API key</td>
                  <td className="p-4 font-mono text-sm text-muted-foreground">your_api_key_here</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Usage Guide */}
        <section id="usage-guide" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Usage Guide</h2>
          </div>
          <Separator className="mb-6" />
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">1</div>
                <h3 className="text-xl font-semibold">Upload Video</h3>
              </div>
              <p className="text-muted-foreground">Click &quot;Upload Video&quot; button on the home page, select an MP4 file from your device, and wait for upload to complete (file is uploaded to S3).</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">2</div>
                <h3 className="text-xl font-semibold">Generate Transcription</h3>
              </div>
              <p className="text-muted-foreground">Navigate to the generator page, click &quot;Auto-generate captions&quot; button, and wait for transcription to complete (this may take a few minutes).</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">3</div>
                <h3 className="text-xl font-semibold">Select Caption Style</h3>
              </div>
              <p className="text-muted-foreground">Choose from 4 available caption styles (TikTok Style, Standard Subtitles, News Bar, Karaoke Highlight). Preview updates in real-time.</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">4</div>
                <h3 className="text-xl font-semibold">Preview Video</h3>
              </div>
              <p className="text-muted-foreground">Use the Remotion Player to preview the video with captions. Scrub through the timeline to see captions at different times.</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">5</div>
                <h3 className="text-xl font-semibold">Render Video</h3>
              </div>
              <p className="text-muted-foreground">Click &quot;Render Video&quot; button, wait for rendering to complete (progress shown in button), and rendered video appears below.</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">6</div>
                <h3 className="text-xl font-semibold">Download Video</h3>
              </div>
              <p className="text-muted-foreground">Click &quot;Download Video&quot; button. File downloads as `Captify_by_Vishal.mp4`.</p>
            </div>
          </div>
        </section>

        {/* API Endpoints */}
        <section id="api-endpoints" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Code className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">API Endpoints</h2>
          </div>
          <Separator className="mb-6" />
          <div className="space-y-8">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">POST <code className="text-sm font-mono bg-muted px-2 py-1 rounded">/api/upload-url</code></h3>
              <p className="text-muted-foreground mb-4">Generates a presigned URL for uploading videos to S3.</p>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Request Body:</h4>
                  <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                    <code>{`{
  "fileName": "video.mp4",
  "fileType": "video/mp4"
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">POST <code className="text-sm font-mono bg-muted px-2 py-1 rounded">/api/transcription</code></h3>
              <p className="text-muted-foreground mb-4">Initiates transcription with AssemblyAI.</p>
              <div>
                <h4 className="font-semibold mb-2">Request Body:</h4>
                <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                  <code>{`{
  "audio_url": "https://s3.amazonaws.com/...",
  "speaker_labels": true,
  "format_text": true,
  "punctuate": true,
  "speech_model": "universal",
  "language_detection": true
}`}</code>
                </pre>
              </div>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">POST <code className="text-sm font-mono bg-muted px-2 py-1 rounded">/api/polling</code></h3>
              <p className="text-muted-foreground mb-4">Polls for transcription status and returns results when complete.</p>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">POST <code className="text-sm font-mono bg-muted px-2 py-1 rounded">/api/render</code></h3>
              <p className="text-muted-foreground mb-4">Renders video with captions (currently returns placeholder).</p>
            </div>
          </div>
        </section>

        {/* Caption Styles */}
        <section id="caption-styles" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Video className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Caption Styles</h2>
          </div>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                name: "TikTok Style",
                id: "tiktok",
                position: "Bottom center",
                text: "Bold, large font",
                background: "Transparent (text shadow for readability)",
                font: "Noto Sans (supports Hinglish)",
                bestFor: "Social media videos, short-form content"
              },
              {
                name: "Standard Subtitles",
                id: "bottom-centered",
                position: "Bottom center",
                text: "White with strong shadow",
                background: "Transparent",
                font: "Noto Sans (supports Hinglish)",
                bestFor: "Professional videos, documentaries"
              },
              {
                name: "News Bar",
                id: "top-bar",
                position: "Top of video",
                text: "White text",
                background: "Transparent bar",
                font: "Noto Sans (supports Hinglish)",
                bestFor: "News videos, informational content"
              },
              {
                name: "Karaoke Highlight",
                id: "karaoke",
                position: "Center",
                text: "Words highlight as they are spoken",
                background: "Transparent with glow effect",
                font: "Noto Sans (supports Hinglish)",
                bestFor: "Music videos, karaoke content"
              }
            ].map((style) => (
              <div key={style.id} className="p-6 rounded-lg border bg-card">
                <h3 className="text-xl font-semibold mb-2">{style.name}</h3>
                <p className="text-sm text-muted-foreground mb-4 font-mono bg-muted px-2 py-1 rounded inline-block">{style.id}</p>
                <div className="space-y-2 text-sm">
                  <p><strong>Position:</strong> <span className="text-muted-foreground">{style.position}</span></p>
                  <p><strong>Text:</strong> <span className="text-muted-foreground">{style.text}</span></p>
                  <p><strong>Background:</strong> <span className="text-muted-foreground">{style.background}</span></p>
                  <p><strong>Font:</strong> <span className="text-muted-foreground">{style.font}</span></p>
                  <p><strong>Best for:</strong> <span className="text-muted-foreground">{style.bestFor}</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Configuration */}
        <section id="configuration" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Configuration</h2>
          </div>
          <Separator className="mb-6" />
          <div className="space-y-6">
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Next.js Configuration</h3>
              <p className="text-muted-foreground mb-4">The project uses webpack (not Turbopack) for Remotion compatibility.</p>
              <pre className="bg-muted p-4 rounded-md text-sm overflow-x-auto">
                <code>{`webpack: (config, { isServer }) => {
  if (!isServer) {
    config.resolve.alias = {
      "@remotion/bundler": false,
      "@remotion/renderer": false,
      "esbuild": false,
    };
  }
}`}</code>
              </pre>
            </div>
            <div className="p-6 rounded-lg border bg-card">
              <h3 className="text-xl font-semibold mb-4">Remotion Configuration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Resolution: 1080x1920 (vertical video)
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Frame Rate: 30 fps
                </li>
                <li className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-primary"></span>
                  Duration: Dynamic (based on video length)
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Troubleshooting */}
        <section id="troubleshooting" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <AlertCircle className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Troubleshooting</h2>
          </div>
          <Separator className="mb-6" />
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="transcription">
              <AccordionTrigger>Transcription Not Starting</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Problem:</strong> AssemblyAI transcription fails to start</p>
                  <p><strong>Solutions:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Verify ASSEMBLYAI_API_KEY is set correctly</li>
                    <li>Check that the video URL is accessible</li>
                    <li>Ensure video format is supported (MP4 recommended)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="captions">
              <AccordionTrigger>Captions Not Appearing</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Problem:</strong> Captions don&apos;t show in preview or rendered video</p>
                  <p><strong>Solutions:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Verify transcription completed successfully</li>
                    <li>Check that words array is not empty</li>
                    <li>Ensure caption style is selected</li>
                    <li>Check browser console for errors</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="upload">
              <AccordionTrigger>Video Upload Fails</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Problem:</strong> Video upload to S3 fails</p>
                  <p><strong>Solutions:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Verify AWS credentials are correct</li>
                    <li>Check S3 bucket permissions</li>
                    <li>Ensure bucket name is correct</li>
                    <li>Verify CORS configuration on S3 bucket</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="rendering">
              <AccordionTrigger>Rendering Takes Too Long</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Problem:</strong> Client-side rendering is slow</p>
                  <p><strong>Solutions:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Use shorter videos for testing</li>
                    <li>Close other browser tabs</li>
                    <li>Consider implementing server-side rendering</li>
                    <li>Check browser performance</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="download">
              <AccordionTrigger>Download Not Working</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Problem:</strong> Download button doesn&apos;t trigger download</p>
                  <p><strong>Solutions:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Check browser console for errors</li>
                    <li>Verify renderedVideoUrl is set</li>
                    <li>Ensure browser allows downloads</li>
                    <li>Check file size (very large files may fail)</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="hinglish">
              <AccordionTrigger>Hinglish Text Not Rendering</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 text-muted-foreground">
                  <p><strong>Problem:</strong> Hindi text appears as boxes or doesn&apos;t render</p>
                  <p><strong>Solutions:</strong></p>
                  <ul className="list-disc ml-6 space-y-1">
                    <li>Verify fonts are loaded (check Network tab)</li>
                    <li>Ensure Noto Sans Devanagari is available</li>
                    <li>Check text encoding in transcription response</li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Future Improvements */}
        <section id="future-improvements" className="mb-16 scroll-mt-20">
          <div className="flex items-center gap-3 mb-6">
            <Zap className="h-6 w-6 text-primary" />
            <h2 className="text-3xl font-bold">Future Improvements</h2>
          </div>
          <Separator className="mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: "Server-Side Rendering", desc: "Implement full Remotion server-side rendering, generate true MP4 files, background job processing" },
              { title: "Additional Caption Styles", desc: "Custom font selection, color customization, position adjustment, animation effects" },
              { title: "Batch Processing", desc: "Upload multiple videos, queue system for rendering, progress tracking for multiple videos" },
              { title: "User Accounts", desc: "Save projects, history of rendered videos, cloud storage integration" },
              { title: "Advanced Features", desc: "Subtitle file export (SRT, VTT), translation support, multiple language captions" },
              { title: "Performance Optimizations", desc: "Video compression options, rendering quality presets, caching for faster previews" },
              { title: "UI/UX Improvements", desc: "Drag-and-drop upload, timeline editor for captions, real-time caption editing" },
            ].map((item, i) => (
              <div key={i} className="p-6 rounded-lg border bg-card">
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              Captify Documentation - Complete guide to video captioning application
            </p>
            <Link href="https://captify-neon.vercel.app/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

