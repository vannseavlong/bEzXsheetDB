const HTML_TEMPLATE = (bodyContent: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>bEasy Campaign</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 15px;
      line-height: 1.6;
      color: #222;
      padding: 16px;
      margin: 0;
    }
    h2 { font-size: 20px; font-weight: 700; margin-bottom: 8px; }
    h3 { font-size: 16px; font-weight: 600; margin-top: 20px; margin-bottom: 6px; }
    p { margin: 8px 0; }
    ul { padding-left: 18px; margin: 6px 0; }
    li { margin-bottom: 6px; }
    hr { margin: 20px 0; border: none; border-top: 1px solid #e5e5e5; }
  </style>
</head>
<body>
  ${bodyContent}
</body>
</html>
`;

export function extractBodyContent(htmlString: string): string {
  if (!htmlString || typeof htmlString !== 'string') {
    return '';
  }
  const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  return bodyMatch ? bodyMatch[1].trim() : htmlString;
}

export function wrapHtmlContent(bodyContent: string): string {
  if (!bodyContent) {
    return '';
  }

  // Check if content is practically empty (like `<p></p>`, `<br>`, or just whitespace)
  // We remove all HTML tags except those that represent actual content like img or iframe
  const stripTagsExceptRe = /<(?!img|iframe)[^>]+>/g;
  const strippedContent = bodyContent.replace(stripTagsExceptRe, '').trim();

  // If there's no text left, and it's not containing media tags, treat it as empty
  if (!strippedContent) {
    return '';
  }

  return HTML_TEMPLATE(bodyContent);
}
