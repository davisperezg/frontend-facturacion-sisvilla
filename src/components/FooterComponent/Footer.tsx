import styles from "./Footer.module.scss";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footer__copyright}>
        © 2020-2021 by Kemay Technology. Todos los derechos reservados. Version:
        0.1.5 | Powered by @davisperezg
      </div>
    </footer>
  );
};

export default Footer;
