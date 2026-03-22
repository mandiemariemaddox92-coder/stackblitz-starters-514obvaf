SoulGem clean sweep notes

What was rebuilt
- Central app state was rewritten into a single coherent localStorage-backed store.
- Login/signup, navigation, notifications, messages, profile editing, top friends, comments, posting, discover, creator hub, reel lanes, moderation purgatory, and the guidelines quiz were wired into one consistent flow.
- Profile song upload now stores audio as a local data URL in browser storage, so it persists locally after reload.
- AI-free reels now use a realistic client-side moderation gate: attestation plus simple suspicious-term checks, with blocked uploads routed away from the human-only lane.
- AI contest uploads are separate and votable.

Important constraints
- This sweep is a functional client-side demo architecture, not a production multi-user backend.
- Messaging, votes, and uploads persist in the browser that used them. They are not shared across devices/users yet.
- Browser autoplay policies may block automatic profile-song playback. The uploaded song is still saved and playable.
- Music/video/image editing controls in Creator Hub are represented as structured product/UI flows and roadmap controls. Full waveform/video processing would require dedicated browser libraries and/or backend media services.
- AI detection cannot be guaranteed perfectly on the client. The current implementation uses policy attestation and flagging, which is honest and realistic.

Best next production steps
1. Add Supabase tables for profiles, posts, conversations, messages, comments, notifications, reels, votes, moderation actions, and challenge joins.
2. Move file uploads to Supabase Storage.
3. Add authenticated row-level security and real user accounts.
4. Add moderation dashboards and human review queues.
5. Add dedicated media-processing libraries or services for audio/video editing.
