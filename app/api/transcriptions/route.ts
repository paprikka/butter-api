import { NextResponse } from "next/server";
import { YoutubeTranscript } from "youtube-transcript";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (typeof id !== "string") {
    return new Response("Missing id", { status: 400 });
  }

  const transcript = await YoutubeTranscript.fetchTranscript(id);

  if (!transcript) {
    return new Response("Cannot get the transcript", { status: 500 });
  }

  return NextResponse.json({ transcript });
}
