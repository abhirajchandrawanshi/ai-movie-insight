export async function generateAIInsights(movieTitle: string, overview: string) {
  const prompt = `
  Analyze the movie "${movieTitle}" based on this description:

  ${overview}

  Provide:
  - A short summary
  - Overall sentiment
  - Whether users should watch it
  `;

  return prompt;
}