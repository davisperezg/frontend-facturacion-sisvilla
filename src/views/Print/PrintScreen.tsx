import styles from "./Print.module.scss";
import { useState, useEffect } from "react";
import { getFactById } from "../../api/fact/fact";
import { useParams } from "react-router-dom";
import { getDetailsByIdFact } from "../../api/detail-fact/detail";
import { formatter, formatDate } from "../../lib/helpers/functions/functions";

const PrintScreen = () => {
  const initialFact = {
    cod_fact: 0,
    client: "",
    payment_type: "",
    way_to_pay: "",
    subtotal: 0,
    discount: 0,
    customer_payment: 0,
  };

  const [fact, setFact] = useState<any>(initialFact);
  const [details, setDetails] = useState<any[]>([]);
  const { id } = useParams();

  const getFact = async (id: string) => {
    const resFact = await getFactById(id);
    const resDetails = await getDetailsByIdFact(id);
    setFact(resFact.data);
    setDetails(resDetails.data);
  };

  useEffect(() => {
    if (id) {
      getFact(id);
    }
  }, [id]);

  const fact_fecha = new Date(fact.fecha_creada);

  return (
    <div className={styles.ticket}>
      <img
        className={styles.ticket__img}
        src="https://logodownload.org/wp-content/uploads/2016/03/ticket-logo.png"
        alt="Logotipo"
      />
      <p className={styles.ticket__centrado}>
        TICKET DE VENTA
        <br />
        {fact.area} - 000{fact.cod_fact}
        <br />
        {formatDate(fact_fecha)}
      </p>
      <div>
        <strong>CLIENTE: </strong>
        {fact.cliente}
      </div>
      <div>
        <strong>VENDEDOR: </strong>
        {fact.vendedor}
      </div>
      <p className={styles.ticket__centrado}>
        {fact.tipo_pago} - {fact.forma_pago}
      </p>
      <table>
        <thead>
          <tr>
            <th className={styles.cantidad}>CANT</th>
            <th className={styles.producto}>PROD.</th>
            <th className={styles.descuento}>DESC.</th>
            <th className={styles.precio}>S/</th>
          </tr>
        </thead>
        <tbody>
          {details.map((dtls, i) => {
            return (
              <tr key={i}>
                <td className={styles.cantidad}>{dtls.cantidad}</td>
                <td className={styles.producto}>{dtls.producto}</td>
                <td className={styles.descuento}>
                  {formatter.format(dtls.descuento)}
                </td>
                <td className={styles.precio}>
                  {/* dtls.precio - dtls.descuento DESCUENTO APLICADO */}
                  {/* dtls.precio DESCUENTO NO APLICADO */}
                  {formatter.format(dtls.precio)}
                </td>
              </tr>
            );
          })}
          <tr>
            <td></td>
            <td>
              <strong>SUB TOTAL</strong>
            </td>
            <td></td>
            <td>
              <div className={styles.iconAndSoles}>
                <div>S/</div>
                <div className={styles.iconAndSoles__soles}>
                  {formatter.format(fact.total)}
                </div>
              </div>
            </td>
          </tr>

          {fact.forma_pago === "EFECTIVO CON VUELTO" ? (
            <>
              <tr className={styles.ticket__tr}>
                <td></td>
                <td>
                  <strong>DESCUENTO</strong>
                </td>
                <td></td>
                <td className={styles.ticket__soles}>
                  <div className={styles.iconAndSoles}>
                    <div>S/</div>
                    <div className={styles.iconAndSoles__soles}>
                      {!fact.descuento || fact.descuento === 0
                        ? formatter.format(0)
                        : formatter.format(fact.descuento)}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className={styles.ticket__tr}>
                <td></td>
                <td>
                  <strong>TOTAL</strong>
                </td>
                <td></td>
                <td className={styles.ticket__soles}>
                  <div className={styles.iconAndSoles}>
                    <div>S/</div>
                    <div className={styles.iconAndSoles__soles}>
                      {!fact.descuento || fact.descuento === 0
                        ? formatter.format(fact.total)
                        : formatter.format(fact.total - fact.descuento)}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className={styles.ticket__tr}>
                <td></td>
                <td>
                  <strong>PAGO CON</strong>
                </td>
                <td></td>
                <td className={styles.ticket__soles}>
                  <div className={styles.iconAndSoles}>
                    <div>S/</div>
                    <div className={styles.iconAndSoles__soles}>
                      {formatter.format(fact.pago_cliente)}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className={styles.ticket__tr}>
                <td></td>
                <td>
                  <strong>VUELTO</strong>
                </td>
                <td></td>
                <td className={styles.ticket__soles}>
                  <div className={styles.iconAndSoles}>
                    <div>S/</div>
                    <div className={styles.iconAndSoles__soles}>
                      {formatter.format(
                        fact.total - fact.descuento - fact.pago_cliente
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </>
          ) : (
            <>
              <tr className={styles.ticket__tr}>
                <td></td>
                <td>
                  <strong>DESCUENTO</strong>
                </td>
                <td></td>
                <td className={styles.ticket__soles}>
                  <div className={styles.iconAndSoles}>
                    <div>S/</div>
                    <div className={styles.iconAndSoles__soles}>
                      {!fact.descuento || fact.descuento === 0
                        ? formatter.format(0)
                        : formatter.format(fact.descuento)}
                    </div>
                  </div>
                </td>
              </tr>
              <tr className={styles.ticket__tr}>
                <td></td>
                <td>
                  <strong>TOTAL</strong>
                </td>
                <td></td>
                <td className={styles.ticket__soles}>
                  <div className={styles.iconAndSoles}>
                    <div>S/</div>
                    <div className={styles.iconAndSoles__soles}>
                      {!fact.descuento || fact.descuento === 0
                        ? formatter.format(fact.total)
                        : formatter.format(fact.total - fact.descuento)}
                    </div>
                  </div>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>

      <p className={styles.ticket__centrado}>
        ¡GRACIAS POR SU COMPRA!
        <br />
        vuelva pronto :)
      </p>
    </div>
  );
};

export default PrintScreen;
