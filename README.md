# Reelive-android-app

Build an iOS-first app (to be wrapped with Capacitor and deployed via Xcode) focused on capturing life progress through ultra-short daily videos.
🌱 Core Concept
The app helps users document meaningful life journeys using 1–2 second daily video clips, which are later compiled into weekly, monthly, and yearly highlight videos.
Primary use cases:
Parenting / children growth
Weight loss & fitness journeys
Pregnancy journey
Personal goals (users can create custom journeys)
The emotional goal of the app is to turn tiny daily moments into powerful visual stories over time.
👤 User & Account Structure
User authentication (email + password, Apple Sign-In ready)
Each user can create multiple “Journeys”
A Journey can be:
Child profile (name, DOB, optional photo)
Weight loss journey
Pregnancy journey
Custom goal (user-defined name & description)
Each Journey is independent and has its own video timeline.
📸 Daily Video Capture
For each Journey, users can:
Record 1–2 second video clips daily
Upload from camera only (no long videos)
Enforce a soft limit (max 2–3 clips per day per journey)
Show a daily reminder prompt like: “Capture today’s moment”
🗓 Timeline & Organization
For each Journey:
Daily clips appear in a chronological timeline
Group clips automatically by:
Day
Week
Month
Year
⭐ Weekly Highlights
At the end of each week:
Show all clips recorded that week
Allow the user to select “Best of the Week” clips
Selected clips are marked as highlights
🎬 Monthly Video Generation
At the end of each month:
Automatically compile:
A 30-second Monthly Video using weekly highlights
Also generate:
A 4-second “Best Moment of the Month” video
Allow manual trigger for video generation
Provide preview before export
🏆 Yearly Video Generation
Combine monthly highlights into:
A Yearly Highlight Video
Available only after enough data exists
Clearly show progress over time visually
🎯 Custom Goals
Users can create their own journeys:
Name
Goal type
Optional notes
Works exactly like parenting / weight loss journeys
📱 Core Screens (UI Priority)
Onboarding
Explain concept in 2–3 screens
Emotional storytelling tone
Home / Journeys Dashboard
List all journeys
Show last captured date
“Record Today” CTA
Journey Detail Screen
Timeline view
Record button
Weekly / Monthly tabs
Weekly Selection Screen
Grid of clips
Select best moments
Monthly / Yearly Video Preview
Video player
Export & share button
Profile / Settings
Notifications
Subscription (future)
Account management
🔔 Notifications
Daily reminder to record a clip
Weekly reminder to select highlights
Monthly reminder to generate video
🧠 UX Principles
Extremely simple
Minimal taps to record
Emotion-first design
Soft colors, calm UI
Designed primarily for moms but inclusive for all users

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://life-moment-capsule.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/0cb3df2c-192c-475b-8ba2-020cad72ccde).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
