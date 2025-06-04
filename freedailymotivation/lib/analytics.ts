declare global {
  interface Window {
    dataLayer: Record<string, any>[];
    gtag: (...args: any[]) => void;
  }
}

// Google Analytics 4 event tracking
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number,
  customParameters?: Record<string, any>
) => {
  try {
    if (typeof window !== 'undefined' && window.gtag) {
      const eventData: Record<string, any> = {
        event_category: category,
        event_label: label,
        value: value,
        ...customParameters,
      };

      // Remove undefined values
      Object.keys(eventData).forEach(key => {
        if (eventData[key] === undefined) {
          delete eventData[key];
        }
      });

      window.gtag('event', action, eventData);
    }

    // Also push to dataLayer for GTM
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'custom_event',
        event_action: action,
        event_category: category,
        event_label: label,
        event_value: value,
        ...customParameters,
      });
    }
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }
};

// Specific tracking functions for different user actions
export const analytics = {
  // Theme change tracking
  trackThemeChange: (theme: 'light' | 'dark') => {
    trackEvent('theme_change', 'UI_Interaction', theme, undefined, {
      theme_mode: theme,
    });
  },

  // CTA button clicks
  trackCTAClick: (ctaName: string, location?: string) => {
    trackEvent('cta_click', 'CTA_Interaction', ctaName, undefined, {
      cta_location: location,
    });
  },

  // Quote card interactions
  trackQuoteAction: (action: 'get_new_quote' | 'like' | 'copy' | 'share', quoteId?: string | number, author?: string) => {
    trackEvent('quote_interaction', 'Quote_Actions', action, undefined, {
      quote_id: quoteId,
      quote_author: author,
    });
  },

  // Authentication events
  trackAuth: (action: 'sign_in' | 'sign_up' | 'sign_out') => {
    trackEvent('auth_action', 'Authentication', action);
  },

  // Category selection
  trackCategorySelection: (category: string, isDeselected?: boolean) => {
    trackEvent('category_select', 'Navigation', category, undefined, {
      action_type: isDeselected ? 'deselect' : 'select',
      category_name: category,
    });
  },

  // Page navigation
  trackPageView: (pageName: string, additionalParams?: Record<string, any>) => {
    trackEvent('page_view', 'Navigation', pageName, undefined, {
      page_name: pageName,
      ...additionalParams,
    });
  },
};

export default analytics; 