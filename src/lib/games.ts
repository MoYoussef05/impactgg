export type Game = {
  id: number;
  title: string;
  thumbnail: string;
  short_description: string;
  game_url: string;
  genre: string;
  platform: string;
  publisher: string;
  developer: string;
  release_date: string;
  freetogame_profile_url: string;
};

export async function getGames(): Promise<Game[]> {
  const res = await fetch("https://www.freetogame.com/api/games", {
    next: { revalidate: 3600 },
  });
  return res.json();
}
