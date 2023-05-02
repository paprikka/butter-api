import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

type YTTranscriptLine = {
  text: string;
  offset: number;
  duration: number;
};

type ResponseTranscriptLine = {
  text: string;
  offsetSeconds: number;
  durationSeconds: number;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (typeof id !== "string") {
    return new Response("Missing id", { status: 400 });
  }

  const transcript = await YoutubeTranscript.fetchTranscript(id).then(
    (lines: YTTranscriptLine[]) =>
      lines.map(
        ({ duration, offset, text }) =>
          ({
            text,
            offsetSeconds: offset / 1000,
            durationSeconds: duration / 1000,
          } as ResponseTranscriptLine)
      )
  );

  if (!transcript) {
    return new Response("Cannot get the transcript", { status: 500 });
  }

  return NextResponse.json(
    { transcript },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
