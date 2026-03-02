export async function GET() {
  return Response.json({
    applinks: {
      apps: [],
      details: [
        {
          appID: "345UAJF999.com.sayem.WeShouldCatchUp",
          paths: ["/invite/*"],
        },
      ],
    },
  });
}
