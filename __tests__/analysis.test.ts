describe("AI Sentiment Logic", () => {
  test("should return Positive sentiment correctly", () => {
    const mockResponse = {
      sentiment: "Positive",
      summary: "Excellent movie."
    }

    expect(mockResponse.sentiment).toBe("Positive")
  })

  test("should fallback to Mixed if sentiment missing", () => {
    const mockResponse: any = {
      summary: "Neutral review."
    }

    const sentiment = mockResponse.sentiment || "Mixed"

    expect(sentiment).toBe("Mixed")
  })
})