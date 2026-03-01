export class HumanizerService {
  private readonly specialKeywords: Record<string, string> = {
    openai: "OpenAI",
    xai: "xAI",
    gpt: "GPT",
  };

  humanizeModelId(modelId: string) {
    return modelId
      .replaceAll("/", "-")
      .split("-")
      .map((p) => {
        if (p in this.specialKeywords) p = this.specialKeywords[p];
        else p = p[0].toUpperCase() + p.substring(1);
        return p;
      })
      .join(" ");
  }
}

const humanizerService = new HumanizerService();
export default humanizerService;
