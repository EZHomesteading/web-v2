import { useEffect, useState } from "react";


const useMediaQuery = (query:string) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    const handler = (event: { matches: boolean | ((prevState: boolean) => boolean); }) => setMatches(event.matches);
    mediaQuery.addListener(handler);
    return () => mediaQuery.removeListener(handler);
  }, [query]);

  return matches;
};

export default useMediaQuery;
