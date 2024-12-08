declare module "#app" {
  interface PageMeta {
    action?: string;
    subject?: string;
    layoutWrapperClasses?: string;
    navActiveLink?: RouteLocationRaw;

    unauthenticatedOnly?: boolean;
    public?: boolean;

    headerTools?: any;
  }
}

// It is always important to ensure you import/export something when augmenting a type
export {};
