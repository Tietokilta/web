import { HSLSchedule } from "../hsl-schedule";
import { getStop } from "../../assets/api_hooks/hsl_api_hooks.ts";
import { RenderableStop } from "../../assets/api_hooks/hsl_api_types.ts";


export async function HSLcombinedSchedule() {
  var response: Response = await fetch(process.env.PUBLIC_FRONTEND_URL.concat("/next_api/fetch-hsl-data"))
  const hslData = () => {
    if (response.status === 200) {
      return response.json()
  } else
      return "Null"
  }


  return (
    <div className="flex-row justify-center w-full">
      <div className="flex justify-center w-full ">
        <h1 className="flex justify-center text-3xl font-bold pt-4">Aalto-yliopisto (M)</h1>
      </div>
      <div className="flex w-full p-8 pt-0 justify-between gap-4">
        {
          // {response.map(res => (<HSLSchedule key={res} className="flex flex-col gap-4" />))}
          hslData().toString()
        }
      </div>
    </div>
  )
}
