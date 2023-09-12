import { useRouteError, isRouteErrorResponse } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
        {
            isRouteErrorResponse(error) ?
                <div>
                    <h1>Router error</h1>
                    <h2>{error.status}</h2>
                    <p>{error.statusText}</p>
                    {error.data?.message && <p>{error.data.message}</p>}
                </div>
                :
                (<>
                    <h1>Error</h1>
                    <p>Sorry, an unexpected error has occurred.</p>
                </>)
        }
    </div>
  );
}