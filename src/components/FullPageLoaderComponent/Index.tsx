import Spinner from "../../resources/images/spinn33r.gif";
import styles from "./Spiner.module.scss";

const FullPageLoader = () => {
  return (
    <div className={styles.fp_container}>
      <img src={Spinner} className={styles.fp_loader} alt="loading" />
    </div>
  );
};

export default FullPageLoader;
