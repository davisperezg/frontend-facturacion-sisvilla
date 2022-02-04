import { useState } from "react";
import FullPageLoader from "../../components/FullPageLoaderComponent/Index";

const useFullPageLoader = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const showLoader = (): void => setLoading(true);

  const hideLoader = (): void => setLoading(false);

  return [
    loading ? <FullPageLoader /> : null,
    showLoader, //Show loader
    hideLoader, //Hide Loader
  ];
};

export default useFullPageLoader;
