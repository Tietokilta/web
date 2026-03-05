interface OpenMeteoResponse {
  current: {
    temperature_2m: number;
    weather_code: number;
    wind_speed_10m: number;
  };
}

// WMO Weather interpretation codes → emoji + Finnish label
function describeWeather(code: number): { emoji: string; label: string } {
  if (code === 0) return { emoji: "☀️", label: "Selkeää" };
  if (code <= 2) return { emoji: "🌤️", label: "Puolipilvistä" };
  if (code === 3) return { emoji: "☁️", label: "Pilvistä" };
  if (code <= 49) return { emoji: "🌫️", label: "Sumua" };
  if (code <= 59) return { emoji: "🌧️", label: "Tihkusadetta" };
  if (code <= 69) return { emoji: "🌧️", label: "Sadetta" };
  if (code <= 79) return { emoji: "🌨️", label: "Lumisadetta" };
  if (code <= 84) return { emoji: "🌦️", label: "Sadekuuroja" };
  if (code <= 94) return { emoji: "⛈️", label: "Ukkosta" };
  return { emoji: "⛈️", label: "Rajuilma" };
}

async function fetchWeather(): Promise<OpenMeteoResponse | null> {
  try {
    // Otaniemi, Espoo (Aalto University campus)
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=60.1841&longitude=24.8301&current=temperature_2m,weather_code,wind_speed_10m&timezone=Europe/Helsinki&wind_speed_unit=ms",
      { next: { revalidate: 600 } },
    );
    if (!res.ok) return null;
    return (await res.json()) as OpenMeteoResponse;
  } catch {
    return null;
  }
}

export async function InfoscreenWeather() {
  const data = await fetchWeather();
  if (!data) return null;

  const { temperature_2m, weather_code, wind_speed_10m } = data.current;
  const { emoji, label } = describeWeather(weather_code);
  const temp = temperature_2m.toFixed(1);
  const wind = wind_speed_10m.toFixed(1);

  return (
    <div className="flex h-full flex-col justify-center px-4 text-white">
      <div className="flex items-center gap-2 text-3xl font-bold leading-tight">
        <span>{emoji}</span>
        <span>{temp}°C</span>
      </div>
      <div className="flex items-center gap-3 text-sm text-gray-300">
        <span>{label}</span>
        <span>💨 {wind} m/s</span>
      </div>
    </div>
  );
}
