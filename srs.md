Software Requirements Specification: Karen's WebHouse
1. Project Overview
Project Name: Karen's WebHouse
Version: 1.0
Date: November 3, 2025
Purpose: A web application that provides sarcastic, entertaining website critiques through an AI agent named Karen, powered by ElevenLabs voice technology and Claude Sonnet vision analysis.

2. System Architecture
2.1 Technology Stack
Frontend:
React.js or Next.js
Tailwind CSS for styling
HTML5 Canvas or SVG for annotation overlays
WebSocket or Server-Sent Events for real-time communication
Backend:
Node.js with Express.js
Puppeteer for website screenshots
Anthropic Claude Sonnet API for vision analysis
ElevenLabs Conversational AI API for voice agent integration
Infrastructure:
Serverless functions or dedicated server with sufficient resources for Puppeteer
Secure API key management
CORS-enabled endpoints

3. Functional Requirements
3.1 Splash Page (Initial Interface)
FR-1.1: Display a centered input field for URL entry
FR-1.2: Include prominent "Roast My Website" submit button
FR-1.3: Validate URL format before submission (must be valid http/https URL)
FR-1.4: Display error message for invalid URLs
FR-1.5: Show Karen's branding/personality through UI design (sarcastic tagline, attitude-filled copy)
3.2 Backend Screenshot & Analysis Pipeline
FR-2.1: Accept URL from frontend via POST request
FR-2.2: Use Puppeteer to:
Navigate to the provided URL
Wait for page load (with reasonable timeout: 15-30 seconds)
Set viewport to standard desktop resolution (1920x1080)
Capture full-page screenshot
Handle errors (page not found, timeout, etc.)
FR-2.3: Send screenshot to Claude Sonnet Vision API with specialized prompt:
Analyze UI/UX design flaws
Identify poor color choices, typography issues, layout problems
Note accessibility concerns
Detect outdated design patterns
Evaluate visual hierarchy and spacing
Provide specific coordinates/regions for problematic areas
Return analysis in structured JSON format
FR-2.4: Structure the analysis response:
{
  "overall_rating": "1-10",
  "roast_summary": "sarcastic overview",
  "design_flaws": [
    {
      "issue": "description",
      "severity": "low|medium|high|critical",
      "coordinates": {"x": 0, "y": 0, "width": 0, "height": 0},
      "roast": "snarky comment about this specific issue"
    }
  ],
  "recommendations": ["actionable fixes"]
}

3.3 ElevenLabs Agent Integration
FR-3.1: Initialize ElevenLabs Conversational AI agent on page load
FR-3.2: Configure agent with Karen persona:
Sarcastic, brutally honest personality
Interruption-resistant behavior
Pre-roast phrases during analysis wait time
Context-aware responses based on analysis results
FR-3.3: Pre-Analysis Interaction:
Agent greets user with snarky comment
Agent makes assumptions about website quality ("I'm sure your website sucks")
Agent responds to user questions with dismissive humor
Agent provides countdown/status updates sarcastically
FR-3.4: Post-Analysis Interaction:
Agent receives structured analysis from Claude
Agent narrates design flaws with personality
Agent references specific circled areas during narration
Agent deflects/roasts user interruptions
Agent maintains context throughout conversation
FR-3.5: Implement interruption handling:
Detect when user tries to interrupt
Trigger interruption-specific roasts
Continue main roast after brief interruption response
3.4 Visual Annotation System
FR-4.1: Display website screenshot in main viewing area
FR-4.2: Overlay interactive canvas/SVG layer on screenshot
FR-4.3: Draw circles/highlights around problematic areas based on coordinates from analysis
FR-4.4: Color-code annotations by severity:
Red: Critical issues
Orange: High severity
Yellow: Medium severity
Blue: Low severity
FR-4.5: Synchronize visual annotations with Karen's narration:
Highlight current issue being discussed
Animate/pulse active annotation
Dim previously discussed issues
FR-4.6: Allow users to click annotations to:
Replay Karen's comment about that specific issue
View detailed explanation
See recommendation for fixing
3.5 Final Report Generation
FR-5.1: Generate comprehensive PDF or web-based report containing:
Overall website rating/score
Screenshot with all annotations
Categorized list of issues (by severity)
Detailed explanations for each flaw
Actionable recommendations
Positive aspects (if any)
Before/after suggestions
FR-5.2: Provide download button for report
FR-5.3: Option to share report via unique URL
FR-5.4: Include Karen's signature sarcastic summary at top
3.6 User Session Management
FR-6.1: Support multiple roast sessions per user
FR-6.2: Maintain conversation history during active session
FR-6.3: Allow users to restart/submit new URL
FR-6.4: Optional: Save roast history (requires authentication)

4. Non-Functional Requirements
4.1 Performance
NFR-1.1: Screenshot capture and analysis must complete within 60 seconds
NFR-1.2: Voice agent must respond within 2 seconds of user input
NFR-1.3: Frontend must be responsive and load within 3 seconds
NFR-1.4: Support concurrent roast sessions (at least 10 simultaneous users)
4.2 Security
NFR-2.1: Sanitize all URL inputs to prevent injection attacks
NFR-2.2: Implement rate limiting (max 5 roasts per IP per hour)
NFR-2.3: Secure API keys using environment variables
NFR-2.4: Implement HTTPS for all communications
NFR-2.5: Prevent screenshotting of sensitive/internal URLs (whitelist approach or content-based blocking)
4.3 Reliability
NFR-3.1: Graceful error handling for:
Invalid/unreachable URLs
API failures (Claude, ElevenLabs)
Puppeteer timeouts
Network issues
NFR-3.2: Provide user-friendly error messages in Karen's voice/personality
NFR-3.3: Implement retry logic for transient failures
4.4 Usability
NFR-4.1: Mobile-responsive design (though primary experience is desktop)
NFR-4.2: Intuitive UI requiring no instructions
NFR-4.3: Clear visual feedback during loading/processing states
NFR-4.4: Accessible color contrasts and readable fonts
4.5 Scalability
NFR-5.1: Architecture should support horizontal scaling
NFR-5.2: Consider queue system for handling multiple screenshot requests
NFR-5.3: Implement caching for previously analyzed websites (optional)

