import cs from "./cs.json" with { type: "json" };

/**
 * Everyday layout work and tests use only the primary locale.
 * Additional locales belong in sibling JSON files and are reviewed once, before release.
 */
export const PRIMARY_LOCALE = "cs" as const;

export const messages = cs;
