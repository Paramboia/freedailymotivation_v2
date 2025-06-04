# Google Analytics Tracking Implementation

This document outlines the Google Analytics tracking events implemented across the Free Daily Motivation website.

## Overview

The website uses both Google Tag Manager (GTM) and Google Analytics 4 (GA4) for comprehensive tracking. The tracking is implemented through a custom analytics utility (`lib/analytics.ts`) that provides a consistent interface for tracking various user interactions.

## Tracked Events

### 1. Theme Changes
- **Event**: `theme_change`
- **Category**: `UI_Interaction`
- **Trigger**: When users toggle between light and dark mode
- **Component**: `components/theme-toggle.tsx`
- **Additional Data**: `theme_mode` (light/dark)

### 2. CTA Button Clicks
- **Event**: `cta_click`
- **Category**: `CTA_Interaction`
- **Triggers**:
  - "Find Quotes" button on home page
  - "Find Quotes" button in header navigation
  - "Find Quotes" button on favorite quotes page
  - "Famous Quotes" navigation button
  - "Favorite Quotes" navigation button
  - "Sign In" buttons across various locations
- **Additional Data**: `cta_location` (page/component location)

### 3. Quote Card Interactions
- **Event**: `quote_interaction`
- **Category**: `Quote_Actions`
- **Triggers**:
  - `get_new_quote`: When users click the refresh button to get a new quote
  - `like`: When users like/unlike a quote
  - `copy`: When users copy a quote to clipboard
  - `share`: When users share a quote
- **Component**: `components/quote-box.tsx`
- **Additional Data**: `quote_id`, `quote_author`

### 4. Authentication Events
- **Event**: `auth_action`
- **Category**: `Authentication`
- **Triggers**:
  - `sign_in`: When users successfully sign in
  - `sign_up`: When users complete registration
  - `sign_out`: When users sign out
- **Component**: `components/AuthComponent.tsx`

### 5. Category Selection
- **Event**: `category_select`
- **Category**: `Navigation`
- **Triggers**: When users select or deselect quote categories
- **Component**: `components/category-buttons.tsx`
- **Additional Data**: `action_type` (select/deselect), `category_name`

## Implementation Details

### Analytics Utility (`lib/analytics.ts`)
The analytics utility provides:
- **Dual tracking**: Sends events to both GTM dataLayer and GA4 gtag
- **Error handling**: Graceful degradation if tracking fails
- **Type safety**: TypeScript definitions for all tracking functions
- **Flexible parameters**: Support for custom event parameters

### Usage Example
```typescript
import { analytics } from "@/lib/analytics";

// Track a theme change
analytics.trackThemeChange('dark');

// Track a CTA click
analytics.trackCTAClick('Find Quotes', 'Home Page');

// Track a quote action
analytics.trackQuoteAction('like', quoteId, author);
```

## Setup Requirements

### Google Tag Manager
- GTM Container ID: `GTM-PQ8LSCWN`
- Implemented in `app/layout.tsx`

### Google Analytics 4
- Measurement ID: `G-PPZFSY342J`
- gtag implementation in `app/layout.tsx`

## Event Structure

All events follow a consistent structure:
```javascript
{
  event: 'custom_event',
  event_action: 'action_name',
  event_category: 'category_name',
  event_label: 'label_value',
  event_value: 'numeric_value',
  // Additional custom parameters
}
```

## Testing

To verify tracking is working:
1. Open browser developer tools
2. Go to Console tab
3. Events will be logged (in development mode)
4. Check GTM Preview mode or GA4 DebugView for real-time event verification

## Maintenance

When adding new tracking events:
1. Add the tracking function to `lib/analytics.ts`
2. Import and call the function in the relevant component
3. Update this documentation
4. Test the implementation

## Notes

- All tracking is client-side only (`"use client"` components)
- Events are batched and sent efficiently to avoid performance impact
- Privacy-friendly: No personally identifiable information is tracked
- Graceful degradation: Site functionality is not affected if tracking fails 