5. API Specifications
5.1 Backend Endpoints
POST /api/roast
Input: { "url": "https://example.com" }
Output: { "sessionId": "uuid", "status": "processing" }
Initiates roast process
GET /api/roast/:sessionId/status
Output: { "status": "processing|complete|error", "progress": 0-100 }
Polls for analysis completion
GET /api/roast/:sessionId/results
Output: Complete analysis JSON with screenshot URL and annotations
Returns when analysis is complete
GET /api/roast/:sessionId/screenshot
Output: Image file (PNG/JPEG)
Serves captured screenshot
POST /api/roast/:sessionId/report
Output: PDF download or report URL
Generates final report
5.2 ElevenLabs Agent Configuration
Agent Persona Prompt:
You are Karen, a brutally honest website critic with zero filter. 
You roast websites with sarcastic, witty commentary. You're impatient, 
dismissive of excuses, and hilariously mean while being technically accurate. 
When users interrupt you, you roast them for it and continue. You reference 
specific design flaws with visual annotations during your critique.

Context Variables:
website_url: URL being analyzed
analysis_complete: Boolean
design_flaws: Array of flaw objects
current_flaw_index: Which flaw is being discussed

6. User Interface Wireframes
6.1 Splash Page
+------------------------------------------+
|              KAREN'S WEBHOUSE            |
|        "Your website probably sucks"     |
|                                          |
|  +------------------------------------+  |
|  | Enter website URL...               |  |
|  +------------------------------------+  |
|           [ROAST MY WEBSITE]             |
|                                          |
+------------------------------------------+

6.2 Analysis Screen
+------------------------------------------+
| [Karen Avatar/Waveform]   Status: 47%    |
+------------------------------------------+
|                                          |
|    [Screenshot Area with Annotations]    |
|          (circled problem areas)         |
|                                          |
+------------------------------------------+
| Karen: "Oh honey, where do I even       |
| start with this hot mess..."            |
|                                          |
| [Microphone for user input]             |
+------------------------------------------+

6.3 Final Report View
+------------------------------------------+
| Overall Score: 3/10 💀                   |
+------------------------------------------+
|  [Annotated Screenshot]                  |
|                                          |
| Critical Issues (4):                     |
|  🔴 Comic Sans in header - Are you 12?  |
|  🔴 Broken responsive design             |
|                                          |
| [Download Report] [Roast Another Site]   |
+------------------------------------------+


7. Development Phases
Phase 1: MVP (Core Functionality)
Splash page with URL input
Puppeteer screenshot capture
Claude vision analysis integration
Basic annotation display
Text-based roast output (no voice initially)
Phase 2: Voice Integration
ElevenLabs agent integration
Pre-roast banter during analysis
Narrated design critique
Interruption handling
Phase 3: Enhanced UX
Synchronized annotation highlighting
Animated transitions
Polished Karen personality
Report generation
Phase 4: Polish & Scale
Performance optimization
Caching layer
Rate limiting
Analytics/usage tracking
Social sharing features

8. Testing Requirements
8.1 Test Cases
TC-1: Valid URL submission triggers analysis
TC-2: Invalid URL shows appropriate error
TC-3: Screenshot captures within timeout period
TC-4: Claude returns structured analysis with coordinates
TC-5: Annotations appear at correct positions
TC-6: ElevenLabs agent maintains personality
TC-7: Interruption triggers roast response
TC-8: Report generates with all sections
TC-9: Multiple concurrent sessions work independently
TC-10: Error states display user-friendly messages
8.2 Edge Cases
Extremely slow-loading websites
Websites with authentication walls
Responsive/mobile-only sites
Websites that block Puppeteer/automation
Non-English websites
Websites with NSFW content
Single-page applications with heavy JavaScript

9. Deployment Requirements
ENV-1: Environment variables needed:
ANTHROPIC_API_KEY
ELEVENLABS_API_KEY
ELEVENLABS_AGENT_ID
NODE_ENV
MAX_CONCURRENT_ROASTS
ENV-2: Server requirements:
Node.js 18+
Sufficient RAM for Puppeteer (minimum 2GB)
Disk space for temporary screenshots
ENV-3: Monitoring:
API usage tracking
Error rate monitoring
Response time metrics
User session analytics

10. Future Enhancements
Mobile app version
Before/after comparison mode
Website redesign suggestions with mockups
Competitor comparison roasts
Karen's "Hall of Shame" for worst websites
Gamification: website score leaderboard
Integration with design tools (Figma export suggestions)
Multi-language support for international roasting

11. Success Metrics
Average session duration
Completion rate (users who finish full roast)
Report downloads
Social shares
Return user rate
Average websites roasted per user

12. Appendix
A. Glossary
Roast: Humorous, sarcastic critique of website design
Karen: AI agent persona delivering website critiques
Annotation: Visual marker highlighting design flaws on screenshot
B. References
ElevenLabs Conversational AI Documentation
Anthropic Claude API Documentation
Puppeteer Documentation
C. Document History
Version
Date
Author
Changes
1.0
Nov 3, 2025
Initial
Complete SRS creation


End of Document
This SRS provides comprehensive specifications for an LLM or development team to implement Karen's WebHouse with all core features and considerations for scalability and user experience.

