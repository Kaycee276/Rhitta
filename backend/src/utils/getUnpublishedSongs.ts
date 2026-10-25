import prisma from "./prisma.ts";

export async function getUnpublishedSongs(): Promise<any[]> {
  try {
    const songs = await prisma.song.findMany({
      where: { published: false },
      orderBy: { createdAt: "asc" },
    });

    console.log(`Fetched ${songs.length} unpublished songs from database`);
    return songs;
  } catch (error) {
    console.error("Failed to fetch songs from database:", error);
    return [];
  }
}
