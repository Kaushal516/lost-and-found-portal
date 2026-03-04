/**
 * Utility to extract searchable tags from a title and description.
 * It removes punctuation, stop words, and returns an array of unique lowercase tokens.
 */

const STOP_WORDS = new Set([
    "i", "me", "my", "myself", "we", "our", "ours", "ourselves", "you", "your",
    "yours", "yourself", "yourselves", "he", "him", "his", "himself", "she",
    "her", "hers", "herself", "it", "its", "itself", "they", "them", "their",
    "theirs", "themselves", "what", "which", "who", "whom", "this", "that",
    "there", "these", "those", "am", "is", "are", "was", "were", "be", "been",
    "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a",
    "an", "the", "and", "but", "if", "or", "because", "as", "until", "while",
    "of", "at", "by", "for", "with", "about", "against", "between", "into",
    "through", "during", "before", "after", "above", "below", "to", "from",
    "up", "down", "in", "out", "on", "off", "over", "under", "again", "further",
    "then", "once", "here", "there", "when", "where", "why", "how", "all", "any",
    "both", "each", "few", "more", "most", "other", "some", "such", "no", "nor",
    "not", "only", "own", "same", "so", "than", "too", "very", "s", "t", "can",
    "will", "just", "don", "should", "now", "lost", "found"
]);

export const extractTags = (title = "", description = "") => {
    const combinedText = `${title} ${description}`.toLowerCase();

    // Remove punctuation and special characters, keep only alphanumerics and spaces
    const cleanText = combinedText.replace(/[^a-z0-9\s]/g, " ");

    // Split into tokens
    const tokens = cleanText.split(/\s+/).filter(Boolean);

    // Filter out stop words and short numeric strings
    const validTokens = tokens.filter(token => {
        // Ignore pure numbers unless they are explicitly meaningful, 
        // but for simplicity we'll just ignore common stop words and very short words
        return !STOP_WORDS.has(token) && token.length > 2;
    });

    // Return unique tags, limited to 8 to avoid DB bloat
    const uniqueTags = [...new Set(validTokens)];
    return uniqueTags.slice(0, 8);
};
