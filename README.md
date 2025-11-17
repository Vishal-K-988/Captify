# Captify - Video Captioning Application Documentation

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Installation & Setup](#installation--setup)
5. [Environment Variables](#environment-variables)
6. [Project Structure](#project-structure)
7. [Usage Guide](#usage-guide)
8. [API Endpoints](#api-endpoints)
9. [Caption Styles](#caption-styles)
10. [Configuration](#configuration)
11. [Troubleshooting](#troubleshooting)
12. [Future Improvements](#future-improvements)

---

## 🎯 Project Overview

**Captify** is a modern web application that automatically generates and overlays captions on video files. It uses AssemblyAI for speech-to-text transcription and Remotion for video rendering with customizable caption styles. The application supports multiple caption styles, Hinglish (Hindi + English) text rendering, and both client-side and server-side video rendering.

### Key Capabilities

- **Automatic Transcription**: Uses AssemblyAI API for accurate speech-to-text conversion
- **Multiple Caption Styles**: 4 predefined caption styles (TikTok, Bottom-Centered, Top-Bar, Karaoke)
- **Hinglish Support**: Renders mixed Hindi (Devanagari) and English text correctly
- **Video Rendering**: Client-side rendering with canvas overlay and audio capture
- **Download Support**: Export rendered videos as MP4 files
- **Real-time Preview**: Live preview using Remotion Player

---

##  Features

### Core Features

1. **Video Upload**
   - Upload MP4 files from local device
   - Secure upload to AWS S3 using presigned URLs
   - Support for various video formats

2. **Auto-Captioning**
   - One-click transcription using AssemblyAI
   - Word-level timing information
   - Speaker labels support
   - Language detection with code-switching support

3. **Caption Style Presets**
   - **TikTok Style**: Bottom-centered with bold text, transparent background
   - **Standard Subtitles**: Bottom-centered with white text and shadow
   - **News Bar**: Semi-transparent bar at the top
   - **Karaoke Highlight**: Words highlight as they are spoken

4. **Hinglish Support**
   - Proper rendering of mixed Hindi (Devanagari script) and English
   - Uses Noto Sans and Noto Sans Devanagari fonts
   - Correct text alignment and encoding

5. **Video Preview**
   - Real-time preview with Remotion Player
   - Frame-accurate caption timing
   - Interactive playback controls

6. **Video Rendering**
   - Client-side rendering with canvas overlay
   - Audio capture and synchronization
   - Progress tracking during rendering
   - Export as MP4 format

7. **Download Functionality**
   - Download rendered videos as MP4 files
   - Automatic filename: `Captify_by_Vishal.mp4`
   - Support for blob URLs, data URLs, and regular URLs

---

##  Tech Stack

### Frontend
- **Next.js 16.0.3** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Zustand 5.0.8** - State management
- **Remotion 4.0.375** - Video rendering library
- **Motion 12.23.24** - Animation library

### Backend
- **Next.js API Routes** - Server-side endpoints
- **AWS SDK v3** - S3 integration
- **AssemblyAI 4.19.0** - Speech-to-text API

### Key Libraries
- **@remotion/player** - Video preview player
- **@remotion/bundler** - Server-side rendering (optional)
- **@remotion/renderer** - Video rendering (optional)
- **axios** - HTTP client
- **lucide-react** - Icons

---

##  Installation & Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- AWS S3 bucket with appropriate permissions
- AssemblyAI API key
- FFmpeg (for server-side rendering, optional)

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd catfy
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_S3_BUCKET_NAME=your_bucket_name
   ASSEMBLYAI_API_KEY=your_assemblyai_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

---

##  Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `AWS_ACCESS_KEY_ID` | AWS access key for S3 | `AKIAIOSFODNN7EXAMPLE` |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key for S3 | `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY` |
| `AWS_REGION` | AWS region for S3 bucket | `ap-northeast-3` |
| `AWS_S3_BUCKET_NAME` | S3 bucket name | `assembly-ai-bucket` |
| `ASSEMBLYAI_API_KEY` | AssemblyAI API key | `your_api_key_here` |

### Optional Variables

- `NODE_ENV` - Environment mode (development/production)
- `NEXT_PUBLIC_*` - Public environment variables accessible in client

---

## Project Structure

```
catfy/
├── app/                          # Next.js App Router directory
│   ├── api/                      # API routes
│   │   ├── polling/              # Transcription polling endpoint
│   │   ├── render/               # Video rendering endpoint
│   │   ├── transcription/       # Transcription initiation endpoint
│   │   └── upload-url/           # S3 presigned URL generation
│   ├── componentss/              # Custom components
│   │   ├── FileUpload.tsx        # File upload component
│   │   ├── Video.tsx             # Video player component
│   │   └── ...
│   ├── dashboard/                # Dashboard page
│   ├── generator/                # Video generation page
│   │   ├── assembly.tsx          # Main caption generation component
│   │   └── page.tsx              # Generator page wrapper
│   ├── store/                    # State management
│   │   └── uploadStore.ts        # Zustand store
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── remotion/                     # Remotion compositions
│   ├── VideoWithCaptions.tsx     # Main video composition
│   ├── TikTokCaption.tsx         # TikTok-style captions
│   ├── BottomCenteredCaption.tsx # Standard subtitles
│   ├── TopBarCaption.tsx         # News bar style
│   ├── KaraokeCaption.tsx        # Karaoke highlighting
│   ├── CaptionStyles.ts          # Caption style definitions
│   ├── Root.tsx                  # Remotion root component
│   ├── fonts.ts                  # Font configuration
│   └── index.tsx                  # Remotion entry point
├── components/                   # Shared UI components
├── lib/                          # Utility functions
├── public/                       # Static assets
├── next.config.ts                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## Usage Guide

### Step-by-Step Workflow

1. **Upload Video**
   - Click "Upload Video" button on the home page
   - Select an MP4 file from your device
   - Wait for upload to complete (file is uploaded to S3)

2. **Generate Transcription**
   - Navigate to the generator page
   - Click "Auto-generate captions" button
   - Wait for transcription to complete (this may take a few minutes)

3. **Select Caption Style**
   - Choose from 4 available caption styles:
     - TikTok Style
     - Standard Subtitles
     - News Bar
     - Karaoke Highlight
   - Preview updates in real-time

4. **Preview Video**
   - Use the Remotion Player to preview the video with captions
   - Scrub through the timeline to see captions at different times
   - Verify caption timing and appearance

5. **Render Video**
   - Click "Render Video" button
   - Wait for rendering to complete (progress shown in button)
   - Rendered video appears below

6. **Download Video**
   - Click "Download Video" button
   - File downloads as `Captify_by_Vishal.mp4`

### Keyboard Shortcuts

- **Space**: Play/Pause (in Remotion Player)
- **Arrow Keys**: Seek forward/backward
- **M**: Mute/Unmute

---

##  API Endpoints

### POST `/api/upload-url`

Generates a presigned URL for uploading videos to S3.

**Request Body:**
```json
{
  "fileName": "video.mp4",
  "fileType": "video/mp4"
}
```

**Response:**
```json
{
  "uploadURL": "https://s3.amazonaws.com/...",
  "getURL": "https://s3.amazonaws.com/..."
}
```

### POST `/api/transcription`

Initiates transcription with AssemblyAI.

**Request Body:**
```json
{
  "audio_url": "https://s3.amazonaws.com/...",
  "speaker_labels": true,
  "format_text": true,
  "punctuate": true,
  "speech_model": "universal",
  "language_detection": true,
  "language_detection_options": {
    "code_switching": true,
    "code_switching_confidence_threshold": 0.5
  }
}
```

**Response:**
```json
{
  "id": "transcription_id"
}
```

### POST `/api/polling`

Polls for transcription status and returns results when complete.

**Request Body:**
```json
{
  "id": "transcription_id"
}
```

**Response (Completed):**
```json
{
  "text": "Full transcription text",
  "words": [
    {
      "start": 0.5,
      "end": 1.2,
      "text": "Hello",
      "confidence": 0.95,
      "speaker": "A"
    }
  ],
  "status": "completed"
}
```

### POST `/api/render`

Renders video with captions (currently returns placeholder).

**Request Body:**
```json
{
  "videoUrl": "https://s3.amazonaws.com/...",
  "words": [...],
  "duration": 25.78,
  "captionStyle": "tiktok"
}
```

**Response:**
```json
{
  "message": "Rendering endpoint configured...",
  "videoUrl": null,
  "progress": 100
}
```

---

## Caption Styles

### 1. TikTok Style (`tiktok`)

- **Position**: Bottom center
- **Text**: Bold, large font
- **Background**: Transparent (text shadow for readability)
- **Font**: Noto Sans (supports Hinglish)
- **Best for**: Social media videos, short-form content

### 2. Standard Subtitles (`bottom-centered`)

- **Position**: Bottom center
- **Text**: White with strong shadow
- **Background**: Transparent
- **Font**: Noto Sans (supports Hinglish)
- **Best for**: Professional videos, documentaries

### 3. News Bar (`top-bar`)

- **Position**: Top of video
- **Text**: White text
- **Background**: Transparent bar
- **Font**: Noto Sans (supports Hinglish)
- **Best for**: News videos, informational content

### 4. Karaoke Highlight (`karaoke`)

- **Position**: Center
- **Text**: Words highlight as they are spoken
- **Background**: Transparent with glow effect
- **Font**: Noto Sans (supports Hinglish)
- **Best for**: Music videos, karaoke content

---

##  Configuration

### Next.js Configuration (`next.config.ts`)

The project uses webpack (not Turbopack) for Remotion compatibility:

```typescript
webpack: (config, { isServer }) => {
  // Exclude server-only packages from client bundle
  if (!isServer) {
    config.resolve.alias = {
      "@remotion/bundler": false,
      "@remotion/renderer": false,
      "esbuild": false,
    };
  }
  // ... additional webpack config
}
```

### Remotion Configuration

Remotion compositions are defined in `remotion/Root.tsx`:

- **Resolution**: 1080x1920 (vertical video)
- **Frame Rate**: 30 fps
- **Duration**: Dynamic (based on video length)

### Font Configuration

Hinglish support is configured in `remotion/fonts.ts`:

```typescript
export const HINGLISH_FONT_FAMILY = 
  '"Noto Sans Devanagari", "Noto Sans", sans-serif';
```

Fonts are loaded in `app/layout.tsx` using Next.js font optimization.

---

## Troubleshooting

### Common Issues

#### 1. **Transcription Not Starting**

**Problem**: AssemblyAI transcription fails to start

**Solutions**:
- Verify `ASSEMBLYAI_API_KEY` is set correctly
- Check that the video URL is accessible
- Ensure video format is supported (MP4 recommended)

#### 2. **Captions Not Appearing**

**Problem**: Captions don't show in preview or rendered video

**Solutions**:
- Verify transcription completed successfully
- Check that `words` array is not empty
- Ensure caption style is selected
- Check browser console for errors

#### 3. **Video Upload Fails**

**Problem**: Video upload to S3 fails

**Solutions**:
- Verify AWS credentials are correct
- Check S3 bucket permissions
- Ensure bucket name is correct
- Verify CORS configuration on S3 bucket

#### 4. **Rendering Takes Too Long**

**Problem**: Client-side rendering is slow

**Solutions**:
- Use shorter videos for testing
- Close other browser tabs
- Consider implementing server-side rendering
- Check browser performance

#### 5. **Download Not Working**

**Problem**: Download button doesn't trigger download

**Solutions**:
- Check browser console for errors
- Verify `renderedVideoUrl` is set
- Ensure browser allows downloads
- Check file size (very large files may fail)

#### 6. **Hinglish Text Not Rendering**

**Problem**: Hindi text appears as boxes or doesn't render

**Solutions**:
- Verify fonts are loaded (check Network tab)
- Ensure `Noto Sans Devanagari` is available
- Check text encoding in transcription response

### Browser Compatibility

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (may have audio capture limitations)
- **Mobile Browsers**: Limited support for rendering (preview works)

---

##  Future Improvements

### Planned Features

1. **Server-Side Rendering**
   - Implement full Remotion server-side rendering
   - Generate true MP4 files (not WebM)
   - Background job processing

2. **Additional Caption Styles**
   - Custom font selection
   - Color customization
   - Position adjustment
   - Animation effects

3. **Batch Processing**
   - Upload multiple videos
   - Queue system for rendering
   - Progress tracking for multiple videos

4. **User Accounts**
   - Save projects
   - History of rendered videos
   - Cloud storage integration

5. **Advanced Features**
   - Subtitle file export (SRT, VTT)
   - Translation support
   - Multiple language captions
   - Custom timing adjustments

6. **Performance Optimizations**
   - Video compression options
   - Rendering quality presets
   - Caching for faster previews

7. **UI/UX Improvements**
   - Drag-and-drop upload
   - Timeline editor for captions
   - Real-time caption editing
   - Preview thumbnails

---

##  Development Notes

### Important Files

- **`app/generator/assembly.tsx`**: Main caption generation and rendering logic
- **`remotion/VideoWithCaptions.tsx`**: Remotion composition for video with captions
- **`app/store/uploadStore.ts`**: Global state management
- **`app/api/transcription/route.ts`**: AssemblyAI integration

### Code Style

- TypeScript strict mode enabled
- ESLint for code quality
- Prettier for formatting (if configured)
- Component-based architecture

### Testing

Currently, manual testing is used. Consider adding:
- Unit tests for utility functions
- Integration tests for API routes
- E2E tests for user workflows

---


